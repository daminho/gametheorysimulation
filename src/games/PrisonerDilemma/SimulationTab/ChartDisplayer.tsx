import { FC } from "react";
import VisualizeChart, { ChartDataInfoProps } from "../../../components/VisualizeChart";

interface ChartDisplayerProps {
    chartData: ChartDataInfoProps[],
    chartName: string
}

export const ChartDisplayer: FC<ChartDisplayerProps> = (props) => {
    return (
        <div style = {{display: "flex", flexDirection: "column"}}>
            <div style = {{fontWeight: "bold", marginBottom: "4px"}}>{props.chartName}</div>
            <div style = {{ height:"400px", border:"solid", borderWidth:"0.2px", borderRadius:"8px", borderColor:"grey"}}>
                <VisualizeChart  xlabels={Array.from({length: props.chartData[0]?.values.length ?? 0}, (_, i) => i + 1)} datas={props.chartData} />
            </div>
        </div>
    );
}