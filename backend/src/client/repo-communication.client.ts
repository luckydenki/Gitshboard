import { Octokit } from "@octokit/rest";
import { GithubGraphqlFetch } from "./repo.client";
import { communicationDiscussionsQuery } from "./queries/github/communication-discussions.query";
import { communicationCommentsQuery } from "./queries/github/communication-comments.query";
import type {
    GithubGQLGetCommunicationDiscussionsQuery as Discussions,
    GithubGQLGetCommunicationDiscussionsQueryVariables as DiscussionVariables,
    GithubGQLGetCommunicationCommentsQuery as Comments,
    GithubGQLGetCommunicationCommentsQueryVariables as CommentVariables,
} from "../types/github/graphql/operations.generated";
/** 각 메서드는 한 종류의 GitHub API 페이지를 원본 그대로 반환한다. */
export default class GithubRepoCommunicationClient {
    private api: Octokit;
    constructor(
        private owner: string,
        private repo: string,
        private token?: string,
    ) {
        this.api = new Octokit({ auth: token, request: { timeout: 5000 } });
    }
    repository() {
        return this.api.rest.repos.get({ owner: this.owner, repo: this.repo });
    }
    async commits(page: number, period: { from: string; to: string }) {
        try {
            return await this.api.rest.repos.listCommits({
                owner: this.owner,
                repo: this.repo,
                per_page: 100,
                page,
                since: new Date(Date.parse(period.from) - 1000).toISOString(),
                until: new Date(Date.parse(period.to) - 1000).toISOString(),
            });
        } catch (error) {
            const failure = error as { status?: number; message?: string };
            if (failure.status === 409 && /empty/i.test(failure.message ?? ""))
                return { data: [], headers: {} };
            throw error;
        }
    }
    issues(page: number) {
        return this.api.rest.issues.listForRepo({
            owner: this.owner,
            repo: this.repo,
            state: "open",
            per_page: 100,
            page,
        });
    }
    releases(page: number) {
        return this.api.rest.repos.listReleases({
            owner: this.owner,
            repo: this.repo,
            per_page: 100,
            page,
        });
    }
    discussions(after?: string): Promise<Discussions> {
        const variables: DiscussionVariables = { owner: this.owner, name: this.repo, after };
        return GithubGraphqlFetch<Discussions>(
            this.token,
            communicationDiscussionsQuery,
            variables,
        );
    }
    comments(id: string, after?: string): Promise<Comments> {
        const variables: CommentVariables = { id, after };
        return GithubGraphqlFetch<Comments>(this.token, communicationCommentsQuery, variables);
    }
}
