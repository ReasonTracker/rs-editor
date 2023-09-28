"use client";
import React, { useContext } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";

import { initialEdges, initialNodes } from "./initialNodesEdges";
import { FlowDataProvider } from "./DataProvider";
import Sidebar from './Sidebar'; 

import "./style.css";

import { FlowDataContext } from "./DataProvider";


const ProviderFlow = () => {
  // const [_nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [_edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="testFlow">
      <ReactFlowProvider>
        <FlowDataProvider>
          <div className="reactflow-wrapper">
            <ReactFlow
              nodes={initialNodes}
              edges={initialEdges}
              // onNodesChange={onNodesChange}
              // onEdgesChange={onEdgesChange}
              fitView
            >
              <Controls />
            </ReactFlow>
          </div>
          <Sidebar />
        </FlowDataProvider>
      </ReactFlowProvider>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <ProviderFlow />
    </ReactFlowProvider>
  );
}
