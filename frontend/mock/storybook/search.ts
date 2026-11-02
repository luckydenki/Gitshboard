import type { GitHubSearchUserCard, SearchRepoCard } from "../../app/types/search/search-result";

export const searchUser: GitHubSearchUserCard = {
    id: 1, login: "octocat", name: "The Octocat", avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
    html_url: "https://github.com/octocat", type: "User", score: 1, bio: "GitHub mascot", location: "San Francisco",
    total_stars: 1234, updated_at: "2024-01-01T00:00:00Z",
};

export const searchRepo: SearchRepoCard = {
    id: 2, type: "Repository", name: "Hello-World", full_name: "octocat/Hello-World",
    owner: { login: "octocat", avatar_url: searchUser.avatar_url }, html_url: "https://github.com/octocat/Hello-World",
    description: "An example repository", stargazers_count: 1234, forks_count: 567,
    language: "TypeScript", updated_at: "2024-01-01T00:00:00Z",
};
