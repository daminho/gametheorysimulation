import React, { FC, useContext, useEffect, useState } from "react";
import { Strategy, StrategyName, NameToEnumStrategy} from "./Strategy";
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
        <div>
            {StrategyName.map((name) => {
                let _strategy: Strategy = NameToEnumStrategy.get(name) ?? Strategy.RANDOM
                return (
                    <Stack key = {name} direction="row">
                        <a style = {{width: "100px", marginRight: "4px"}}>{name}</a>
                        <a>{}</a>
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
                            step={5}
                            marks
                            min={0}
                            max={200}
                        />
                        <a>200</a>
                        <div style = {{width: "200px", marginLeft: "4px"}}>% of population: {percentage.get(_strategy) ?? 0}%</div>
                    </Stack>
                )}
            )}
        </div>
    )
}

export default SettingTab;