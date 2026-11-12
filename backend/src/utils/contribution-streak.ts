interface ContributionDay {
    date: string;
    contributionCount: number;
}

/**
 * calculateContributionStreak는 기준일에 이어지는 GitHub 기여 일수를 셉니다.
 * @param days 날짜(YYYY-MM-DD)와 해당 날짜의 기여 수가 담긴 캘린더 항목입니다.
 * @param today 기준 날짜(YYYY-MM-DD)입니다.
 * @returns 오늘 또는 어제부터 기여가 이어진 일수입니다. 날짜가 빠졌거나 기여가 없으면 멈춥니다.
 * @example 오늘이 0건이고 어제와 그제가 각각 1건이면 2를 반환합니다. 둘 다 0건이면 0을 반환합니다.
 */
export function calculateContributionStreak(days: readonly ContributionDay[], today: string): number {
    const activeDates = new Set(
        days.filter(({ contributionCount }) => contributionCount > 0).map(({ date }) => date),
    );
    const date = new Date(`${today}T00:00:00Z`);

    if (!activeDates.has(today)) {
        date.setUTCDate(date.getUTCDate() - 1);
    }

    let streakDays = 0;
    while (activeDates.has(date.toISOString().slice(0, 10))) {
        streakDays += 1;
        date.setUTCDate(date.getUTCDate() - 1);
    }
    return streakDays;
}
