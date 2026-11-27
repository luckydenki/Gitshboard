import type { RestEndpointMethodTypes } from "@octokit/rest";

/** 저장소 Issue 목록. link : https://docs.github.com/en/rest/issues/issues#list-repository-issues */
export type RestIssue =
    RestEndpointMethodTypes["issues"]["listForRepo"]["response"]["data"][number];
/** 열린 마일스톤 목록. link : https://docs.github.com/en/rest/issues/milestones */
export type RestMilestone =
    RestEndpointMethodTypes["issues"]["listMilestones"]["response"]["data"][number];
/** 저장소 PR 목록. link : https://docs.github.com/en/rest/pulls/pulls#list-pull-requests */
export type RestPull = RestEndpointMethodTypes["pulls"]["list"]["response"]["data"][number];
/** PR 변경 규모 및 병합 시각. link : https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request */
export type RestPullDetail = RestEndpointMethodTypes["pulls"]["get"]["response"]["data"];
/** PR 리뷰. link : https://docs.github.com/en/rest/pulls/reviews */
export type RestReview =
    RestEndpointMethodTypes["pulls"]["listReviews"]["response"]["data"][number];
/** PR 대화 댓글. link : https://docs.github.com/en/rest/issues/comments */
export type RestConversation =
    RestEndpointMethodTypes["issues"]["listComments"]["response"]["data"][number];
/** PR 코드 리뷰 댓글. link : https://docs.github.com/en/rest/pulls/comments */
export type RestReviewComment =
    RestEndpointMethodTypes["pulls"]["listReviewComments"]["response"]["data"][number];
