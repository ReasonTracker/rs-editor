import React, { useContext, useEffect, useRef, useState } from "react";
import { FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button, Slider } from "@blueprintjs/core";
import { useReactFlow } from "reactflow";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { timelines } from "@/app/timelines/_timelines";

const buttonStyle = {
    // width: "min-content",
    margin: "10px",
    display: "inline-block",
}

const TimelinePanel = () => {
    const flowDataState = useContext(FlowDataContext);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const reactFlowInstance = useReactFlow()
    const [sliderValue, setsliderValue] = useState(0)
    const [timeline, _setTimeline] = useState<gsap.core.Timeline | null>(null);
    const timelineRef = useRef<any>(null);

    const refs = useRef({ flowDataState, reactFlowInstance });

    useEffect(() => {
        refs.current = { flowDataState, reactFlowInstance };
    }, [flowDataState, reactFlowInstance, timelineRef]);

    const { contextSafe } = useGSAP(() => { });

    const setTimeline = contextSafe((id?: string) => {
        if (timelineRef.current) {
            timelineRef.current.kill();
        }
        let newTimeline = null;
        if (id) {
            newTimeline = timelines[id].timelineConstructor({
                dispatch: flowDataState.dispatch,
                refs,
                gsap,
            })
            newTimeline.eventCallback("onUpdate", function (this: any) {
                setsliderValue(this.time());
            })
        }

        timelineRef.current = newTimeline;
        _setTimeline(newTimeline);
    })

    const playTimeline = () => {
        timelineRef.current.play();
    };

    const pauseTimeline = () => {
        timelineRef.current.pause();
    };

    const resetTimeline = () => {
        timelineRef.current.progress(0);
    };

    const reverseTimeline = () => {
        timelineRef.current.reverse();
    };

    return (
        <div>
            <Button
                onClick={() => {
                    setIsPanelOpen(!isPanelOpen)
                }}
                icon="chevron-left"
                minimal
                style={{ opacity: 0.25 }}
            >
                Timeline
            </Button>
            <Drawer
                hasBackdrop={false}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                canOutsideClickClose={false}
                canEscapeKeyClose={true}
                position="bottom"
                size={"200px"}
                className={"bp5-dark"}
                usePortal={false}
                enforceFocus={false}
                autoFocus={false}
                style={
                    { position: "fixed" } // Odd that this is needed Otherwise the drawer is transparent
                }
            >
                <div>
                    <select
                        onChange={(e) => setTimeline(e.target.value)}
                        style={{ margin: "10px", padding: "5px" }}
                    >
                        <option key="" value="">
                            choose a timeline
                        </option>
                        {Object.values(timelines).map((tl) => (
                            <option key={tl.id} value={tl.id}>
                                {tl.name}
                            </option>
                        ))}
                    </select>
                    {timeline && <>
                        <Button style={buttonStyle} onClick={playTimeline}>Play</Button>
                        <Button style={buttonStyle} onClick={pauseTimeline}>Pause</Button>
                        <Button style={buttonStyle} onClick={resetTimeline}>Reset</Button>
                        <Button style={buttonStyle} onClick={reverseTimeline}>Reverse</Button>
                    </>}
                </div>
                {timeline && <>

                    <div style={{ padding: '0 30px' }}>
                        <Slider
                            min={0}
                            max={timeline?.duration() || 1}
                            stepSize={0.1}
                            onRelease={(value: number) => { timelineRef.current.time(value) }}
                            value={sliderValue}
                        // vertical={false}
                        />
                    </div>
                </>}

                <div style={{ padding: '10px' }}>
                    <p>{`${JSON.stringify(reactFlowInstance.getViewport())}`}</p>
                </div>

            </Drawer>
        </div>
    );
};

export default TimelinePanel;


