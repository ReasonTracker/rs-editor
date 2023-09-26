"use client";
import React, { useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";

import { initialEdges, initialNodes, DataProvider } from "./ContextProvider";
import Sidebar from './Sidebar'; 

import "./style.css";



const ProviderFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="testFlow">
      <ReactFlowProvider>
        <DataProvider>
          <div className="reactflow-wrapper">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
            >
              <Controls />
            </ReactFlow>
          </div>
          <Sidebar />
        </DataProvider>
      </ReactFlowProvider>
    </div>
  );
};

export default function App({ params }: { params: { slug: string[] } }) {
  return (
    <ReactFlowProvider>
      <ProviderFlow />
    </ReactFlowProvider>
  );
}
