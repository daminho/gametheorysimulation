import React, { useState, useContext, createContext} from "react";
import { FC } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SimulationTab from "./SimulationTab";
import { Strategy } from "./Strategy";
import SettingTab, { GameSettings } from "./SettingTab";
import InformationTab from "./InformationTab";


export const  StrategiesContext = createContext<GameSettings>({
    strategiesCount: new Map<Strategy, number>(),
    updateStrategiesCount: (name: Strategy, newValue: number) => {},
    errorPercentage: 20, // In percentage a.k.a x => x%
    updateErrorProb: (newProb: number) => {},
    replaceAmount: 20,
    updateReplaceAmount: (newVal: number) => {},
    numRoundPerMatch: 20,
    updateNumRoundPerMatch: (newRound: number) => {},
})

const PrisonerDilemmaEntry: FC = () => {


    const [tabValue, updateTabValue] = useState("simulation");

    const [strategiesCount, updateStrategiesCount] = useState<Map<Strategy, number>>(new Map<Strategy, number>());
    const [errorProbability, updateErrorProb] = useState<number>(0);
    const [replaceAmount, updateReplaceAmount] = useState<number>(10);
    const [numRoundPerMatch, updateNumRoundPerMatch] = useState<number>(10);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        updateTabValue(newValue);
      };

    return (
        <StrategiesContext.Provider value = {{
            strategiesCount: strategiesCount,
            updateStrategiesCount: (name: Strategy, newValue: number) => {
                updateStrategiesCount((_curMap) => {
                    let _newMap = new Map<Strategy, number>(_curMap)
                    _newMap.set(name, newValue)
                    return _newMap
                })
            },
            errorPercentage: errorProbability,
            updateErrorProb: (newProb: number) => updateErrorProb(newProb),
            replaceAmount: replaceAmount,
            updateReplaceAmount: (newVal: number) => updateReplaceAmount(newVal),
            numRoundPerMatch: numRoundPerMatch,
            updateNumRoundPerMatch: (newRound: number) => updateNumRoundPerMatch(newRound)
        }}>
            <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                <Tab label="Simulation" value="simulation" />
                <Tab label="Settings" value="simulation_setting" />
                <Tab label="Information" value="infos" />
                </TabList>
            </Box>
                <TabPanel value="simulation"><SimulationTab/></TabPanel>
                <TabPanel value="simulation_setting"><SettingTab/></TabPanel>
                <TabPanel value="infos"><InformationTab/></TabPanel>
            </TabContext>
        </StrategiesContext.Provider>
    );
}

export default PrisonerDilemmaEntry;