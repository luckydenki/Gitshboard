import { FiGitBranch } from "react-icons/fi";
import type { RepositorySearchItem } from "~/types/search/repository-search";
import SearchItemLayout from "./SearchItemLayout";

export default function SearchRepoItem({ item }: { item: RepositorySearchItem }) {
    return (
        <SearchItemLayout
            avatarUrl={item.owner.avatar_url}
            avatarAlt={`${item.owner.login} 프로필 사진`}
            title={item.full_name}
            badge="저장소"
            dashboardUrl={`/repo/${encodeURIComponent(item.full_name)}`}
            githubUrl={item.html_url}
            description={item.description}
            stars={item.stargazers_count}
            updatedAt={item.updated_at}>
            {item.language && <span>주 언어 {item.language}</span>}
            <span className="flex items-center gap-1"><FiGitBranch aria-hidden="true" />Fork {item.forks_count.toLocaleString("ko-KR")}</span>
        </SearchItemLayout>
    );
}
