'use client'

import ReactFlow, { ReactFlowProvider, useReactFlow } from 'reactflow';
import ChildComponent from './childComponent';

import "./style.css";
const nodes = [
  { id: 'node-1', position: { x: 0, y: 0 }, data: { label: 'node 1' } },
];

function Flow() {
  return (
    <div className="reactflow-wrapper">
        <ReactFlow defaultNodes={nodes} />;
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
      <ChildComponent />
    </ReactFlowProvider>
  );
}
