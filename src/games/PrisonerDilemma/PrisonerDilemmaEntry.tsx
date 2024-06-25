import React, { useState } from "react";
import { FC } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SimulationTab from "./SimulationTab";
import { Strategy } from "./Strategy";
import SettingTab from "./SettingTab";
import InformationTab from "./InformationTab";




const PrisonerDilemmaEntry: FC = () => {


    const [tabValue, updateTabValue] = useState("simulation");

    const [strategiesCount, updateStrategiesCount] = useState<Map<string, number>>(new Map<string, number>());

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        updateTabValue(newValue);
      };

    return (
        <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Simulation" value="simulation" />
            <Tab label="Settings" value="simulation_setting" />
            <Tab label="Information" value="infos" />
            </TabList>
        </Box>
            <TabPanel value="simulation"><SimulationTab/></TabPanel>
            <TabPanel value="simulation_setting">
                <SettingTab 
                    strategiesCount={strategiesCount}
                    updateStrategies= {(name: string, newValue: number) => {
                        console.log("update value")
                        updateStrategiesCount((_curMap) => {
                            let _newMap = _curMap;
                            _newMap.set(name, newValue)
                            return _newMap;
                        })
                    }}
                />
            </TabPanel>
            <TabPanel value="infos"><InformationTab/></TabPanel>
        </TabContext>
    );
}

export default PrisonerDilemmaEntry;