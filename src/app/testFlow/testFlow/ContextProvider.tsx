"use client";
import { ReactNode, createContext, useState } from "react";

export const initialNodes = [
  {
    id: "provider-1",
    type: "input",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 },
  },
  {
    id: "provider-2",
    data: { label: "Node 2a" },
    position: { x: 100, y: 100 },
  },
  {
    id: "provider-3",
    data: { label: "Node 3a" },
    position: { x: 400, y: 100 },
  },
  {
    id: "provider-4",
    data: { label: "Node 4a" },
    position: { x: 400, y: 200 },
  },
];

export const initialEdges = [
  {
    id: "provider-e1-2",
    source: "provider-1",
    target: "provider-2",
    animated: true,
  },
  { id: "provider-e1-3", source: "provider-1", target: "provider-3" },
];

type NodeClaim = {
  [key: string]: {
      claim: string;
  };
};

export const NodeContext = createContext({
  context: {} as NodeClaim,
  setContext: (updatedContext: NodeClaim) => {}
});

export const DataProvider = ({ children }: { children: ReactNode[] }) => {
  const [context, setContext] = useState({
});

  return (
    <NodeContext.Provider value={{ context, setContext }}>
      {children}
    </NodeContext.Provider>
  );
};
