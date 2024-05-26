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
  

  


    const [maxValue, setMaxValue] = useState<number>(0)  
    const [minValue, setMinValue] = useState<number>(0)  
    const [options, updateOptions] = useState<any>({
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 1,
          max: 1050,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    })    

    const [_data, updateData] = useState<any>({
      labels: xlabels.map((x) => x.toString()),
      datasets: []
    })


    useEffect(() => {
      updateOptions({
        maintainAspectRatio: false,
        scales: {
          y: {
            min: Math.max(minValue * 2, minValue - 50),
            max: Math.min(maxValue * 2, maxValue + 50),
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        transitions: {
          active: {
            animation: {
              duration: 0.1
            }
          }
        }
      })
    }, [maxValue])

    

    useEffect(() => {
      let _max = 0
      let _min = 1
      datas.forEach((info) => {
        for(let i = 0; i < info.values.length; i++) {
          _max = Math.max(_max, info.values[i])
          _min = Math.min(_min, info.values[i])
        }
      })
      setMaxValue(_max)
      setMinValue(_min)
      updateData({
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
      })
    }, [xlabels, datas])
  
    return (
      <div style={chartContainerStyle}>
         <Line ref={chartRef} data={_data} options={options} />
      </div>
    );
  };
  
  export default VisualizeChart;
  