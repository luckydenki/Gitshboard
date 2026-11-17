import type { GithubRestReposGetCommitResponse } from "../github/rest/repos-get-commit";

/** 저장소 활동 목록에서 커밋의 변경 경로를 읽는 데 사용하는 GitHub REST 응답입니다. */
export type GithubReposDto = Pick<GithubRestReposGetCommitResponse, "files">;
