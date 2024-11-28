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
import addNode from '../utils/addNode';
import { newId } from '@/reasonScore/newId';


const initialFlowDataState: FlowDataState = {
    dispatch: () => { },
    dispatchReset: () => { },
    displayNodes: [],
    setDisplayNodes: () => { },
    setDisplayEdges: () => { },
    displayEdges: [],
    onNodesChange: () => { },
    onEdgesChange: () => { },
    debateData: { claims: {}, connectors: {} },
    animating: false,
    debate: newDebate({ mainClaimId: newId() }),
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
    const flowDataState: FlowDataState = { debate, dispatch, dispatchReset, displayNodes, setDisplayNodes, displayEdges, setDisplayEdges, onNodesChange, onEdgesChange, debateData, animating }

    useEffect(() => {
        if (debateData.claims[debate.mainClaimId || ""]) return
        addNode({ flowDataState, isNewNodePro: true, claimId: debate.mainClaimId })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function dispatch(actions: ActionTypes[]) {
        flowDataReducer({
            setDebate, actions, setDisplayNodes, setDisplayEdges, setDebateData, setAnimating,
            displayNodes // TODO: remove this, add position to debateData
        })
    }

    async function dispatchReset(actions: ActionTypes[], debateData: DebateData, debate: Debate) {
        flowDataReducer({
            debate, debateData, actions, displayNodes,
            setDebate, setDisplayNodes, setDisplayEdges, setDebateData, setAnimating,
            // TODO: displayNodes remove this, add position to debateData
        })
    }

    return (
        <FlowDataContext.Provider value={{ debate, dispatch, dispatchReset, displayNodes, setDisplayNodes, displayEdges, setDisplayEdges, onNodesChange, onEdgesChange, debateData, animating }}>
            <DevContext.Provider value={{ isDev, setDevMode }}>
                {children}
            </DevContext.Provider>
        </FlowDataContext.Provider>
    );
}



