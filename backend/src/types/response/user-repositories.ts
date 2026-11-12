import type { GetUserPublicRepositoriesQuery } from "../github/graphql/operations.generated";

type RepositoryConnection = NonNullable<GetUserPublicRepositoriesQuery["user"]>["repositories"];
type RepositoryItem = NonNullable<NonNullable<RepositoryConnection["nodes"]>[number]>;

export interface GetUserRepositoriesDto {
    repositories: RepositoryItem[];
    totalCount: number;
    totalStars: number; // (derived) 공개 저장소가 받은 스타의 합계
    totalForks: number; // (derived) 공개 저장소의 포크 수 합계
}
