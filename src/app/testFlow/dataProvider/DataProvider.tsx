"use client";
import { ReactNode, createContext, useState } from "react";

export const NodeContext = createContext({context: {node:"", claim:""}, setContext: (context: any) => {}});
export const DataProvider = ({ children }: { children: ReactNode[] }) => {
    const [context, setContext] = useState({
        node: "initial node",
        claim: "initial claim",
    });
  return (
    <NodeContext.Provider value={{ context, setContext }}>
      {children}
    </NodeContext.Provider>
  );
};
