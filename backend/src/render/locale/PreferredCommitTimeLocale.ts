import type { RenderLocale } from "./RenderLocale";

type PreferredCommitTimeCopy = {
    eyebrow: string;
    title: string;
    detail: string;
    strongestWindow: string;
    strongestFocus: (label: string) => string;
    peakActivity: (hour: string) => string;
    noCommitData: string;
    empty: string;
    timeBucket: Record<string, string>;
};

export const locale: Record<RenderLocale, PreferredCommitTimeCopy> = {
    en: {
        eyebrow: "WORK PATTERN",
        title: "Preferred commit time",
        detail: "Activity by time of day",
        strongestWindow: "STRONGEST WINDOW",
        strongestFocus: (label) => `${label} focus`,
        peakActivity: (hour) => `Peak activity is around ${hour} in your local timezone.`,
        noCommitData: "No commit data",
        empty: "No commit history available",
        timeBucket: { Dawn: "Dawn", Morning: "Morning", Afternoon: "Afternoon", Night: "Night" },
    },
    ko: {
        eyebrow: "작업 패턴",
        title: "선호 커밋 시간",
        detail: "시간대별 활동량",
        strongestWindow: "가장 활발한 시간대",
        strongestFocus: (label) => `${label} 집중`,
        peakActivity: (hour) => `로컬 시간대 기준 가장 활발한 시간은 ${hour}경입니다.`,
        noCommitData: "커밋 데이터가 없습니다",
        empty: "사용 가능한 커밋 기록이 없습니다",
        timeBucket: { Dawn: "새벽", Morning: "오전", Afternoon: "오후", Night: "밤" },
    },
    jp: {
        eyebrow: "作業パターン",
        title: "コミット時間の傾向",
        detail: "時間帯別のアクティビティ",
        strongestWindow: "最も活発な時間帯",
        strongestFocus: (label) => `${label}に集中`,
        peakActivity: (hour) => `ローカルタイムゾーンで最も活発な時間は${hour}頃です。`,
        noCommitData: "コミットデータがありません",
        empty: "利用可能なコミット履歴はありません",
        timeBucket: { Dawn: "早朝", Morning: "朝", Afternoon: "午後", Night: "夜" },
    },
};
