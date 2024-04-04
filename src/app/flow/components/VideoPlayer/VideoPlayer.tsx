'use client'
import React, { useContext, useEffect, useState } from 'react';
import { FlowDataContext } from '../FlowDataProvider';
import addNodes from '../../utils/addNodes';
import { Button } from '@blueprintjs/core';
import {  useReactFlow } from 'reactflow';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const VideoPlayer = () => {
    const flowDataState = useContext(FlowDataContext);
    const reactFlowInstance = useReactFlow();
    const [isPlaying, setIsPlaying] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    
    useEffect(() => {
        const controller = abortController;
        return () => controller?.abort();
    }, [abortController]);

    const tempNodeSequence = [
        {delay: 1500, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "insects are Gorgeous and Handcrafted.", claimId: "mainClaim" }]},
        {delay: 1500, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "cats are Small and Gorgeous.", sourceId: "mainClaim", claimId: "claim1" }]},
        {delay: 1500, nodes: [{ flowDataState, isNewNodePro: false, claimContent: "birds are Bespoke and Unbranded.", sourceId: "mainClaim", claimId: "claim2" }]},
        {delay: 1000, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "cetaceans are Bespoke and Recycled.", sourceId: "mainClaim", claimId: "claim3" }]},
        {delay: 1500, nodes: [{ flowDataState, isNewNodePro: false, claimContent: "cetaceans are Small and Elegant.", sourceId: "mainClaim", claimId: "claim4" }]},
        {delay: 1500, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "snakes are Incredible and Bespoke.", sourceId: "claim1", claimId: "claim5" }]},
        {delay: 1000, nodes: [{ flowDataState, isNewNodePro: false, claimContent: "horses are Handcrafted and Ergonomic.", sourceId: "claim1", claimId: "claim6" }]},
        {delay: 1500, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "bears are Sleek and Ergonomic.", sourceId: "claim1", claimId: "claim7" }]},
        {delay: 1500, nodes: [{ flowDataState, isNewNodePro: false, claimContent: "dogs are Gorgeous and Oriental.", sourceId: "claim7", claimId: "claim8" }]},
    ]

    const playVideo = async () => {
        setIsPlaying(true);
        const abortController = new AbortController();
        setAbortController(abortController);

        try {
            for (const { delay: ms, nodes } of tempNodeSequence) {
                if (abortController.signal.aborted) break;
                addNodes(nodes);
                reactFlowInstance.fitView({ padding: 0.5, duration: 1500 });
                await delay(ms);
                if (abortController.signal.aborted) break;
            }
        } catch (error) {
            console.error('An error occurred during video playback', error);
        }

        setIsPlaying(false);
    };

    const cancelVideo = () => {
        abortController?.abort();
        setAbortController(null);
        setIsPlaying(false);
    };


    return (
        <div className='flex gap-2 absolute bottom-0 right-1/2 z-10'>
            <Button onClick={playVideo} disabled={isPlaying}>Play</Button>
            <Button onClick={cancelVideo} disabled={!isPlaying}>Cancel</Button>
        </div>
    );
};

export default VideoPlayer;