import { BsGithub } from "react-icons/bs";
import HomeSearchBar from "./home/SearchBar";

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
type GitHubSearchUserCard = GitHubSearchUser & GitHubUserProfile;

/** // derived: 기본 검색 응답의 `items`에 사용자 상세 조회 필드를 결합한 화면용 응답입니다. */
type GitHubSearchUserCardResponse = Omit<GitHubSearchUsersResponse, "items"> & {
    items: GitHubSearchUserCard[];
};

export default function Search() {
    const isSearch = false;

    const searchResponse: GitHubSearchUserCardResponse = {
        total_count: 7,
        incomplete_results: false,
        items: [
            {
                id: 1,
                login: "taeseung",
                avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
                html_url: "https://github.com/taeseung",
                type: "User",
                score: 1,
                name: "정태승",
                bio: "천재 개발자 정태승입니다.",
                location: "Korea, Seoul",
            },
            {
                id: 2,
                login: "taeseung-dev",
                avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
                html_url: "https://github.com/taeseung-dev",
                type: "User",
                score: 1,
                name: "정태승",
                bio: "천재 개발자 정태승입니다. 진짜 까불지 마시길 바랍니다. 천재 개발자 정태승입니다. 진짜 까불지 마시길 바랍니다.",
                location: "Korea, Seoul",
            },
            {
                id: 3,
                login: "taeseung-git",
                avatar_url: "https://avatars.githubusercontent.com/u/3?v=4",
                html_url: "https://github.com/taeseung-git",
                type: "User",
                score: 1,
                name: "정태승",
                bio: "천재 개발자 정태승입니다.",
                location: "Korea, Seoul",
            },
            {
                id: 4,
                login: "taeseung-4",
                avatar_url: "https://avatars.githubusercontent.com/u/4?v=4",
                html_url: "https://github.com/taeseung-4",
                type: "User",
                score: 1,
                name: "정태승",
                bio: null,
                location: "Korea, Seoul",
            },
            {
                id: 5,
                login: "taeseung-5",
                avatar_url: "https://avatars.githubusercontent.com/u/5?v=4",
                html_url: "https://github.com/taeseung-5",
                type: "User",
                score: 1,
                name: "정태승",
                bio: null,
                location: "Korea, Seoul",
            },
            {
                id: 6,
                login: "taeseung-6",
                avatar_url: "https://avatars.githubusercontent.com/u/6?v=4",
                html_url: "https://github.com/taeseung-6",
                type: "User",
                score: 1,
                name: "정태승",
                bio: null,
                location: "Korea, Seoul",
            },
            {
                id: 7,
                login: "taeseung-7",
                avatar_url: "https://avatars.githubusercontent.com/u/7?v=4",
                html_url: "https://github.com/taeseung-7",
                type: "User",
                score: 1,
                name: "정태승",
                bio: null,
                location: "Korea, Seoul",
            },
        ],
    };

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
                <header>
                    <h3 className="text-">검색 결과 : {total_count}건</h3>
                </header>
                {total_count > 0 ? (
                    <section className="grid grid-cols-1 gap-4 not-lg:grid-cols-2">
                        {data.map((e) => {
                            return (
                                <article className="bg-panel hover:outline-primary flex w-full justify-between rounded-lg hover:outline">
                                    <a
                                        href={e.html_url}
                                        className="flex w-full gap-4 px-2 py-4 not-lg:flex-col not-lg:px-4">
                                        <img
                                            src={e.avatar_url}
                                            alt={`${e.login} 프로필 사진`}
                                            className="aspect-square size-12 self-center rounded-lg"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <div>
                                                <div className="flex gap-2 text-lg font-semibold">
                                                    {e.name ?? e.login}
                                                    <span className="self-end text-sm text-gray-500">
                                                        {e.location ?? ""}
                                                    </span>
                                                </div>
                                                <div className="text-sm">{e.type}</div>
                                            </div>
                                            <div className="line-clamp-2 text-sm text-wrap">
                                                {e.bio ?? "소개가 없습니다"}
                                            </div>
                                        </div>
                                    </a>
                                    <button className="cursor-pointer rounded-r-lg px-2 outline outline-gray-300 hover:outline">
                                        깃 허브
                                    </button>
                                </article>
                            );
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
