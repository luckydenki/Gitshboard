import type { GitHubSearchUserCard } from "~/types/search/search-result";
import SearchItemLayout from "./SearchItemLayout";

export default function SearchUserItem({ item }: { item: GitHubSearchUserCard }) {
    return (
        <SearchItemLayout
            avatarUrl={item.avatar_url}
            avatarAlt={`${item.login} 프로필 사진`}
            title={item.name ?? item.login}
            badge={item.type === "Organization" ? "조직" : "사용자"}
            dashboardUrl={`/user/${encodeURIComponent(item.login)}`}
            githubUrl={item.html_url}
            description={item.bio}
            stars={item.total_stars}
            starsLabel="소유 저장소 Star 합계"
            updatedAt={item.updated_at}>
            <span>@{item.login}</span>
            {item.location && <span>{item.location}</span>}
        </SearchItemLayout>
    );
}
