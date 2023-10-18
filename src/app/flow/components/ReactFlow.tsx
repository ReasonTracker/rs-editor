'use client';
import ReactFlow from 'reactflow';
import { FlowDataContext } from './FlowDataProvider'
import { useContext } from 'react';
import DisplayNode from './DisplayNode'
import DisplayEdge from './DisplayEdge'

const nodeTypes = { rsNode: DisplayNode };
const edgeTypes = { rsEdge: DisplayEdge };


export default function Flow() {

    const x = useContext(FlowDataContext);

    return (
        <div style={{ width: '100vw', height: '100vh', margin: 'auto' }} >
            <ReactFlow
                nodes={x.displayNodes}
                edges={x.displayEdges}
                onNodesChange={x.onNodesChange}
                onEdgesChange={x.onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
            />
        </div>
    )
}