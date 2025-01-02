'use client';
import "./ScoreVolume.css";

import React from 'react';

const minVolume = 2;

export default function ScoreVolume(
    {
        score,
        ...props
    }: {
        score?: number;
        [key: string]: any;
        }) {
    
    if (score === undefined) score = 100;
    
    let scorePct = ((score + 1) / 2) * 100;

    if (scorePct > (100 - minVolume)) {
        scorePct = 100 - minVolume;
    } else if (scorePct < minVolume) {
        scorePct = minVolume;
    };


    return (
        <div
            className="scoreVolume"
            {...props}
            style={{
                flexDirection: "column",
                display: "flex",
                zIndex: 1001,
                border: '5px solid #000',
                ...props.style
            }}
        >
            <div
                className="pro-volume"
                style={{
                    height: `${scorePct}%`,
                    backgroundColor: 'var(--pro)',
                    border: '1px solid #000',
                    width: '100%',

                }}
            ></div>
            <div
                className="con-volume"
                style={{
                    height: `${100 - scorePct}%`,
                    backgroundColor: 'var(--con)',
                    border: '1px solid #000',
                    width: '100%',
                }}
            ></div>
        </div>
    );
}