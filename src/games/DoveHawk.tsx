import React, {EventHandler, FC, FormEvent, useEffect, useState} from "react"
import VisualizeChart, { ChartDataInfoProps, VisualizeChartProps } from "../components/VisualizeChart"

interface Dove {
    probToHawk: number
}

const defaultDove: Dove = {
    probToHawk: 0
}


const DoveHawk: FC = () => {

    const payoff: [number, number][][] = [[[0, 0], [0, 2], [0, 2]], [[2, 0], [1, 1], [1/2, 3/2]], [[2, 0], [3/2, 1/2], [0, 0]]]


    const [isSimulating, setSimulating] = useState<boolean>(false)

    const [maxFood, setMaxFood] = useState<number>(1000)
    const [numDove, setNumDove] = useState<number>(1)
    const [numHawk, setNumHawk] = useState<number>(100)
    const [numDay,  setNumDay] = useState<number>(200)
    const [probToHawk, setProbToHawk] = useState<number>(0.0)


    const [hawkDoveData, setHawkDoveData] = useState<[number, number][]>([[0, 0]])

    useEffect(() => {
        setHawkDoveData([[0, 0], [numDove, numHawk]])
    }, [numDove, numHawk])


    const [curGameDay, setCurGameDay] = useState<number>(numDay)
    const [chartData, setChartData] = useState<ChartDataInfoProps[]>([])

    useEffect(() => {
        setChartData([
            {label: "Dove", values: hawkDoveData.map((data) => data[0]), lineColor: "blue"},    
            {label: "Hawk", values: hawkDoveData.map((data) => data[1]), lineColor: "red"}, 
        ])
    }, [hawkDoveData])


    const updateMaxFood = (e: FormEvent) => {
        setSimulating(false)
        setCurGameDay(numDay)
        setMaxFood(Math.min(1000, Number((e.target as HTMLInputElement).value)))
    }

    const updateNumHawk = (e:FormEvent) => {
        setSimulating(false)
        setCurGameDay(numDay)
        setNumHawk(Math.min(maxFood, Number((e.target as HTMLInputElement).value)))
    }

    const updateNumDove = (e:FormEvent) => {
        setSimulating(false)
        setCurGameDay(numDay)
        setNumDove(Math.min(maxFood, Number((e.target as HTMLInputElement).value)))
    }

    const updateNumDay = (e:FormEvent) => {
        setSimulating(false)
        let newDay = Math.min(1000, Number((e.target as HTMLInputElement).value))
        setCurGameDay(newDay)
        setNumDay(newDay)
    }


    const randInt = (n: number) => {
        return Math.floor(Math.random() * n) + 1
    }


    const simulateDays = (day: number) => {
        if(day === 0 || !isSimulating) {
            setSimulating(false)
            return
        }

        setTimeout(() => {
            setHawkDoveData((hawkDoveData) =>  {
                let _numDove = hawkDoveData[hawkDoveData.length - 1][0]
                let _numHawk = hawkDoveData[hawkDoveData.length -1][1]
                let cnt = [Math.max(0, maxFood - _numDove - _numHawk), _numDove , _numHawk]

                let population =[...Array.from({length: cnt[2]}, () => 2),...Array.from({length: cnt[1]}, () => 1), ...Array.from({length: cnt[0]}, () => 0), ]
                population.sort((a, b) => Math.random() - 0.5)
                population = population.slice(0, maxFood)
                cnt = [0, 0, 0]
                for(let j = 0; j < maxFood; j ++) {
                    cnt[population[j]] += 1
                }
                population.sort((a, b) => Math.random() - 0.5)
                for(let j = 0; j < maxFood; j += 2) {
                    
                    let _x = population[j], _y = population[j + 1]
                    if(_x === 1 && (randInt(1000) <= probToHawk * 1000)) {_x = 2}
                    if(_y === 1 && (randInt(1000) <= probToHawk * 1000)) {_y = 2}
    
                    let _chance_x = payoff[_x][_y][0], _chance_y = payoff[_x][_y][1]
                    
                    if(_chance_x <  1 && (randInt(1000) > (_chance_x * 1000))) {
                        cnt[population[j]] -= 1
                    } else if(_chance_x >= 1 && randInt(1000) <= ((_chance_x - 1) * 1000)) {
                        cnt[population[j]] += 1
                    }
    
                    if(_chance_y < 1 && (randInt(1000) > (_chance_y * 1000))) {
                        cnt[population[j + 1]] -= 1
                    } else if(_chance_y >= 1 && randInt(1000) <= ((_chance_y - 1) * 1000)) {
                        cnt[population[j + 1]] += 1
                    }
                }
                return [...hawkDoveData, [cnt[1], cnt[2]]]
            })     
            setCurGameDay(day - 1)      
        }, 500)

    }



    const startSimulation = (e: FormEvent) => {
        setSimulating(true)
    }

    useEffect(() => {
        if(isSimulating) {
            simulateDays(curGameDay)
        }
    }, [isSimulating, curGameDay])


    return (
        <div style = {{display: "flex", height: "50vh"}}>
            <VisualizeChart datas = {chartData} xlabels={Array.from({length: hawkDoveData.length}, (_, i) => i + 1)}/>
            <div style = {{display: "flex", flexDirection: "column", justifyContent:"center", alignContent: "space-between"}}>
                <div style = {{display: "flex", flexDirection: "column", marginTop:"8px"}}>
                    Set number of days to run simulation (max 1000)
                    <input type = "number" aria-label="number of days" value={numDay} onChange={updateNumDay}></input>
                </div>
                <div style = {{display: "flex", flexDirection: "column", marginTop:"8px"}}>
                    Set maximum number of food (max 1000)
                    <input type = "number" aria-label="maximum food" value={maxFood} onChange={updateMaxFood}></input>
                </div>
                <div style = {{display: "flex", flexDirection: "column", marginTop:"8px"}}>
                    Set inital number of hawks
                    <input type = "number" aria-label="number of hawks" value={numHawk} onChange={updateNumHawk}></input>
                </div>
                <div style = {{display: "flex", flexDirection: "column", marginTop:"8px"}}>
                    Set inital number of doves
                    <input type = "number" aria-label="number of doves" value={numDove} onChange={updateNumDove}></input>
                </div>
                
                {isSimulating ? <button onClick={(e: FormEvent) => {setSimulating(false)}}>Stop Simulation</button> : <button onClick={startSimulation}>Start Simulation</button>}
            </div>
        </div>
    )
}

export default DoveHawk