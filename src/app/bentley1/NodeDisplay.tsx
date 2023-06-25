import { BezierEdge, Edge, Handle, NodeProps, Position, ReactFlowState, getBezierPath, useStore } from 'reactflow';
import styles from './rsNode.module.css'
import { halfStroke, maxStrokeWidth } from './config';
import { DisplayEdgeData, DisplayNodeData } from './pageData';
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
                    (allSources[allSources.length - 1]?.data?.targetTop || 1) + (allSources[allSources.length - 1].data?.maxImapct || 0)
                ) * maxStrokeWidth}
                width={maxStrokeWidth}>
                {allSources.map(s => {
                    const data = s.data;
                    if (data) {
                        const maxImpact = data.maxImapct * maxStrokeWidth;
                        const topMax = data.targetTop * maxStrokeWidth;
                        const bottomMax = topMax + maxImpact;

                        const impact = data.impact * maxStrokeWidth;
                        const impactDiff = (maxImpact - impact) / 2;
                        const topImpact = topMax + impactDiff;
                        const bottomImpact = bottomMax - impactDiff;

                        const reducedImpact = impact * data.sourceScore.confidence;
                        const reducedImpactDiff = (impact - reducedImpact) / 2;
                        const topReducedImpact = topMax + impactDiff + reducedImpactDiff;
                        const bottomReducedImpact = bottomMax - impactDiff - reducedImpactDiff;

                        const reducesMaxImpact = maxImpact * data.sourceScore.confidence;
                        const reducesMaxImpactDiff = (maxImpact - reducesMaxImpact) / 2;
                        const topReducedMaxImpact = topMax + reducesMaxImpactDiff;
                        const bottomReducedMaxImpact = bottomMax - reducesMaxImpactDiff;

                        return <Fragment key={s.id}>

                            <polygon
                                style={{ opacity: .4, fill: `var(--${s.data?.pol})` }}
                                points={`
                                0,${topReducedMaxImpact}
                                0,${bottomReducedMaxImpact}
                                25,${bottomMax}
                                25,${topMax}
                            `}
                            />

                            <polygon
                                style={{ fill: `var(--${s.data?.pol})` }}
                                points={`
                            0,${topReducedImpact}
                            0,${bottomReducedImpact}
                            25,${bottomImpact}
                            25,${topImpact}
                        `}
                            />
                        </Fragment>
                    }
                }

                )}
            </svg>
        </>}
    </div>

    const consolidate = <div className={styles.rsCalc}>
        <svg
            height={(allSources?.length || 1) * maxStrokeWidth}
            width={maxStrokeWidth}>
            {
                // allSources.map(s =>
                //     <path style={{ stroke: `var(--${s.source.data.pol})` }}
                //         key={s.source.id}
                //         d={getBezierPath({ sourceX: 10, sourceY: 10, sourcePosition: Position.Left, targetX: 100, targetY: 200, targetPosition: Position.Right })[0]}></path>
                // )
            }
        </svg>
    </div >

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