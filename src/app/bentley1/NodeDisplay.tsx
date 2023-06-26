import { Edge, Handle, NodeProps, Position, ReactFlowState, getBezierPath, useStore } from 'reactflow';
import styles from './rsNode.module.css'
import { maxStrokeWidth } from './config';
import { DisplayEdgeData } from './pageData';
import { Fragment } from 'react';

export function NodeDisplay(props: NodeProps) {
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
                            consolidatedStacked: ConsolidatedStacked
                        } = data;

                        const [edgePath, labelX, labelY] = getBezierPath({
                            sourceX: 100,
                            sourceY: reducedImpactStacked.center * maxStrokeWidth,
                            sourcePosition: Position.Left,
                            targetX: 0,
                            targetY: ConsolidatedStacked.center * maxStrokeWidth,
                            targetPosition: Position.Right,
                        });

                        console.log(edgePath);


                        return <Fragment key={s.id}>
                            <path
                                style={{
                                    stroke: `var(--${s.data?.pol})`,
                                    strokeWidth: (reducedImpactStacked.bottom - reducedImpactStacked.top) * maxStrokeWidth,
                                }}

                                d={edgePath}
                            />
                            {/* <polygon
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
                            /> */}
                        </Fragment>
                    }
                }

                )}
            </svg>
        </>}
    </div>

    const scaleTo1 = <div className={styles.rsCalc}>
    </div>

    const cancelOut = <div className={styles.rsCalc}>
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