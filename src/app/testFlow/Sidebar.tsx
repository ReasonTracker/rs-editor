'use client'
import React, { useCallback } from 'react';
import { useStore, Node, } from 'reactflow';

type transformSelector = (state: any) => any;
const transformSelector: transformSelector = (state) => state.transform;



type Props = {
    nodes: Node[];
    setNodes: (func: (nodes: Node[]) => Node[]) => void;
  };

export default ({ nodes, setNodes }: Props) => {
  const transform = useStore(transformSelector);

  const selectAll = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        node.selected = true;
        return node;
      })
    );
  }, [setNodes]);

  return (
    <aside className='internalState'>
      <div className="description">
        This is an example of how you can access the internal state outside of the ReactFlow
        component.
      </div>
      <div className="title">Zoom & pan transform</div>
      <div className="transform">
        [{transform[0].toFixed(2)}, {transform[1].toFixed(2)}, {transform[2].toFixed(2)}]
      </div>
      <div className="title">Nodes</div>
      {nodes.map((node) => (
        <div key={node.id}>
          Node {node.id} - x: {node.position.x.toFixed(2)}, y: {node.position.y.toFixed(2)}
        </div>
      ))}

      <div className="selectall">
        <button onClick={selectAll}>select all nodes</button>
      </div>
    </aside>
  );
};
