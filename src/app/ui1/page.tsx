'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  ReactFlowProvider,
  Node,
} from 'reactflow';

import 'reactflow/dist/style.css';
import './page.css';
import './nodeDisplay.css';
import './createNodeDialog.css';

//import pageData from './pageData';
import { NodeDisplay } from './NodeDisplay';
import EdgeDisplay from './EdgeDisplay';
import { ConfidenceEdgeData, DisplayNodeData, RelevenceEdgeData, getEdgesAndNodes } from './pageData';
import CreateNodeDialog from './CreateNodeDialog';

const nodeTypes = { rsNode: NodeDisplay };
const edgeTypes = { rsEdge: EdgeDisplay };

//const {nodes, edges} = await getEdgesAndNodes( );

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // is there a better way to do this?
    const connectingNode = useRef({
    nodeId: null,
    handleId: null,
    handleType: null,
  });
  const connectingNodeCoord = useRef({
    top: 0,
    left: 0,
  });
  const currentMouseEvent = useRef({
    clientX: 0,
    clientY: 0,
  });
  const { project } = useReactFlow();

  // TODO: fix 'any' types
  const onConnectStart = useCallback((_: any, {nodeId, handleId, handleType}: any) => {
    console.log(nodeId, handleId, handleType)
    connectingNode.current = {
      nodeId,
      handleId,
      handleType
    };
  }, []);

  const [showCreateNodeDialog, setCreateNodeDialog] = useState(false);

  
  
  const handleClose = () => {
    setCreateNodeDialog(false);
  };

  // TODO: fix 'any' types
  const onConnectEnd = useCallback(
    (e: any) => {
      const targetIsPane = (e.target as Element).classList.contains(
        'react-flow__pane'
      );
      if (targetIsPane && reactFlowWrapper.current) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        
        currentMouseEvent.current = {
          clientX: e.clientX,
          clientY: e.clientY,
        }
        connectingNodeCoord.current = {
          top,
          left,
        }
        // if handle type="source", skip dialog and create node of same type as source node
        setCreateNodeDialog(true)
      }
    },
    [project]
  );

  const createNode = () => {
    const { clientX, clientY } = currentMouseEvent.current;
    const { top, left } = connectingNodeCoord.current;
    const id = Math.random().toString(36).substring(2, 15);

    const newNode: Node<DisplayNodeData> = {
      id,
      // type: 'rsNode',
      position: project({
        x: clientX - left - 75,
        y: clientY - top,
      }),
      data: {
        // TODO Add proper node data
        label: `Node ${id}`,
        // pol: 'pro',
        // score: 1,
        // claim: 'new claim',
      },
    };
    setNodes((nds) => nds.concat(newNode));
    const isTarget = connectingNode.current.handleType === 'target';
    setEdges((eds) =>
      eds.concat({
        id,
        source: isTarget ? id : connectingNode.current.nodeId,
        targetHandle: isTarget ? connectingNode.current.handleId : null,
        target: isTarget ? connectingNode.current.nodeId : id,
      } as any)
    );
  }

  const [nodes, setNodes, onNodesChange] = useNodesState<DisplayNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ConfidenceEdgeData | RelevenceEdgeData>([]);

  // useEffect call getEdgesAndNodesand put them into setnodes and set edges
  useEffect(() => {

    async function _getEdgesAndNodes() {
      const { nodes, edges } = await getEdgesAndNodes();
      setNodes(nodes);
      setEdges(edges);
    }

    _getEdgesAndNodes();

  }, [setNodes, setEdges]);




  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 'auto' }} ref={reactFlowWrapper}>
      <CreateNodeDialog 
        open={showCreateNodeDialog} 
        handleClose={handleClose}
        createNode={createNode}
        // this seems not optimal
        clientX={currentMouseEvent.current.clientX}
        clientY={currentMouseEvent.current.clientY}
        />
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
        <Controls
          position='top-left'
        />
        <MiniMap
          maskColor='rgb(240, 240, 240, 0.3)'
          pannable
          zoomable
          nodeColor={n => `var(--${n.data.pol})`}
          position='bottom-left'
        />
      </ReactFlow>
      <svg style={{ height: 0 }}>
        <defs>
          <pattern id='cancelOutPattern' patternUnits='userSpaceOnUse' width='60' height='30' patternTransform='scale(.25) rotate(0)'>
            <rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 0%, 1)' />
            <path d='M1-6.5v13h28v-13H1zm15 15v13h28v-13H16zm-15 15v13h28v-13H1z' strokeWidth='1' stroke='none' fill='var(--pro)' />
            <path d='M31-6.5v13h28v-13H31zm-45 15v13h28v-13h-28zm60 0v13h28v-13H46zm-15 15v13h28v-13H31z' strokeWidth='1' stroke='none' fill='var(--con)' />
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