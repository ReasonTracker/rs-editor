import { ReactNode, createContext, use, useState } from 'react';
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
import { initialDebateData, initialDisplayEdges, initialDisplayNodes } from '../data/initialNodesEdges';


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
    const [debateData, setDebateData] = useState<DebateData>({claims: {}, connectors: {}})
    const [isDev, setDevMode] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);

    async function dispatch(actions: ActionTypes[]) {
        flowDataReducer({
            actions, setDisplayNodes, setDisplayEdges, setDebateData, setAnimating,
            displayNodes // TODO: remove this, add position to debateData
        })
    }

    return (
        <FlowDataContext.Provider value={{ dispatch, displayNodes, setDisplayNodes, displayEdges, setDisplayEdges, onNodesChange, onEdgesChange, debateData, animating }}>
            <DevContext.Provider value={{ isDev, setDevMode }}>
                {children}
            </DevContext.Provider>
        </FlowDataContext.Provider>
    );
}



