import { BezierEdge, Edge, Handle, NodeProps, Position, ReactFlowState, getBezierPath, useStore } from 'reactflow';
import styles from './rsNode.module.css'

const handleStyle = { left: 10 };
const maxStrokeWidth = 25;


export function RsNode(props: NodeProps) {
    const { data, id } = props

    const allSources = useStore((s: ReactFlowState) => {
        const originalSources = s.edges.filter(
            (e) => e.target === id
        );
        const sources: {
            source: Edge,
            stackedY: number
            top: number
            bottom: number
            index: number
        }[] = [];
        let lastBottom = 0;
        for (const [index, s] of originalSources.entries()) {
            sources.push({
                source: s,
                stackedY: 0,
                top: lastBottom,
                bottom: lastBottom += (s.data.score * maxStrokeWidth),
                index: index
            });

        }
        return sources;
    });

    const weightByConfidence = <div className={styles.rsCalc}>
        {allSources.map(s => <svg key={s.source.id}
            height={maxStrokeWidth}
            width={maxStrokeWidth}
            style={{ fill: `var(--${s.source.data.pol})` }}>

            <polygon style={{ opacity: .4 }} points={
                `0,${(maxStrokeWidth / 2) - ((maxStrokeWidth / 2) * s.source.data.score)}
                0,${(maxStrokeWidth / 2) + ((maxStrokeWidth / 2) * s.source.data.score)}
                25,${(maxStrokeWidth / 2) + ((maxStrokeWidth / 2))}
                25,${(maxStrokeWidth / 2) - ((maxStrokeWidth / 2))}
            `} />

            <polygon points={
                `0,${(maxStrokeWidth / 2) - ((maxStrokeWidth / 2) * s.source.data.score * s.source.data.score)}
                0,${(maxStrokeWidth / 2) + ((maxStrokeWidth / 2) * s.source.data.score * s.source.data.score)}
                25,${(maxStrokeWidth / 2) + ((maxStrokeWidth / 2) * s.source.data.score)}
                25,${(maxStrokeWidth / 2) - ((maxStrokeWidth / 2) * s.source.data.score)}
            `} />

        </svg>)}
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
            <Handle type="source" position={Position.Left} />
            <div className={styles.rsNodeGrid} style={{ minHeight: (allSources?.length || 1) * maxStrokeWidth }}>
                <div className={styles.rsContent + " " + styles[data.pol]}>
                    {data.label}
                </div>
                {cancelOut}
                {scaleTo1}
                {consolidate}
                {weightByConfidence}
            </div>
            <Handle type="target" position={Position.Right} />
        </div>
    );
}