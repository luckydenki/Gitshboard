import type { CommitStatusPeriod, CommitStatusWeek, CommitStatusCodeWeek } from "../types/controllers/repo-commit-status";

export type CommitStatusCommit = { sha: string; committedAt: string; additions: number; deletions: number };

/** 커밋 현황의 날짜 경계와 집계값을 계산합니다. */
class RepoCommitStatusProcessor {
    /** 요청 시간대의 날짜와 시각을 추출합니다. */
    public static localParts(value: string | number, timezone: string) {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
        }).formatToParts(new Date(value));
        const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
        const year = get("year");
        const month = get("month");
        const day = get("day");
        return { date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
            year, month, day, hour: get("hour"), minute: get("minute"), second: get("second") };
    }

    /** 날짜를 달력 기준 일수만큼 이동합니다. */
    public static moveDate(date: string, days: number): string {
        const value = new Date(`${date}T00:00:00Z`);
        value.setUTCDate(value.getUTCDate() + days);
        return value.toISOString().slice(0, 10);
    }

    /** 지난 같은 날짜로 이동하며 2월 29일은 2월 28일에 맞춥니다. */
    public static previousYear(date: string): string {
        const [year, month, day] = date.split("-").map(Number);
        const last = new Date(Date.UTC(year - 1, month, 0)).getUTCDate();
        return `${year - 1}-${String(month).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
    }

    /** 현지 날짜의 00:00을 UTC ISO 시각으로 바꿉니다. */
    public static midnight(date: string, timezone: string): string {
        const target = Date.parse(`${date}T00:00:00Z`);
        let result = target;
        for (let attempt = 0; attempt < 4; attempt++) {
            const local = this.localParts(result, timezone);
            const represented = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second);
            const next = result + target - represented;
            if (next === result) break;
            result = next;
        }
        return new Date(result).toISOString();
    }

    /** 완료된 최근 n일의 반열린 조회 기간을 반환합니다. */
    public static daysPeriod(today: string, days: number, timezone: string): CommitStatusPeriod {
        const from = this.midnight(this.moveDate(today, -days), timezone);
        const to = this.midnight(today, timezone);
        return { from, to, effectiveTo: to };
    }

    /** 완료된 최근 1년의 반열린 조회 기간을 반환합니다. */
    public static yearPeriod(today: string, timezone: string): CommitStatusPeriod {
        const from = this.midnight(this.previousYear(today), timezone);
        const to = this.midnight(today, timezone);
        return { from, to, effectiveTo: to };
    }

    /** 해당 날짜가 속한 주의 월요일을 반환합니다. */
    public static monday(date: string): string {
        const day = new Date(`${date}T00:00:00Z`).getUTCDay();
        return this.moveDate(date, -(day + 6) % 7);
    }

    /** 주별 점과 줄 수를 집계합니다. */
    public static weeks(commits: readonly CommitStatusCommit[], fromDate: string, toDate: string, timezone: string): CommitStatusCodeWeek[] {
        const points: CommitStatusCodeWeek[] = [];
        for (let date = this.monday(fromDate); date < toDate; date = this.moveDate(date, 7)) {
            const next = this.moveDate(date, 7);
            points.push({ from: this.midnight(date, timezone), to: this.midnight(next < toDate ? next : toDate, timezone),
                count: 0, additions: 0, deletions: 0, net: 0 });
        }
        for (const commit of commits) {
            const timestamp = Date.parse(commit.committedAt);
            const point = points.find((item) => timestamp >= Date.parse(item.from) && timestamp < Date.parse(item.to));
            if (!point) continue;
            point.count++;
            point.additions += commit.additions;
            point.deletions += commit.deletions;
            point.net = point.additions - point.deletions;
        }
        return points;
    }

    /** 기간 내 커밋만 반환합니다. */
    public static within(commits: readonly CommitStatusCommit[], period: CommitStatusPeriod): CommitStatusCommit[] {
        const start = Date.parse(period.from);
        const end = Date.parse(period.to);
        return commits.filter((commit) => {
            const time = Date.parse(commit.committedAt);
            return time >= start && time < end;
        });
    }

    /** 이전 기간 대비 백분율을 계산합니다. */
    public static growth(count: number, previous: number): number | null {
        return previous === 0 ? null : (count - previous) * 100 / previous;
    }

    /** 연속 활동 주의 최장 길이와 현재 진행 여부를 계산합니다. */
    public static activeWeekStreak(points: readonly CommitStatusWeek[]): { weeks: number; ongoing: boolean } {
        let longest = 0;
        let current = 0;
        for (const point of points) {
            current = point.count > 0 ? current + 1 : 0;
            longest = Math.max(longest, current);
        }
        return { weeks: longest, ongoing: current > 0 };
    }
}

export default RepoCommitStatusProcessor;
