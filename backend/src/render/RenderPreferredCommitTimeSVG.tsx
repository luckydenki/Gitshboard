import * as echarts from "echarts";
import type { CommitStats } from "../utils/stat";
import { chart } from "./echart/PreferredCommitTimeEchart";

export default function RenderPreferredCommitTimeSVG(
    commitStats: CommitStats,
    width: number,
    height: number,
): string {
    const echart = echarts.init(null, null, {
        renderer: "svg",
        ssr: true,
        width,
        height,
    });

    echart.setOption(chart(commitStats, width, height));

    const svg = echart.renderToSVGString();
    echart.dispose();

    return svg;
}
