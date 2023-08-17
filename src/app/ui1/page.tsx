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
import { ConfidenceEdgeData, DisplayNodeData, RelevenceEdgeData, getEdgesAndNodes, processClaims, processConfidenceEdges, processRelevanceEdges } from './pageData';
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

      const actions: Action[] = [
        { type: "add_claim", newData: { id: "test", text: "test" }, oldData: undefined, dataId: "test" },
        { type: "add_claimEdge", newData: { id: "testEdge", parentId: "resedential", childId: "test", pro: true }, oldData: undefined, dataId: "testEdge" },
        { type: "add_claim", newData: { id: "test2", text: "test" }, oldData: undefined, dataId: "test2" },
        { type: "add_claimEdge", newData: { id: "test2Edge", parentId: "resedential", childId: "test2", pro: true }, oldData: undefined, dataId: "test2Edge" },
    ];
    await calculateScoreActions({
        actions: actions, repository: rsRepo
    })

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
    const position = project({
      x: clientX - left - 75,
      y: clientY - top,
    })
    
    // Get parent score
    const currentNodeId = connectingNode.current.nodeId
    const parentClaimId = await rsRepo.getClaimIdBySourceId(currentNodeId)
    // console.log(`parentClaimId`, parentClaimId)
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
    // const claim: Claim = {
    //   id: newClaimId,
    //   content: `new claim ${newClaimId}`,
    //   reversible: false,
    //   type: `claim`,
    // }
    
    const actions: Action[] = [
      { type: "add_claim", newData: { id: newClaimId, content: "newClaimText", position: position }, oldData: undefined, dataId: `${newClaimId}` },
      { type: "add_claimEdge", newData: { id: `${newClaimId}Edge`, parentId: parentClaimId, childId: newClaimId, pro: pol === "pro" ? true : false }, oldData: undefined, dataId: `${newClaimId}Edge` },
    ];
    await calculateScoreActions({actions: actions, repository: rsRepo})

    // Get ScoreID
    const scores = await rsRepo.getScoresBySourceId(newClaimId);
    const newNodeScore= scores && scores.length > 0 ? scores[0] : undefined;
    if (!newNodeScore) throw new Error("No score found for the given claimId");
    
    // const mainScoreId = (await rsRepo.getScoreRoot(rsData.ScoreRootIds[0]))?.topScoreId;
    // const mainScore = await rsRepo.getScore(mainScoreId || "");
    // let scores = await rsRepo.getDescendantScoresById(mainScoreId || "");
    // scores.reverse();
    // scores.sort((a, b) => a.proMain ? -1 : 1)
    // if (mainScore) scores.unshift(mainScore);


    // console.log(`edges before`, edges)
    // console.log(`nodes nodes`, nodes)
    // const claimEdges = await processConfidenceEdges({rsRepo, targetScore: newNodeScore, edges});
    // console.log(`edges after processConfidenceEdges`, edges)
    // console.log(`nodes after processConfidenceEdges`, nodes)
    // const newEdges = await processRelevanceEdges({claimEdges, rsRepo, targetScore: newNodeScore, edges});
    // console.log(`edges after processRelevanceEdges`, edges)
    // console.log(`nodes after processRelevanceEdges`, nodes)
    // const newNodes = await processClaims({rsRepo, targetScore: newNodeScore, nodes, position});
    const { nodes: newNodes, edges: newEdges } = await getEdgesAndNodes(rsRepo, nodes, edges);
    setNodes(newNodes)
    setEdges(newEdges)
    // console.log(`edges after processClaims`, edges)
    // console.log(`nodes after processClaims`, nodes)
    // console.log(`claimEdges`, claimEdges)
    // const edgeConfidenceEdgeData: Edge<ConfidenceEdgeData> = {
    //     "id": "claimId-Wf3svP2YoaQaEdge",
    //     "type": "rsEdge",
    //     "target": "payoffScore",
    //     "targetHandle": "confidence",
    //     "source": "claimId-Wf3svP2YoaQaScore",
    //     "data": {
    //         "pol": "pro",
    //         "maxImpact": 1,
    //         "impact": 1,
    //         "targetTop": 0,
    //         "claimEdge": {
    //             "parentId": "payoff",
    //             "childId": "claimId-Wf3svP2YoaQa",
    //             "affects": "confidence",
    //             "pro": true,
    //             "proMain": true,
    //             "id": "claimId-Wf3svP2YoaQaEdge",
    //             "priority": "",
    //             "type": "claimEdge"
    //         },
    //         "sourceScore": {
    //             "sourceClaimId": "claimId-Wf3svP2YoaQa",
    //             "scoreRootId": "ScoreRoot",
    //             "parentScoreId": "payoffScore",
    //             "sourceEdgeId": "claimId-Wf3svP2YoaQaEdge",
    //             "reversible": false,
    //             "pro": true,
    //             "affects": "confidence",
    //             "confidence": 1,
    //             "relevance": 1,
    //             "id": "claimId-Wf3svP2YoaQaScore",
    //             "priority": "",
    //             "content": "",
    //             "scaledWeight": 1,
    //             "type": "score",
    //             "descendantCount": 0,
    //             "generation": 3,
    //             "fractionSimple": 0.4,
    //             "fraction": 0.5454545454545455,
    //             "childrenAveragingWeight": 1,
    //             "childrenConfidenceWeight": 1,
    //             "childrenRelevanceWeight": 1,
    //             "childrenWeight": 1,
    //             "weight": 1,
    //             "percentOfWeight": 1,
    //             "proMain": true
    //         },
    //         "maxImpactStacked": {
    //             "top": 0,
    //             "center": 0.5,
    //             "bottom": 1
    //         },
    //         "impactStacked": {
    //             "top": 0,
    //             "center": 0.5,
    //             "bottom": 1
    //         },
    //         "reducedImpactStacked": {
    //             "top": 0,
    //             "center": 0.5,
    //             "bottom": 1
    //         },
    //         "reducedMaxImpactStacked": {
    //             "top": 0,
    //             "center": 0.5,
    //             "bottom": 1
    //         },
    //         "consolidatedStacked": {
    //             "top": 0,
    //             "center": 0.5,
    //             "bottom": 1
    //         },
    //         "scaledTo1Stacked": {
    //             "top": 0,
    //             "center": 0.5,
    //             "bottom": 1
    //         },
    //         "type": "confidence"
    //     }
    // }
    // setEdges((edges) => edges.concat(edgeConfidenceEdgeData));
    // setEdges((edges) => edges.concat(edgeConfidenceEdgeData));

    // const claimEdges = await processConfidenceEdges({rsRepo, targetScore: newNodeScore, edges});
    // const newEdge = await processRelevanceEdges({claimEdges, rsRepo, targetScore: newNodeScore, edges});
    // const newNode = await processClaims({rsRepo, targetScore: newNodeScore, nodes, position});
    // await getEdgesAndNodes(rsRepo, nodes, edges);
    // await calculateScoreActions({repository: rsRepo})
    // setNodes((nodes) => nodes.concat(newNode));
    // setEdges((edges) => edges.concat(newEdge));
    // console.log(results)
    
    // runItBack();
    // setNodes(nodes);
    // setEdges(edges);
    // setEdges(results.edges);
    // const results2  = await getEdgesAndNodes(rsRepo, nodes, edges);
    // setNodes(results2.nodes);
    // setEdges(results2.edges);

    // TODO: NOT WORKING

  }

  // DEV LOGGING
  const data = () => {
    return async () => {
      if (!rsRepo) return console.log("no repo state")
      console.log(`rsRepoState`, rsRepo)
      console.log(`rsRepoState items: `, Object.keys(rsRepo.rsData.items).length)  
      console.log(`rsRepoState ScoreRootIds: `, Object.keys(rsRepo.rsData.ScoreRootIds).length)  
      console.log(`rsRepoState childIdsByScoreId: `, Object.keys(rsRepo.rsData.childIdsByScoreId).length)  
      console.log(`rsRepoState claimEdgeIdsByChildId: `, Object.keys(rsRepo.rsData.claimEdgeIdsByChildId).length)  
      console.log(`rsRepoState claimEdgeIdsByParentId: `, Object.keys(rsRepo.rsData.claimEdgeIdsByParentId).length)  
      console.log(`nodes`, nodes)
      console.log(`edges`, edges)
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
        <button onClick={data()} style={{margin:10,padding:10}} >data</button>
        <button onClick={logDescendantScores()} style={{margin:10,padding:10}}>descendantScores</button>
        <button onClick={() => runItBack()} style={{margin:10,padding:10}}>getEdgesAndNodes()</button>
        <button onClick={() => console.log(nodes)} style={{margin:10,padding:10}}>nodes()</button>
        <button onClick={() => console.log(edges)} style={{margin:10,padding:10}}>edges()</button>
        <button onClick={() => setNodes(nodes)} style={{margin:10,padding:10}}>setNodes()</button>
        <button onClick={() => setEdges(edges)} style={{margin:10,padding:10}}>setEdges()</button>
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