import React, {FC, useContext, useEffect, useState} from "react";
import VisualizeChart, { ChartDataInfoProps } from "../../components/VisualizeChart";
import {Strategy, StrategyName} from "./Strategy";
import { Grid, styled } from "@mui/material";
import { Modal } from "react-overlays";
import { StrategiesContext } from "./PrisonerDilemmaEntry";


const payoff = [[[3, 3],[0, 5]],[[5, 0],[1, 1]]]

export interface PlayerProps {
    strategy: Strategy,
    id: number,
    score: number,
}

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
  overflow: scroll;
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

const SimulationTab: FC = () => {

    const strategiesContext = useContext(StrategiesContext)

    

    const [chartData, setChartData] = useState<ChartDataInfoProps[]>([]);
    const [liveScore, updateLiveScore] = useState<Map<Strategy, number[]>>(new Map<Strategy, number[]>());
    const [showResult, setShowResult] = useState<boolean>(false)

    const [isSimulating, setSimulating] = useState<boolean>(false)
    const [curGameDay, setCurGameDay] = useState<number>(1000)
    const [strategiesColor, updateStrategiesColor] = useState<Map<Strategy, string>>(new Map<Strategy, string>())

    useEffect(() => {
        let entries = Array.from(liveScore.entries())
        setChartData(entries.map(([k, v]) => {
            let _name = StrategyName[k.valueOf()]
            return {
                label: _name,
                values: v,
                lineColor: strategiesColor.get(k) ?? "black"
            }
        }))
    }, [liveScore])




    const [players, updatePlayers] = useState<PlayerProps[]>([])


    const getPercentage = (_strategiesCount: Map<Strategy, number>) => {
        let _percentage = new Map<Strategy, number>()
        let _sum = 0

        Array.from(_strategiesCount.entries()).forEach(([_key, _val]) => {
            _sum += _val;
        })

        

        Array.from(_strategiesCount.entries()).forEach(([_key, _val]) => {
            _percentage.set(_key, _sum != 0 ? (Math.round(((_val /_sum )* 10000)) / 100): 0)
        })

        return _percentage

    }

    const _handleNewPercentage = (_percentage: Map<Strategy, number>) => {
        updateLiveScore((_liveScore) => {
            let _newLiveScore = new Map<Strategy, number[]>(_liveScore)
            let _tmp = []
            Array.from(_percentage.entries()).forEach(([k, v]) => {
                _tmp = _newLiveScore.get(k) ?? []
                let _last = _tmp.length > 0 ? _tmp[_tmp.length - 1] : 0
                _newLiveScore.set(k, _tmp.concat(v))
            })
            return _newLiveScore
        })
    }

    useEffect(() => {
        resetSimulation()
        updatePlayers((_players) => {
            let _newPlayers: PlayerProps[] = []
            Array.from(strategiesContext.strategiesCount.entries()).forEach(([_strategy, _cnt]) => {
                for(let i = 0; i < _cnt; i++) {
                    const _id = _newPlayers.length
                    _newPlayers.push({
                        strategy: _strategy,
                        id: _id,
                        score: 0
                    })
                }
            })
            return _newPlayers
        })
        let _strategiesColor = new Map<Strategy, string>()
        Array.from(strategiesContext.strategiesCount.keys()).forEach((_key) => {
            _strategiesColor.set(_key, randomColor())
        })

        let _percentage = getPercentage(strategiesContext.strategiesCount)
        _handleNewPercentage(_percentage)

    }, [strategiesContext.strategiesCount])



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
        return ("#" + _tmp)
    }




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


    const getScore = (s1: Strategy, s2: Strategy): [number, number] => {
        const makeMove = (_s: Strategy, turn: number, selfLast: number, opLast: number, opCheated: boolean) => {
            if(turn === 0) return init(_s) 
            switch(_s) {
                case Strategy.ALL_CHEAT:
                    return 1;
                case Strategy.ALL_COOPERATE:
                    return 0;
                case Strategy.DETECTIVE:
                    if(turn < 4) {
                        return turn === 1 ? 1 : 0;
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
                case Strategy.TITFORTAT:
                    return opLast;
                case Strategy.COPYKITTEN:
                    return opCheated ? 1 : 0;
                case Strategy.SECRETE:
                case Strategy.RANDOM:
                    return (Math.random() < 0.5 ? 0 : 1);
            }
        }

        let s1Last = 0, s2Last = 0;
        let s1Cheated = false, s2Cheated = false;
        let s1Score = 0, s2Score = 0;
        let s1Moves: number[] = [], s2Moves: number[] = []

        for(let i = 0; i < strategiesContext.numRoundPerMatch; i++) {
            let s1Move = makeMove(s1, i, s1Last, s2Last, s2Cheated)
            let s2Move = makeMove(s2, i, s2Last, s1Last, s1Cheated)
            s1Score += payoff[s1Move][s2Move][0]
            s2Score += payoff[s1Move][s2Move][1]
            s1Moves.push(s1Move)
            s2Moves.push(s2Move)
            switch(s1) {
                case Strategy.GRUDGER:
                    if(s2Move === 1) s2Cheated = true
                    break;
                case Strategy.SIMPLETON:
                    s2Cheated = s2Move === 1
                    break;
                case Strategy.DETECTIVE:
                    if(i < 4 && s2Move === 1)
                        s2Cheated = true;
                    break;
                case Strategy.COPYKITTEN:
                    if(i > 1) {
                        let n = s2Moves.length
                        if(s2Moves[n - 1] === 1 && s2Moves[n - 2] === 1) s2Cheated = true;
                    }
                    break;
                default:
                    break;
            }
    
            switch(s2) {
                case Strategy.GRUDGER:
                    if(s1Move === 1) s1Cheated = true
                    break;
                case Strategy.SIMPLETON:
                    s1Cheated = s1Move === 1
                    break;
                case Strategy.DETECTIVE:
                    if(i < 4 && s1Move === 1)
                        s1Cheated = true;
                    break;
                case Strategy.COPYKITTEN:
                    if(s1Moves.length > 1) {
                        let n = s1Moves.length
                        if(s1Moves[n - 1] === 1 && s1Moves[n - 2] === 1) s1Cheated = true;
                    }
                    break;
                default:
                    break;
            }
            s1Last = s1Move
            s2Last = s2Move 
        }

        
        return [s1Score, s2Score];
    }


    const simulateDays = (day: number) => {
        if(day === -1 || !isSimulating) {
            setSimulating(false)
            setShowResult(true)
            return
        }
        setTimeout(() => {
            let _players = Array.from(players)
            for(let i = 0; i < _players.length; i++) {
                for(let j = i + 1; j < _players.length; j++) {
                    let [iScore, jScore] = getScore(_players[i].strategy, _players[j].strategy)
                    _players[i].score += iScore
                    _players[j].score += jScore
                }
            }

            _players.sort((a : PlayerProps, b: PlayerProps) => {
                if(a.score == b.score) {
                    return Math.random() < 0.5 ? 1 : -1; // avoid being sorted by other metrics
                } else {
                    return a.score < b.score ? 1 : -1;
                }
                
            })

            let _listBestStrategy: Strategy[] = [];
            let _n = Math.min(_players.length, strategiesContext.replaceAmount)
            for(let i = 0; i < _n; i++) {
                _listBestStrategy.push(_players[i].strategy)
            }
            for(let i = 0; i < _n; i++) {
                _players[_players.length - 1 - i].strategy = _listBestStrategy[i]
            }
            for(let i = 0; i < _players.length; i++) {
                _players[i].score = 0
            }

            let _newLocalStrategiesCount = new Map<Strategy, number>()

            for(let i = 0; i < _players.length; i++) {
                let _tmp = _newLocalStrategiesCount.get(_players[i].strategy) ?? 0
                _newLocalStrategiesCount.set(_players[i].strategy, _tmp + 1)
            }
            Array.from(strategiesContext.strategiesCount.keys()).forEach((_key) => {
                if(!_newLocalStrategiesCount.has(_key)) {
                    _newLocalStrategiesCount.set(_key, 0)
                }
            });

            updatePlayers(_players);

            let _percentage = getPercentage(_newLocalStrategiesCount)
            _handleNewPercentage(_percentage)

         
            setCurGameDay(day - 1)
        },300)

        
    }

    useEffect(() => {
        if(isSimulating) {
            simulateDays(curGameDay)
        }
    }, [isSimulating, curGameDay])


    const runSimulation = () => {
        const _players = Array.from(players.values())
        const _liveScore = new Map<Strategy, number[]>()
        updateLiveScore(_liveScore)
        setSimulating(true)

    }

    const resetSimulation = () => {
        updateLiveScore(new Map<Strategy, number[]>())
        setSimulating(false)
        setShowResult(false)
    }


    const renderBackdrop = (props: any) => <Backdrop {...props} />;


    return (
        <div style = {{display: "flex", flexDirection: "column"}}>
            {/* <RandomlyPositionedModal
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
            </RandomlyPositionedModal> */}

            {/*The Chart & buttons*/}
            <div style = {{display: "flex", height:"400px", marginBottom:"8px", maxWidth: "100vw"}}>
                <div style = {{width:"100vw",border:"solid", borderWidth:"0.2px", borderRadius:"8px", borderColor:"grey"}}>
                    <VisualizeChart  xlabels={Array.from({length: chartData[0]?.values.length ?? 0}, (_, i) => i + 1)} datas={chartData} />
                </div>
                <div style = {{"display": "flex", "flexDirection": "column"}}>
                    <button style = {{width:"200px", height: "100px", marginLeft: "8px"}} onClick={() => {runSimulation()}}>Run Simulation</button>
                    <button style = {{width:"200px", height: "100px", marginLeft: "8px"}} onClick={() => {setSimulating(false)}}>Stop Simulation</button>

                    <button style = {{width:"200px", height: "100px", marginLeft: "8px"}} onClick={() => {resetSimulation()}}>Reset Simulation</button>
                </div>
            </div>

            {/* The grid to display information of players/strategies
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
            </Grid> */}
        </div>
    )
}


export default SimulationTab