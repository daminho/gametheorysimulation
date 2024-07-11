import React, {FC, useEffect, useRef, useState} from "react"
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";


export interface ChartDataInfoProps {
  label: string,
  values: number[],
  lineColor?: string
}

export interface VisualizeChartProps {
    xlabels: number[]
    datas: ChartDataInfoProps[],
}

 
const VisualizeChart: FC<VisualizeChartProps> = ({ xlabels, datas }) => {
    Chart.register(...registerables);
    const chartRef = useRef<Chart<"line", number[], string> | null>(null);
    const chartContainerStyle: React.CSSProperties = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    };
  

  


    const [options, updateOptions] = useState<any>({
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 100,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    })    


    
    const _data = {
      labels: xlabels.map((x) => x.toString()),
      datasets: datas.map((info, index) => {
        const randomColor = "#" +  Math.floor(Math.random()*16777215).toString(16);
        return {
          label: info.label,
          data: info.values,
          fill: false,
          borderColor: info.lineColor ?? randomColor,
          tension: 0.0,
        }
      })
    }
  
    return (
      <div style={chartContainerStyle}>
         <Line ref={chartRef} data={_data} options={options} />
      </div>
    );
  };
  
  export default VisualizeChart;
  