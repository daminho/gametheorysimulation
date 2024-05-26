import React, {FC, useEffect, useState} from "react";
import VisualizeChart, { ChartDataInfoProps } from "../../components/VisualizeChart";
import Player, { PlayerProps, PlayerStatus, Strategy } from "./Player";
import { Grid } from "@mui/material";


const payoff = [[[2, 2],[-1, 3]],[[3, -1],[0, 0]]]


interface MatchProps {
    moves: [number, number][],
    s1Cheated: boolean,
    s2Cheated: boolean,
}


const PrisonerDilemma: FC = () => {

    
    const [numRound, setNumRound] = useState<number>(0);
    const [hasRandom, setHasRandom] = useState<boolean>(false);


    const [chartData, setChartData] = useState<ChartDataInfoProps[]>([]);
    const [xlabels, setXLabels] = useState<number[]>([]);


    const [players, setPlayers] = useState<Map<string, PlayerProps>>(new Map<string, PlayerProps>());

    const [liveScore, updateLiveScore] = useState<Map<string, number[]>>(new Map<string, number[]>());


    const [move, updateMove] = useState<Map<string, MatchProps>>(new Map<string, MatchProps>());


    useEffect(() => {
        if(hasRandom) {
            return;
        }
        setNumRound(150 + Math.round(Math.random() * 50));
        setHasRandom(true);
    }, [hasRandom])





    const updatePlayers = () => {
        let id = (Math.random() + 1).toString(36).substring(7);

        setPlayers((_players: Map<string, PlayerProps>) => {
            let _newPlayers = new Map<string, PlayerProps>(_players)
            _newPlayers.set(id, {
                name:"", strategy: Strategy.RANDOM,
                status: PlayerStatus.JUST_CREATED,
                id: id,
                color: "#" +  Math.floor(Math.random()*16777215).toString(16),
                removePlayer: () => {
                    setPlayers((__players) => {
                        let __newPlayers = new Map<string, PlayerProps>(__players)
                        __newPlayers.delete(id)
                        return __newPlayers
                    })
                },
                updatePlayerProps: (newProps: PlayerProps) => {
                    setPlayers((__players) => {
                        let __newPlayers = new Map<string, PlayerProps>(__players)
                        __newPlayers.set(id, newProps)
                        return __newPlayers
                    })
                }
            })
            return _newPlayers
        })
    }

    const [isSimulating, setSimulating] = useState<boolean>(false)
    const [curGameDay, setCurGameDay] = useState<number>(0)


    useEffect(() => {
        let entries = Array.from(liveScore.entries())
        setChartData(entries.map(([k, v]) => {
            let prop = players.get(k)
            return {
                label: prop?.name ?? "No Name",
                values: v,
                lineColor: prop?.color ?? "black"
            }
        }))
    }, [liveScore])


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


    const getMove = (id1:string, id2:string): [number, number] => {
        if(id1 > id2) {
            return getMove(id2, id1)
        }
        const matchProps =  move.get(id1.concat(id2))
        const oldMoves = matchProps?.moves ?? []
        const makeMove = (_s: Strategy, _selfOldMoves: number[], _opOldMoves: number[], opCheated: boolean) => {
            if(_selfOldMoves.length === 0) return init(_s) 
            let opLast = _opOldMoves[_opOldMoves.length - 1];
            let selfLast = _selfOldMoves[_selfOldMoves.length - 1]
            switch(_s) {
                case Strategy.ALL_CHEAT:
                    return 1;
                case Strategy.ALL_COOPERATE:
                    return 0;
                case Strategy.DETECTIVE:
                    if(oldMoves.length < 4) {
                        return oldMoves.length === 1 ? 1 : 0;
                    } else {
                        if(opCheated) {
                            return opLast;
                        } else {
                            return 1;
                        }
                    }
                case Strategy.GRUDGER:
                    return opCheated ? 1 : 0;
                case Strategy.SIMPLETON:
                    if(opCheated){
                        return 1 - selfLast;
                    } else {
                        return selfLast;
                    } 
                case Strategy.TITANDTAT:
                    return opLast;
                case Strategy.SECRETE:
                case Strategy.RANDOM:
                    return (Math.random() < 0.5 ? 0 : 1);
            }
        }

        let s1 = players.get(id1)?.strategy ?? Strategy.RANDOM
        let s2 = players.get(id2)?.strategy ?? Strategy.RANDOM

        let s1Moves = oldMoves.map(x => x[0]) ?? []
        let s2Moves = oldMoves.map(x => x[1]) ?? []

        let s1Cheated = matchProps?.s1Cheated ?? false
        let s2Cheated = matchProps?.s2Cheated ?? false

        let s1_curMove = makeMove(s1, s1Moves, s2Moves, s2Cheated)
        let s2_curMove = makeMove(s2, s2Moves, s1Moves, s1Cheated)
        console.log(
            id1.concat(id2), move.get(id1.concat(id2)),
            s1Moves, s2Moves, s1_curMove, s2_curMove
        )

        switch(s1) {
            case Strategy.GRUDGER:
                if(s2_curMove === 1) s2Cheated = true
                break;
            case Strategy.SIMPLETON:
                s2Cheated = s2_curMove === 1
                break;
            case Strategy.DETECTIVE:
                if(s2Moves.length < 4 && s2_curMove === 1)
                    s2Cheated = true;
                    break;
            default:
                break;
        }

        switch(s2) {
            case Strategy.GRUDGER:
                if(s1_curMove === 1) s1Cheated = true
                break;
            case Strategy.SIMPLETON:
                s1Cheated = s1_curMove === 1
                break;
            case Strategy.DETECTIVE:
                if(s2Moves.length < 4 && s1_curMove === 1)
                    s1Cheated = true;
                    break;
            default:
                break;
        }

        updateMove((_moves) => {
            let _newMoves = new Map<string, MatchProps>(_moves)
            _newMoves.set(id1.concat(id2), {
                moves: oldMoves.concat([[s1_curMove, s2_curMove]]),
                s1Cheated: s1Cheated,
                s2Cheated: s2Cheated,
            })
            return _newMoves
        })

        return [s1_curMove, s2_curMove]
    }


    const simulateDays = (day: number) => {
        if(day === -1 || !isSimulating) {
            setSimulating(false)
            return
        }
        const _players = Array.from(players.values()).filter((item) => item.status === PlayerStatus.SAVED)
        _players.sort((a, b) => {
            return a.id < b.id ? -1 : 1;
        } )
        setTimeout(() => {
            let _tmpScore: Map<string, number> = new Map<string, number>()
            for(let i = 0; i < _players.length; i++) {
                let id1 = _players[i].id
                for(let j = i + 1; j < _players.length; j++) {
                    let id2 = _players[j].id
                    let _move =  getMove(id1, id2)
                    let _score1 = _tmpScore.get(id1) ?? 0
                    let _score2 = _tmpScore.get(id2) ?? 0
                    console.log(_players[i].strategy, _players[j].strategy, _move)
                    _score1 += payoff[_move[0]][_move[1]][0]
                    _score2 += payoff[_move[0]][_move[1]][1]
                    _tmpScore.set(id1, _score1)
                    _tmpScore.set(id2, _score2)
                }
            }
            updateLiveScore((_liveScore) => {
                let _newLiveScore = new Map<string, number[]>(_liveScore)
                let _tmp = []
                console.log(Array.from(_tmpScore.entries()))
                console.log(Array.from(_newLiveScore.entries()))
                Array.from(_tmpScore.entries()).forEach(([k, v]) => {
                    _tmp = _newLiveScore.get(k) ?? []
                    let _last = _tmp.length > 0 ? _tmp[_tmp.length - 1] : 0
                    _newLiveScore.set(k, _tmp.concat(_last + v))
                })
                return _newLiveScore
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
        const _players = Array.from(players.values()).filter((item) => item.status === PlayerStatus.SAVED)
        const _liveScore = new Map<string, number[]>()
        _players.forEach((player) => _liveScore.set(player.id, [0]))
        updateLiveScore(_liveScore)
        setCurGameDay(numRound)
        setSimulating(true)

    }

    const resetSimulation = () => {
        setPlayers(new Map<string, PlayerProps> ())
        updateLiveScore(new Map<string, number[]>())
        updateMove(new Map<string, MatchProps>())
    }



    return (
        <div style = {{"display": "flex", "flexDirection": "column"}}>
            <div style = {{display: "flex", height:"500px"}}>
            <VisualizeChart  xlabels={Array.from({length: chartData[0]?.values.length ?? 0}, (_, i) => i + 1)} datas={chartData} />
            <div style = {{"display": "flex", "flexDirection": "column"}}>
                <button style = {{width:"200px", height: "100px", marginLeft: "8px"}} onClick={() => {runSimulation()}}>Run Simulation</button>
                <button style = {{width:"200px", height: "100px", marginLeft: "8px"}} onClick={() => {resetSimulation()}}>Reset Simulation</button>
            </div>
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
                {Array.from(players.values()).map(props => <Grid item key = {props.id} md = {3}>
                    <Player {...props}/>
                </Grid>)}
            </Grid>
        </div>
    )
}


export default PrisonerDilemma