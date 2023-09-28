import { ReactNode, createContext, useContext, useReducer, useState } from 'react';
import { EdgeChange, NodeChange, useEdgesState, useNodesState } from 'reactflow';
import { DisplayNodeData, ConfidenceEdgeData, RelevenceEdgeData } from './pageData';
import { ActionTypes } from '@/reasonScoreNext/ActionTypes';
import { flowDataReducer } from './flowDataReducer';
import { DebateData } from '@/reasonScoreNext/DebateData';
import { Node, Edge } from "reactflow";

const initialArg: FlowDataState | undefined = undefined;
export const FlowDataContext = createContext<FlowDataState | undefined>(initialArg);

export type OnChange<ChangesType> = (changes: ChangesType[]) => void;


export function FlowDataProvider({ children }: { children: ReactNode[] | ReactNode }) {
  const [displayNodes, setDisplayNodes, onNodesChange] = useNodesState<DisplayNodeData>([]);
  const [displayEdges, setDisplayEdges, onEdgesChange] = useEdgesState<ConfidenceEdgeData | RelevenceEdgeData>([]);
  const [debateData, setDebateData] = useState<DebateData>({claims:{}, connectors:{} })

  async function dispatch(actions: ActionTypes[]) {
    flowDataReducer({ actions, setDisplayNodes, setDisplayEdges, setDebateData })
  }

  return (
    <FlowDataContext.Provider value={{ dispatch, displayNodes, displayEdges, onNodesChange, onEdgesChange }}>
      {children}
    </FlowDataContext.Provider>
  );
}

export type FlowDataState = {
  dispatch: (actions: ActionTypes[]) => void,
  displayNodes: Node<DisplayNodeData, string | undefined>[],
  displayEdges: Edge<ConfidenceEdgeData | RelevenceEdgeData>[],
  onNodesChange: OnChange<NodeChange>,
  onEdgesChange: OnChange<EdgeChange>,
}

