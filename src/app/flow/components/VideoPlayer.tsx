'use client'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlowDataContext } from './FlowDataProvider';
import addNodes, { AddNodeType, typeOutContent } from '../utils/addNodes';
import { Button } from '@blueprintjs/core';
import { useReactFlow } from 'reactflow';
import { ClaimActions, ConnectorActions } from '@/reasonScoreNext/ActionTypes';


type AudioClipType = {
    start: number,
    end: number,
    delay?: number | true
}
type SequenceType = {
    delay: number,
    nodes: AddNodeType[],
    audio?: AudioClipType
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const VideoPlayer = () => {
    const flowDataState = useContext(FlowDataContext);
    const reactFlowInstance = useReactFlow();
    const [isPlaying, setIsPlaying] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const controller = abortController;
        return () => controller?.abort();
    }, [abortController]);

    const mainClaim = flowDataState.debate.mainClaimId
    const tempNodeSequence: SequenceType[] = [
        { delay: 1500, nodes: [{ isNewNodePro: true, claimContent: "insects are Gorgeous and Handcrafted.", claimId: mainClaim }], audio: { start: 0, end: 5, delay: true } },
        { delay: 1500, nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "cats are Small and Gorgeous.", sourceId: mainClaim, claimId: "claim1" }], audio: { start: 10, end: 15, delay: true } },
        { delay: 1500, nodes: [{ targetNodePolarity: "pro", isNewNodePro: true, claimContent: "birds are Bespoke and Unbranded.", sourceId: mainClaim, claimId: "claim2" }], audio: { start: 15, end: 20, delay: true } },
        { delay: 1000, nodes: [{ targetNodePolarity: "pro", isNewNodePro: true, claimContent: "cetaceans are Bespoke and Recycled.", sourceId: mainClaim, claimId: "claim3" }], audio: { start: 20, end: 25, delay: true } },
        { delay: 1500, nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "cetaceans are Small and Elegant.", sourceId: mainClaim, claimId: "claim4" }], audio: { start: 30, end: 35, delay: true } },
        { delay: 1500, nodes: [{ targetNodePolarity: "pro", isNewNodePro: true, claimContent: "snakes are Incredible and Bespoke.", sourceId: "claim1", claimId: "claim5" }], audio: { start: 40, end: 45, delay: true } },
        { delay: 1000, nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "horses are Handcrafted and Ergonomic.", sourceId: "claim1", claimId: "claim6" }], audio: { start: 50, end: 55, delay: true } },
        { delay: 1500, nodes: [{ targetNodePolarity: "pro", isNewNodePro: true, claimContent: "bears are Sleek and Ergonomic.", sourceId: "claim1", claimId: "claim7" }], audio: { start: 60, end: 65, delay: true } },
        { delay: 1500, nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "dogs are Gorgeous and Oriental.", sourceId: "claim7", claimId: "claim8" }], audio: { start: 65, end: 70, delay: true } },
    ]

    const manageAudio = (action: 'play' | 'pause') => {
        if (!audioRef.current) return;
        if (action === 'play') audioRef.current.play();
        if (action === 'pause') audioRef.current.pause();
    };

    const manageAudioListeners = (action: 'add' | 'remove', callback?: () => void) => {
        if (!audioRef.current || !callback) return;
        if (action === 'add') audioRef.current.addEventListener('timeupdate', callback);
        if (action === 'remove') audioRef.current.removeEventListener('timeupdate', callback);
    };

    const handleAudioPlayback = async ({ audio, sequence }: { audio: AudioClipType, sequence: SequenceType }) => {
        if (!audioRef.current || !audio) return;

        if (audio?.delay) {
            if (audio.delay === true) await delay(sequence.delay)
            if (typeof audio.delay === 'number') await delay(audio.delay)
        }

        audioRef.current.currentTime = audio.start;
        manageAudio('play');
        await new Promise<void>((resolve) => {
            const onTimeUpdate = () => {
                if (!audioRef.current || audioRef.current.currentTime >= audio.end) {
                    manageAudio('pause');
                    manageAudioListeners('remove', onTimeUpdate);
                    resolve();
                }
            };
            manageAudioListeners('add', onTimeUpdate);
        });
    };

    const playVideo = async () => {
        setIsPlaying(true);
        const abortController = new AbortController();
        setAbortController(abortController);

        try {
            for (let i = currentStep; i < tempNodeSequence.length; i++) {
                if (abortController.signal.aborted) break;
                const sequence = tempNodeSequence[i]
                const audio = sequence.audio

                if (audio) handleAudioPlayback({ audio, sequence });

                await addNodes({
                    flowDataState,
                    nodes: sequence.nodes,
                    options: {
                        fitView: { reactFlowInstance, duration: sequence.delay, padding: 0.5 },
                        typeOut: { typeOutDelay: 100 }
                    },
                });

                setCurrentStep(i + 1);
                await delay(2000)
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
            const sequence = tempNodeSequence[currentStep]
            const delay = sequence.delay
            const audio = sequence.audio

            if (audio) handleAudioPlayback({ audio, sequence });

            addNodes({
                flowDataState,
                nodes: tempNodeSequence[currentStep].nodes,
                options: {
                    fitView: { reactFlowInstance, duration: delay, padding: 0.5 },
                    typeOut: { typeOutDelay: delay }
                },
            });
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
            <audio ref={audioRef} src="/dev/monolog.webm" />
            <Button onClick={playVideo} disabled={isPlaying} icon={'play'} />
            <Button onClick={pauseVideo} disabled={!isPlaying} icon={'pause'} />
            <Button onClick={stepForward} disabled={isPlaying || currentStep >= tempNodeSequence.length} icon={'step-forward'} />
            <Button onClick={reset} icon={'reset'} />
        </div>
    );
};

export default VideoPlayer;