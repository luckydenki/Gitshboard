import type { UserSearchItem } from "~/types/search/user-search";
import SearchItemLayout from "./SearchItemLayout";

export type SearchUserCardItem = UserSearchItem & {
    total_stars?: number;
};

export default function SearchUserItem({ item }: { item: SearchUserCardItem }) {
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
            {item.location && <span>지역 {item.location}</span>}
        </SearchItemLayout>
    );
}
