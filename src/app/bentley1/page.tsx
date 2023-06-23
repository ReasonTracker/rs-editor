'use client'

import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';
import './page.css';
import './rsNode.Module.css';

//import pageData from './pageData';
import { RsNode } from './RsNode';
import RsEdge from './RsEdge';
import { getEdges, getNodes } from './pageData';

const nodeTypes = { rsNode: RsNode };
const edgeTypes = { rsEdge: RsEdge };

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(getNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getEdges());

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '90vw', height: '90vh', margin: 'auto', border: '1px solid grey' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
