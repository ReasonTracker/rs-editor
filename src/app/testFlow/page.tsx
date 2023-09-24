"use client";
import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Edge,
  Node,
  useEdges,
} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./Sidebar";

import "./style.css";
import { FlowProvider, useEdgesDispatch, useNodes, useNodesDispatch } from "./FlowContext";



const ProviderFlow = () => {
    const [nodes2, setNewEdges, OnEdgesChange] = useEdgesState<Edge[]>([]);
    const [edges2, setNewNodes, OnNodesChange] = useNodesState<Node[]>([]);
    const nodes = useNodes();
    const edges = useEdges();
    const nodesDispatch = useNodesDispatch();
    const edgesDispatch = useEdgesDispatch();

    useEffect(() => {
    setNewEdges(edges)
    setNewNodes(nodes)
    },[])
    
    const onConnect = useCallback(
        (params) => edgesDispatch({ type: "addEdge", payload: params }),
        [edgesDispatch]
      );

  const [nodeName, setNodeName] = useState("Node 1");
  const [nodeBg, setNodeBg] = useState("#eee");
  const [nodeHidden, setNodeHidden] = useState(false);

  //
  // Updating a node
  //
//   useEffect(() => {
//     setNodes((nds) =>
//       nds.map((node) => {
//         // @ts-ignore
//         if (node.data.label === nodeName) {
//           // it's important that you create a new object here
//           // in order to notify react flow about the change
//           node.data = {
//             ...node.data,
//             // @ts-ignore
//             label: nodeName,
//           };
//         }

//         return node;
//       })
//     );
//   }, [nodeName, setNodes]);

//   useEffect(() => {
//     setNodes((nds) =>
//       nds.map((node) => {
//         // @ts-ignore
//         if (node.data.label === nodeName) {
//           // it's important that you create a new object here
//           // in order to notify react flow about the change
//           node.style = { ...node.style, backgroundColor: nodeBg };
//         }

//         return node;
//       })
//     );
//   }, [nodeBg, setNodes]);

//   useEffect(() => {
//     setNodes((nds) =>
//       nds.map((node) => {
//         // @ts-ignore
//         if (node.data.label === nodeName) {
//           // when you update a simple type you can just update the value
//           node.hidden = nodeHidden;
//         }

//         return node;
//       })
//     );
//     setEdges((eds) =>
//       eds.map((edge) => {
//         if (edge.id === "e1-2") {
//           edge.hidden = nodeHidden;
//         }

//         return edge;
//       })
//     );
//   }, [nodeHidden, setNodes, setEdges]);

  return (
    <div className="providerflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={OnNodesChange}
            onEdgesChange={OnEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
        <div className="updatenode__controls">
            <label>addNode:</label>
            <button onClick={() => nodesDispatch({ type: "addNode" })}>add node</button>
          <label className="updatenode__bglabel">background:</label>

          <label>label:</label>
          <input
            value={nodeName}
            onChange={(evt) => setNodeName(evt.target.value)}
          />

          <input
            value={nodeBg}
            onChange={(evt) => setNodeBg(evt.target.value)}
          />

          <div className="updatenode__checkboxwrapper">
            <label>hidden:</label>
            <input
              type="checkbox"
              checked={nodeHidden}
              onChange={(evt) => setNodeHidden(evt.target.checked)}
            />
          </div>
        </div>
        {/* <Sidebar nodes={nodes} setNodes={setNodes} /> */}
      </ReactFlowProvider>
    </div>
  );
};

export default function App({ params }: { params: { slug: string[] } }) {
  
    return (
      <ReactFlowProvider>
        <FlowProvider>
          <ProviderFlow />
        </FlowProvider>
      </ReactFlowProvider>
    );
  }


