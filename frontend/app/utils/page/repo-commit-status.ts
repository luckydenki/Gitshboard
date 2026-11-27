import type { CommitStatusMetric, CommitStatusPeriod } from "~/types/response/repo-commit-status";

const numberFormat = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 });

/** 커밋 수와 줄 수를 화면용 문자열로 표시합니다. */
export function formatCommitNumber(value: number): string {
    return numberFormat.format(value);
}

/** 증감률을 부호와 함께 표시합니다. */
export function formatCommitChange(value: number | null): string {
    if (value === null) return "비교할 이전 기록 없음";
    return `${value > 0 ? "+" : ""}${numberFormat.format(value)}%`;
}

/** API의 종료일 제외 구간을 사람이 읽는 현지 날짜 범위로 바꿉니다. */
export function formatCommitPeriod(period: CommitStatusPeriod, timezone: string): string {
    const date = (value: string) =>
        new Intl.DateTimeFormat("ko-KR", {
            timeZone: timezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date(value));
    return `${date(period.from)} ~ ${date(new Date(Date.parse(period.to) - 1).toISOString())}`;
}

/** 날짜를 요청 시간대의 간결한 차트 라벨로 표시합니다. */
export function formatCommitWeek(value: string, timezone: string): string {
    return new Intl.DateTimeFormat("ko-KR", {
        timeZone: timezone,
        month: "numeric",
        day: "numeric",
    }).format(new Date(value));
}

/** 해당 지표의 수집이 완료됐을 때만 값을 사용합니다. */
export function completeCommitValue<T>(metric: CommitStatusMetric<T>): T | null {
    return metric.status === "complete" ? metric.value : null;
}
