import React, { FC } from "react";


interface StrategyProps {
    name: string,
    information: string,
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
])
