/** 기본 브랜치의 README 목록 응답입니다. */
export interface GetRepoReadmesDto {
    defaultBranch: string | null;
    documents: Array<{ path: string; sha: string }>;
}

/** 선택한 README의 Markdown 원문 응답입니다. */
export interface GetRepoReadmeContentDto {
    path: string;
    markdown: string;
    htmlUrl: string;
    defaultBranch: string;
}
