import { FiExternalLink } from "react-icons/fi";
import HomeSearchBar from "../components/home/SearchBar";
import { searchResponseMock } from "~/mock/search/search-response";

/** GitHub REST API `GET /search/users`의 검색 결과 항목입니다. */
interface GitHubSearchUser {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type: "User" | "Organization";
    score: number;

    // `tag` 필드는 GitHub API에서 제공하지 않습니다.
    // derived: `type`이 "User"이면 "사용자", "Organization"이면 "조직"처럼 화면용 문구로 변환합니다.
}

/** GitHub REST API `GET /search/users`의 응답 본문입니다. */
interface GitHubSearchUsersResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubSearchUser[];
}

/** GitHub REST API `GET /users/{username}`의 사용자 프로필에서 카드에 사용하는 필드입니다. */
interface GitHubUserProfile {
    login: string;
    name: string | null;
    bio: string | null;
    location: string | null;
}

/**
 * // derived: 검색 응답의 각 `login`으로 `GET /users/{username}`을 요청한 뒤
 * `GitHubSearchUser`와 `GitHubUserProfile`을 `login` 기준으로 결합해 만듭니다.
 */
export type GitHubSearchUserCard = GitHubSearchUser & GitHubUserProfile;

/** // derived: 기본 검색 응답의 `items`에 사용자 상세 조회 필드를 결합한 화면용 응답입니다. */
export type GitHubSearchUserCardResponse = Omit<GitHubSearchUsersResponse, "items"> & {
    items: GitHubSearchUserCard[];
};

export const SearchItem = ({ item }: { item: GitHubSearchUserCard }) => {
    return (
        <article
            key={item.id}
            className="bg-panel hover:border-primary flex w-full items-center gap-4 rounded-lg border border-gray-300 p-4 not-sm:flex-wrap not-sm:items-start">
            <img
                src={item.avatar_url}
                alt={`${item.login} 프로필 사진`}
                className="aspect-square size-16 shrink-0 rounded-lg border border-gray-300"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <h4 className="line-clamp-1 max-w-sm text-lg font-bold">
                        {item.name ?? item.login}
                    </h4>
                    <span className="text-primary rounded-lg text-xs font-medium">{item.type}</span>
                </div>

                <span className="text-sm text-gray-500">{item.location ?? ""}</span>
                <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                    {item.bio ?? "소개가 없습니다"}
                </p>
            </div>
            <a
                href={item.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary flex shrink-0 items-center justify-center gap-1 p-2 text-sm font-medium not-sm:ml-20">
                GitHub에서 보기
                <FiExternalLink aria-hidden="true" />
            </a>
        </article>
    );
};

export const SearchResultHeader = ({ total_count }: { total_count: number }) => {
    return (
        <header>
            <h3 className="text-lg font-semibold">검색 결과 : {total_count}건</h3>
        </header>
    );
};

export default function Search() {
    const searchResponse: GitHubSearchUserCardResponse = searchResponseMock;

    const { items: data, total_count } = searchResponse;

    return (
        <main className="grid grid-rows-[auto_1fr] [grid-area:main]">
            <section className="flex h-fit w-full flex-col items-center justify-center gap-4 pt-22 pb-12">
                <HomeSearchBar
                    enableFilter={true}
                    variant={{
                        wsize: "sm",
                    }}
                />
            </section>

            <section className="flex min-h-screen w-full flex-col gap-4 justify-self-center pb-12">
                <SearchResultHeader total_count={total_count} />
                {total_count > 0 ? (
                    <section className="flex flex-col gap-3">
                        {data.map((e) => {
                            return <SearchItem item={e} />;
                        })}
                    </section>
                ) : (
                    <div className="flex h-full items-center justify-center text-3xl text-gray-500">
                        검색 결과가 없습니다
                    </div>
                )}
            </section>
        </main>
    );
}
