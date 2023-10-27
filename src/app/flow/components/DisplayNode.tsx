import { Edge, Handle, NodeProps, Position, ReactFlowState, getBezierPath, useStore } from 'reactflow';
import { Fragment, useContext, useState } from 'react';
import { Button, TextArea, Tooltip } from '@blueprintjs/core';
import { DisplayNodeData, ConfidenceEdgeData } from '@/app/flow/types/types';
import { DevContext, FlowDataContext } from './FlowDataProvider';
import addNode from '../utils/addNode';

const MAX_STROKE_WIDTH = 25
const HALF_STROKE_WIDTH = MAX_STROKE_WIDTH / 2

export default function DisplayNode(props: NodeProps<DisplayNodeData>) {
    const { data, id, xPos, yPos } = props
    const x = useContext(FlowDataContext);
    const dev = useContext(DevContext);

    // typescript temp fix
    data.cancelOutStacked ? data.cancelOutStacked : data.cancelOutStacked = { top: 0, bottom: 0, center: 0 };

    const [nodeText, setNodeText] = useState(data.claim.content);
    const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>, id: string) => {
        setNodeText(e.target.value);
        // rsRepo.updateClaim(id, e.target.value);
    };

    const allSources = useStore((s: ReactFlowState) => {
        const originalSources: Edge<ConfidenceEdgeData>[] = s.edges.filter(
            (e) => e.target === id && e.data?.type !== 'relevance'
        );

        return originalSources;
    });

    const relevanceHalf = data.score.relevance * HALF_STROKE_WIDTH
    const relevanceMax = data.score.relevance * MAX_STROKE_WIDTH
    const confidenceMax = data.score.confidence * MAX_STROKE_WIDTH

    const Relevance = () => (
        <div className="rsCalc" style={{ gridArea: 'relevance', width: '50px' }}>
            <svg
                height={relevanceMax}
                width={'50px'}
            >
                <polygon
                    style={{ opacity: .4, fill: `var(--${data.pol})` }}
                    points={`
                        0  , 0
                        0  , ${relevanceMax}
                        50 , ${MAX_STROKE_WIDTH}
                        50 , 0
                `}
                />
                <polygon
                    style={{ fill: `var(--${data.pol})` }}
                    points={`
                        0  , ${relevanceHalf - confidenceMax}
                        0  , ${relevanceHalf + confidenceMax}
                        50 , ${confidenceMax}
                        50 , 0
                    `}
                />
            </svg>
        </div>
    )

    const cancelOutTop = data.cancelOutStacked.top * MAX_STROKE_WIDTH
    const cancelOutBottom = data.cancelOutStacked.bottom * MAX_STROKE_WIDTH

    const CancelOut = () => (
        <div className="rsCalc" style={{ gridArea: 'cancelOut', position: "relative" }}>
            <div style={{
                opacity: .4,
                backgroundColor: `var(--${data.pol})`,
                height: `${MAX_STROKE_WIDTH}px`
            }} />
            <div style={{
                backgroundColor: `var(--${data.pol})`,
                height: `${confidenceMax}px`,
                position: 'absolute', top: '0px', left: '0px',
                width: '100%'
            }} />

            {allSources.length > 0 && <>
                <svg
                    style={{ position: 'absolute', right: '0px', top: '0px' }}

                    height={MAX_STROKE_WIDTH}
                    width={MAX_STROKE_WIDTH * 2}>

                    <polygon
                        fill='url(#cancelOutPattern)'
                        points={`
                            ${MAX_STROKE_WIDTH}     , 0
                            ${MAX_STROKE_WIDTH}     , ${MAX_STROKE_WIDTH}
                            ${MAX_STROKE_WIDTH * 2} , ${MAX_STROKE_WIDTH}
                            ${MAX_STROKE_WIDTH * 2} , 0
                        `}
                    />

                    {/* <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)' /></svg> */}

                    <polygon
                        style={{ fill: `var(--${data.pol})` }}
                        points={`
                            0                       , ${cancelOutTop}
                            0                       , ${cancelOutBottom}
                            ${MAX_STROKE_WIDTH * 2} , ${cancelOutBottom}
                            ${MAX_STROKE_WIDTH * 2} , ${cancelOutTop}
                        `}
                    />
                </svg>
            </>}
        </div>
    )

    const calculatedHeight = (
        (allSources[allSources.length - 1]?.data?.targetTop || 1) +
        (allSources[allSources.length - 1]?.data?.maxImpact || 0)
    ) * MAX_STROKE_WIDTH

    const ScaleTo1Polygon = ({ source }: { source: Edge<ConfidenceEdgeData> }) => {
        const { id, data } = source;
        if (!data) return null;

        const { consolidatedStacked, scaledTo1Stacked } = data;

        const scaledTop = scaledTo1Stacked.top * MAX_STROKE_WIDTH
        const scaledBottom = scaledTo1Stacked.bottom * MAX_STROKE_WIDTH
        const consolidatedTop = consolidatedStacked.top * MAX_STROKE_WIDTH
        const consolidatedBottom = consolidatedStacked.bottom * MAX_STROKE_WIDTH

        return (
            <Fragment key={id}>
                <polygon
                    style={{ fill: `var(--${data.pol})` }}
                    points={`
                        0  , ${scaledTop}
                        0  , ${scaledBottom}
                        50 , ${consolidatedBottom}
                        50 , ${consolidatedTop}
                    `}
                />
            </Fragment>
        );
    };
    const ScaleTo1 = () => {
        if (allSources.length === 0) return null

        return (
            <div className="rsCalc" style={{ gridArea: 'scaleTo1' }}>
                <svg height={calculatedHeight} width={'50px'}>
                    {allSources.map(s =>
                        <ScaleTo1Polygon key={s.id} source={s} />
                    )}
                </svg>
            </div>
        )
    }

    const ConsolidatePolygon = ({ source }: { source: Edge<ConfidenceEdgeData> }) => {
        const { id, data } = source;
        if (!data) return null;

        const { reducedImpactStacked, consolidatedStacked } = data;

        const reducedCenter = reducedImpactStacked.center * MAX_STROKE_WIDTH
        const consolidatedCenter = consolidatedStacked.center * MAX_STROKE_WIDTH
        const reducedImpact = (reducedImpactStacked.bottom - reducedImpactStacked.top) * MAX_STROKE_WIDTH

        const [edgePath, labelX, labelY] = getBezierPath({
            sourceX: 100,
            sourceY: reducedCenter,
            sourcePosition: Position.Left,
            targetX: 0,
            targetY: consolidatedCenter,
            targetPosition: Position.Right,
        });

        return (
            <Fragment key={id}>
                <path
                    style={{
                        stroke: `var(--${data?.pol})`,
                        strokeWidth: reducedImpact,
                    }}
                    d={edgePath}
                />
            </Fragment>
        );
    }

    const Consolidate = () => (
        <div className="rsCalc" style={{ gridArea: 'consolidate' }}>
            {allSources.length > 0 && <>
                <svg
                    height={calculatedHeight}
                    width={'100px'}>
                    {allSources.map(s =>
                        <ConsolidatePolygon key={s.id} source={s} />
                    )}
                </svg>
            </>}
        </div>
    )

    const WeightByConfidencePolygon = ({ source }: { source: Edge<ConfidenceEdgeData> }) => {
        const { id, data } = source;
        if (!data) return null;

        const { impactStacked, reducedImpactStacked, maxImpactStacked, reducedMaxImpactStacked } = data;

        const top = impactStacked.top * MAX_STROKE_WIDTH;
        const reducedTop = reducedImpactStacked.top * MAX_STROKE_WIDTH;
        const reducedMaxTop = reducedMaxImpactStacked.top * MAX_STROKE_WIDTH;
        const maxTop = maxImpactStacked.top * MAX_STROKE_WIDTH;

        const bottom = impactStacked.bottom * MAX_STROKE_WIDTH;
        const reducedBottom = reducedImpactStacked.bottom * MAX_STROKE_WIDTH;
        const reducedMaxBottom = reducedMaxImpactStacked.bottom * MAX_STROKE_WIDTH;
        const maxBottom = maxImpactStacked.bottom * MAX_STROKE_WIDTH;

        return (
            <Fragment key={id}>
                <polygon
                    style={{ opacity: .4, fill: `var(--${data?.pol})` }}
                    points={`
                        0                   , ${reducedMaxTop}
                        0                   , ${reducedMaxBottom}
                        ${MAX_STROKE_WIDTH} , ${maxBottom}
                        ${MAX_STROKE_WIDTH} , ${maxTop}
                    `}
                />
                <polygon
                    style={{ fill: `var(--${data?.pol})` }}
                    points={`
                        0                   , ${reducedTop}
                        0                   , ${reducedBottom}
                        ${MAX_STROKE_WIDTH} , ${bottom}
                        ${MAX_STROKE_WIDTH} , ${top}
                    `}
                />
            </Fragment>
        );
    }
    const WeightByConfidence = () => {
        if (allSources.length === 0) return null
        return (
            <div className="rsCalc" style={{ gridArea: 'weightByConfidence' }}>
                <svg
                    height={calculatedHeight}
                    width={MAX_STROKE_WIDTH}>
                    {allSources.map(s =>
                        <WeightByConfidencePolygon key={s.id} source={s} />
                    )}
                </svg>
            </div>
        )
    }

    const RsContent = () => (
        <div style={{ gridArea: "content" }} className={`rsContent ${data.pol} relative`}>
            {dev.isDev
                ? <DevDetails />
                : <TextArea
                    className="node-text-area text-xs" // !p-0, but caused gap it main claim
                    value={nodeText}
                    onChange={(e) => handleChangeText(e, data.claim.id)}
                    autoResize
                    asyncControl
                />
            }
            <div
                className="absolute -right-7 bottom-0 transform 
                                opacity-0 
                                group-hover:opacity-100 
                                transition flex flex-col"
            >
                <Tooltip content="Add Pro" position="right">
                    <Button
                        minimal
                        small
                        className="mb-1 !bg-pro"
                        icon="plus"
                        onClick={() => addNode({ x, sourceId: id, proTarget: true, affects: 'confidence' })}
                    />
                </Tooltip>
                <Tooltip content="Add Con" position="right">
                    <Button
                        minimal
                        small
                        className="!bg-con"
                        onClick={() => addNode({ x, sourceId: id, proTarget: false, affects: 'confidence' })}
                        icon="plus"
                    />
                </Tooltip>
            </div>
        </div>
    )

    const DevDetails = () => {
        return (
            <>
                <p>scoreId: {data.score.id}</p>
                <p>nodeId: {id}</p>
                <p>claimId: {data.claim.id}</p>
            </>
        )
    }

    return (
        <div className='group relative'>
            <div className="rsNode" >
                <div className="rsNodeGrid" style={{ minHeight: (allSources?.length || 1) * MAX_STROKE_WIDTH }}>

                    <Relevance />
                    <CancelOut />
                    <ScaleTo1 />
                    <Consolidate />
                    <WeightByConfidence />

                    <RsContent />

                </div>
            </div>

            <Handle type="target"
                id="relevance"
                position={Position.Top}
                style={{ left: 50 - HALF_STROKE_WIDTH + 'px' }}
                className={dev.isDev ? 'opacity-100' : 'opacity-0'}
            />

            <Handle type="source"
                position={Position.Left}
                style={{ top: 0 }}
                isConnectableStart={false}
                className={dev.isDev ? 'opacity-100' : 'opacity-0'}
            />

            <Handle
                type="target"
                id="confidence"
                position={Position.Right}
                style={{ top: 0 }}
                isConnectable={true}
                className={dev.isDev ? 'opacity-100' : 'opacity-0'}
            />
        </div>
    );
}