import { Edge, Handle, NodeProps, Position, ReactFlowState, getBezierPath, useReactFlow, useStore } from 'reactflow';
import { Fragment, useContext, useMemo, useState } from 'react';
import { Button, TextArea, Tooltip } from '@blueprintjs/core';
import { DisplayNodeData, ConfidenceEdgeData, DisplayEdgeData, RelevanceEdgeData } from '@/app/flow/types/types';
import { DevContext, FlowDataContext, FlowDataProvider } from './FlowDataProvider';
import addNode from '../utils/addNode';
import { stackSpace } from '@/utils/stackSpace';
import { ClaimActions } from '@/reasonScore/ActionTypes';

const MAX_STROKE_WIDTH = 25
const HALF_STROKE_WIDTH = MAX_STROKE_WIDTH / 2

const calculateRelevanceHeight = (relevanceSources: Edge<RelevanceEdgeData>[]) => {
    const maxRelevanceSource = relevanceSources.reduce((maxSource: Edge<RelevanceEdgeData> | null, currentSource: Edge<RelevanceEdgeData>) => {
        if (!maxSource || (currentSource.data?.targetRelevanceBottom ?? 0) > (maxSource.data?.targetRelevanceBottom ?? 0)) {
            return currentSource;
        }
        return maxSource;
    }, null);
    const maxTargetRelevanceBottom = maxRelevanceSource?.data?.targetRelevanceBottom ?? 1;
    const maxImpact = maxRelevanceSource?.data?.maxImpact ?? 0;
    return (maxTargetRelevanceBottom + maxImpact) * MAX_STROKE_WIDTH;
};

export default function DisplayNode(props: NodeProps<DisplayNodeData>) {
    const { data, id, xPos, yPos } = props
    const flowDataState = useContext(FlowDataContext);
    const dev = useContext(DevContext);

    const reactFlowInstance = useReactFlow();


    const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>, id: string) => {
        flowDataState.dispatch([{
            type: `modify`,
            newData: {
                id,
                content: e.target.value,
                type: "claim",
            }
        }])
    };

    const allRelevanceSources: Edge<RelevanceEdgeData>[] = useStore((s: ReactFlowState) => {
        const originalSources = s.edges.filter(
            (e) => e.target === id && e.data?.type === 'relevance'
        );
        return originalSources;
    })



    const allSources = useStore((s: ReactFlowState) => {
        const originalSources = s.edges.filter(
            (e) => e.target === id && e.data?.type === 'confidence'
        );

        return originalSources;
    });
    const allTargets = useStore((s: ReactFlowState) => {
        const originalTargets = s.edges.filter(
            (e) => e.source === id
        );

        return originalTargets;
    });

    const totalConfidence = allSources.reduce((acc, s) => {
        if (!s.data?.sourceScore) return acc;
        return acc + s.data.sourceScore.confidence;
    }, 0);

    const relevanceHalf = data.score.relevance * HALF_STROKE_WIDTH
    const relevanceMax = data.score.relevance * MAX_STROKE_WIDTH
    const confidenceMax = data.score.confidence * MAX_STROKE_WIDTH
    const confidenceHalf = data.score.confidence * HALF_STROKE_WIDTH


    const relevance = (<>
        {allTargets.length > 0 && (
            <div className="rsCalc rs-relevance" style={{ gridArea: 'relevance', width: '50px' }}>
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
                        0  , ${relevanceHalf - (confidenceMax * data.score.relevance / 2)}
                        0  , ${relevanceHalf + (confidenceMax * data.score.relevance / 2)}
                        50 , ${confidenceMax}
                        50 , 0
                    `}
                    />
                </svg>
            </div>
        )}</>)

    const cancelOutTop = data?.cancelOutStacked?.top ?? 0 * MAX_STROKE_WIDTH
    const cancelOutBottom = data?.cancelOutStacked?.bottom ?? 0 * MAX_STROKE_WIDTH

    const cancelOut = (
        <div className="rsCalc rs-cancelOut" style={{ gridArea: 'cancelOut', position: "relative" }}>
            <div style={{
                opacity: .4,
                backgroundColor: `var(--${data.pol})`,
                height: `${MAX_STROKE_WIDTH}px`
            }} />
            <div style={{
                backgroundColor: `var(--${data.pol})`,
                height: `${confidenceMax}px`,
                position: 'absolute', top: '0px', left: '0px',
                width: '100%',
                zIndex: 10
            }} />

            {allSources.length > 0 && <>
                <svg
                    style={{ position: 'absolute', right: '0px', top: '0px' }}

                    height={MAX_STROKE_WIDTH}
                    width={MAX_STROKE_WIDTH * 2}>
                    <defs>
                        <pattern id='cancelOutPattern' patternUnits='userSpaceOnUse' width='60' height='30' patternTransform='scale(.25) rotate(0)'>
                            <rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 0%, 1)' />
                            <path d='M1-6.5v13h28v-13H1zm15 15v13h28v-13H16zm-15 15v13h28v-13H1z' strokeWidth='1' stroke='none' fill='var(--pro)' />
                            <path d='M31-6.5v13h28v-13H31zm-45 15v13h28v-13h-28zm60 0v13h28v-13H46zm-15 15v13h28v-13H31z' strokeWidth='1' stroke='none' fill='var(--con)' />
                        </pattern>
                    </defs>
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
        (allSources[allSources.length - 1]?.data?.targetConfidenceTop || 1) +
        (allSources[allSources.length - 1]?.data?.maxImpact || 0)
    ) * MAX_STROKE_WIDTH

    const scaledTo1Stack = stackSpace();
    const scaleTo1Polygon = (<>
        {allSources.map(s => {
            if (!s.data) return null;

            const percentOfWeight = (s.data.sourceScore?.confidence || 0) / totalConfidence
            const scaledTo1Stacked = scaledTo1Stack(percentOfWeight)
            const { consolidatedStacked } = s.data;

            const scaledTop = scaledTo1Stacked.top * MAX_STROKE_WIDTH
            const scaledBottom = scaledTo1Stacked.bottom * MAX_STROKE_WIDTH
            const consolidatedTop = consolidatedStacked.top * MAX_STROKE_WIDTH
            const consolidatedBottom = consolidatedStacked.bottom * MAX_STROKE_WIDTH

            return (
                <Fragment key={`scale-${s.id}`}>
                    <polygon
                        style={{ fill: `var(--${s.data.pol})` }}
                        points={`
                            0  , ${scaledTop}
                            0  , ${scaledBottom}
                            50 , ${consolidatedBottom}
                            50 , ${consolidatedTop}
                        `}
                    />
                </Fragment>
            );
        })}
    </>)
    const scaleTo1 = (
        <div className="rsCalc rs-scaleTo1" style={{ gridArea: 'scaleTo1' }}>
            <svg height={calculatedHeight} width={'50px'}>
                {scaleTo1Polygon}
            </svg>
        </div>
    )

    const consolidatePolygon = (<>
        {allSources.map(s => {
            if (!s.data) return null;
            const { reducedImpactStacked, consolidatedStacked } = s.data;

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
                <Fragment key={`consolidate-${s.id}`}>
                    <path
                        style={{
                            stroke: `var(--${s.data?.pol})`,
                            strokeWidth: reducedImpact,
                        }}
                        d={edgePath}
                    />
                </Fragment>
            );
        }
        )}
    </>);
    const consolidate = (
        <div className="rsCalc rs-consolidate" style={{ gridArea: 'consolidate' }} >
            <svg
                height={calculatedHeight}
                width={'100px'}>
                {consolidatePolygon}
            </svg>
        </div>
    )

    const weightByConfidencePolygon = (<>
        {allSources.map(s => {
            if (!s.data) return null;
            const { impactStacked, reducedImpactStacked, maxImpactStacked, reducedMaxImpactStacked } = s.data;

            const top = impactStacked.top * MAX_STROKE_WIDTH;
            const reducedTop = reducedImpactStacked.top * MAX_STROKE_WIDTH;
            const reducedMaxTop = reducedMaxImpactStacked.top * MAX_STROKE_WIDTH;
            const maxTop = maxImpactStacked.top * MAX_STROKE_WIDTH;

            const bottom = impactStacked.bottom * MAX_STROKE_WIDTH;
            const reducedBottom = reducedImpactStacked.bottom * MAX_STROKE_WIDTH;
            const reducedMaxBottom = reducedMaxImpactStacked.bottom * MAX_STROKE_WIDTH;
            const maxBottom = maxImpactStacked.bottom * MAX_STROKE_WIDTH;

            return (
                <Fragment key={`weight-${s.id}`}>
                    {/* Outer bar */}
                    <polygon
                        style={{
                            opacity: .4,
                            fill: `var(--${s.data?.pol})`
                        }}
                        points={`
                            0                   , ${reducedMaxTop}
                            0                   , ${reducedMaxBottom}
                            ${MAX_STROKE_WIDTH} , ${maxBottom}
                            ${MAX_STROKE_WIDTH} , ${maxTop}
                        `}
                    />
                    {/* Inner bar */}
                    <polygon
                        style={{ fill: `var(--${s.data?.pol})` }}
                        points={`
                            0                   , ${reducedTop}
                            0                   , ${reducedBottom}
                            ${MAX_STROKE_WIDTH} , ${bottom}
                            ${MAX_STROKE_WIDTH} , ${top}
                        `}
                    />
                </Fragment>
            );
        })
        }
    </>)
    const weightByConfidence = (
        <div className="rsCalc rs-weightByConfidence"
            style={{ gridArea: 'weightByConfidence' }}>
            <svg
                height={calculatedHeight}
                width={MAX_STROKE_WIDTH}
            >
                {weightByConfidencePolygon}
            </svg>
        </div>
    )


    const calculatedRelevanceHeight = useMemo(
        () => calculateRelevanceHeight(allRelevanceSources),
        [allRelevanceSources]
    );

    const incomingRelevancePolygon = (
        <>
            {allRelevanceSources.map((r, i) => {
                if (!r.data) return null;
                const { maxImpactStackedRelevance } = r.data;

                const relTop = maxImpactStackedRelevance.top * MAX_STROKE_WIDTH;
                const relBottom = maxImpactStackedRelevance.bottom * MAX_STROKE_WIDTH;

                return (
                    <Fragment key={`relevance-${r.id}`}>
                        <polygon
                            style={{ fill: `var(--${r.data?.pol})` }}
                            points={`
                                0                   , ${relBottom}
                                0                   , ${relTop}
                                ${MAX_STROKE_WIDTH} , ${relTop}
                                ${MAX_STROKE_WIDTH} , ${relBottom}
                            `}
                        >
                        </polygon>
                    </Fragment>
                );
            })}
        </>
    );

    const incomingRelevance = (
        <div
            className="rsCalc rs-incomingRelevance"
            style={{
                gridArea: "incomingRelevance",
                transform: `scaleY(-1)`,
            }}
        >
            <div style={{ transform: `rotate(180deg)` }}>
                <svg
                    height={calculatedRelevanceHeight}
                    width={MAX_STROKE_WIDTH}
                >
                    {incomingRelevancePolygon}
                </svg>
            </div>
        </div>
    );

    const consolidateRelevancePolygon = (<>
        {allRelevanceSources.map(s => {
            if (!s.data) return null;
            const { maxImpactStackedRelevance, relevanceStacked } = s.data;

            const reducedCenter = maxImpactStackedRelevance.center * MAX_STROKE_WIDTH
            const consolidatedCenter = relevanceStacked.center * MAX_STROKE_WIDTH
            const reducedImpact = (maxImpactStackedRelevance.bottom - maxImpactStackedRelevance.top) * MAX_STROKE_WIDTH

            const [edgePath, labelX, labelY] = getBezierPath({
                sourceX: 100,
                sourceY: consolidatedCenter,
                sourcePosition: Position.Left,
                targetX: 0,
                targetY: reducedCenter,
                targetPosition: Position.Right,
            });

            return (
                <Fragment key={`consolidateRelevance-${s.id}`}>
                    <path
                        style={{
                            stroke: `var(--${s.data?.pol})`,
                            strokeWidth: reducedImpact,
                        }}
                        d={edgePath}
                    />
                </Fragment>
            );
        }
        )}
    </>);
    const consolidateRelevance = (
        <div
            className="rsCalc rs-consolidateRelevance"
            style={{ gridArea: "consolidateRelevance", transform: `scaleY(-1)` }}
        >
            <div style={{ transform: `rotate(180deg)` }}>
                <svg
                    height={calculatedRelevanceHeight}
                    width={"100px"}
                // viewBox={`-10 -10 120 ${calculatedRelevanceHeight + 20}`}
                >
                    {consolidateRelevancePolygon}
                </svg>
            </div>
        </div>
    );

    const scaledTo1StackRelevance = stackSpace();
    let proTarget: Edge<RelevanceEdgeData>[] = []
    let conTarget: Edge<RelevanceEdgeData>[] = []
    allRelevanceSources.map((s) => {
        if (s.data?.pol === "pro") proTarget.push(s)
        if (s.data?.pol === "con") conTarget.push(s)
    })
    const reSortedRelevanceSources = [...conTarget, ...proTarget]

    const scaleTo1RelevancePolygon = (<>
        {reSortedRelevanceSources.map(s => {
            if (!s.data) return null;

            const percentOfWeight = (s.data.sourceScore?.confidence || 0) / totalConfidence
            const scaledTo1Stacked = scaledTo1StackRelevance(percentOfWeight)
            const { relevanceStacked } = s.data;

            const scaledBottom = calculatedRelevanceHeight - scaledTo1Stacked.top * MAX_STROKE_WIDTH
            const scaledTop = calculatedRelevanceHeight - scaledTo1Stacked.bottom * MAX_STROKE_WIDTH
            const consolidatedTop = relevanceStacked.top * MAX_STROKE_WIDTH
            const consolidatedBottom = relevanceStacked.bottom * MAX_STROKE_WIDTH

            const points = [
                { x: 50, y: scaledTop },
                { x: 50, y: scaledBottom },
                { x: 0, y: consolidatedBottom },
                { x: 0, y: consolidatedTop },
            ];

            return (
                <Fragment key={`scale-${s.id}`}>
                    <polygon
                        style={{ fill: `var(--${s.data.pol})` }}
                        points={points.map(p => `${p.x},${p.y}`).join(' ')}
                    />
                </Fragment>
            );
        })}
    </>)
    const scaleTo1Relevance = (
        <div
            className="rsCalc rs-scaleTo1Relevance"
            style={{
                gridArea: "scaleTo1Relevance",
                transform: `scaleY(-1)`
            }}
        >
            <div style={{
                transform: `rotate(180deg)`
            }}>
                <svg height={calculatedRelevanceHeight} width={"50px"}>
                    {scaleTo1RelevancePolygon}
                </svg>
            </div>
        </div>
    );

    const devButtons = (
        <>

            <Tooltip content="calculatedHeight" position="right">
                <Button
                    minimal
                    small
                    className="mb-1"
                    icon="helicopter"
                    onClick={() => {
                        console.log("calculatedHeight", calculatedHeight)
                    }}
                />
            </Tooltip>
            <Tooltip content="data" position="right">
                <Button
                    minimal
                    small
                    className="mb-1"
                    icon="database"
                    onClick={() => {
                        console.log(id, data)
                        console.log("confidence", data.score.confidence)
                        console.log("totalConfidence", totalConfidence)
                        console.log("cancelOutStacked", data.cancelOutStacked)
                    }}
                />
            </Tooltip>
            <Tooltip content="allSources" position="right">
                <Button
                    minimal
                    small
                    className="mb-1"
                    icon="sort-numerical"
                    onClick={() => {
                        allSources.map(s => {
                            if (!s.data) return null;
                            // const { cancelOutStacked, consolidatedStacked, scaledTo1Stacked } = s.data;
                            console.log(`${s.id}----`)
                            // console.log("cancelOutStacked", cancelOutStacked)
                            // console.log("totalConfidence", totalConfidence)

                            const percentOfWeight = (s.data.sourceScore?.confidence || 0) / totalConfidence
                            const scaledTo1Stacked = stackSpace()(percentOfWeight)
                            console.log("percentOfWeight", percentOfWeight)
                            console.log("scaledTo1Stacked", scaledTo1Stacked)

                        })
                        console.log("allSources", allSources)
                    }}
                />
            </Tooltip>
        </>
    )
    const rsContent = (
        <div style={{ gridArea: "content" }} className={`rsContent ${data.pol} relative`}>
            {dev.isDev
                ? <>
                    {/* <p>scoreId: {data.score.id}</p> */}
                    {/* <p>nodeId: {id}</p> */}
                    {/* <p>claimId: {data.claim.id}</p> */}
                    <p>{data.claim.content}</p>
                    <br />
                    <p>{id}</p>
                    <table className='overflow-hidden'>
                        <tbody>
                            {
                                Object.entries(data.score).map(([key, value]) => {
                                    const values = [
                                        "confidence",
                                        "relevance",
                                    ]
                                    if (values.includes(key)) {
                                        return <tr key={key}>
                                            <td>{key}</td>
                                            <td className='pl-2'>{((typeof value === "number") ? value.toFixed(2) : value)}</td>
                                        </tr>
                                    }
                                })}
                        </tbody>
                    </table>
                    <div
                        className="absolute -left-14 bottom-0 transform"
                    >
                        <div><span className='text-gray-400'>x:</span> {props.xPos}</div>
                        <div><span className='text-gray-400'>y:</span> {props.yPos}</div>
                    </div>
                </>
                : <TextArea
                    className="node-text-area text-xs" // !p-0, but caused gap it main claim
                    value={data.claim.content}
                    onChange={(e) => handleChangeText(e, data.claim.id)}
                    autoResize
                    asyncControl
                />
            }
            <div
                className="absolute -right-7 bottom-0 transform opacity-0 group-hover:opacity-100 transition flex flex-col"
                style={{
                    scale: '.5',
                    transformOrigin: 'bottom left'
                }}
            >
                {dev.isDev ? devButtons : null}
                <Tooltip content="Add Relevance" position="right">
                    <Button
                        minimal
                        small
                        className="mb-1 !bg-pro"
                        icon="plus"
                        onClick={() => {
                            addNode({ flowDataState, sourceId: id, isNewNodePro: true, targetNodeData: data, affects: 'relevance' })
                            reactFlowInstance.fitView({ padding: 0.5, duration: 1000 });
                        }}
                    />
                </Tooltip>
                <Tooltip content="Add Relevance" position="right">
                    <Button
                        minimal
                        small
                        className="mb-1 !bg-con"
                        icon="plus"
                        onClick={() => {
                            addNode({ flowDataState, sourceId: id, isNewNodePro: false, targetNodeData: data, affects: 'relevance' });
                            reactFlowInstance.fitView({ padding: 0.5, duration: 1000 });
                        }}
                    />
                </Tooltip>
                <Tooltip content="Add Pro" position="right">
                    <Button
                        minimal
                        small
                        className="mb-1 !bg-pro"
                        icon="plus"
                        onClick={() => {
                            addNode({ flowDataState, sourceId: id, isNewNodePro: true, targetNodeData: data, affects: 'confidence' });
                            reactFlowInstance.fitView({ padding: 0.5, duration: 1000 });
                        }}
                    />
                </Tooltip>
                <Tooltip content="Add Con" position="right">
                    <Button
                        minimal
                        small
                        className="mb-1 !bg-con"
                        onClick={() => {
                            addNode({ flowDataState, sourceId: id, isNewNodePro: false, targetNodeData: data, affects: 'confidence' });
                            reactFlowInstance.fitView({ padding: 0.5, duration: 1000 });
                        }}
                        icon="plus"
                    />
                </Tooltip>


                {/* <Tooltip content="Delete this claim" position="right">
                    <Button
                        minimal
                        small
                        className=""
                        onClick={() => {
                            console.log("delete")
                            const claimAction: ClaimActions = {
                                type: "delete",
                                newData: { id, type: "claim" },
                            };
                    
                            console.log("deleteNode", claimAction);
                    
                            flowDataState.dispatch([claimAction]);
                            

                            // reactFlowInstance.fitView({ padding: 0.5, duration: 1000 });
                        }}
                        icon="trash"
                    />
                </Tooltip> */}


                {/* <Tooltip content="Collapse" position="right">
                    <Button
                        minimal
                        small
                        className="mb-1"
                        icon="collapse-all"
                        onClick={() => {
                            x.setDisplayNodes((prev) => {
                                return prev.map((n) => {
                                    if (n.id === id) {
                                        return {
                                            ...n,
                                            data: {
                                                ...n.data,
                                                collapsed: !n.data.collapsed,
                                            },
                                        };
                                    }
                                    return n;
                                });
                            })

                        }}
                    />
                </Tooltip> */}
            </div>
        </div>
    )

    return (
        <div className='group relative'>
            <div className="rsNode" >
                <div className="rsNodeGrid" style={{ minHeight: (allSources?.length || 1) * MAX_STROKE_WIDTH }}>

                    {incomingRelevance}
                    {consolidateRelevance}
                    {scaleTo1Relevance}
                    {relevance}
                    {cancelOut}
                    {scaleTo1}
                    {consolidate}
                    {weightByConfidence}
                    {/* -{data.collapsed? "true":"false"}- */}
                    {rsContent}

                </div>
            </div>

            <Handle type="target"
                id="relevance"
                position={Position.Right}
                style={{ top: 0 }}
                className={dev.isDev ? 'opacity-100' : 'opacity-0'}
            />

            <Handle type="source"
                position={Position.Left}
                style={{ top: `0` }}
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