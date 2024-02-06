'use client'

import ReactFlow, { Controls, MiniMap, Node } from 'reactflow';
import { FlowDataContext } from './FlowDataProvider'
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import DisplayNode from './DisplayNode'
import DisplayEdge from './DisplayEdge'
import { DisplayNodeData } from '../types/types';
import ContextMenu, { ContextMenuData } from './ContextMenu';
import addNode from '../utils/addNode';
import ScoreBoard from '../../../components/ScoreBoard';

const nodeTypes = { rsNode: DisplayNode };
const edgeTypes = { rsEdge: DisplayEdge };

export default function Flow() {

    const menuRef = useRef(null);
    const [menu, setMenu] = useState<ContextMenuData | null>(null);

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

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
                onPaneClick
            });
        },
        [setMenu, onPaneClick]
    );

    const flowDataState = useContext(FlowDataContext);

    // // addNode({ x }) for dev
    // useEffect(() => {
    //     addNode({ flowDataState, isNewNodePro: true, claimId: "mainClaim" })
    // }, [])

    const mainScore = flowDataState.displayNodes.find((n) => n.id === flowDataState.debate.mainClaimId )?.data?.score;

    return (
        <div className={flowDataState.animating ? "autoAnimate" : ''} style={{ width: '100vw', height: '100vh', margin: 'auto' }} >
            <ReactFlow
                ref={menuRef}
                nodes={flowDataState.displayNodes}
                edges={flowDataState.displayEdges}
                onNodesChange={flowDataState.onNodesChange}
                onEdgesChange={flowDataState.onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onPaneClick={onPaneClick}
                onNodeContextMenu={onNodeContextMenu}
                fitView
            >
            <ScoreBoard score={mainScore?.confidence} />
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
            {menu && <ContextMenu {...menu} />}

        </div>
    )
}