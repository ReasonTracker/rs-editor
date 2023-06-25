import React from 'react';
import { BaseEdge, BezierEdge, EdgeLabelRenderer, EdgeProps, ReactFlowState, getBezierPath, useStore } from 'reactflow';
import { halfStroke, maxStrokeWidth } from './config';
import { DisplayEdgeData } from './pageData';

// this is a little helper component to render the actual edge label
function EdgeLabel({ transform }: { transform: string }) {
    return (
        <div
            style={{

                position: 'absolute',
                background: 'transparent',
                padding: 0,
                color: '#000',
                fontSize: 20,
                fontWeight: 1000,
                transform,
            }}
            className="nodrag nopan"
        >
            {'◀'}
        </div>
    );
}

export default function EdgeDisplay(props: EdgeProps<DisplayEdgeData>) {
    let { style, source, data, target, targetY, targetX, sourceX, sourceY, sourcePosition, targetPosition, id } = props
    sourceX += 4;
    targetX -= 4;
    let newTargetY = targetY;
    let newSourceY = sourceY;
    let width = maxStrokeWidth;
    if (data) {
        newTargetY += (data.targetTop * maxStrokeWidth) + (data.maxImapct * halfStroke);
        newSourceY += data.maxImapct * halfStroke;
        width = maxStrokeWidth * data.impact;
    }

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX: sourceX,
        sourceY: newSourceY,
        sourcePosition,
        targetX: targetX,
        targetY: newTargetY,
        targetPosition,
    });

    return <g className={'rs-edge ' + data?.pol}>

        <BezierEdge {...props}
            style={{
                ...(props.style),
                stroke: `var(--${data?.pol})`,
                strokeWidth: (data?.maxImapct || 1) * maxStrokeWidth,
                strokeOpacity: .4
            }}
            targetY={newTargetY}
            targetX={targetX}
            sourceX={sourceX}
            sourceY={newSourceY}

        />

        <BaseEdge id={id}
            style={{
                ...(props.style),
                stroke: `var(--${data?.pol})`,
                strokeWidth: width,
            }}
            path={edgePath} />
        <EdgeLabelRenderer>
            <EdgeLabel
                transform={`translate(-1em, -.65em) translate(${sourceX}px,${newSourceY}px)`}
            />
            <EdgeLabel
                transform={`translate(.1em, -.65em) translate(${targetX}px,${newTargetY}px)`}
            />
        </EdgeLabelRenderer>

    </g>
}