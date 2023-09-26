"use client";
import React, { useCallback, useState } from "react";
import { useStore, Node, useReactFlow } from "reactflow";

type transformSelector = (state: any) => any;
const transformSelector: transformSelector = (state) => state.transform;

type Props = {
  initialNodes1: Node[];
  initialNodes2: Node[];
};

export default ({ initialNodes1, initialNodes2 }: Props) => {
  const reactFlowInstance = useReactFlow();

  const consoleLogReactFlowInstance = () => console.log(reactFlowInstance);

  const transform = useStore(transformSelector);

  // getting and setting nodes outside of ReactFlow component
  const { getNodes, setNodes } = useReactFlow();
  const nodes = getNodes();

  const selectAll = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        node.selected = true;
        return node;
      })
    );
  }, [setNodes]);

  const [initialNodes, setInitialNodes] = useState(1);
  const swapNodes = () => {
    if (initialNodes === 1) setNodes(initialNodes2);
    else setNodes(initialNodes1);
    setInitialNodes(initialNodes === 1 ? 2 : 1);
  };

  return (
    <aside className="internalState">
      <div className="description">
        This is an example of how you can access the internal state outside of
        the ReactFlow component.
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div className="title">Zoom & pan transform</div>
          <div className="transform">
            [{transform[0].toFixed(2)}, {transform[1].toFixed(2)},{" "}
            {transform[2].toFixed(2)}]
          </div>
          <div className="title">Nodes</div>
          {nodes.map((node) => (
            <div key={node.id}>
              Node {node.id} - x: {node.position.x.toFixed(2)}, y:{" "}
              {node.position.y.toFixed(2)}
            </div>
          ))}
        </div>

        <div className="buttons">
          <div className="selectall">
            <button onClick={selectAll}>select all nodes</button>
          </div>

          <div>
            <button onClick={swapNodes}>swapNodes()</button>
          </div>
        </div>
        <div className="buttons">
          <div>
            <button onClick={consoleLogReactFlowInstance}>
              consoleLogReactFlowInstance()
            </button>
          </div>
          <div>
            <button onClick={() => console.log(getNodes())}>
              console getNodes()
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
