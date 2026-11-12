import type { SearchUserCardItem } from "../../app/components/page/search/SearchUserItem";
import type { RepositorySearchItem } from "../../app/types/search/repository-search";

export const searchUser: SearchUserCardItem = {
    id: "U_octocat", login: "octocat", name: "The Octocat", avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
    html_url: "https://github.com/octocat",
    type: "User", bio: "GitHub mascot", location: "San Francisco",
    total_stars: 1234, updated_at: "2024-01-01T00:00:00Z",
};

export const searchRepo: RepositorySearchItem = {
    id: 2, name: "Hello-World", full_name: "octocat/Hello-World",
    owner: { login: "octocat", avatar_url: searchUser.avatar_url, html_url: searchUser.html_url, type: "User" },
    html_url: "https://github.com/octocat/Hello-World",
    description: "An example repository", stargazers_count: 1234, forks_count: 567,
    language: "TypeScript", created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z", license: null,
};
