import { ReactNode, createContext, useContext, useReducer, useState } from 'react';
import { useEdgesState, useNodesState } from 'reactflow';
// import { DisplayNodeData, ConfidenceEdgeData, RelevenceEdgeData } from './pageData';
import { ActionTypes } from '@/reasonScoreNext/ActionTypes';
import { dataReducer } from './dataReducer';
import { DebateData } from '@/reasonScoreNext/DebateData';
import { initialDebateData } from './initialNodesEdges';

export const FlowDataContext = createContext<FlowDataState | undefined>(initialDebateData);


export function FlowDataProvider({ children }: { children: ReactNode[] }) {
  const [_debateData, setDebateData] = useState<DebateData>({claims:{}, connectors:{} })

  async function dispatch(actions: ActionTypes[]) {
    dataReducer({ actions, setDebateData })
  }

  return (
    <FlowDataContext.Provider value={{ dispatch }}>
      {children}
    </FlowDataContext.Provider>
  );
}

export type FlowDataState = any


