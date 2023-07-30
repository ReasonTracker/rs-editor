"use client";

import { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  ReactFlowProvider,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";
import "./page.css";
import "./nodeDisplay.css";

//import pageData from './pageData';
import { NodeDisplay } from "./NodeDisplay";
import EdgeDisplay from "./EdgeDisplay";
import {
  ConfidenceEdgeData,
  DisplayNodeData,
  RelevenceEdgeData,
  getEdgesAndNodes,
} from "./pageData";

const nodeTypes = { rsNode: NodeDisplay };
const edgeTypes = { rsEdge: EdgeDisplay };

//const {nodes, edges} = await getEdgesAndNodes( );

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef(null);
  const currentHandleId = useRef(null);
  const { project } = useReactFlow();

  // TODO: fix "any" types
  const onConnectStart = useCallback((_: any, { nodeId, handleId }: any) => {
    connectingNodeId.current = nodeId;
    currentHandleId.current = handleId;
  }, []);

  let id = 1;
  const getId = () => `${id++}`;

  // TODO: fix "any" types
  const onConnectEnd = useCallback(
    (e: any) => {
      const targetIsPane = (e.target as Element).classList.contains(
        "react-flow__pane"
      );

      if (targetIsPane && reactFlowWrapper.current) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode: Node<DisplayNodeData> = {
          id,
          // we are removing the half of the node width (75) to center the new node
          position: project({
            x: e.clientX - left - 75,
            y: e.clientY - top,
          }),
          data: {
            // TODO fix all of this
            label: `Node ${id}`,
            // pol: "default_pol",
            // score: "default_score" as any,
            // claim: "default_claim" as any,
            // scoreNumberText: "default_scoreNumberText",
            // scoreNumber: 0,
            // cancelOutStacked: false as any,
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id,
            source: connectingNodeId.current,
            sourceHandle: currentHandleId.current,
            target: id,
          } as any)
        );
      }
    },
    [project]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<DisplayNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<
    ConfidenceEdgeData | RelevenceEdgeData
  >([]);

  // useEffect call getEdgesAndNodesand put them into setnodes and set edges
  useEffect(() => {
    async function _getEdgesAndNodes() {
      const { nodes, edges } = await getEdgesAndNodes();
      setNodes(nodes);
      setEdges(edges);
    }

    _getEdgesAndNodes();
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div
      style={{ width: "100vw", height: "100vh", margin: "auto" }}
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
      >
        <Controls position="top-left" />
        <MiniMap
          maskColor="rgb(240, 240, 240, 0.3)"
          pannable
          zoomable
          nodeColor={(n) => `var(--${n.data.pol})`}
          position="bottom-left"
        />
      </ReactFlow>
      <svg style={{ height: 0 }}>
        <defs>
          <pattern
            id="cancelOutPattern"
            patternUnits="userSpaceOnUse"
            width="60"
            height="30"
            patternTransform="scale(.25) rotate(0)"
          >
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="hsla(0, 0%, 0%, 1)"
            />
            <path
              d="M1-6.5v13h28v-13H1zm15 15v13h28v-13H16zm-15 15v13h28v-13H1z"
              strokeWidth="1"
              stroke="none"
              fill="var(--pro)"
            />
            <path
              d="M31-6.5v13h28v-13H31zm-45 15v13h28v-13h-28zm60 0v13h28v-13H46zm-15 15v13h28v-13H31z"
              strokeWidth="1"
              stroke="none"
              fill="var(--con)"
            />
          </pattern>
        </defs>
      </svg>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
