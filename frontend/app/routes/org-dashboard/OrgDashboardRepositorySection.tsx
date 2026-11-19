import { useParams } from "react-router";
import AccountDashboardRepositoryListItem, {
    AccountDashboardRepositoryListSkleton,
} from "~/components/common/AccountDashboard/AccountDashboardRepositoryList";
import { AccountDashboardRepositoryStatsSection } from "~/components/common/AccountDashboard/AccountDashboardRepositoryStatsSection";
import { useOrgDashboardRepositories } from "~/hooks/api/useOrgDashboardRepositories";

export default function OrgDashboardRepositorySection() {
    const { org } = useParams();
    const { data, isLoading, isError } = useOrgDashboardRepositories(org);
    const repositories = data?.repositories ?? [];

    return (
        <section className="min-h-[50vh]" aria-labelledby="organization-repositories-heading">
            <AccountDashboardRepositoryStatsSection
                totalCount={data?.totalCount.toLocaleString()}
                totalForks={data?.totalForks.toLocaleString()}
                totalStars={data?.totalStars.toLocaleString()}
            />

            <h2 id="organization-repositories-heading" className="mb-2 text-xl">
                레포지토리
            </h2>
            {isLoading && <AccountDashboardRepositoryListSkleton />}
            {isError && <p role="alert">조직 저장소를 불러오지 못했습니다.</p>}
            {data && repositories.length === 0 && <p>공개 저장소가 없습니다.</p>}

            <ul className="flex flex-col gap-4">
                {repositories.map((repository) => (
                    <AccountDashboardRepositoryListItem
                        key={repository.nameWithOwner}
                        repo={repository}
                    />
                ))}
            </ul>
        </section>
    );
}
