import React, { FC } from "react";


interface StrategyProps {
    name: string,
    color: string,
}


// TODO: revise code
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
    PSYCHO = 9,
    PAVLOV = 10,
}

export const StrategyPropsMap: Map<Strategy, StrategyProps> = new Map<Strategy, StrategyProps>([
    [Strategy.ALL_CHEAT,     {name: "All Cheat",     color: "#fc2803"} as StrategyProps],
    [Strategy.ALL_COOPERATE, {name: "All Cooperate", color: "#fc03e7"} as StrategyProps],
    [Strategy.GRUDGER,       {name: "Grudger",       color: "#453920"} as StrategyProps],
    [Strategy.DETECTIVE,     {name: "Detective",     color: "#565c1c"} as StrategyProps],
    [Strategy.SIMPLETON,     {name: "Simpleton",     color: "#49ab4e"} as StrategyProps],
    [Strategy.RANDOM,        {name: "Random",        color: "#4963ab"} as StrategyProps],
    [Strategy.SECRETE,       {name: "Secrete",       color: "#4963ab"} as StrategyProps],
    [Strategy.TITFORTAT,     {name: "Tit For Tat",   color: "#0394fc"} as StrategyProps],
    [Strategy.COPYKITTEN,    {name: "Copy Kitten",   color: "#03e3fc"} as StrategyProps],
    [Strategy.PSYCHO,        {name: "Psycho",        color: "#610308"} as StrategyProps],
    [Strategy.PAVLOV,        {name: "Pavlov",        color: "#0d9146"} as StrategyProps],
])


export const NameToEnumStrategy: Map<string, Strategy> = new Map<string, Strategy>([
    ["All Cheat", Strategy.ALL_CHEAT],
    ["All Cooperate", Strategy.ALL_COOPERATE],
    ["Grudger", Strategy.GRUDGER],
    ["Detective", Strategy.DETECTIVE],
    ["Simpleton", Strategy.SIMPLETON],
    ["Random", Strategy.RANDOM],
    ["Secrete", Strategy.SECRETE],
    ["Tit For Tat", Strategy.TITFORTAT],
    ["Copy Kitten", Strategy.COPYKITTEN],
    ["Psycho", Strategy.PSYCHO],
    ["Pavlov", Strategy.PAVLOV]
])
