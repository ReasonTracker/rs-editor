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

import Sidebar from "./Sidebar"

import "./style.css";

const initialNodes1 = [
    {
      id: 'provider-1',
      type: 'input',
      data: { label: 'Node 1' },
      position: { x: 250, y: 5 },
    },
    { id: 'provider-2', data: { label: 'Node 2a' }, position: { x: 100, y: 100 } },
    { id: 'provider-3', data: { label: 'Node 3a' }, position: { x: 400, y: 100 } },
    { id: 'provider-4', data: { label: 'Node 4a' }, position: { x: 400, y: 200 } },
  ];
const initialNodes2 = [
    {
      id: 'provider-1',
      type: 'input',
      data: { label: 'Node 1b' },
      position: { x: 250, y: 5 },
    },
    { id: 'provider-2', data: { label: 'Node 2b' }, position: { x: 150, y: 50 } },
    { id: 'provider-3', data: { label: 'Node 3b' }, position: { x: 450, y: 50 } },
    { id: 'provider-4', data: { label: 'Node 4b' }, position: { x: 450, y: 150 } },
  ];
  
  const initialEdges = [
    {
      id: 'provider-e1-2',
      source: 'provider-1',
      target: 'provider-2',
      animated: true,
    },
    { id: 'provider-e1-3', source: 'provider-1', target: 'provider-3' },
  ];
  
  const ProviderFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes1);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  

  return (
    <div className="providerflow">
      <ReactFlowProvider>
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

        <Sidebar initialNodes1={initialNodes1} initialNodes2={initialNodes2} />
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


