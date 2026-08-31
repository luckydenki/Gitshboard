import type { RenderLocale } from "./RenderLocale";

export const locale: Record<RenderLocale, {
    eyebrow: string;
    title: string;
    detail: string;
    empty: string;
}> = {
    en: {
        eyebrow: "LANGUAGES",
        title: "Technology distribution",
        detail: "Code volume across repositories",
        empty: "No language data available",
    },
    ko: {
        eyebrow: "언어",
        title: "기술 분포",
        detail: "저장소 전체의 코드 분량",
        empty: "사용 가능한 언어 데이터가 없습니다",
    },
    jp: {
        eyebrow: "言語",
        title: "技術分布",
        detail: "リポジトリ全体のコード量",
        empty: "利用可能な言語データはありません",
    },
};
