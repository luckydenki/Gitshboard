import EChartsReact from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { CSSProperties } from "react";

type Props = { option: EChartsOption; className?: string; style?: CSSProperties };

export default function RepoDashboardProjectStatusChart({ option, className, style }: Props) {
    return (
        <EChartsReact
            option={option}
            className={className}
            style={style ?? { height: 256, width: "100%" }}
        />
    );
}
