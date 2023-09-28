import { ReactNode, createContext, useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import { ActionTypes } from "@/reasonScoreNext/ActionTypes";
import { dataReducer } from "./dataReducer";
import { DebateData } from "@/reasonScoreNext/DebateData";
import { initialDebateData } from "./initialNodesEdges";
import useRandomPosition from "./utils/getRandomPosition";

export const FlowDataContext = createContext<FlowDataState | undefined>(
  initialDebateData
);

export function FlowDataProvider({ children }: { children: ReactNode[] }) {
  const [debateData, setDebateData] = useState<DebateData>(initialDebateData);
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();

  async function dispatch(actions: ActionTypes[]) {
    dataReducer({ actions, setDebateData });
  }

  useEffect(() => {
    const nodesFromDebateData = convertDebateDataToNodes(debateData);
    setNodes(nodesFromDebateData);
  }, [debateData]);

  const convertDebateDataToNodes = (debateData: DebateData) => {
    const existingNodes = getNodes();

    return Object.values(debateData.claims).map((claim) => {
      const existingNode = existingNodes.find((node) => node.id === claim.id);

      const label = claim.content
        ? claim.content
        : existingNode
        ? existingNode.data.label
        : "";
      const position = existingNode
        ? existingNode.position
        : useRandomPosition();
        
      return {
        id: claim.id,
        data: {
          label,
        },
        position: position,
      };
    });
  };

  return (
    <FlowDataContext.Provider value={{ dispatch, debateData }}>
      {children}
    </FlowDataContext.Provider>
  );
}

export type FlowDataState = any;
