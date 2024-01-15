'use client';
import ReactFlow from 'reactflow';
import { FlowDataContext } from './FlowDataProvider'
import { useContext } from 'react';
import { DisplayNode } from '../flow-old/[[...slug]]/DisplayNode';
import DisplayEdge from '../flow-old/[[...slug]]/DisplayEdge';

const nodeTypes = { rsNode: DisplayNode };
const edgeTypes = { rsEdge: DisplayEdge };


export default function SubCom() {

  const x = useContext(FlowDataContext);


  return (<>
    {x && <>
      <button onClick={() => x.dispatch(
        [{
          type: 'add',
          newData: { type: 'claim', id: '1', content: 'claim 1' }
        }
      ]
      )}>Add node</button>
      <div style={{ width: '100vw', height: '100vh', margin: 'auto' }} >

        <ReactFlow
          nodes={x.displayNodes}
          edges={x.displayEdges}
          onNodesChange={x.onNodesChange}
          onEdgesChange={x.onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        ></ReactFlow>
      </div>
    </>}
  </>
  )
}