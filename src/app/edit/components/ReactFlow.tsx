'use client'

import ReactFlow, { Controls, MiniMap } from 'reactflow';
import { FlowDataContext } from './FlowDataProvider'
import { useContext, useRef } from 'react';
import DisplayNode from './DisplayNode'
import DisplayEdge from './DisplayEdge'
import ScoreBoard from '../../../components/ScoreBoard';
import DevPanel from './DevPanel';
import DataPanel from './DataPanel';
import TimelinePanel from './TimelinePanel';
import ScoreVolume from '@/components/ScoreVolume';


const nodeTypes = { rsNode: DisplayNode };
const edgeTypes = { rsEdge: DisplayEdge };

export default function Flow() {

    const menuRef = useRef(null);
    const flowDataState = useContext(FlowDataContext);
    const mainScore = flowDataState.displayNodes.find((n) => n.id === flowDataState.debate.mainClaimId)?.data?.score;

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
                fitView
                minZoom={0.01}
                maxZoom={10}
            >

                <ScoreBoard score={mainScore?.reversibleConfidence} />
                <ScoreVolume score={mainScore?.reversibleConfidence}
                    style={{ width: "75px", height: "360px", top:'30px', left:'80px', position:'absolute' }}
                 />

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

                <div className="bp5-dark react-flow__panel react-flow__controls top right">
                    <DataPanel />
                    <DevPanel />
                    <TimelinePanel />
                </div>

            </ReactFlow>

        </div>
    )
}