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
import { Action, Claim, ClaimEdge, RepositoryLocalPure, RsData, Score, calculateScoreActions } from './rs';
import { rsData } from './rsData';
import { Stacked } from './stackSpace';

const nodeTypes = { rsNode: NodeDisplay };
const edgeTypes = { rsEdge: EdgeDisplay };

//const {nodes, edges} = await getEdgesAndNodes( );

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<DisplayNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ConfidenceEdgeData | RelevenceEdgeData>([]);
  const [rsRepoState, setRsRepoState] = useState<RepositoryLocalPure | null>(null);

  // useEffect call getEdgesAndNodesand put them into setnodes and set edges
  useEffect(() => {

    async function _getEdgesAndNodes() {
      const { nodes, edges, rsRepo } = await getEdgesAndNodes();
      setNodes(nodes);
      setEdges(edges);
      setRsRepoState(rsRepo)
      console.log(`rsRepoState set`)
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
    // console.log(`nodeId: `, nodeId, `| `,`handleId :`,handleId,"| ","handleType: ", handleType)
    // console.log(`rsData`, rsData)
    if (!rsRepoState) return console.log("no repo state")
    console.log(`rsRepoState`, rsRepoState)
    console.log(nodeId, rsRepoState.rsData.items[nodeId]) 

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
        // TODO if handle type="source", skip dialog and create node of same type as source node
        setCreateNodeDialog(true)
      }
    },
    [project]
  );

  const createNode = async (pol: "pro" | "con") => {
    if (!rsRepoState) return console.log("no repo state")
    if (!connectingNode.current.nodeId) return console.log("no nodeId")


    const { clientX, clientY } = currentMouseEvent.current;
    const { top, left } = connectingNodeCoord.current;

    
    // console.log(`parentId`, parentId)
    
    // const nodes: Node<DisplayNodeData>[] = []
    // const edges: Edge<ConfidenceEdgeData | RelevenceEdgeData>[] = []
    console.log(`rsRepoState`, rsRepoState)
    console.log(`rsRepoState items: `, Object.keys(rsRepoState.rsData.items).length)
    const parentScoreId = connectingNode.current.nodeId
    const parentClaimId = await rsRepoState.getClaimIdBySourceId(parentScoreId)
    if (!parentClaimId) return console.log("no parentScoreId")
    const parentScore = await rsRepoState.getScoresBySourceId(parentClaimId)
    console.log(`parentScore`, parentScore)
    
    const isTarget = connectingNode.current.handleType === 'target';

    // Generate Mock Data
    const claimId = "claimId"+Math.random().toString(36).substring(2, 5);
    const newScoreId = `${claimId}Score` 
    const nodeId = newScoreId //"nodeId33-"+Math.random().toString(36).substring(2, 5);
    const claimEdgeId = "claimEdgeId"+Math.random().toString(36).substring(2, 5);
    const newEdgeId = "newEdgeId-"+Math.random().toString(36).substring(2, 5);
    
    const scoreRootId = rsRepoState.rsData.ScoreRootIds[0];
    const newNodeScore = new Score(claimId, scoreRootId, undefined, undefined, false, true, "confidence", 1, 1, newScoreId);

    // Mock Data
    const stacked: Stacked = {
      top: 2.5,
      center: 3,
      bottom: 3.5
    }
    const claim: Claim = {
      id: claimId,
      content: `new claim ${claimId}`,
      reversible: false,
      type: `claim`,
    }
    const newScore: Score = {
      type: 'score',
      sourceClaimId: claimId,
      scoreRootId: 'ScoreRoot',
      parentScoreId,
      sourceEdgeId: claimEdgeId,
      reversible: true,
      pro: true,
      affects: 'confidence',
      confidence: 0.9,
      relevance: 1.2,
      id: newScoreId,
      priority: 'high',
      content: 'why does score have content?  I thought score used claim content?',
      scaledWeight: 0.7,
      descendantCount: 3,
      generation: 2,
      fractionSimple: 0.8,
      fraction: 0.6,
      childrenAveragingWeight: 0.7,
      childrenConfidenceWeight: 0.9,
      childrenRelevanceWeight: 0.5,
      childrenWeight: 0.4,
      weight: 0.6,
      percentOfWeight: 0.75,
      proMain: true
    }
    const claimEdge: ClaimEdge = {
      parentId: parentClaimId,
      childId: claimId,
      affects: 'confidence',
      pro: true,
      proMain: true,
      id: claimEdgeId,
      priority: 'high',
      type: 'claimEdge',
    }
    const confidenceEdgeData: ConfidenceEdgeData = {
      pol,
      claimEdge,
      sourceScore: parentScore[0],
      maxImpactStacked: stacked,
      impactStacked: stacked,
      reducedImpactStacked: stacked,
      reducedMaxImpactStacked: stacked,
      consolidatedStacked: stacked,
      scaledTo1Stacked: stacked,
      type: "confidence",

      // TODO: Remove all below
      impact: 0,
      targetTop: 0,
      maxImpact: 0,
    }
    const edgeConfidenceEdgeData: Edge<ConfidenceEdgeData> = {
      id: newEdgeId,
      type: "rsEdge",
      target: isTarget ? connectingNode.current.nodeId! : nodeId, // Fix the !
      targetHandle: isTarget ? connectingNode.current.handleId : 'confidence',
      source: isTarget ? nodeId : connectingNode.current.nodeId!, // Fix the !
      data: confidenceEdgeData
    }
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
        scoreNumberText: "score",
        cancelOutStacked: stacked,
      },   
    };

    const actions: Action[] = [
        { type: "add_claim", newData: { id: claimId, content: "newClaimText" }, oldData: undefined, dataId: `${claimId}` },
        { type: "add_claimEdge", newData: { id: `${claimId}Edge`, parentId: parentClaimId, childId: claimId, pro: pol === "pro" ? true : false }, oldData: undefined, dataId: `${claimId}Edge` },
      ];
    const newActions0 = await calculateScoreActions({
          actions: actions, repository: rsRepoState
        })
    setNodes((nds) => nds.concat(node));
    setEdges((eds) => eds.concat(edgeConfidenceEdgeData));
    console.log(edgeConfidenceEdgeData)
    // console.log(`newActions`, newActions0)
  }






  const logRsData = () => {
    return async () => {
      if (!rsRepoState) return console.log("no repo state")
      console.log(`rsRepoState`, rsRepoState)
    console.log(`rsRepoState items: `, Object.keys(rsRepoState.rsData.items).length)  
    console.log(`rsData.items`, rsRepoState.rsData.items)
    }      
  }
  const logDescendantScores = () => {
    return async () => {
      if (!rsRepoState) return console.log("no repo state")
      const descendantScores = await rsRepoState.getDescendantScoresById("mainClaimScore")
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

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 'auto' }} ref={reactFlowWrapper}>
      <div style={{position:"absolute",right:"10px",top:"10px", zIndex:"1",display:"flex",flexDirection:"column"}}>
        <button onClick={logRsData()} style={{margin:10,padding:10}} >rsdata items</button>
        <button onClick={logDescendantScores()} style={{margin:10,padding:10}}>descendantScores</button>
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