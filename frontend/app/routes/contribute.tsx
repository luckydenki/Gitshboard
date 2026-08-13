import { useContributeData } from "~/hooks/pages/contribute-hooks";
import {  useState } from "react";
import ContributionHeader from "~/components/page/contribution/ContributionHeader";
import ContributionInfoSection from "~/components/page/contribution/ContributionInfoSection";
import ContributionCommitActivityByRepo from "~/components/page/contribution/ContributionCommitActivityByRepo";
import ContributionCommitTotalSection from "~/components/page/contribution/ContributionCommitTotalSection";
import ContributionDateInput from "~/components/page/contribution/ContributionDateInput";

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


    let to_raw = Date.now();
    let from_raw = to_raw - (365 * 24 * 60 * 60 * 1000); // 1년간의 타임스탬프 계산

    const to_date = new Date(to_raw).toISOString();
    const from_date = new Date(from_raw).toISOString();

    const [from, setFrom] = useState(from_date.split("T")[0]);
    const [to, setTo] = useState(to_date.split("T")[0]);

    const { data, isLoading, isError } = useContributeData(from, to);


    return (
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950 dark:text-white">
            <main className="mx-auto flex max-w-360 flex-col gap-8 px-6 py-10 lg:px-8">
                <ContributionHeader startTime={from} endTime={to} />

                <ContributionDateInput 
                    from={from}
                    to={to}
                    setFromState={setFrom}
                    setToState={setTo}
                    />
                    

                <ContributionInfoSection
                    data = {data}
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
