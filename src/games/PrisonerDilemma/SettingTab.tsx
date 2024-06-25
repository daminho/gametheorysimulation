import React, { FC, useEffect, useState } from "react";
import { Strategy, StrategyName, NameToEnumStrategy} from "./Strategy";
import { Slider, Stack } from "@mui/material";


export interface SettingTabProps {
    strategiesCount: Map<string, number>,
    updateStrategies: (name: string, count: number) => void
}


const SettingTab: FC<SettingTabProps> = ({strategiesCount, updateStrategies}) => {


    const updateStrategyCount = (name: string, newValue: number) => {
        console.log("ALO")
        updateStrategies(name, newValue)
    }

    const [percentage, updatePercentage] = useState<Map<string, number>>(new Map<string, number>());

    useEffect(() => {
        console.log("getValue updated")
        let sum = 0;
        let _percentage = new Map<string, number>();
        Array.from(strategiesCount.entries()).forEach(([name, cnt]) => {
            sum += cnt;
        });
        Array.from(strategiesCount.entries()).forEach(([name, cnt]) => {
            _percentage.set(name, Math.round((cnt / sum) * 10000) / 100);
        });
        updatePercentage(_percentage)
    }, [])

    return (
    <div>
        {StrategyName.map((name) => 
            <Stack direction="row">
                <a style = {{width: "100px", marginRight: "4px"}}>{name}</a>
                <a>{}</a>
                <a>0</a>
                <Slider
                    sx = {{
                        marginLeft: "8px",
                        marginRight: "8px"
                    }}
                    onChange={(e: Event, newValue: number | number[]) => updateStrategyCount(name, newValue as number)}
                    aria-label="Temperature"
                    defaultValue={strategiesCount.get(name) ?? 0}
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={0}
                    max={500}
                />
                <a>500</a>
                <div style = {{width: "200px", marginLeft: "4px"}}>% of population: {percentage.get(name) ?? 0}%</div>
            </Stack>
        )}
    </div>
    )
}

export default SettingTab;