export interface GithubUserSearchResponse {
    total_count: number
    incomplete_results: boolean,
    items: Array<{
        login: string,
        id: number,
        avatar_url: string,
        html_url: string,
        type: "User" | "Organization"
    }>
}
