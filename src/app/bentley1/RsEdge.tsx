import React from 'react';
import { BaseEdge, BezierEdge, EdgeLabelRenderer, EdgeProps, ReactFlowState, getBezierPath, useStore } from 'reactflow';

const maxStrokeWidth = 25;

// this is a little helper component to render the actual edge label
function EdgeLabel({ transform, label }: { transform: string; label: string }) {
    return (
        <div
            style={{
                position: 'absolute',
                background: 'transparent',
                padding: 0,
                color: '#000',
                fontSize: 40,
                fontWeight: 1000,
                transform,
            }}
            className="nodrag nopan"
        >
            {label}
        </div>
    );
}

export default function RsEdge(props: EdgeProps) {
    const { style, source, data, target, targetY, targetX, sourceX, sourceY, sourcePosition, targetPosition, id } = props

    const sources = useStore((s: ReactFlowState) => {
        const allSources = s.edges.filter(
            (e) => e.target === target
        );
        const index = allSources.map(e => e.source).indexOf(source);

        return {
            length: allSources.length,
            index: index,
            newTargetY: targetY + (index * maxStrokeWidth) + (maxStrokeWidth / 2) - (allSources.length * maxStrokeWidth / 2),
            newTargetX: targetX - 4,
            newSourceX: sourceX + 4

        };
    });

    const [edgePath] = getBezierPath({
        sourceX: sources.newSourceX,
        sourceY,
        sourcePosition,
        targetX: sources.newTargetX,
        targetY: sources.newTargetY,
        targetPosition,
    });

    return <g className={'rs-edge ' + data.pol}>

        <BezierEdge {...props}
            style={{
                ...(props.style),
                stroke: `var(--${data.pol})`,
                strokeWidth: maxStrokeWidth,
                strokeOpacity: .4
            }}
            targetY={sources.newTargetY}
            targetX={sources.newTargetX}
            sourceX={sources.newSourceX}
        />

        {/* <BezierEdge {...props}
            style={{
                ...(props.style),
                stroke: `var(--${data.pol})`,
                strokeWidth: maxStrokeWidth * data.score
            }}
            targetY={sources.newTargetY}
            targetX={sources.newTargetX}
            sourceX={sources.newSourceX}
        /> */}
        <BaseEdge id={id}
            style={{
                ...(props.style),
                stroke: `var(--${data.pol})`,
                strokeWidth: maxStrokeWidth * data.score
            }}
            path={edgePath} />
        <EdgeLabelRenderer>
            <EdgeLabel
                transform={`translate(-70%, -28px) translate(${sourceX}px,${sourceY}px)`}
                label={'🠔'}
            />
            <EdgeLabel
                transform={`translate(-20%, -28px) translate(${targetX}px,${sources.newTargetY}px)`}
                label={'🠔'}
            />
        </EdgeLabelRenderer>

    </g>
}