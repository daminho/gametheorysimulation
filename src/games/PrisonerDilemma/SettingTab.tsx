import React, { FC, useContext, useEffect, useState } from "react";
import { Strategy, NameToEnumStrategy, StrategyPropsMap} from "./Strategy";
import { Slider, Stack } from "@mui/material";
import { StrategiesContext } from "./PrisonerDilemmaEntry";


export interface GameSettings {
    strategiesCount: Map<Strategy, number>,
    updateStrategiesCount: (name: Strategy, count: number) => void
    errorPercentage: number,
    updateErrorProb: (newProb: number) => void,
    replaceAmount: number,
    updateReplaceAmount: (newVal: number) => void,
    numRoundPerMatch: number,
    updateNumRoundPerMatch: (newRound: number) => void,
}


const SettingTab: FC = () => {

    const strategiesContext = useContext(StrategiesContext);


    const getPercentage = (strategiesCount: Map<Strategy, number>) => {
        let sum = 0;
        let _percentage = new Map<Strategy, number>();
        Array.from(strategiesCount.entries()).forEach(([name, cnt]) => {
            sum += cnt;
        });
        Array.from(strategiesCount.entries()).forEach(([name, cnt]) => {
            _percentage.set(name, Math.round((cnt / sum) * 10000) / 100);
        });
        return _percentage
    }

    const [percentage, updatePercentage] = useState<Map<Strategy, number>>(new Map<Strategy, number>())

    useEffect(() => {
        updatePercentage(getPercentage(strategiesContext.strategiesCount))
    }, [strategiesContext.strategiesCount])


    return (
        <div style = {{display:"flex", flexDirection: "column"}}>
            <a style = {{fontWeight:"bold"}}>Strategy Setting</a>
            {Array.from(StrategyPropsMap.values()).map((props) => {
                let name = props.name
                let _strategy: Strategy = NameToEnumStrategy.get(name) ?? Strategy.RANDOM
                return (
                    <Stack key = {name} direction="row">
                        <a style = {{width: "100px", marginRight: "4px"}}>{name}</a>
                        <a>0</a>
                        <Slider
                            sx = {{
                                marginLeft: "8px",
                                marginRight: "8px",
                                maxWidth: "600px"
                            }}
                            onChange={(e: Event, newValue: number | number[]) => strategiesContext.updateStrategiesCount(_strategy, newValue as number)}
                            aria-label="Strategy Count"
                            value={strategiesContext.strategiesCount.get(_strategy) ?? 0}
                            valueLabelDisplay="auto"
                            marks
                            min={0}
                            max={25}
                        />
                        <a>25</a>
                        <div style = {{width: "200px", marginLeft: "4px"}}>% of population: {percentage.get(_strategy) ?? 0}%</div>
                    </Stack>
                )}
            )}
            <a style = {{fontWeight:"bold"}}>Additional Setting</a>
            <Stack direction="row">
                <a style = {{width: "100px", marginRight: "4px"}}>Error Percentage</a>
                <a>0</a>
                <Slider
                    sx = {{
                        marginLeft: "8px",
                        marginRight: "8px",
                        maxWidth: "600px"
                    }}
                    onChange={(e: Event, newValue: number | number[]) => strategiesContext.updateErrorProb(newValue as number)}
                    aria-label="Error Percentage"
                    value={strategiesContext.errorPercentage}
                    valueLabelDisplay="auto"
                    marks
                    min={0}
                    max={100}
                />
                <a>100</a>
            </Stack>
            <Stack direction="row">
                <a style = {{width: "100px", marginRight: "4px"}}>Number of players to be replaced</a>
                <a>0</a>
                <Slider
                    sx = {{
                        marginLeft: "8px",
                        marginRight: "8px",
                        maxWidth: "600px"
                    }}
                    onChange={(e: Event, newValue: number | number[]) => strategiesContext.updateReplaceAmount(newValue as number)}
                    aria-label="Error Percentage"
                    value={strategiesContext.replaceAmount}
                    valueLabelDisplay="auto"
                    marks
                    min={0}
                    max={25}
                />
                <a>25</a>
            </Stack>
        </div>
    )
}

export default SettingTab;