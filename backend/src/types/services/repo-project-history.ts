import type { GithubRestGitGetTreeResponse } from "../github/rest/git-get-tree";
import type { GithubRestIssuesListForRepoResponse } from "../github/rest/issues-list-for-repo";
import type { GithubRestReposGetResponse } from "../github/rest/repos-get";
import type { GithubRestReposListCommitsResponse } from "../github/rest/repos-list-commits";

/** 이력 집계에 사용하는 저장소 메타데이터입니다. */
export type GithubReposHistoryMetadataDto = Pick<GithubRestReposGetResponse,
    "node_id" | "name" | "owner" | "visibility" | "default_branch" | "created_at" | "size">;
/** Git 트리의 경로와 커버리지입니다. */
export type GithubGitHistoryTreeDto = Pick<GithubRestGitGetTreeResponse, "tree" | "truncated">;
/** 커밋 이력 한 페이지와 페이지 링크입니다. */
export type GithubReposHistoryCommitsDto = Pick<GithubRestReposListCommitsResponse, "data" | "headers">;
/** 저장소 이슈와 PR 한 페이지와 페이지 링크입니다. */
export type GithubIssuesHistoryDto = Pick<GithubRestIssuesListForRepoResponse, "data" | "headers">;
