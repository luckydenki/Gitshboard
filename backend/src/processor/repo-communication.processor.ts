import type {
    CommunicationDiscussionInput,
    CommunicationCategoryInput,
} from "../types/services/repo-communication";
import type { CommunicationDiscussion } from "../types/controllers/repo-communication";
export default class RepoCommunicationProcessor {
    /** overview: 전체 카테고리 분포와 최근 90일 응답 통계를 계산한다.
     * @param items 전체 Discussion 원본 노드. @param categories 전체 카테고리 노드.
     * @param asOf 수집 시작 UTC 시각. 반환값은 distribution, responses, cohort.
     * @example RepoCommunicationProcessor.overview([], [], "2026-11-24T00:00:00Z") // 비율 null
     * @see src/test/communication.processor.test.ts
     */
    public static overview(
        items: CommunicationDiscussionInput[],
        categories: CommunicationCategoryInput[],
        asOf: string,
    ) {
        const distribution = {
            total: items.length,
            categories: categories.map((c) => {
                const count = items.filter((d) => d.category.id === c.id).length;
                return {
                    id: c.id,
                    name: c.name,
                    count,
                    percent: items.length ? (100 * count) / items.length : null,
                };
            }),
        };
        const cohort = items.filter(
            (d) =>
                Date.parse(d.createdAt) >= Date.parse(asOf) - 90 * 86400000 &&
                Date.parse(d.createdAt) < Date.parse(asOf),
        );
        const answerable = cohort.filter((d) => d.category.isAnswerable),
            answered = answerable.filter((d) => d.answer);
        const responses = {
            answerableCount: answerable.length,
            answeredCount: answered.length,
            answeredPercent: answerable.length ? (100 * answered.length) / answerable.length : null,
        };
        return { distribution, responses, cohort };
    }
    /** rank: 점수 내림차순, 동점 번호 내림차순 상위 3개를 반환한다. 입력은 변경하지 않는다.
     * @param rows 계산이 완료된 인기 후보 목록. @returns 정렬한 상위 3개 목록.
     * @example RepoCommunicationProcessor.rank([]) // []
     * @see src/test/communication.processor.test.ts
     */
    public static rank(rows: CommunicationDiscussion[]) {
        return [...rows].sort((a, b) => b.score - a.score || b.number - a.number).slice(0, 3);
    }
}
