import type { GithubGQLGetCommunicationDiscussionsQuery } from "../github/graphql/operations.generated";
/** Communication 수집 결과의 GitHub 원본 노드 타입. */
type Repository = NonNullable<GithubGQLGetCommunicationDiscussionsQuery["repository"]>;
export type CommunicationDiscussionInput = NonNullable<
    NonNullable<Repository["discussions"]["nodes"]>[number]
>;
export type CommunicationCategoryInput = NonNullable<
    NonNullable<Repository["discussionCategories"]["nodes"]>[number]
>;
export type CommunicationDiscussionCollection = {
    items: CommunicationDiscussionInput[];
    categories: CommunicationCategoryInput[];
    complete: boolean;
    disabled: boolean;
};
