'use client'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlowDataContext } from './FlowDataProvider';
import addNodes, { AddNodeType, typeOutContent } from '../utils/addNodes';
import { Button, HTMLSelect } from '@blueprintjs/core';
import { useReactFlow } from 'reactflow';
import { ClaimActions, ConnectorActions } from '@/reasonScoreNext/ActionTypes';
import { animalAudioUrl, getAnimalSequence } from '../data/demo-animal-flow';
import { newId } from '@/reasonScoreNext/newId';
import { fictionalCityAudioUrl, fictionalCitySequence } from '../data/fictional-city-flow';


type AudioClip = {
    start: number,
    end: number,
    delay?: number | true
}

interface SequenceGroup {
    id: string;
    label: string;
    sequence: SequenceStep[];
    audioUrl: string
}

export type SequenceStep = {
    delay?: number,
    nodes?: AddNodeType[],
    audio?: AudioClip
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


const VideoPlayer = () => {
    const flowDataState = useContext(FlowDataContext);
    const reactFlowInstance = useReactFlow();
    const [isPlaying, setIsPlaying] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [sequenceGroups, setSequenceGroups] = useState<SequenceGroup[] | null>(null);
    
    const mainClaimId = flowDataState.debate.mainClaimId || newId()
    
    const fictionalCitySequenceGroup = {
        id: "fictional-city",
        label: "Fictional City Flow",
        sequence: fictionalCitySequence(mainClaimId),
        audioUrl: fictionalCityAudioUrl
    }
    const demoAnimalSequenceGroup = {
        id: "demo-animal",
        label: "Demo Animal Flow",
        sequence: getAnimalSequence(mainClaimId),
        audioUrl: animalAudioUrl
    }
    const [selectedSequenceGroup, setSelectedSequenceGroup] = useState<SequenceGroup>(fictionalCitySequenceGroup);

    useEffect(() => {
        setSequenceGroups([demoAnimalSequenceGroup, fictionalCitySequenceGroup]);
    }, []);

    useEffect(() => {
        const controller = abortController;
        return () => controller?.abort();
    }, [abortController]);

    const handleSequenceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const sequence = sequenceGroups?.find(seq => seq.id === event.target.value);
        if (sequence) setSelectedSequenceGroup(sequence);
    };



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

    const handleAudioPlayback = async ({ audio, sequence }: { audio: AudioClip, sequence: SequenceStep }) => {
        if (!audioRef.current || !audio) return;

        if (audio?.delay) {
            if (audio.delay === true) await delay(sequence.delay || 0)
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

        const sequence = selectedSequenceGroup?.sequence || []
        try {
            for (let i = currentStep; i < sequence.length; i++) {
                if (abortController.signal.aborted) break;
                const sequenceStep = sequence[i]
                const audio = sequenceStep.audio

                const toRun = []
                if (audio) toRun.push(handleAudioPlayback({ audio, sequence: sequenceStep }));
                if (sequenceStep.nodes)
                    toRun.push(
                        addNodes({
                            flowDataState,
                            nodes: sequenceStep.nodes || [],
                            options: {
                                fitView: { reactFlowInstance, duration: sequenceStep.delay, padding: 0.5, },
                                typeOut: { typeOutDelay: 100 },
                            },
                        })
                    );
                await Promise.all(toRun)

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
        const sequence = selectedSequenceGroup?.sequence || []
        if (currentStep < sequence.length) {
            const sequenceStep = sequence[currentStep]
            const delay = sequenceStep.delay
            const audio = sequenceStep.audio

            const toRun = []
            if (audio) toRun.push(handleAudioPlayback({ audio, sequence: sequenceStep }));
            if (sequenceStep.nodes)
                toRun.push(
                    addNodes({
                        flowDataState,
                        nodes: sequence[currentStep].nodes || [],
                        options: {
                            fitView: { reactFlowInstance, duration: delay, padding: 0.5 },
                            typeOut: { typeOutDelay: delay || 0 }
                        },
                    }));
            await Promise.all(toRun)

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
            <audio ref={audioRef} src={selectedSequenceGroup?.audioUrl} />
            <HTMLSelect
                options={sequenceGroups?.map(seq => ({label: seq.label, value: seq.id}))}
                onChange={handleSequenceChange}
                value={selectedSequenceGroup?.id}
                iconName={'caret-down'}
                
            />
            <Button onClick={playVideo} disabled={isPlaying || !selectedSequenceGroup?.sequence?.length} icon={'play'} />
            <Button onClick={pauseVideo} disabled={!isPlaying} icon={'pause'} />
            <Button onClick={stepForward} disabled={isPlaying || currentStep >= (selectedSequenceGroup?.sequence?.length || 0)} icon={'step-forward'} />
            <Button onClick={reset} icon={'reset'} />
        </div>
    );
};

export default VideoPlayer;