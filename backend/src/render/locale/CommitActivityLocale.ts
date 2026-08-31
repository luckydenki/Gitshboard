import type { RenderLocale } from "./RenderLocale";

export const locale: Record<RenderLocale, {
    eyebrow: string;
    title: string;
    detail: string;
    period: string;
    totalCommits: string;
    peakCommits: string;
    peakDay: string;
}> = {
    en: {
        eyebrow: "DAILY VOLUME",
        title: "All commits by date",
        detail: "A complete daily count combined from every tracked repository.",
        period: "PERIOD",
        totalCommits: "TOTAL COMMITS",
        peakCommits: "PEAK COMMITS",
        peakDay: "PEAK DAY",
    },
    ko: {
        eyebrow: "일일 커밋량",
        title: "날짜별 전체 커밋",
        detail: "추적 중인 모든 저장소의 일별 커밋 수를 합산한 결과입니다.",
        period: "기간",
        totalCommits: "총 커밋",
        peakCommits: "최다 커밋",
        peakDay: "최다 커밋일",
    },
    jp: {
        eyebrow: "日別コミット数",
        title: "日付ごとの全コミット",
        detail: "追跡中のすべてのリポジトリの日別コミット数を集計しています。",
        period: "期間",
        totalCommits: "総コミット数",
        peakCommits: "最多コミット数",
        peakDay: "最多コミット日",
    },
};
