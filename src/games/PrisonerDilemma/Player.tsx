import React, { KeyboardEvent, useEffect, useState } from "react";
import { FidgetSpinner } from "react-loader-spinner";
import { JsxElement } from "typescript";
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MenuList from "@mui/material/MenuList"
import { FormControl, InputLabel, Select, SelectChangeEvent } from "@mui/material";

export enum PlayerStatus {
    LOADING = 0,
    JUST_CREATED = 1,
    SAVED = 2
}


export enum Strategy {
    ALL_CHEAT = 0,
    ALL_COOPERATE = 1,
    GRUDGER = 2,
    DETECTIVE = 3,
    SIMPLETON = 4,
    RANDOM = 5,
    SECRETE = 6,
    TITFORTAT = 7,
    COPYKITTEN = 8,
    
}

export const StrategyName = [
    "All Cheat",
    "All Cooperate",
    "Grudger",
    "Detective",
    "Simpleton",
    "Random",
    "Secrete",
    "Tit For Tat",
    "Copy Kitten",
]

const NameToEnumStrategy: Map<string, Strategy> = new Map<string, Strategy>([
    ["All Cheat", Strategy.ALL_CHEAT],
    ["All Cooperate", Strategy.ALL_COOPERATE],
    ["Grudger", Strategy.GRUDGER],
    ["Detective", Strategy.DETECTIVE],
    ["Simpleton", Strategy.SIMPLETON],
    ["Random", Strategy.RANDOM],
    ["Secrete", Strategy.SECRETE],
    ["Tit For Tat", Strategy.TITFORTAT],
    ["Copy Kitten", Strategy.COPYKITTEN],
])
   


export interface PlayerProps {
    status: PlayerStatus,
    name: string,
    strategy: Strategy,
    id: string,
    color: string,
    removePlayer: () => void,
    updatePlayerPropsName: (newName: string) => void,
    updatePlayerPropsStrategy: (newStrategy: Strategy) => void
}



export default function Player(props: PlayerProps) {

    const [status, updateStatus] = useState<PlayerStatus>(0);

    const [content, updateContent] = useState<JSX.Element>(<div/>)


    const [playerName, updatePlayerName] = useState<string>("")
    const [playerStrategy, updateStrategy] = useState<string>(StrategyName[Strategy.RANDOM])


    const handleChangeName = (newName: string) => {
        props.updatePlayerPropsName(newName);
        updatePlayerName(newName)
    }

    const handleChangeStrategy = (event: SelectChangeEvent) => {
        updateStrategy(event.target.value);
        props.updatePlayerPropsStrategy(NameToEnumStrategy.get(event.target.value as string) ?? Strategy.RANDOM)
    };
    


    useEffect(() => {
        switch(status) {
            case PlayerStatus.JUST_CREATED:
                updateContent(<div style = {{display:"flex", flexDirection: "column"}}>
                    <input style={{height:"20px"}} placeholder={"Enter your name"} onChange={(v) => handleChangeName(v.target.value)}></input>
                    <div style = {{marginTop: "8px", display: "flex", flexDirection:"row"}}>
                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={playerStrategy}
                            onChange={handleChangeStrategy}
                            sx={{height:"30px", backgroundColor: "white"}}
                        >
                            {StrategyName.map((name) => 
                                <MenuItem key = {name} value = {name} sx = {{fontSize:"12px"}}>
                                    {name}
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    {/* <button onClick = {() => savePlayer()}>Save</button> */}
                    </div>
                </div>)
                break;
            case PlayerStatus.SAVED:
                const textColor = "#121212"
                updateContent(<div style = {{display:"flex", flexDirection: "column"}}>
                    <div style={{color: textColor}}>Team: {playerName}</div>
                    <div style={{color: textColor}}>Strategy: {playerStrategy}</div>
                </div>)
                break;
            case PlayerStatus.LOADING:
            default:
                updateContent(<FidgetSpinner
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="fidget-spinner-loading"
                    wrapperStyle={{}}
                    wrapperClass="fidget-spinner-wrapper"
                    />)
                break;
        }
    }, [status, playerStrategy, playerName]);


    useEffect(() => {
        updateStatus(props.status)
    }, [props.status])

    return (
        <div style = {{
            backgroundColor: props.color ?? "transparent",
            position: "relative",
            height: "80px", padding: "4px", display:"flex",
             border: "solid", borderRadius:"16px", borderColor: "grey", borderWidth:"0.2px",
             justifyContent: "center", alignItems: "center"}}
        >
            <button style = {{
                position: "absolute", top: "8px", right:"8px",
                width: "16px", height:"16px", display:"flex",
                justifyContent: "center", alignItems:"center"}}
                onClick = {() => props.removePlayer()}
            >X</button>
            <div style = {{width: "60%"}}>{content}</div>
        </div>
    )
}