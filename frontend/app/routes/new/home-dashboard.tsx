import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { FiGitCommit } from "react-icons/fi";

interface Commit {
    sha: string;
    repository: string;
    message: string;
    date: string;
    type: string;
    url: string;
}

const ThemeColors = {
    green: {
        heatMapRange: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    },
};

export default function HomeDashboard() {
    const heatMapColorRange = ThemeColors.green.heatMapRange;
    const location: string = "Korea, Seoul";
    const bio = "안녕하세요 뛰어난 개발자입니다.";
    const name = "flyetanol";
    const link = ["https://instagram.com", "https://naver.com"];
    const following = 30;
    const followers = 25;

    const commits: Commit[] = [];
    for (let i = 0; i < 12; ++i) {
        commits.push({
            date: "2017-09-01",
            message: "feat : 새로운 커밋",
            repository: "Gitshboard",
            sha: "59671a",
            type: "타입",
            url: "www.naver.com",
        });
    }

    const option: EChartsOption = {
        visualMap: {
            min: 0,
            max: 10,
            show: false,
            inRange: {
                color: heatMapColorRange,
            },
        },

        calendar: {
            range: "2026",
            splitLine: {
                show: false,
            },
            yearLabel: {
                show: false,
            },
            left: "80px",
            right: "80px",
        },

        series: {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: [
                ["2026-01-01", 3],
                ["2026-01-02", 7],
                ["2026-01-03", 15],
                ["2026-01-04", 10],
                ["2026-10-06", 8],
                // ...
            ],
            emphasis: {
                itemStyle: {
                    borderWidth: 2,
                    borderColor: "#fff",
                },
            },
        },

        tooltip: {
            trigger: "item",
            formatter: (params) => {
                if (Array.isArray(params)) return "";

                const [date, count] = params.value as [string, number];

                return `${date}<br/><b>${count}</b> contributions`;
            },
        },
        media: [
            {
                query: {
                    maxWidth: 700,
                },
                option: {
                    calendar: {
                        left: 30,
                    },
                },
            },
        ],
    };

    return (
        <main className="px-main-side flex w-full min-w-0 flex-col gap-8 pt-8 pb-8">
            <section className="bg-panel px-4 pt-8">
                <article className="flex justify-between gap-4 not-lg:flex-col">
                    <div className="flex gap-4">
                        <img
                            className="rounded-xl border border-gray-300"
                            width={100}
                            height={100}
                        />
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-semibold"> {name}</h1>
                            <div>
                                {" "}
                                {bio ? (
                                    bio
                                ) : (
                                    <div className="min-h-16 text-gray-500">소개가 없습니다.</div>
                                )}{" "}
                            </div>
                            <div className="">
                                지역 | {location ? location : "Gyeungi Hwasung"}{" "}
                            </div>

                            <div className="flex gap-2">
                                <div> 링크 |</div>
                                <a href={link[0]}>Instagram</a>
                                <a href={link[1]}>Notion</a>
                            </div>
                        </div>
                    </div>

                    <section className="flex gap-4">
                        <div className="h-fit w-24 py-2 not-lg:w-full">
                            팔로잉 <span>{following}</span>
                        </div>
                        <div className="h-fit w-24 py-2 not-lg:w-full">
                            팔로워 <span>{followers}</span>
                        </div>
                    </section>
                </article>
                <article className="flex h-fit w-full flex-col gap-2">
                    <div className="w-full overflow-x-auto">
                        <EChartsReact
                            option={option}
                            className="w-full min-w-5xl"
                        />
                    </div>
                </article>
            </section>

            <section className="border-lg bg-panel flex gap-4 px-4 py-2">
                <button className="h-8 w-24 cursor-pointer rounded-lg hover:bg-gray-200">
                    최근 활동
                </button>
                <button className="h-8 w-24 cursor-pointer rounded-lg hover:bg-gray-200">
                    성향
                </button>
                <button className="h-8 w-24 cursor-pointer rounded-lg hover:bg-gray-200">
                    레포지토리
                </button>

                <button className="h-8 w-24 cursor-pointer rounded-lg hover:bg-gray-200">
                    기술 동향
                </button>
            </section>

            <section className="grid min-w-24 grid-cols-[1fr_minmax(320px,2fr)] gap-4 not-lg:grid-cols-1">
                <article className="bg-panel flex flex-col gap-4 px-4 py-4">
                    <h4 className="text-md font-semibold">100일 연속 활동 중</h4>
                    <div>총 커밋수 </div> <div></div>
                    <div className="h-48 rounded-lg border border-gray-300 p-2">
                        <h4 className="text-md">최근 일주일 간의 활동</h4>
                        <div></div>
                    </div>
                    <div className="h-48 rounded-lg border border-gray-300 p-2">
                        <h4 className="text-md">저장소 별 활동</h4>
                        <div></div>
                    </div>
                </article>
                <section>
                    <h3 className="mb-2 text-xl"> 최근 커밋 내역 </h3>

                    <ul className="divide-y divide-gray-200">
                        {commits.map((commit) => (
                            <li
                                key={`${commit.repository}-${commit.sha}`}
                                className="bg-panel rounded-lg p-4">
                                <article className="space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <FiGitCommit
                                                size={18}
                                                className="shrink-0 text-gray-500"
                                                aria-hidden="true"
                                            />
                                            <span className="text-md truncate font-medium">
                                                {commit.repository}
                                            </span>
                                        </div>

                                        <a
                                            href={commit.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 font-mono text-xs text-gray-500 hover:underline"
                                            aria-label={`View commit ${commit.sha.slice(0, 7)}`}>
                                            {commit.sha.slice(0, 7)}
                                        </a>
                                    </div>

                                    <p className="text-sm font-medium wrap-break-word text-gray-900">
                                        {commit.message.split("\n")[0]}
                                    </p>

                                    <div className="flex items-center justify-between gap-2">
                                        <time
                                            dateTime={commit.date}
                                            className="text-xs text-gray-500">
                                            {new Date(commit.date).toLocaleString()}
                                        </time>

                                        <span className="rounded-md border border-gray-300 px-2 py-0.5 text-xs text-gray-600">
                                            {commit.type}
                                        </span>
                                    </div>
                                </article>
                            </li>
                        ))}
                    </ul>
                </section>
            </section>
        </main>
    );
}
