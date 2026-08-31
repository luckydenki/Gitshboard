import type { RenderLocale } from "./RenderLocale";

type WeeklyActivityCopy = {
    eyebrow: string;
    title: string;
    detail: string;
    empty: string;
    weekday: Record<string, string>;
};

export const locale: Record<RenderLocale, WeeklyActivityCopy> = {
    en: {
        eyebrow: "COMMIT RHYTHM",
        title: "Weekly activity",
        detail: "Default branch commit frequency",
        empty: "No commit history available",
        weekday: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },
    },
    ko: {
        eyebrow: "커밋 리듬",
        title: "주간 활동",
        detail: "기본 브랜치의 커밋 빈도",
        empty: "사용 가능한 커밋 기록이 없습니다",
        weekday: { Mon: "월", Tue: "화", Wed: "수", Thu: "목", Fri: "금", Sat: "토", Sun: "일" },
    },
    jp: {
        eyebrow: "コミットリズム",
        title: "週間アクティビティ",
        detail: "デフォルトブランチのコミット頻度",
        empty: "利用可能なコミット履歴はありません",
        weekday: { Mon: "月", Tue: "火", Wed: "水", Thu: "木", Fri: "金", Sat: "土", Sun: "日" },
    },
};
