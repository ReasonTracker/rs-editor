import React, { useContext } from 'react';
import { BaseEdge, BezierEdge, EdgeLabelRenderer, EdgeProps, EdgeText, ReactFlowState, getBezierPath, useStore } from 'reactflow';
import { ConfidenceEdgeData, RelevanceEdgeData } from '@/app/flow/types/types'
import { isConfidenceEdgeData } from '@/app/flow/types/typeGuards'
import { DevContext } from './FlowDataProvider';

const maxStrokeWidth = 25;
const halfStroke = maxStrokeWidth / 2;

// this is a little helper component to render the actual edge label
function EdgeLabel({ transform, label }: { transform: string, label: string }) {
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
            {label}
        </div>
    );
}

export default function DisplayEdge(props: EdgeProps<ConfidenceEdgeData | RelevanceEdgeData>) {
    let { style, source, data, target, targetY, targetX, sourceX, sourceY, sourcePosition, targetPosition, id } = props
    const dev = useContext(DevContext);
    
    sourceX += 4;
    targetX -= 4;
    let newTargetY = targetY;
    let newSourceY = sourceY;
    let width = maxStrokeWidth;
    if (isConfidenceEdgeData(data)) {
        newTargetY += (data.targetTop * maxStrokeWidth) + (data.maxImpact * halfStroke);
        width = maxStrokeWidth * data.impact;
    }
    if (data) newSourceY += data?.maxImpact * halfStroke;


    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX: sourceX,
        sourceY: newSourceY,
        sourcePosition,
        targetX: targetX,
        targetY: newTargetY,
        targetPosition,
        curvature: 1,
    });

    return <g className={'rs-edge ' + data?.pol}>

        {dev.isDev &&
            <EdgeText
                labelShowBg={false}
                x={labelX}
                y={labelY}
                label={props.id}
                labelStyle={{
                    fill: 'white',
                    textAnchor: 'middle',
                    pointerEvents: 'none',
                    fontWeight: 300,
                    strokeWidth: 0,
                    zIndex: -1,
                }}
            />
        }
        <BaseEdge {...props}
            style={{
                ...(props.style),
                stroke: `var(--${data?.pol})`,
                strokeWidth: (data?.maxImpact || 1) * maxStrokeWidth,
                strokeOpacity: .4
            }}
            path={edgePath}

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
                label='◀'
            />
            {data?.type === "confidence" ?
                <EdgeLabel
                    transform={`translate(.1em, -.65em) translate(${targetX}px,${newTargetY}px)`}
                    label={'◀'}
                /> :
                <EdgeLabel
                    transform={`translate(-.5em, -1em) translate(${targetX}px,${newTargetY}px)`}
                    label={`▼`}
                />
            }
        </EdgeLabelRenderer>

    </g>
}