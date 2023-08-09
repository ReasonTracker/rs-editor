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
  Edge,
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
import { Action, Claim, RepositoryLocalPure, calculateScoreActions } from './rs';
import { rsData } from './rsData';
import { newId } from '@/reasonScore/newId';

const nodeTypes = { rsNode: NodeDisplay };
const edgeTypes = { rsEdge: EdgeDisplay };

//const {nodes, edges} = await getEdgesAndNodes( );

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<DisplayNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ConfidenceEdgeData | RelevenceEdgeData>([]); 
  const [rsRepo, setRsRepo] = useState(() => {
    console.log('--------------rsRepo created');
    return new RepositoryLocalPure(rsData) 
  })

  // useEffect call getEdgesAndNodesand put them into setnodes and set edges
  useEffect(() => {

    async function _getEdgesAndNodes() {
      const { nodes, edges } = await getEdgesAndNodes(rsRepo);
      setNodes(nodes);
      setEdges(edges);
    }
 
    _getEdgesAndNodes();

  }, [setNodes, setEdges]);

  // create Refs
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
  const onConnectStart = useCallback(async (_: any, {nodeId, handleId, handleType}: any) => {
    if (!rsRepo) return console.log("no repo state")
    // console.log(`nodeId: `, nodeId, `| `,`handleId :`,handleId,"| ","handleType: ", handleType)
    // console.log(`rsData`, rsData)
    // console.log(`rsRepoState`, rsRepo)
    // console.log(`rsRepoState items: `, Object.keys(rsRepo.rsData.items).length)
    // console.log(nodeId, rsRepo.rsData.items[nodeId]) 

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
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        currentMouseEvent.current = {
          clientX: e.clientX,
          clientY: e.clientY,
        }
        connectingNodeCoord.current = {
          top,
          left,
        }
        // TODO if handle type="source", skip dialog and create node of same type as source node
        setCreateNodeDialog(true)
      }
    },
    [project]
  );

  // TODO move into separate file
  const createNode = async (pol: "pro" | "con") => {
    if (!rsRepo) return console.log("no repo state")
    if (!connectingNode.current.nodeId) return console.log("no nodeId")

    // Get coordinates
    const { clientX, clientY } = currentMouseEvent.current;
    const { top, left } = connectingNodeCoord.current;
    const position =  {
      x: clientX - left - 75,
      y: clientY - top,
    }
    
    // Get parent score
    const currentNodeId = connectingNode.current.nodeId
    const parentClaimId = await rsRepo.getClaimIdBySourceId(currentNodeId)
    if (!parentClaimId) return console.log("no parentScoreId")
    const parentScore = await rsRepo.getScoresBySourceId(parentClaimId)
    
    // console.log(`parentId`, parentId)
    // console.log(`rsRepoState`, rsRepo)
    // console.log(`rsRepoState items: `, Object.keys(rsRepo.rsData.items).length)
    // console.log(`parentScore`, parentScore)
    
    // TODO re-implement
    const isTarget = connectingNode.current.handleType === 'target';

    // Generate Id's
    const newClaimId = "claimId-" + newId();
    const newNodeId = `${newClaimId}Score` 
    
    // const scoreRootId = rsRepo.rsData.ScoreRootIds[0];
    // const newNodeScore = new Score(claimId, scoreRootId, undefined, undefined, false, true, "confidence", 1, 1, newScoreId);
    const claim: Claim = {
      id: newClaimId,
      content: `new claim ${newClaimId}`,
      reversible: false,
      type: `claim`,
    }
    
    const actions: Action[] = [
      { type: "add_claim", newData: { id: newClaimId, content: "newClaimText" }, oldData: undefined, dataId: `${newClaimId}` },
      { type: "add_claimEdge", newData: { id: `${newClaimId}Edge`, parentId: parentClaimId, childId: newClaimId, pro: pol === "pro" ? true : false }, oldData: undefined, dataId: `${newClaimId}Edge` },
    ];
    await calculateScoreActions({actions: actions, repository: rsRepo})

    // Get ScoreID
    const scores = await rsRepo.getScoresBySourceId(newClaimId);
    const newNodeScore= scores && scores.length > 0 ? scores[0] : undefined;
    if (!newNodeScore) throw new Error("No score found for the given claimId");
    
    const node: Node<DisplayNodeData> = { 
      id: nodeId,
      type: 'rsNode',
      position: project({
        x: clientX - left - 75,
        y: clientY - top,
      }),
      data: {
        claim,
        score: newNodeScore,
        pol,
        scoreNumber: 1,
        scoreNumberText: "replaceMe",
        cancelOutStacked: { top: 1, center: 1, bottom: 1 },
      },   
    };

    setNodes((nodes) => nodes.concat(node));
    const {nodes, edges} = await getEdgesAndNodes(rsRepo);
    setEdges(edges);

  }

  // DEV LOGGING
  const logRsData = () => {
    return async () => {
      if (!rsRepo) return console.log("no repo state")
      console.log(`rsRepoState`, rsRepo)
      console.log(`rsRepoState items: `, Object.keys(rsRepo.rsData.items).length)  
      console.log(`rsData.items`, rsRepo.rsData.items)
    }      
  }
  const logDescendantScores = () => {
    return async () => {
      if (!rsRepo) return console.log("no repo state")
      const descendantScores = await rsRepo.getDescendantScoresById("mainClaimScore")
      console.log(
        `descendantScores`,
        descendantScores.map((score) => {
          return {
            id: score.id,
            score: score,
          }
        })
      );
    }
  } 

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // DEV TESTING
  async function runItBack() {
    const { nodes, edges } = await getEdgesAndNodes(rsRepo);
    setNodes(nodes);
    setEdges(edges);
  }

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 'auto' }} ref={reactFlowWrapper}>
      <div style={{position:"absolute",right:"10px",top:"10px", zIndex:"1",display:"flex",flexDirection:"column"}}>
        <button onClick={logRsData()} style={{margin:10,padding:10}} >rsdata items</button>
        <button onClick={logDescendantScores()} style={{margin:10,padding:10}}>descendantScores</button>
        <button onClick={() => runItBack()} style={{margin:10,padding:10}}>getEdgesAndNodes()</button>
      </div>
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