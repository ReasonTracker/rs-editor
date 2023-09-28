'use client'
import React from 'react';
import ReactFlow, { ReactFlowProvider, useReactFlow } from 'reactflow';

export default function ChildComponent()  {
  const { setNodes } = useReactFlow();

  const addNode = () => {
    // Example logic to add a new node
    const newNode = {
      id: 'newNode',
      type: 'default',
      position: { x: 100, y: 100 },
      data: { label: 'New Node' }
    };
    setNodes((nodes) => nodes.concat(newNode));
  };

  return <button onClick={addNode} style={{position:"absolute", top:"0", right:"0"}}>Add Node</button>;
};