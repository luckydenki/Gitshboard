import { Octokit } from "@octokit/rest";
import { GithubGraphqlFetch } from "./repo.client";
import { repoPopularIssuePageQuery } from "./queries/github/repo-popular-issue-page.query";
import type { GithubGQLGetRepoPopularIssuePageQuery } from "../types/github/graphql/operations.generated";

export default class GithubRepoPopularIssuesClient {
    private readonly api: Octokit;

    constructor(
        private readonly owner: string,
        private readonly repo: string,
        token?: string,
    ) {
        this.api = new Octokit({ auth: token, request: { timeout: 5000 } });
    }

    public async verifyPublicRepository() {
        const { data: repository } = await this.api.rest.repos.get({
            owner: this.owner,
            repo: this.repo,
        });
        if (repository.private || repository.visibility === "internal") {
            throw Object.assign(new Error("저장소를 찾을 수 없습니다."), { status: 404 });
        }
    }

    public openIssues(page: number) {
        return this.api.rest.issues.listForRepo({
            owner: this.owner,
            repo: this.repo,
            state: "open",
            sort: "created",
            direction: "desc",
            per_page: 100,
            page,
        });
    }

    public reactions(number: number, page: number) {
        return this.api.rest.reactions.listForIssue({
            owner: this.owner,
            repo: this.repo,
            issue_number: number,
            per_page: 100,
            page,
        });
    }

    public graphqlPage(token: string, after?: string) {
        return GithubGraphqlFetch<GithubGQLGetRepoPopularIssuePageQuery>(
            token,
            repoPopularIssuePageQuery,
            { owner: this.owner, repo: this.repo, after },
        );
    }
}
