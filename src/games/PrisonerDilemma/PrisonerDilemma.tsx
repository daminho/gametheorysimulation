import React, {FC, useEffect, useState} from "react";
import VisualizeChart, { ChartDataInfoProps } from "../../components/VisualizeChart";
import Player, { PlayerProps, PlayerStatus, Strategy } from "./Player";
import { Grid } from "@mui/material";


const payoff = [[[3, 3],[0, 5]],[[5, 0],[1, 1]]]


const PrisonerDilemma: FC = () => {

    
    const [numRound, setNumRound] = useState<number>(0);
    const [hasRandom, setHasRandom] = useState<boolean>(false);


    const [chartData, setChartData] = useState<ChartDataInfoProps[]>([]);
    const [xlabels, setXLabels] = useState<number[]>([]);


    const [players, setPlayers] = useState<PlayerProps[]>([]);

    const [liveScore, updateLiveScore] = useState<Map<PlayerProps, number[]>>(new Map<PlayerProps, number[]>());


    useEffect(() => {
        if(hasRandom) {
            return;
        }
        setNumRound(10 + Math.round(Math.random() * 20));
        setHasRandom(true);
    }, [hasRandom])





    const updatePlayers = () => {
        let id = (Math.random() + 1).toString(36).substring(7);
        setPlayers((_players: PlayerProps[]) => {
            return _players.concat([{
                name:"", strategy: Strategy.RANDOM,
                status: PlayerStatus.JUST_CREATED,
                id: id,
                color: "#" +  Math.floor(Math.random()*16777215).toString(16),
                removePlayer: () => {
                    setPlayers((__players: PlayerProps[]) => {
                        return __players.filter((item) => {
                            return item.id !== id
                        })
                    })
                },
                updatePlayerProps: (newProps: PlayerProps) => {
                    setPlayers((__players: PlayerProps[]) => {
                        __players.forEach((item, index) => {
                            if(item.id === id) {
                                __players[index] = newProps;
                            }
                        })
                        return __players;
                    })
                }
            } as PlayerProps])
        })
    }


    const calculateScore = (s1: Strategy, s2:Strategy, _numRound: number) => {
        const init = (_s: Strategy) => {
            switch(_s) {
                case Strategy.ALL_CHEAT:
                    return 1
                case Strategy.RANDOM:
                    return (Math.random() < 0.5 ? 0 : 1);
                default:
                    return 0;
            }
        }
        const makeMove = (_s: Strategy, turn: number, last: number, has_cheat: boolean, op_last: number) => {
            switch(_s) {
                case Strategy.ALL_CHEAT:
                    return 1;
                case Strategy.ALL_COOPERATE:
                    return 0;
                case Strategy.SECRETE:
                case Strategy.RANDOM:
                    return (Math.random() < 0.5 ? 0 : 1);
                case Strategy.DETECTIVE:
                    if(turn <= 3) {
                        return turn === 1 ? 1 : 0;
                    } else {
                        if(has_cheat) {
                            return op_last;
                        } else {
                            return 1;
                        }
                    }
                case Strategy.GRUDGER:
                    return has_cheat ? 1 : 0;
                case Strategy.SIMPLETON:
                    if(has_cheat){
                        return 1 - last;
                    } else {
                        return last;
                    } 

            }
        }
        let op_has_cheat_1 = false, op_has_cheat_2 = false;
        let last_1 = init(s1), last_2 = init(s2);
        let cur_1 = 0, cur_2 = 0;
        let _score = [0, 0];
        for(let i = 0; i < _numRound; i++) {
            cur_1 = makeMove(s1, i, last_1, op_has_cheat_1, last_2)
            cur_2 = makeMove(s2, i, last_2, op_has_cheat_2, last_1)
            let _payoff = payoff[cur_1][cur_2];
            _score[0] += _payoff[0];
            _score[1] += _payoff[1];
            if(s1 === Strategy.DETECTIVE && i <= 3 && cur_2 === 1) op_has_cheat_1 = true;
            if(s2 === Strategy.DETECTIVE && i <= 3 && cur_1 === 1) op_has_cheat_2 = true;
            if(s1 === Strategy.SIMPLETON || s1 === Strategy.GRUDGER) op_has_cheat_1 = cur_2 === 1; 
            if(s2 === Strategy.SIMPLETON || s2 === Strategy.GRUDGER) op_has_cheat_2 = cur_1 === 1; 
        }
        return _score;
    }


    const [isSimulating, setSimulating] = useState<boolean>(false)
    const [curGameDay, setCurGameDay] = useState<number>(0)


    useEffect(() => {
        let entries = Array.from(liveScore.entries())
        setChartData(entries.map(([k, v]) => {
            return {
                label: k.name,
                values: v,
                lineColor: k.color
            }
        }))
    }, [liveScore])


    const simulateDays = (day: number) => {
        if(day === -1 || !isSimulating) {
            setSimulating(false)
            return
        }
        const _players = players.filter((item) => item.status === PlayerStatus.SAVED)
        _players.sort((a, b) => {
            return a.id < b.id ? 1 : -1;
        } )
        setTimeout(() => {
            let score = Array<number>(_players.length).fill(0);

            for(let i = 0; i < _players.length; i++) {
                for(let j = i + 1; j < _players.length; j++) {
                    console.log(_players[i].name, players[j].name);
                    let _score = calculateScore(_players[i].strategy, _players[j].strategy, numRound - day)
                    score[i] += _score[0];
                    score[j] += _score[1];
                }
            }
            updateLiveScore((_liveScore) => {
                let _curScore: number[] = [];
                let new_livescore = new Map<PlayerProps, number[]>()
                _players.forEach((player, index) => {
                    _curScore = _liveScore.get(player) ?? []
                    _curScore.push(score[index])
                    new_livescore.set(player, _curScore)
                })
                return new_livescore
            })
            setCurGameDay(day - 1)
        },200)

        
    }

    useEffect(() => {
        if(isSimulating) {
            simulateDays(curGameDay)
        }
    }, [isSimulating, curGameDay])


    const runSimulation = () => {
        const _players = players.filter((item) => item.status === PlayerStatus.SAVED)
        const _liveScore = new Map<PlayerProps, number[]>()
        _players.forEach((player) => _liveScore.set(player, []))
        updateLiveScore(_liveScore)

        setCurGameDay(numRound)
        setSimulating(true)


    }



    return (
        <div style = {{"display": "flex", "flexDirection": "column"}}>
            <div style = {{display: "flex"}}>
            <VisualizeChart  xlabels={Array.from({length: chartData[0]?.values.length ?? 0}, (_, i) => i + 1)} datas={chartData} />
            <button style = {{width:"200px", marginLeft: "8px"}} onClick={() => {runSimulation()}}>Run Simulation</button>
            </div>
            <Grid container  spacing={2}>
                <Grid item md = {3}>
                <div style = {{
                    height: "80px", padding: "4px", display: "flex", flexDirection:"column",
                    border: "solid", borderRadius:"16px", borderColor: "grey", borderWidth:"0.2px",
                    justifyContent:"center", alignItems:"center"}}

                    onClick={() => {
                        updatePlayers()
                    }}
                >
                    Add new player
                </div>
                </Grid>
                {players.map(props => <Grid item key = {props.id} md = {3}>
                    <Player {...props}/>
                </Grid>)}
            </Grid>
        </div>
    )
}


export default PrisonerDilemma