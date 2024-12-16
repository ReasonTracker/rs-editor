'use client';
import "./ScoreVolume.css";

import React from 'react';

export default function ScoreVolume(
    {
        score,
        ...props
    }: {
        score?: number;
        [key: string]: any;
    }) {
    return (
        <div
            className="scoreVolume"
            {...props}
            style={{ 
                flexDirection: "row", 
                display: "flex", 
                zIndex: 1001,
                border: '5px solid #000',
                ...props.style 
            }}
        >
            <div
                className="pro-volume"
                style={{
                    width: `${(score === undefined ? .99 : (score + 1)/2) * 100}%`,
                    backgroundColor: 'var(--pro)',
                    border: '1px solid #000',
                    height: '100%',

                }}
            ></div>
            <div
                className="con-volume"
                style={{
                    width: `${(1 - (score === undefined ? .99 : (score + 1)/2)) * 100}%`,
                    backgroundColor: 'var(--con)',
                    border: '1px solid #000',
                    height: '100%',
                }}
            ></div>
        </div>
    );
}