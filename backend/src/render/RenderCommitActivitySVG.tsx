import * as echarts from "echarts";
import type { GithubCommitActivity } from "../types/contribution";
import { chart } from "./echart/CommitActivityEchart";
import type { RenderLocale } from "./locale/RenderLocale";

export function RenderCommitActivitySVG(
    commitActivity: GithubCommitActivity,
    from: string,
    to: string,
    width: number,
    height: number,
    locale: RenderLocale = "en",
): string {
    const echart = echarts.init(null, null, {
        renderer: "svg",
        ssr: true,
        width,
        height,
    });

    echart.setOption(chart(commitActivity, from, to, width, height, locale));

    const svg = echart.renderToSVGString();
    echart.dispose();

    return svg;
}
