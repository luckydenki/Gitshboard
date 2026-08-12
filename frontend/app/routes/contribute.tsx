import { useQuery } from "@tanstack/react-query";
import { HTTPCredentials } from "dench-fetch";
import ContributionHeader from "~/components/page/contribution/ContributionHeader";
import ContributionInfoSection from "~/components/page/contribution/ContributionInfoSection";
import ContributionCommitActivityByRepo from "~/components/page/contribution/ContributionCommitActivityByRepo";
import ContributionCommitTotalSection from "~/components/page/contribution/ContributionCommitTotalSection";

export interface GithubCommitActivity {
    total: number;
    results: Array<{
        repositoryName: string;
        occuredAt: Array<string>;
        commitCount: Array<number>;
    }>;
    commitOccuredAt: Array<string>;
    commitCounts: Array<number>;
}

export const surfaceClass = "rounded-[1.75rem] bg-white shadow-[0_22px_65px_rgba(15,23,42,0.08)] dark:bg-gray-900";


export function EmptyChart({ message }: { message: string }) {
    return (
        <div className="flex h-95 items-center justify-center rounded-3xl bg-[#eef4ff] px-6 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {message}
        </div>
    );
}

export default function ContributePage() {
    const endTime = Date.now();
    const startTime = endTime - (60 * 24 * 60 * 60 * 1000); // 60일 전의 타임스탬프 계산
    const params = new URLSearchParams({
        from: new Date(startTime).toISOString(),
        to: new Date(endTime).toISOString(),
    });

    const { data, isLoading, isError } = useQuery<GithubCommitActivity>({
        queryKey: ["contributeData"],
        queryFn: async () => {
            const response = await fetch(`/api/contribute/commitActivity?${params.toString()}`, {
                method: "GET",
                credentials: HTTPCredentials.INCLUDE,
            });
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message ?? "Unable to load commit activity");
            }

            return json.data as GithubCommitActivity;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const repositories = data?.results ?? [];
    const totalCommits = data?.total ?? 0;
    const activeDays = data?.commitCounts.filter((count) => count > 0).length ?? 0;

    return (
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950 dark:text-white">
            <main className="mx-auto flex max-w-360 flex-col gap-8 px-6 py-10 lg:px-8">
                <ContributionHeader commitOccuredAt={data?.commitOccuredAt ?? []} />


                <ContributionInfoSection
                    totalCommits={totalCommits}
                    repositories_count={repositories.length}
                    activeDays={activeDays}
                    isLoading={isLoading}
                />


                <ContributionCommitActivityByRepo
                    data={data}
                    isLoading={isLoading}
                    isError={isError}
                />

                <ContributionCommitTotalSection
                    data={data}
                    isLoading={isLoading}
                    isError={isError}
                />
            </main>
        </div>
    );
}
