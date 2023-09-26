"use client";
import React, { useCallback, useContext, useState } from "react";
import { useStore, Node, useReactFlow } from "reactflow";
import { NodeContext } from "./ContextProvider";

type transformSelector = (state: any) => any;
const transformSelector: transformSelector = (state) => state.transform;

export const Sidebar = () => {
  const { getNodes, setNodes } = useReactFlow();
  const nodes = getNodes();

  const [selectedNode, setSelectedNode] = useState(
    nodes.length > 0 ? nodes[0].id : ""
  );
  const [label, setLabel] = useState(
    nodes.length > 0 ? nodes[0].data.label : ""
  );
  const { context, setContext } = useContext(NodeContext);
  const [claim, setClaim] = useState(
    context[selectedNode] ? context[selectedNode].claim : ""
  );

  const updateContextAndLabel = () => {
    // Update node label
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === selectedNode) {
          return {
            ...node,
            data: {
              ...node.data,
              label: label,
            },
          };
        }
        return node;
      })
    );

    // Update context
    const updatedContext = { ...context };

    if (updatedContext[selectedNode]) {
      updatedContext[selectedNode].claim = claim;
    } else {
      updatedContext[selectedNode] = { claim: claim };
    }

    setContext(updatedContext);
  };

  return (
    <aside className="internalState">
      <div className="description">
        <div>
          This is an example of how you can access additional context and the
          internal state outside of the ReactFlow component.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Nodes */}
        <div>
          <div className="title">Nodes</div>
          {nodes.map((node) => (
            <div key={node.id}>
              <span>{node.id}: </span>
              <span>{node.data.label}</span>
            </div>
          ))}
        </div>

        {/* Context */}
        <div>
          {" "}
          <div className="title">Context</div>
          <div>
            context: <pre>{JSON.stringify(context, null, 2)}</pre>
          </div>
        </div>

        {/* Update Nodes Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <select
            value={selectedNode}
            onChange={(e) => {
              setSelectedNode(e.target.value);
              const node = nodes.find((n) => n.id === e.target.value);
              if (node) {
                setLabel(node.data.label);
              }
              if (context[e.target.value]) {
                setClaim(context[e.target.value].claim);
              } else {
                setClaim("");
              }
            }}
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.data.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={label}
            placeholder="Update label"
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            type="text"
            value={claim}
            placeholder="Enter a claim"
            onChange={(e) => setClaim(e.target.value)}
          />
          <button onClick={updateContextAndLabel}>UPDATE</button>
        </div>

        {/* Buttons */}
        {/* <div className="buttons">
          <div>
            <button onClick={() => console.log(getNodes())}>
              console getNodes()
            </button>
          </div>
          <div>
            <button onClick={() => console.log(context)}>
              console context
            </button>
          </div>
        </div> */}
        
      </div>
    </aside>
  );
};

export default Sidebar;
