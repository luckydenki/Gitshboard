import * as echarts from "echarts";
import type { CommitStats } from "../utils/stat";
import { chart } from "./echart/WeeklyActivityEchart";
import type { RenderLocale } from "./locale/RenderLocale";

export default function RenderWeeklyActivitySVG(
    commitStats: CommitStats,
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

    echart.setOption(chart(commitStats, width, height, locale));

    const svg = echart.renderToSVGString();
    echart.dispose();

    return svg;
}
