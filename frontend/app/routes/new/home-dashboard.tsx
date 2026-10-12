import type { EChartsOption } from "echarts";
import DashboardActivitySection from "~/components/page/home-dashboard/DashboardActivitySection";
import DashboardNavigationSection from "~/components/page/home-dashboard/DashboardNavigationSection";
import DashboardProfileSection from "~/components/page/home-dashboard/DashboardProfileSection";

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
            <DashboardProfileSection
                option={option}
                name={name}
                bio={bio}
                location={location}
                link={link}
                following={following}
                followers={followers}
            />
            <DashboardNavigationSection />
            <DashboardActivitySection commits={commits} />
        </main>
    );
}
