import { Octokit } from "@octokit/rest";
import CommonError from "../utils/common-error";
import type { ErrorStatus } from "../types/middlewares/common";
import type {
    GithubRestActivityListPublicEventsForUserResponse,
    GithubRestReposListForUserResponse,
    GithubRestReposListLanguagesResponse,
} from "../types/github/rest/user-develop-style";
export default class GithubUserDevelopStyleClient {
    private octokit = new Octokit({
        auth: process.env.PUBLIC_API_TOKEN,
        request: { timeout: 15000 },
    });
    private async request<T>(fetch: () => Promise<{ data: T }>): Promise<T> {
        try {
            const { data: response } = await fetch();
            return response;
        } catch (error) {
            if (error instanceof CommonError) throw error;
            const upstream = (error as { status?: number }).status;
            const status: ErrorStatus =
                upstream === 401
                    ? 401
                    : upstream === 403
                      ? 403
                      : upstream === 404
                        ? 404
                        : upstream === 429
                          ? 429
                          : 500;
            throw new CommonError({
                status,
                type: "GitHub API",
                title:
                    status === 404
                        ? "GitHub 대상 정보를 찾을 수 없습니다."
                        : "개발 성향 정보를 조회하지 못했습니다.",
                detail:
                    status === 403 || status === 429
                        ? "GitHub 권한 또는 호출 제한을 확인해주세요."
                        : "잠시 후 다시 시도해주세요.",
            });
        }
    }
    public listRepositories(login: string): Promise<GithubRestReposListForUserResponse> {
        return this.request(() =>
            this.octokit.repos.listForUser({
                username: login,
                type: "owner",
                sort: "pushed",
                per_page: 31,
            }),
        );
    }
    public listEvents(
        login: string,
        page: number,
    ): Promise<GithubRestActivityListPublicEventsForUserResponse> {
        return this.request(() =>
            this.octokit.activity.listPublicEventsForUser({ username: login, per_page: 100, page }),
        );
    }
    public listLanguages(
        owner: string,
        repo: string,
    ): Promise<GithubRestReposListLanguagesResponse> {
        return this.request(() => this.octokit.repos.listLanguages({ owner, repo }));
    }
}
