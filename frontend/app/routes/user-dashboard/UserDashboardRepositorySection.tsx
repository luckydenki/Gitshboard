import { useParams } from "react-router";
import AccountDashboardRepositoryListItem, {
    AccountDashboardRepositoryListSkleton,
} from "~/components/common/AccountDashboard/AccountDashboardRepositoryList";
import { AccountDashboardRepositoryStatsSection } from "~/components/common/AccountDashboard/AccountDashboardRepositoryStatsSection";

import { handleOAuthLogin } from "~/components/common/LoginButton";
import useGithubScopes from "~/hooks/useGithubScopes";
import { useUserDashboardRepositories } from "~/hooks/useUserDashboard";

export default function UserDashboardRepositorySection() {
    const { data: scope, isLoading: scopeLoading } = useGithubScopes();
    const { user } = useParams();
    const { data, isLoading, isError } = useUserDashboardRepositories(user);
    const repos = data?.repositories ?? [];

    return (
        <section className="min-h-[50vh]">
            <AccountDashboardRepositoryStatsSection
                totalCount={data?.totalCount.toLocaleString()}
                totalForks={data?.totalForks.toLocaleString()}
                totalStars={data?.totalStars.toLocaleString()}
            />

            <div className="mb-2 flex justify-between">
                <h3 className="text-xl">레포지토리</h3>
                {scopeLoading ? (
                    <div className="w-4 bg-gray-200 p-2" />
                ) : scope?.includes("read:org") ? (
                    <div>이미 조직 레포지토리까지 설정이 완료되었습니다.</div>
                ) : (
                    <div>
                        <span className="mr-2 text-sm text-gray-500">
                            현재 조직 레포 권한이 설정되지 않았습니다.
                        </span>
                        <button
                            className="bg-primary hover:bg-primary/70 rounded-xl border p-2 text-white"
                            onClick={() => {
                                handleOAuthLogin(["read:org", ...scope!]);
                            }}>
                            권한 설정
                        </button>
                    </div>
                )}
            </div>
            {isLoading && <AccountDashboardRepositoryListSkleton />}
            {isError && <p role="alert">저장소를 불러오지 못했습니다.</p>}
            {data && repos.length === 0 && <p>공개 저장소가 없습니다.</p>}

            <ul className="flex flex-col gap-4">
                {repos.map((repo) => {
                    return (
                        <AccountDashboardRepositoryListItem
                            key={repo.nameWithOwner}
                            repo={repo}
                        />
                    );
                })}
            </ul>
        </section>
    );
}
