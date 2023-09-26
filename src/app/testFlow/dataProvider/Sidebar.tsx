"use client";
import React, { useState, useContext } from "react";
import { useReactFlow } from "reactflow";
import { NodeContext } from "./DataProvider";

export const Sidebar = () => {
  const reactFlowInstance = useReactFlow();
  const nodes = reactFlowInstance.getNodes();

  // Assuming each node object has an 'id' and a 'label' field.
  const [selectedNode, setSelectedNode] = useState(
    nodes.length > 0 ? nodes[0].id : ""
  );

  const [claim, setClaim] = useState("");
  const { context, setContext } = useContext(NodeContext);

  const updateContext = () => {
    const newContext = {
      node: selectedNode,
      claim: claim,
    };
    setContext(newContext);
  };

  return (
    <aside className="internalState">
      <div className="description">
        This is an example of how you can access additional context from a
        parent
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>context: {JSON.stringify(context)}</div>

        <div className="buttons">
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.data.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={claim}
            placeholder="Enter a claim"
            onChange={(e) => setClaim(e.target.value)}
          />

          <button onClick={updateContext}>Update Context</button>
        </div>
      </div>
    </aside>
  );
};
