'use client';

import { ReactNode, createContext, use, useEffect, useState } from 'react';
import { useEdgesState, useNodesState } from 'reactflow';
import { ActionTypes } from '@/reasonScoreNext/ActionTypes';
import { flowDataReducer } from '../utils/flowDataReducer';
import { DebateData } from '@/reasonScoreNext/DebateData';
import {
    DisplayNodeData,
    DisplayEdgeData,
    DevContextState,
    FlowDataState,
} from "@/app/flow/types/types";
import { Debate, newDebate } from '@/reasonScoreNext/Debate';
import { newId } from '@/reasonScore/newId';


const initialFlowDataState: FlowDataState = {
    dispatch: () => { },
    displayNodes: [],
    setDisplayNodes: () => { },
    setDisplayEdges: () => { },
    displayEdges: [],
    onNodesChange: () => { },
    onEdgesChange: () => { },
    debateData: { claims: {}, connectors: {} },
    animating: false,
    debate: newDebate({mainClaimId: newId()}),
    isAddingNode: false,
    setIsAddingNode: () => { },
};

const initialDevContextState: DevContextState = {
    isDev: false,
    setDevMode: () => { },
}

export const FlowDataContext = createContext<FlowDataState>(initialFlowDataState);
export const DevContext = createContext<DevContextState>(initialDevContextState);

export function FlowDataProvider({ children }: { children: ReactNode[] | ReactNode }) {
    const [displayNodes, setDisplayNodes, onNodesChange] = useNodesState<DisplayNodeData>([]);
    const [displayEdges, setDisplayEdges, onEdgesChange] = useEdgesState<DisplayEdgeData>([]);
    const [debateData, setDebateData] = useState<DebateData>({ claims: {}, connectors: {} })
    const [debate, setDebate] = useState<Debate>(initialFlowDataState.debate)
    const [isDev, setDevMode] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);
    const [isAddingNode, setisAddingNode] = useState<boolean>(false);
    const flowDataState = { debate, dispatch, displayNodes, setDisplayNodes, displayEdges, setDisplayEdges, onNodesChange, onEdgesChange, debateData, animating }

    useEffect(() => {
        if (debateData.claims[debate.mainClaimId || ""]) return
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function dispatch(actions: ActionTypes[]) {
        flowDataReducer({
            debate, setDebate, actions, setDisplayNodes, setDisplayEdges, setDebateData, setAnimating,
            displayNodes // TODO: remove this, add position to debateData
        })
    }

    return (
        <FlowDataContext.Provider value={{ debate, dispatch, displayNodes, setDisplayNodes, displayEdges, setDisplayEdges, onNodesChange, onEdgesChange, debateData, animating, isAddingNode, setIsAddingNode: setisAddingNode }}>
            <DevContext.Provider value={{ isDev, setDevMode }}>
                {children}
            </DevContext.Provider>
        </FlowDataContext.Provider>
    );
}



