'use client';

import { createContext, useCallback, useEffect, useReducer, useRef, useState, useContext } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  // addEdge,
  ReactFlowProvider,
  Node
} from 'reactflow';

import 'reactflow/dist/style.css';
import './page.css';
import './page-dev.css';
import './displayNode.css';
import './createNodeDialog.css';
import './contextMenu.css';

//import pageData from './pageData';
import { DisplayNode } from './DisplayNode';
import DisplayEdge from './DisplayEdge';
import { ConfidenceEdgeData, DisplayNodeData, RelevenceEdgeData, getEdgesAndNodes } from './pageData';
import CreateNodeDialog from './CreateNodeDialog';
// import ContextMenu from './ContextMenu';
import { Action, RepositoryLocalPure, calculateScoreActions, newId } from '@/reasonScore/rs';
import { rsData } from './rsData';

const nodeTypes = { rsNode: DisplayNode };
const edgeTypes = { rsEdge: DisplayEdge };

type MenuData = {
  id: string;
  top: number | "false";
  left: number | "false";
  right: number | "false";
  bottom: number | "false";
};

export type ContextMenuData = MenuData & {
  onClick: () => void;
  rsRepo: RepositoryLocalPure;
};

export const DevContext = createContext<boolean>(false);
export const RsRepoContext = createContext<RepositoryLocalPure>(new RepositoryLocalPure(rsData));

function Flow({ slug }: { slug: string[] }) {
  console.log(slug)
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [displayNodes, setDisplayNodes, onNodesChange] = useNodesState<DisplayNodeData>([]);
  const [displayEdges, setDisplayEdges, onEdgesChange] = useEdgesState<ConfidenceEdgeData | RelevenceEdgeData>([]);
  const [menu, setMenu] = useState<MenuData | null>(null);
  const menuRef = useRef(null);
  const [isDev, setIsDev] = useReducer((state: boolean, action: boolean) => {
    localStorage.setItem("isDev", !state + "");
    return !state
  }, typeof window !== 'undefined' ? localStorage.getItem("isDev") === "true" : false);

  const rsRepo = useContext(RsRepoContext);

  // useEffect call getEdgesAndNodesand put them into setnodes and set edges
  useEffect(() => {

    async function _getEdgesAndNodes() {

      const actions: Action[] = [
        { type: "add_claim", newData: { id: "test", content: "test" }, oldData: undefined, dataId: "test" },
        { type: "add_claimEdge", newData: { id: "testEdge", parentId: "resedential", childId: "test", proParent: true }, oldData: undefined, dataId: "testEdge" },
        { type: "add_claim", newData: { id: "test2", content: "test" }, oldData: undefined, dataId: "test2" },
        { type: "add_claimEdge", newData: { id: "test2Edge", parentId: "resedential", childId: "test2", proParent: true }, oldData: undefined, dataId: "test2Edge" },
      ];
      await calculateScoreActions({
        actions: actions, repository: rsRepo
      })

      const { newDisplayNodes, newDisplayEdges } = await getEdgesAndNodes(rsRepo);
      setDisplayNodes(newDisplayNodes);
      setDisplayEdges(newDisplayEdges);
    }

    _getEdgesAndNodes();

  }, []);

  // create Refs
  // Move into onConnectEnd and pass to setCreateNodeDialog ?
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
  const onConnectStart = useCallback(async (_: any, { nodeId, handleId, handleType }: any) => {
    if (!rsRepo) return console.log("no repo state")

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

  // Create Node
  // TODO move into separate file
  const createNode = async (isProMain: boolean) => {
    if (!rsRepo) return console.log("no repo state")
    if (!connectingNode.current.nodeId) return console.log("no nodeId")

    // Get parentClaimId
    const currentNodeId = connectingNode.current.nodeId
    const parentClaimId = await rsRepo.getClaimIdBySourceId(currentNodeId)

    // Get parent pol
    const parentPol = displayNodes.find(node => node.id === currentNodeId)?.data.pol
    const proParent = parentPol === "pro" ? isProMain : !isProMain

    // Generate ID
    const newClaimId = "claimId-" + newId();

    // Get coordinates
    const { clientX, clientY } = currentMouseEvent.current;
    const { top, left } = connectingNodeCoord.current;
    const position = project({
      x: clientX - left - 75,
      y: clientY - top,
    })

    // add displayEdge to proper handle
    const affects = connectingNode.current.handleId;

    const newClaimEdgeData = affects
      ? { affects, id: `${newClaimId}Edge`, parentId: parentClaimId, childId: newClaimId, proParent }
      : {}


    const actions: Action[] = [
      { type: "add_claim", newData: { id: newClaimId, content: "newClaimText" }, oldData: undefined, dataId: `${newClaimId}` },
      { type: "add_claimEdge", newData: newClaimEdgeData, oldData: undefined, dataId: `${newClaimId}Edge` },
    ];
    await calculateScoreActions({ actions: actions, repository: rsRepo })

    // Get ScoreID
    const scores = await rsRepo.getScoresBySourceId(newClaimId);
    const newNodeScore = scores && scores.length > 0 ? scores[0] : undefined;
    if (!newNodeScore) throw new Error("No score found for the given claimId");

    // Set newNodePosition
    const newNodePosition =
    {
      id: newNodeScore.id,
      position: position
    }

    const { newDisplayNodes, newDisplayEdges } = await getEdgesAndNodes(rsRepo, displayNodes, displayEdges, newNodePosition);
    setDisplayNodes(newDisplayNodes)
    setDisplayEdges(newDisplayEdges)

  }

  // Context Menu
  // Move Function to ContextMenu.tsx
  function ContextMenu({ id, top, left, right, bottom, rsRepo, ...props }: ContextMenuData) {
    const deleteNode = useCallback(async () => {
      const sourceEdge = await rsRepo.getSourceEdgeIdBySourceId(id)
      if (!sourceEdge) return console.log("no sourceEdge")
      const existingClaimEdge = await rsRepo.getClaimEdge(sourceEdge)
      const actions: Action[] = [
        { type: "delete_claimEdge", newData: {}, oldData: existingClaimEdge, dataId: sourceEdge },
      ];
      await calculateScoreActions({ actions: actions, repository: rsRepo })
      const { newDisplayNodes, newDisplayEdges } = await getEdgesAndNodes(rsRepo, displayNodes, displayEdges);
      setDisplayNodes(newDisplayNodes);
      setDisplayEdges(newDisplayEdges);
    }, [id, setDisplayNodes, setDisplayEdges]);

    return (
      <div style={{ top: top, left: left, right: right, bottom: bottom }} className="context-menu"  {...props}>
        <button onClick={deleteNode} className="context-btn">delete</button>
      </div>
    );
  }

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, displayNode: Node<DisplayNodeData>) => {
      event.preventDefault();
      if (!menuRef.current) return console.log("no menuRef")
      const pane = (menuRef.current as HTMLElement).getBoundingClientRect();
      setMenu({
        id: displayNode.id,
        top: event.clientY < pane.height - 200 && event.clientY || "false",
        left: event.clientX < pane.width - 200 && event.clientX || "false",
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX || "false",
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY || "false",
      });
    },
    [setMenu]
  );
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

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
      console.log(`nodes`, displayNodes)
      console.log(`edges`, displayEdges)
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

  // TODO: What is this doing?
  // const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // DEV TESTING
  async function runItBack() {
    const { newDisplayNodes, newDisplayEdges } = await getEdgesAndNodes(rsRepo, displayNodes, displayEdges);
    setDisplayNodes(newDisplayNodes);
    setDisplayEdges(newDisplayEdges);
  }

  return (
    <DevContext.Provider value={isDev}>
      <div style={{ width: '100vw', height: '100vh', margin: 'auto' }} ref={reactFlowWrapper} className={isDev ? 'dev' : ''}>
        <div style={{ position: "absolute", right: "20px", top: "20px", zIndex: "1", display: "flex", flexDirection: "column", gap: "20px" }}>
          <button onClick={() => setIsDev(!isDev)} style={{ padding: 10, opacity: .5 }}>dev</button>
          {isDev && <>
            <button onClick={data()} style={{ padding: 10 }} >data</button>
            <button onClick={() => console.log(rsRepo.rsData.items)} style={{ padding: 10 }} >items</button>
            <button onClick={logDescendantScores()} style={{ padding: 10 }}>descendantScores</button>
            <button onClick={() => runItBack()} style={{ padding: 10 }}>getEdgesAndNodes()</button>
            <button onClick={() => console.log(displayNodes)} style={{ padding: 10 }}>nodes()</button>
            <button onClick={() => console.log(displayEdges)} style={{ padding: 10 }}>edges()</button>
            <button onClick={() => setDisplayNodes(displayNodes)} style={{ padding: 10 }}>setNodes()</button>
            <button onClick={() => setDisplayEdges(displayEdges)} style={{ padding: 10 }}>setEdges()</button>
          </>
          }
        </div>
        <CreateNodeDialog
          open={showCreateNodeDialog}
          handleClose={handleClose}
          createNode={createNode}
          clientX={currentMouseEvent.current.clientX}
          clientY={currentMouseEvent.current.clientY}
        />
        <ReactFlow
          ref={menuRef}
          nodes={displayNodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          // onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
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
          {menu && <ContextMenu onClick={onPaneClick} {...menu} rsRepo={rsRepo} />}
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
    </DevContext.Provider>
  );
}

export default function App({ params }: { params: { slug: string[] } }) {
  const rsRepo = useContext(RsRepoContext);

  return (
    <ReactFlowProvider>
      <RsRepoContext.Provider value={rsRepo}>
        <Flow slug={params.slug} />
      </RsRepoContext.Provider>
    </ReactFlowProvider>
  );
}