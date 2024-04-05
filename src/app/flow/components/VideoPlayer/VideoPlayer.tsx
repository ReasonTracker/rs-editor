'use client'
import React, { useContext, useEffect, useState } from 'react';
import { FlowDataContext } from '../FlowDataProvider';
import addNodes from '../../utils/addNodes';
import { Button } from '@blueprintjs/core';
import { useReactFlow } from 'reactflow';
import { ClaimActions, ConnectorActions } from '@/reasonScoreNext/ActionTypes';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const VideoPlayer = () => {
    const flowDataState = useContext(FlowDataContext);
    const reactFlowInstance = useReactFlow();
    const [isPlaying, setIsPlaying] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const controller = abortController;
        return () => controller?.abort();
    }, [abortController]);

    const tempNodeSequence = [
        { delay: 1500, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "insects are Gorgeous and Handcrafted.", claimId: "mainClaim" }] },
        { delay: 1500, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "cats are Small and Gorgeous.", sourceId: "mainClaim", claimId: "claim1" }] },
        { delay: 1500, nodes: [{ flowDataState, isNewNodePro: false, claimContent: "birds are Bespoke and Unbranded.", sourceId: "mainClaim", claimId: "claim2" }] },
        { delay: 1000, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "cetaceans are Bespoke and Recycled.", sourceId: "mainClaim", claimId: "claim3" }] },
        { delay: 1500, nodes: [{ flowDataState, isNewNodePro: false, claimContent: "cetaceans are Small and Elegant.", sourceId: "mainClaim", claimId: "claim4" }] },
        { delay: 1500, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "snakes are Incredible and Bespoke.", sourceId: "claim1", claimId: "claim5" }] },
        { delay: 1000, nodes: [{ flowDataState, isNewNodePro: false, claimContent: "horses are Handcrafted and Ergonomic.", sourceId: "claim1", claimId: "claim6" }] },
        { delay: 1500, nodes: [{ flowDataState, isNewNodePro: true, claimContent: "bears are Sleek and Ergonomic.", sourceId: "claim1", claimId: "claim7" }] },
        { delay: 1500, nodes: [{ flowDataState, isNewNodePro: false, claimContent: "dogs are Gorgeous and Oriental.", sourceId: "claim7", claimId: "claim8" }] },
    ]

    const playVideo = async () => {
        setIsPlaying(true);
        const abortController = new AbortController();
        setAbortController(abortController);

        try {
            for (let i = currentStep; i < tempNodeSequence.length; i++) {
                if (abortController.signal.aborted) break;
                addNodes(tempNodeSequence[i].nodes);
                setCurrentStep(i + 1);
                reactFlowInstance.fitView({ padding: 0.5, duration: 1500 }); // TODO delay seems a step behind (one node behind)
                await delay(tempNodeSequence[i].delay);
                if (abortController.signal.aborted) break;
            }
        } catch (error) {
            console.error('An error occurred during video playback', error);
        }

        setIsPlaying(false);
    };

    const pauseVideo = () => {
        abortController?.abort();
        setAbortController(null);
        setIsPlaying(false);
    };

    const stepForward = async () => {
        if (currentStep < tempNodeSequence.length) {
            addNodes(tempNodeSequence[currentStep].nodes);
            setCurrentStep(currentStep + 1);
            reactFlowInstance.fitView({ padding: 0.5, duration: 1500 });
        }
    };

    const reset = () => {
        const nodeActions: Array<ClaimActions> = flowDataState.displayNodes.map((node) => ({
            type: "delete",
            newData: { id: node.id, type: "claim" },
        }));
        const edgeActions: Array<ConnectorActions> = flowDataState.displayEdges.map((edge) => ({
            type: "delete",
            newData: { id: edge.id, type: "connector" },
        }));

        setCurrentStep(0);
        flowDataState.dispatch([...nodeActions, ...edgeActions]);
        reactFlowInstance.setViewport({ "x": -430, "y": 298, "zoom": 2 })
    };

    return (
        <div className='flex gap-2 absolute bottom-0 right-1/2 z-10'>
            <Button onClick={playVideo} disabled={isPlaying} icon={'play'} />
            <Button onClick={pauseVideo} disabled={!isPlaying} icon={'pause'} />
            <Button onClick={stepForward} disabled={isPlaying || currentStep >= tempNodeSequence.length} icon={'step-forward'} />
            <Button onClick={reset} icon={'reset'} />
        </div>
    );
};

export default VideoPlayer;