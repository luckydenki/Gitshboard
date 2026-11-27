import type { UserDevelopStyle } from "../types/response/user-develop-style";
import type {
    GithubRestActivityListPublicEventsForUserResponse,
    GithubRestReposListForUserResponse,
    GithubRestReposListLanguagesResponse,
} from "../types/github/rest/user-develop-style";
import UserDevelopStyleProcess from "../processor/user-develop-style.processor";
import GithubUserDevelopStyleClient from "../client/user-develop-style.client";
import CommonError from "../utils/common-error";

export default class UserDevelopStyleServices {
    public async getOverview(
        login: unknown,
        timezone: unknown,
        queryKeys: string[],
    ): Promise<UserDevelopStyle> {
        if (
            typeof login !== "string" ||
            !/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(login) ||
            login.includes("--") ||
            typeof timezone !== "string" ||
            queryKeys.some((key) => key !== "timezone")
        ) {
            throw new CommonError({
                status: 400,
                type: "Validation",
                title: "사용자명 또는 시간대가 올바르지 않습니다.",
            });
        }
        try {
            new Intl.DateTimeFormat("en", { timeZone: timezone });
        } catch {
            throw new CommonError({
                status: 400,
                type: "Validation",
                title: "지원하지 않는 시간대입니다.",
            });
        }
        const client = new GithubUserDevelopStyleClient();
        const repositories_response = await client.listRepositories(login);
        const repositories: GithubRestReposListForUserResponse = repositories_response
            .filter((r) => !r.fork)
            .slice(0, 30);
        const events: GithubRestActivityListPublicEventsForUserResponse = [];
        for (let page = 1; page <= 3; page++) {
            const events_response = await client.listEvents(login, page);
            events.push(...events_response);
            if (events_response.length < 100) break;
        }
        const repositoryData: {
            languages: GithubRestReposListLanguagesResponse;
            topics: string[];
        }[] = [];
        for (const repository of repositories) {
            const languages = await client.listLanguages(login, repository.name);
            repositoryData.push({ languages, topics: repository.topics ?? [] });
        }
        const to = new Date();
        const from = new Date(to.getTime() - 30 * 86400000);
        const selected = events.filter(
            (e) => e.created_at && new Date(e.created_at) >= from && new Date(e.created_at) <= to,
        );
        const data: UserDevelopStyle = {
            ...UserDevelopStyleProcess.summarizeRepositories(repositoryData),
            ...UserDevelopStyleProcess.summarizeDevelopActivity(selected, login, timezone),
            coverage: {
                from: from.toISOString(),
                to: to.toISOString(),
                timezone,
                events: selected.length,
                repositories: repositories.length,
                eventsLimited: events.length === 300,
                repositoriesLimited: repositories_response.length === 31,
                scope: "public",
            },
            workTypes: {
                status: "unsupported",
                reason: "PR 목적 분류에는 별도 분류 규칙이 필요합니다.",
            },
        };

        return data;
    }
}
