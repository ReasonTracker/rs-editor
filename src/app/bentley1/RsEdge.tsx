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

export default function RsEdge(props: EdgeProps<DisplayEdgeData>) {
    let { style, source, data, target, targetY, targetX, sourceX, sourceY, sourcePosition, targetPosition, id } = props
    sourceX += 4;
    targetX -= 4;
    let newTargetY = targetY;
    let newSourceY = sourceY;
    let width = maxStrokeWidth;
    if (data) {
        newTargetY += data.targetTop * maxStrokeWidth;
        newSourceY += data.sourceTop * maxStrokeWidth;
        width = maxStrokeWidth * data.impact;
    }

    // const sources = useStore((s: ReactFlowState) => {
    //     const originalSources = s.edges.filter(
    //         (e) => e.target === target
    //     );
    //     let result = {
    //         index: 0,
    //         newTargetX: targetX,
    //         newTargetY: targetY,
    //         newSourceX: sourceX,
    //         top: 0,
    //         bottom: 0
    //     }

    //     let lastBottom = targetY;
    //     for (const [index, s] of originalSources.entries()) {
    //         console.log('s.data.score * maxStrokeWidth', s.data.score, maxStrokeWidth, s.data.score * maxStrokeWidth);

    //         const newItem = {
    //             newTargetX: targetX - 4,
    //             newSourceX: sourceX + 4,
    //             //source: s,
    //             //stackedY: 0,
    //             //top: lastBottom,
    //             newTargetY: lastBottom + (s.data.score * halfStroke),//targetY,// + (index * maxStrokeWidth * (Math.max(1, data.score / 2))),
    //             bottom: lastBottom += Math.max((s.data.score * maxStrokeWidth), maxStrokeWidth),
    //             index: index
    //         };
    //         console.log('newItem', s.data.score, newItem.newTargetY)


    //         if (s.source === source) {
    //             result = { ...result, ...newItem };
    //         }

    //     }

    //     return result

    //     // const index = allSources.map(e => e.source).indexOf(source);

    //     // return {
    //     //     length: allSources.length,
    //     //     index: index,
    //     //     newTargetY: targetY + (index * maxStrokeWidth * (Math.max(1, data.score / 2))),
    //     //     newTargetX: targetX - 4,
    //     //     newSourceX: sourceX + 4

    //     // };
    // });

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
                strokeWidth: maxStrokeWidth,
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