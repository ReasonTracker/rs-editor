import { Edge, Handle, NodeProps, Position, ReactFlowState, getBezierPath, useStore } from 'reactflow';
import { halfStroke, maxStrokeWidth } from './config';
import { ConfidenceEdgeData, DisplayNodeData } from './pageData';
import { Fragment } from 'react';
import { Hi_Melody } from 'next/font/google';

export function NodeDisplay(props: NodeProps<DisplayNodeData>) {
    const { data, id } = props

    const allSources = useStore((s: ReactFlowState) => {
        const originalSources: Edge<ConfidenceEdgeData>[] = s.edges.filter(
            (e) => e.target === id && e.data?.type !== 'relevance'
        );

        return originalSources;
    });

    const relevance = <div className="rsCalc" style={{ gridArea: 'relevance', width: '50px' }}>
        <svg
            height={data.score.relevance * maxStrokeWidth}
            width={'50px'}>
            <polygon
                style={{ opacity: .4, fill: `var(--${data.pol})` }}
                points={`
                        0                 , 0
                        0                 , ${data.score.relevance * maxStrokeWidth}
                        50 , ${maxStrokeWidth}
                        50 , 0
                    `}
            />
            <polygon
                style={{ fill: `var(--${data.pol})` }}
                points={`
                        0                 , 0
                        0                 , ${data.score.confidence * data.score.relevance * maxStrokeWidth}
                        50 , ${data.score.confidence * maxStrokeWidth}
                        50 , 0
                    `}
            />
        </svg>
    </div>

    const cancelOut = <div className="rsCalc" style={{ gridArea: 'cancelOut', position: "relative" }}>
        <div style={{ opacity: .4, backgroundColor: `var(--${data.pol})`, height: `${maxStrokeWidth}px` }}>
        </div>
        <div style={{
            backgroundColor: `var(--${data.pol})`,
            height: `${data.score.confidence * maxStrokeWidth}px`,
            position: 'absolute', top: '0px', left: '0px',
            width: '100%'
        }}>
        </div>

        {allSources.length > 0 && <>
            <svg
                style={{ position: 'absolute', right: '0px', top: '0px' }}

                height={maxStrokeWidth}
                width={maxStrokeWidth * 2}>
                <polygon
                    style={{ opacity: .4, fill: `var(--${data.pol})` }}
                    points={`
                        0                     , 0
                        0                     , ${maxStrokeWidth}
                        ${maxStrokeWidth * 2} , ${maxStrokeWidth}
                        ${maxStrokeWidth * 2} , 0
                    `}
                />

                <polygon
                    fill='url(#cancelOutPattern)'
                    points={`
                        ${maxStrokeWidth} , 0
                        ${maxStrokeWidth}  , ${maxStrokeWidth}
                        ${maxStrokeWidth * 2} , ${maxStrokeWidth}
                        ${maxStrokeWidth * 2} , 0
                    `}
                />

                {/* <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)' /></svg> */}

                <polygon
                    style={{ fill: `var(--${data.pol})` }}
                    points={`
                                    0                 , ${data.cancelOutStacked.top * maxStrokeWidth}
                                    0                 , ${data.cancelOutStacked.bottom * maxStrokeWidth}
                                    ${maxStrokeWidth * 2} , ${data.cancelOutStacked.bottom * maxStrokeWidth}
                                    ${maxStrokeWidth * 2} , ${data.cancelOutStacked.top * maxStrokeWidth}
                                `}
                />
            </svg>
        </>}
    </div>

    const scaleTo1 = <div className="rsCalc" style={{ gridArea: 'scaleTo1' }}>
        {allSources.length > 0 && <>
            <svg
                height={(
                    (allSources[allSources.length - 1]?.data?.targetTop || 1) + (allSources[allSources.length - 1].data?.maxImpact || 0)
                ) * maxStrokeWidth}
                width={'50px'}>
                {allSources.map(s => {
                    const data = s.data;
                    if (data) {

                        const {
                            consolidatedStacked,
                            scaledTo1Stacked,
                        } = data;

                        return <Fragment key={s.id}>

                            <polygon
                                style={{ fill: `var(--${s.data?.pol})` }}
                                points={`
                        0                 , ${scaledTo1Stacked.top * maxStrokeWidth}
                        0                 , ${scaledTo1Stacked.bottom * maxStrokeWidth}
                        50 , ${consolidatedStacked.bottom * maxStrokeWidth}
                        50 , ${consolidatedStacked.top * maxStrokeWidth}
                    `}
                            />
                        </Fragment>
                    }
                }

                )}
            </svg>
        </>}
    </div>

    const consolidate = <div className="rsCalc" style={{ gridArea: 'consolidate' }}>
        {allSources.length > 0 && <>
            <svg
                height={(
                    (allSources[allSources.length - 1]?.data?.targetTop || 1) + (allSources[allSources.length - 1].data?.maxImpact || 0)
                ) * maxStrokeWidth}
                width={'100px'}>
                {allSources.map(s => {
                    const data = s.data;
                    if (data) {

                        const {
                            reducedImpactStacked,
                            consolidatedStacked
                        } = data;

                        const [edgePath, labelX, labelY] = getBezierPath({
                            sourceX: 100,
                            sourceY: reducedImpactStacked.center * maxStrokeWidth,
                            sourcePosition: Position.Left,
                            targetX: 0,
                            targetY: consolidatedStacked.center * maxStrokeWidth,
                            targetPosition: Position.Right,
                        });

                        return <Fragment key={s.id}>
                            <path
                                style={{
                                    stroke: `var(--${s.data?.pol})`,
                                    strokeWidth: (reducedImpactStacked.bottom - reducedImpactStacked.top) * maxStrokeWidth,
                                }}

                                d={edgePath}
                            />
                        </Fragment>
                    }
                }

                )}
            </svg>
        </>}
    </div>

    const weightByConfidence = <div className="rsCalc" style={{ gridArea: 'weightByConfidence' }}>
        {allSources.length > 0 && <>
            <svg
                height={(
                    (allSources[allSources.length - 1]?.data?.targetTop || 1) + (allSources[allSources.length - 1].data?.maxImpact || 0)
                ) * maxStrokeWidth}
                width={maxStrokeWidth}>
                {allSources.map(s => {
                    const data = s.data;
                    if (data) {

                        const {
                            maxImpactStacked,
                            impactStacked,
                            reducedImpactStacked,
                            reducedMaxImpactStacked
                        } = data;

                        return <Fragment key={s.id}>

                            <polygon
                                style={{ opacity: .4, fill: `var(--${s.data?.pol})` }}
                                points={`
                                    0                 , ${reducedMaxImpactStacked.top * maxStrokeWidth}
                                    0                 , ${reducedMaxImpactStacked.bottom * maxStrokeWidth}
                                    ${maxStrokeWidth} , ${maxImpactStacked.bottom * maxStrokeWidth}
                                    ${maxStrokeWidth} , ${maxImpactStacked.top * maxStrokeWidth}
                                `}
                            />

                            <polygon
                                style={{ fill: `var(--${s.data?.pol})` }}
                                points={`
                                    0                 , ${reducedImpactStacked.top * maxStrokeWidth}
                                    0                 , ${reducedImpactStacked.bottom * maxStrokeWidth}
                                    ${maxStrokeWidth} , ${impactStacked.bottom * maxStrokeWidth}
                                    ${maxStrokeWidth} , ${impactStacked.top * maxStrokeWidth}
                                `}
                            />
                        </Fragment>
                    }
                }

                )}
            </svg>
        </>}
    </div>

    return (
        <div className="rsNode" >
            <div className="rsNodeGrid" style={{ minHeight: (allSources?.length || 1) * maxStrokeWidth }}>
                {relevance}
                {cancelOut}
                {scaleTo1}
                {consolidate}
                {weightByConfidence}
                <div style={{ gridArea: "content" }} className={`rsContent ${data.pol}`}>
                    {[
                        // data.scoreNumberText,
                        // data.score.confidence.toFixed(2),
                        // id,
                        data.claim.content
                    ].join(" | ")}
                </div>
            </div>

            <Handle type="target"
                id="relevance"
                position={Position.Top}
                style={{ left: 50 - halfStroke + 'px' }}
            />

            <Handle type="source"
                position={Position.Left}
                style={{ top: 0 }}
            />

            <Handle
                type="target"
                id="confidence"
                position={Position.Right}
                style={{ top: 0 }}
                isConnectable={true}
            />
        </div>
    );
}