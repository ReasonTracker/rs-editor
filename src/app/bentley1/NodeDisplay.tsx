import { Edge, Handle, NodeProps, Position, ReactFlowState, getBezierPath, useStore } from 'reactflow';
import styles from './rsNode.module.css'
import { maxStrokeWidth } from './config';
import { DisplayEdgeData, DisplayNodeData } from './pageData';
import { Fragment } from 'react';

export function NodeDisplay(props: NodeProps<DisplayNodeData>) {
    const { data, id } = props

    const allSources = useStore((s: ReactFlowState) => {
        const originalSources: Edge<DisplayEdgeData>[] = s.edges.filter(
            (e) => e.target === id
        );

        return originalSources;
    });

    const weightByConfidence = <div className={styles.rsCalc}>
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

    const consolidate = <div className={styles.rsCalc} style={{ width: '100px' }}>
        {allSources.length > 0 && <>
            <svg
                height={(
                    (allSources[allSources.length - 1]?.data?.targetTop || 1) + (allSources[allSources.length - 1].data?.maxImpact || 0)
                ) * maxStrokeWidth}
                width={'150px'}>
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

    const scaleTo1 = <div className={styles.rsCalc} style={{ width: '50px' }}>
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

    const cancelOut = <div className={styles.rsCalc} style={{ width: '50px' }}>
        {allSources.length > 0 && <>
            <svg
                height={(
                    (allSources[allSources.length - 1]?.data?.targetTop || 1) + (allSources[allSources.length - 1].data?.maxImpact || 0)
                ) * maxStrokeWidth}
                width={maxStrokeWidth * 2}>

                <defs><pattern id='a' patternUnits='userSpaceOnUse' width='60' height='30' patternTransform='scale(.25) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 0%, 1)' /><path d='M1-6.5v13h28v-13H1zm15 15v13h28v-13H16zm-15 15v13h28v-13H1z' strokeWidth='1' stroke='none' fill='var(--pro)' /><path d='M31-6.5v13h28v-13H31zm-45 15v13h28v-13h-28zm60 0v13h28v-13H46zm-15 15v13h28v-13H31z' strokeWidth='1' stroke='none' fill='var(--con)' /></pattern></defs>

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
                    fill='url(#a)'
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

    return (
        <div className={styles.rsNode} >
            <Handle type="source"
                position={Position.Left}
                style={{ top: 0 }}
            />

            <div className={styles.rsNodeGrid} style={{ minHeight: (allSources?.length || 1) * maxStrokeWidth }}>
                <div className={styles.rsContent + " " + styles[data.pol]}>
                    {[
                        // data.scoreNumberText,
                        // data.score.confidence.toFixed(2),
                        // id,
                        data.claim.content
                    ].join(" | ")}
                </div>
                {allSources.length > 0 && <>
                    {cancelOut}
                    {scaleTo1}
                    {consolidate}
                    {weightByConfidence}
                </>}
            </div>

            <Handle
                type="target"
                position={Position.Right}
                style={{ top: 0 }}
                isConnectable={true}
            />
        </div>
    );
}