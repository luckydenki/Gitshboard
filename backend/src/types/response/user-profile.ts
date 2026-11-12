import type { GetUserDashboardProfileQuery } from "../github/graphql/operations.generated";

export type GetUserProfileDto = GetUserDashboardProfileQuery & {
    streakDays: number; // (derived) 기여 캘린더의 연속 활동 일수
};
