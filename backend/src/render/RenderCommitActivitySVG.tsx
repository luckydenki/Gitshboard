import * as echarts from "echarts";
import type { GithubCommitActivity } from "../types/contribution";
import { chart } from "./echart/CommitActivityEchart";

export function RenderCommitActivitySVG(
    commitActivity: GithubCommitActivity,
    from: string,
    to: string,
    width: number,
    height: number,
): string {
    const echart = echarts.init(null, null, {
        renderer: "svg",
        ssr: true,
        width,
        height,
    });

    echart.setOption(chart(commitActivity, from, to, width, height));

    const svg = echart.renderToSVGString();
    echart.dispose();

    return svg;
}
