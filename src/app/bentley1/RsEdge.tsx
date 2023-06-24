import React from 'react';
import { BaseEdge, BezierEdge, EdgeLabelRenderer, EdgeProps, ReactFlowState, getBezierPath, useStore } from 'reactflow';
import { halfStroke, maxStrokeWidth } from './config';

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

export default function RsEdge(props: EdgeProps) {
    const { style, source, data, target, targetY, targetX, sourceX, sourceY, sourcePosition, targetPosition, id } = props

    const sources = useStore((s: ReactFlowState) => {
        const originalSources = s.edges.filter(
            (e) => e.target === target
        );
        let result = {
            index: 0,
            newTargetX: targetX,
            newTargetY: targetY,
            newSourceX: sourceX,
            top: 0,
            bottom: 0
        }

        let lastBottom = targetY;
        for (const [index, s] of originalSources.entries()) {
            console.log('s.data.score * maxStrokeWidth', s.data.score, maxStrokeWidth, s.data.score * maxStrokeWidth);

            const newItem = {
                newTargetX: targetX - 4,
                newSourceX: sourceX + 4,
                //source: s,
                //stackedY: 0,
                //top: lastBottom,
                newTargetY: lastBottom + (s.data.score * halfStroke),//targetY,// + (index * maxStrokeWidth * (Math.max(1, data.score / 2))),
                bottom: lastBottom += Math.max((s.data.score * maxStrokeWidth), maxStrokeWidth),
                index: index
            };
            console.log('newItem', s.data.score, newItem.newTargetY)


            if (s.source === source) {
                result = { ...result, ...newItem };
            }

        }

        return result

        // const index = allSources.map(e => e.source).indexOf(source);

        // return {
        //     length: allSources.length,
        //     index: index,
        //     newTargetY: targetY + (index * maxStrokeWidth * (Math.max(1, data.score / 2))),
        //     newTargetX: targetX - 4,
        //     newSourceX: sourceX + 4

        // };
    });

    const [edgePath, labelX, labelY] = getBezierPath({
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

        <BaseEdge id={id}
            style={{
                ...(props.style),
                stroke: `var(--${data.pol})`,
                strokeWidth: maxStrokeWidth * data.score
            }}
            path={edgePath} />
        <EdgeLabelRenderer>
            <EdgeLabel
                transform={`translate(-1em, -.65em) translate(${sourceX}px,${sourceY}px)`}
            />
            <EdgeLabel
                transform={`translate(-20%, -.65em) translate(${targetX}px,${sources.newTargetY}px)`}
            />
        </EdgeLabelRenderer>

    </g>
}