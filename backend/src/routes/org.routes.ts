import { Router } from "express";
import { checkToken, checkUser } from "../middlewares/auth.middleware";
import { GithubGraphqlFetch } from "../client/repo.client";
import { githubOrgProfileDetailsQuery } from "../client/queries/github/org-profile-details.query";
import { githubOrgProfileMembersQuery } from "../client/queries/github/org-profile-members.query";
import { githubOrgPublicRepositoriesQuery } from "../client/queries/github/org-public-repositories.query";
import type {
    OrgProfileDetailsQuery,
    OrgProfileDetailsQueryVariables,
    OrgProfileMembersQuery,
    OrgProfileMembersQueryVariables,
    OrgPublicRepositoriesQuery,
    OrgPublicRepositoriesQueryVariables,
} from "../types/github/graphql/operations.generated";
import type { AuthRequest } from "../types/middlewares/auth";
import type { CommonResponse } from "../types/middlewares/common";
import type { GetOrgProfileDto } from "../types/response/org-profile";
import type { GetOrgRepositoriesDto } from "../types/response/org-repositories";
import CommonError from "../utils/common-error";

const org_router = Router();

org_router.get("/health", (_req, res) => {
    res.json({ message: "Org route is working!" });
});

/**
 * @api GET /api/orgs/:login/profile
 * @desc GitHub 조직 프로필과 멤버 수를 별도 요청으로 조회합니다. 멤버 조회가 제한되면 멤버 수는 null입니다.
 * @github backend/src/client/queries/github/org-profile-details.query.ts, backend/src/client/queries/github/org-profile-members.query.ts
 * @response backend/src/types/response/org-profile.ts
 * @error [400] GitHub 로그인 이름 형식이 잘못된 경우.
 * @error [404] GitHub 조직을 찾을 수 없는 경우.
 * @error [500] 사용자 인증 처리 또는 GitHub 조직 프로필 조회에 실패한 경우.
 */
org_router.get("/:login/profile", checkToken, checkUser, async (req: AuthRequest, res) => {
    const { login } = req.params;
    res.set("Cache-Control", "private, no-store");

    try {
        if (typeof login !== "string" || !/^[a-z\d][a-z\d-]{0,38}$/i.test(login)) {
            throw CommonError.create400Error("GitHub 로그인 이름 형식이 올바르지 않습니다.");
        }
        const variables = { login } satisfies OrgProfileDetailsQueryVariables &
            OrgProfileMembersQueryVariables;
        const response = await GithubGraphqlFetch<OrgProfileDetailsQuery>(
            req.user?.githubAccessToken,
            githubOrgProfileDetailsQuery,
            variables,
        );
        if (!response.organization)
            throw CommonError.create404Error("GitHub 조직을 찾을 수 없습니다.");
        let membersWithRole:
            NonNullable<OrgProfileMembersQuery["organization"]>["membersWithRole"] | null = null;
        try {
            const members_response = await GithubGraphqlFetch<OrgProfileMembersQuery>(
                req.user?.githubAccessToken,
                githubOrgProfileMembersQuery,
                variables,
            );
            membersWithRole = members_response.organization?.membersWithRole ?? null;
            console.log("member Role", membersWithRole);
        } catch (error) {
            console.warn("조직 멤버 수 조회 실패:", error);
        }
        const data: GetOrgProfileDto = {
            organization: { ...response.organization, membersWithRole },
        };
        const commonResponse: CommonResponse<GetOrgProfileDto> = {
            status: 200,
            success: true,
            data,
        };
        return res.json(commonResponse);
    } catch (error) {
        if (error instanceof Error && "errors" in error && Array.isArray(error.errors)) {
            console.error(
                "조직 프로필 GraphQL 오류 경로:",
                JSON.stringify(error.errors.map((item) => item?.path ?? null)),
            );
        }
        const notFound =
            error instanceof Error &&
            "errors" in error &&
            Array.isArray(error.errors) &&
            error.errors.some(
                (item) => item?.type === "NOT_FOUND" && item.path?.[0] === "organization",
            );
        const mappedError =
            error instanceof CommonError
                ? error
                : notFound
                  ? CommonError.create404Error("GitHub 조직을 찾을 수 없습니다.")
                  : CommonError.create500Error("GitHub 조직 프로필을 조회하지 못했습니다.");
        return res.status(mappedError.status).json(mappedError);
    }
});

/**
 * @api GET /api/orgs/:login/repositories
 *
 * @desc 조직 소유의 공개 저장소 목록과 저장소 수, 스타·포크 합계를 조회합니다.
 *
 * @github backend/src/client/queries/github/org-public-repositories.query.ts
 *
 * @response backend/src/types/response/org-repositories.ts
 *
 * @error [400] : GitHub 조직 로그인 이름 형식이 잘못된 경우.
 * @error [404] : GitHub 조직을 찾을 수 없는 경우.
 * @error [500] : GitHub 저장소 목록 조회에 실패한 경우.
 */
org_router.get("/:login/repositories", checkToken, checkUser, async (req: AuthRequest, res) => {
    const { login } = req.params;
    res.set("Cache-Control", "private, no-store");

    try {
        if (typeof login !== "string" || !/^[a-z\d][a-z\d-]{0,38}$/i.test(login)) {
            throw CommonError.create400Error("GitHub 조직 로그인 이름 형식이 올바르지 않습니다.");
        }

        const data: GetOrgRepositoriesDto = {
            repositories: [],
            totalCount: 0,
            totalStars: 0,
            totalForks: 0,
        };
        let after: string | null = null;

        do {
            const variables: OrgPublicRepositoriesQueryVariables = { login, after };
            const response = await GithubGraphqlFetch<OrgPublicRepositoriesQuery>(
                req.user?.githubAccessToken,
                githubOrgPublicRepositoriesQuery,
                variables,
            );
            if (!response.organization) {
                throw CommonError.create404Error("GitHub 조직을 찾을 수 없습니다.");
            }

            const { nodes, pageInfo, totalCount } = response.organization.repositories;
            data.totalCount = totalCount;
            for (const repository of nodes ?? []) {
                if (!repository) continue;
                data.repositories.push(repository);
                data.totalStars += repository.stargazerCount;
                data.totalForks += repository.forkCount;
            }

            const { hasNextPage, endCursor } = pageInfo;
            if (hasNextPage && (!endCursor || endCursor === after)) {
                throw CommonError.create500Error("GitHub 저장소의 다음 페이지를 찾지 못했습니다.");
            }
            after = hasNextPage ? endCursor ?? null : null;
        } while (after);

        const commonResponse: CommonResponse<GetOrgRepositoriesDto> = {
            status: 200,
            success: true,
            data,
        };
        return res.json(commonResponse);
    } catch (error) {
        const notFound =
            error instanceof Error &&
            "errors" in error &&
            Array.isArray(error.errors) &&
            error.errors.some(
                (item) => item?.type === "NOT_FOUND" && item.path?.[0] === "organization",
            );
        const mappedError =
            error instanceof CommonError
                ? error
                : notFound
                  ? CommonError.create404Error("GitHub 조직을 찾을 수 없습니다.")
                  : CommonError.create500Error("GitHub 저장소 목록을 조회하지 못했습니다.");
        return res.status(mappedError.status).json(mappedError);
    }
});

export default org_router;
