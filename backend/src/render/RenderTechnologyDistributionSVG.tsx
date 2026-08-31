import * as echarts from "echarts";
import type { LanguageStat } from "../utils/stat";
import { chart } from "./echart/TechnologyDistributionEchart";
import type { RenderLocale } from "./locale/RenderLocale";

export default function RenderTechnologyDistributionSVG(
    languageStats: LanguageStat[],
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

    echart.setOption(chart(languageStats, width, height, locale));

    const svg = echart.renderToSVGString();
    echart.dispose();

    return svg;
}
