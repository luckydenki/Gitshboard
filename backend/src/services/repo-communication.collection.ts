import GithubRepoCommunicationClient from "../client/repo-communication.client";
import type { ActivityComment } from "../utils/repo-communication";
import type {
    CommunicationDiscussionInput,
    CommunicationCategoryInput,
    CommunicationDiscussionCollection,
} from "../types/services/repo-communication";
import CommonError from "../utils/common-error";
/** Discussion 목록·댓글·대댓글 페이지 수집. 서비스가 전달한 동일 마감 시각을 사용한다. */
export default class RepoCommunicationCollection {
    constructor(
        private client: GithubRepoCommunicationClient,
        private deadline: number,
    ) {}
    /** 전체 Discussion 페이지를 수집하며 활성화 여부와 완전 수집 여부를 구분한다. */
    public async discussions(): Promise<CommunicationDiscussionCollection> {
        const items: CommunicationDiscussionInput[] = [];
        let after: string | undefined;
        let complete = false;
        let categories: CommunicationCategoryInput[] = [];
        for (let page = 0; page < 60 && Date.now() < this.deadline; page++) {
            const r = (await this.client.discussions(after)).repository;
            if (!r) throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            if (!r.hasDiscussionsEnabled) {
                return { items, categories, complete: false, disabled: true };
            }
            categories = (r.discussionCategories.nodes ?? []).filter((c) => c !== null);
            items.push(...(r.discussions.nodes ?? []).filter((d) => d !== null));
            if (!r.discussions.pageInfo.hasNextPage) {
                complete = true;
                break;
            }
            after = r.discussions.pageInfo.endCursor ?? undefined;
        }
        return { items, categories, complete, disabled: false };
    }
    /** 댓글과 대댓글 전체 페이지를 수집한다. 페이지/시간 초과와 누락은 기존 오류로 전달한다. */
    public async comments(id: string, replies = false): Promise<ActivityComment[]> {
        const items: ActivityComment[] = [];
        let after: string | undefined;
        for (let page = 0; page < 60 && Date.now() < this.deadline; page++) {
            const response = await this.client.comments(id, after);
            const node = response.node;
            const connection =
                node &&
                ("comments" in node ? node.comments : "replies" in node ? node.replies : null);
            if (!connection) throw new Error("upstream_partial");
            for (const c of connection.nodes ?? [])
                if (c) {
                    items.push(c);
                    if (
                        !replies &&
                        "replies" in c &&
                        typeof c.replies === "object" &&
                        c.replies !== null &&
                        "totalCount" in c.replies &&
                        typeof c.replies.totalCount === "number" &&
                        c.replies.totalCount > 0
                    )
                        items.push(...(await this.comments(c.id, true)));
                }
            if (!connection.pageInfo.hasNextPage) return items;
            after = connection.pageInfo.endCursor ?? undefined;
        }
        throw new Error("collection_limit");
    }
}
