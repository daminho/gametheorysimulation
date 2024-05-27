import React, {FC, useEffect, useState} from "react";
import VisualizeChart, { ChartDataInfoProps } from "../../components/VisualizeChart";
import Player, { PlayerProps, PlayerStatus, Strategy, StrategyName } from "./Player";
import { Grid, styled } from "@mui/material";
import { Modal } from "react-overlays";


const payoff = [[[3, 3],[0, 5]],[[5, 0],[1, 1]]]


interface MatchProps {
    moves: [number, number][],
    s1Cheated: boolean,
    s2Cheated: boolean,
}

const RandomlyPositionedModal = styled(Modal)`
  position: fixed;
  width: 400px;
  height: 300px;
  z-index: 1040;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -200px;
  border: 1px solid #e5e5e5;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  padding: 20px;
`;

const Backdrop = styled("div")`
  position: fixed;
  z-index: 1040;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  opacity: 0.5;
`;

const PrisonerDilemma: FC = () => {

    
    const [numRound, setNumRound] = useState<number>(0);
    const [hasRandom, setHasRandom] = useState<boolean>(false);


    const [chartData, setChartData] = useState<ChartDataInfoProps[]>([]);
    const [xlabels, setXLabels] = useState<number[]>([]);


    const [players, setPlayers] = useState<Map<string, PlayerProps>>(new Map<string, PlayerProps>());

    const [liveScore, updateLiveScore] = useState<Map<string, number[]>>(new Map<string, number[]>());


    const [move, updateMove] = useState<Map<string, MatchProps>>(new Map<string, MatchProps>());

    const [showResult, setShowResult] = useState<boolean>(false)


    useEffect(() => {
        if(hasRandom) {
            return;
        }
        setNumRound(100 + Math.round(Math.random() * 20));
        setHasRandom(true);
    }, [hasRandom])


    const randomColor = () => {
        let _cac = [140, 140, 140]
        let _x = Math.random()
        if(_x * 99 < 33) {
            _cac[0] += Math.random() * 50 + Math.random() * 50
            _cac[Math.random() < 0.5 ? 1 : 2] += Math.random() * 30 + Math.random() * 30
        } else if(_x * 99 < 66) {
            _cac[1] += Math.random() * 50 + Math.random() * 50
            _cac[Math.random() < 0.5 ? 2 : 0] += Math.random() * 30 + Math.random() * 30
        } else {
            _cac[2] += Math.random() * 50 + Math.random() * 50
            _cac[Math.random() < 0.5 ? 0 : 1] += Math.random() * 30 + Math.random() * 30
        }
        let _tmp = "";
        for(let i = 0; i < 3; i++) {
            _tmp += Math.round(_cac[i]).toString(16)
        }
        console.log("#" + _tmp)
        return ("#" + _tmp)
    }


    const updatePlayers = () => {
        let id = (Math.random() + 1).toString(36).substring(7);

        setPlayers((_players: Map<string, PlayerProps>) => {
            let _newPlayers = new Map<string, PlayerProps>(_players)
            _newPlayers.set(id, {
                name:"", strategy: Strategy.RANDOM,
                status: PlayerStatus.JUST_CREATED,
                id: id,
                color: randomColor(),
                removePlayer: () => {
                    setPlayers((__players) => {
                        let __newPlayers = new Map<string, PlayerProps>(__players)
                        __newPlayers.delete(id)
                        return __newPlayers
                    })
                },
                updatePlayerPropsName: (newName: string) => {
                    setPlayers((__players) => {
                        let __newPlayers = new Map<string, PlayerProps>(__players)
                        let _newProps = Object.assign({}, __newPlayers.get(id)!)
                        _newProps.name = newName
                        __newPlayers.set(id, _newProps)
                        return __newPlayers
                    })
                },
                updatePlayerPropsStrategy: (newStrategy: Strategy) => {
                    setPlayers((__players) => {
                        let __newPlayers = new Map<string, PlayerProps>(__players)
                        let _newProps = Object.assign({}, __newPlayers.get(id)!)
                        _newProps.strategy = newStrategy
                        __newPlayers.set(id, _newProps)
                        return __newPlayers
                    })
                }
            } as PlayerProps)
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
                case Strategy.COPYCAT:
                    return opLast;
                case Strategy.COPYKITTEN:
                    return opCheated ? 1 : 0;
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
            case Strategy.COPYKITTEN:
                if(s2Moves.length > 1) {
                    let n = s2Moves.length
                    if(s2Moves[n - 1] == 1 && s2Moves[n - 2] == 1) s2Cheated = true;
                }
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
            case Strategy.COPYKITTEN:
                if(s1Moves.length > 1) {
                    let n = s1Moves.length
                    if(s1Moves[n - 1] == 1 && s1Moves[n - 2] == 1) s1Cheated = true;
                }
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
            setShowResult(true)
            return
        }
        const _players = Array.from(players.values())
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
                    _score1 += payoff[_move[0]][_move[1]][0]
                    _score2 += payoff[_move[0]][_move[1]][1]
                    _tmpScore.set(id1, _score1)
                    _tmpScore.set(id2, _score2)
                }
            }
            updateLiveScore((_liveScore) => {
                let _newLiveScore = new Map<string, number[]>(_liveScore)
                let _tmp = []
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
        const _players = Array.from(players.values())
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
        setSimulating(false)
        setShowResult(false)
    }

    const resetScore = () => {
        updateLiveScore(new Map<string, number[]>())
        updateMove(new Map<string, MatchProps>())
        setSimulating(false)
        setShowResult(false)
    }

    const renderBackdrop = (props: any) => <Backdrop {...props} />;


    return (
        <div style = {{"display": "flex", "flexDirection": "column"}}>
            <RandomlyPositionedModal
                show={showResult}
                onHide={() => setShowResult(false)}
                renderBackdrop={renderBackdrop}
                aria-labelledby="modal-label"
            >
                <div style = {{display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                    <h4 id="modal-label">Result</h4>
                    <ul>
                        {Array.from(liveScore.entries()).sort(([_a, a], [_b, b]) => {
                            if(a.length === 0) return 1;
                            return a[a.length - 1] < b[b.length - 1] ? 1 : -1;
                        }).map(([k, v]) => <li>{players.get(k)!.name} - {StrategyName[players.get(k)!.strategy]}: {v.length > 0 ? v[v.length - 1] : 0}</li>)}
                    </ul>
                </div>
            </RandomlyPositionedModal>
            <div style = {{display: "flex", height:"400px", marginBottom:"8px"}}>
                <div style = {{width:"100pc",border:"solid", borderWidth:"0.2px", borderRadius:"8px", borderColor:"grey"}}>
                    <VisualizeChart  xlabels={Array.from({length: chartData[0]?.values.length ?? 0}, (_, i) => i + 1)} datas={chartData} />
                </div>
                <div style = {{"display": "flex", "flexDirection": "column"}}>
                    <button style = {{width:"200px", height: "100px", marginLeft: "8px"}} onClick={() => {runSimulation()}}>Run Simulation</button>
                    <button style = {{width:"200px", height: "100px", marginLeft: "8px"}} onClick={() => {resetSimulation()}}>Reset Simulation</button>
                    <button style = {{width:"200px", height: "100px", marginLeft: "8px"}} onClick={() => {resetScore()}}>Reset Score</button>
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