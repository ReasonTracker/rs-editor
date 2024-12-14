import React, { use, useContext, useEffect, useRef, useState } from "react";
import { FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button, Slider } from "@blueprintjs/core";
import { useReactFlow } from "reactflow";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { newClaim } from "@/reasonScore/types/Claim";
import { ClaimActions, ConnectorActions } from "@/reasonScore/types/ActionTypes";
import { newConnector } from "@/reasonScore/types/Connector";
import { time } from "console";
import { timelines } from "@/app/timelines/_timelines";
import { Test_Timeline } from "@/app/timelines/Test_Timeline";
// import { TextPlugin } from "gsap/TextPlugin";
// gsap.registerPlugin(TextPlugin)

const buttonStyle = {
    width: "min-content",
    margin: "10px",
    display: "inline-block",
}

const TimelinePanel = () => {
    const flowDataState = useContext(FlowDataContext);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const reactFlowInstance = useReactFlow()
    const [sliderValue, setsliderValue] = useState(0)
    const timelineRef = useRef<any>(null);

    const refs = useRef({ flowDataState, reactFlowInstance });

    useEffect(() => {
        refs.current = { flowDataState, reactFlowInstance };
    }, [flowDataState, reactFlowInstance, timelineRef]);

    useGSAP(() => {
        // let tl = gsap.timeline({
        //     paused: true,
        //     onUpdate: () => {
        //         setsliderValue(tl.progress());
        //     }
        // })
        // timelineRef.current = tl;
        // tl
        //     .to({ text: "", id: flowDataState.debate.mainClaimId || "", }, {
        //         text: "first text",
        //         duration: 3,
        //         onUpdate: onUpdate
        //     })

        //     .to({ text: "", id: flowDataState.debate.mainClaimId || "", }, {
        //         text: "This is the animated text!",
        //         duration: 3,
        //         onUpdate: onUpdate
        //     })

        //     .call(function (this: any) {
        //         // if (tl.progress() < lastProgress) {
        //         if (tl.time() < this.startTime()) {
        //             flowDataState.dispatch([
        //                 { type: "delete", newData: { id: "1", type: "claim", } },
        //                 { type: "delete", newData: { id: "l1", type: "connector", } },
        //                 { type: "delete", newData: { id: "2", type: "claim", } },
        //                 { type: "delete", newData: { id: "l2", type: "connector", } }
        //             ])
        //             fitView(.3);
        //             return;
        //         }

        //         let actions = [];
        //         const newClaimData = newClaim({ content: "", id: "1" });
        //         newClaimData.forceConfidence = 0;
        //         const claimAction: ClaimActions = {
        //             type: "add",
        //             newData: { ...newClaimData, pol: "con" },
        //         };

        //         const newClaimData2 = newClaim({ content: "", id: "2" });
        //         const claimAction2: ClaimActions = {
        //             type: "add",
        //             newData: { ...newClaimData2, pol: "pro" },
        //         };

        //         actions.push(claimAction, claimAction2);

        //         const newConnectorData = newConnector({
        //             id: "l1",
        //             source: newClaimData.id,
        //             target: flowDataState.debate.mainClaimId as string,
        //             proTarget: false,
        //             affects: "confidence"
        //         });
        //         const connectorAction: ConnectorActions = {
        //             type: "add",
        //             newData: newConnectorData,
        //         };
        //         const newConnectorData2 = newConnector({
        //             id: "l2",
        //             source: newClaimData2.id,
        //             target: flowDataState.debate.mainClaimId as string,
        //             proTarget: true,
        //             affects: "confidence"
        //         });
        //         const connectorAction2: ConnectorActions = {
        //             type: "add",
        //             newData: newConnectorData2,
        //         };

        //         actions.push(connectorAction,connectorAction2);
        //         flowDataState.dispatch(actions);

        //         fitView();

        //     }, [], ">1.001")

        //     .to({ text: "", id: "1", }, {
        //         text: "Second Animated Text",
        //         duration: 3,
        //         onUpdate: onUpdate
        //     })

        //     .to({}, {
        //         duration: 10,
        //         onUpdate:function(this: any) {

        //             flowDataState.dispatch([{
        //                 type: "modify", newData: {
        //                     id: "1",
        //                     type: "claim",
        //                     forceConfidence: this.progress(),
        //                 }
        //             }]);

        //         } 
        //     })


        // let fitView = (seconds: number = 1) => {
        //     setTimeout(() => {
        //         refs.current.reactFlowInstance.fitView({ padding: 0.5, duration: seconds * 1000 });
        //     }, 50);
        // }

        // tl.progress(sliderValue)



        const newTimelineData = timelines.Test_Timeline({
            dispatch: flowDataState.dispatch,
            refs,
            gsap,
        })
        newTimelineData.timeline.eventCallback("onUpdate", function (this:any) {
            setsliderValue(this.progress());
        })
        timelineRef.current = newTimelineData.timeline;
    }, { dependencies: [] });

    function onUpdate(this: any) {
        //  console.log("onUpdate", this.vars.text, this.progress())
        const target = this.targets()[0];
        target.text = this.vars.text.substring(0, this.progress() * this.vars.text.length);
        // myObject.text = targetText.substring(0, length)
        flowDataState.dispatch([{
            type: "modify", newData: {
                id: target.id,
                type: "claim",
                content: target.text,
            }
        }]);

    }

    const playTimeline = () => {
        timelineRef.current.play();
        console.log("timelineRef.current", timelineRef.current)
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
                    <Button
                        onClick={() => {


                        }}
                        style={buttonStyle}
                    >
                        Test
                    </Button>
                    <Button style={buttonStyle} onClick={playTimeline}>Play</Button>
                    <Button style={buttonStyle} onClick={pauseTimeline}>Pause</Button>
                    <Button style={buttonStyle} onClick={resetTimeline}>Reset</Button>
                    <Button style={buttonStyle} onClick={reverseTimeline}>Reverse</Button>

                </div>
                <div style={{ padding: '0 30px' }}>
                    <Slider
                        min={0}
                        max={1}
                        stepSize={0.01}
                        onRelease={(value: number) => { timelineRef.current.progress(value) }}
                        value={sliderValue}
                    // vertical={false}
                    />
                </div>

            </Drawer>
        </div>
    );
};

export default TimelinePanel;


