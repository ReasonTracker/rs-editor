"use client";
import { ReactNode, createContext, useState } from "react";

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
  const [context, setContextState] = useState({
});

function setContext(updatedContext: NodeClaim) {
  // You can add any additional logic here before setting the state
  setContextState(updatedContext);
}

  return (
    <NodeContext.Provider value={{ context, setContext }}>
      {children}
    </NodeContext.Provider>
  );
};
