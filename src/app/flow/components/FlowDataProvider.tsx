import { ReactNode, createContext, useContext, useReducer, useState } from 'react';
import { EdgeChange, NodeChange, useEdgesState, useNodesState } from 'reactflow';
import { ActionTypes } from '@/reasonScoreNext/ActionTypes';
import { flowDataReducer } from '../utils/flowDataReducer';
import { DebateData } from '@/reasonScoreNext/DebateData';
import { Node, Edge } from "reactflow";
import {
  DisplayNodeData,
  DisplayEdgeData,
  DevContextState
} from "@/app/flow/types/types";
// import { initialNodes } from '../data/initialNodesEdges';

export const FlowDataContext = createContext<FlowDataState | undefined>(undefined);
export const DevContext = createContext<DevContextState | undefined>(undefined);

export type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export function FlowDataProvider({ children }: { children: ReactNode[] | ReactNode }) {
  const [displayNodes, setDisplayNodes, onNodesChange] = useNodesState<DisplayNodeData>([]);
  const [displayEdges, setDisplayEdges, onEdgesChange] = useEdgesState<DisplayEdgeData>([]);
  const [debateData, setDebateData] = useState<DebateData>({claims:{}, connectors:{} })
  const [isDev, setDevMode] = useState<boolean>(false);

  async function dispatch(actions: ActionTypes[]) {
    flowDataReducer({ actions, setDisplayNodes, setDisplayEdges, setDebateData, 
      displayNodes // TODO: remove this, add position to debateData
    })
  }

  return (
    <FlowDataContext.Provider value={{ dispatch, displayNodes, displayEdges, onNodesChange, onEdgesChange, debateData }}>
      <DevContext.Provider value={{isDev, setDevMode}}>
      {children}
      </DevContext.Provider>
    </FlowDataContext.Provider>
  );
}

export type FlowDataState = {
  dispatch: (actions: ActionTypes[]) => void,
  displayNodes: Node<DisplayNodeData, string | undefined>[],
  displayEdges: Edge<DisplayEdgeData>[],
  onNodesChange: OnChange<NodeChange>,
  onEdgesChange: OnChange<EdgeChange>,
  debateData: DebateData
}


