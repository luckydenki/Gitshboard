import type { GithubCommitActivity } from "~/routes/contribute";


/**
 * toDateKey는 주어진 문자열을 Date 객체로 변환하고, 유효한 날짜인 경우 ISO 형식의 날짜 문자열(YYYY-MM-DD)을 반환합니다.
 * 
 * @param value 
 * @returns 
 */
export function toDateKey(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
}


/**
 * formatDate는 주어진 문자열을 Date 객체로 변환하고, 유효한 날짜인 경우 "MMM dd" 형식의 문자열을 반환합니다.
 * 
 * @param value 
 * @returns "MMM dd" 형식의 문자열 또는 원래 입력 값
 */
export function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

/**
 * 
 * alignRepositoryActivity는 주어진 repository의 commit 활동 데이터를 allDates 배열에 맞춰 정렬합니다.
 * 
 * @param repository 정렬할 repository의 commit 활동 데이터
 * @param allDates 기준이 되는 모든 날짜 배열
 * @returns allDates 배열에 맞춰 정렬된 commit 활동 데이터 배열
 */
export function alignRepositoryActivity(
    repository: GithubCommitActivity["results"][number],
    allDates: string[],
) {
    const commitsByDate = new Map(
        repository.occuredAt.map((date, index) => [toDateKey(date), repository.commitCount[index] ?? 0]),
    );
    return allDates.map((date) => commitsByDate.get(toDateKey(date)) ?? 0);
}

/**
 * getDateRange는 주어진 날짜 배열에서 가장 이른 날짜와 가장 늦은 날짜를 찾아 범위를 나타내는 문자열을 반환합니다.
 * 
 * @param dates 
 * @returns 날짜 범위를 나타내는 문자열 (예: "MMM dd – MMM dd") 또는 "No activity recorded"
 */
export function getDateRange(dates: string[]): string {
    if (dates.length === 0) return "No activity recorded";

    const first = formatDate(dates[0]);
    const last = formatDate(dates[dates.length - 1]);

    return first === last ? first : `${first} – ${last}`;
}
