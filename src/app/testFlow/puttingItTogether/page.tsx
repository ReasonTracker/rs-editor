"use client";
import React from "react";
import ReactFlow, { ReactFlowProvider, Controls } from "reactflow";
import "reactflow/dist/style.css";

import { initialEdges, initialNodes } from "./initialNodesEdges";
import { FlowDataProvider } from "./DataProvider";
import Sidebar from "./Sidebar";

import "./style.css";

export default function App() {
  return (
    <div className="testFlow">
      <ReactFlowProvider>
        <FlowDataProvider>
          <div className="reactflow-wrapper">
            <ReactFlow
              defaultNodes={initialNodes}
              defaultEdges={initialEdges}
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
}
