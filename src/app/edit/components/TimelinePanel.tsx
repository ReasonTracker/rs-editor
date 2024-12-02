import React, { use, useContext, useRef, useState } from "react";
import { FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button, Slider } from "@blueprintjs/core";
import { useReactFlow } from "reactflow";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { newClaim } from "@/reasonScore/types/Claim";
import { ClaimActions, ConnectorActions } from "@/reasonScore/types/ActionTypes";
import { newConnector } from "@/reasonScore/types/Connector";
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

    useGSAP(() => {
        let tl = gsap.timeline({
            paused: true,
            onUpdate: () => {
                setsliderValue(tl.progress());
            }
        })
        timelineRef.current = tl;
        tl
            .to({ text: "", id: flowDataState.debate.mainClaimId || "", }, {
                text: "This is the animated text!",
                duration: 3,
                onUpdate: onUpdate
            })

            .call(function () {
                let actions = [];

                const newClaimData = newClaim({ content: "", id: "1"});
                const claimAction: ClaimActions = {
                    type: "add",
                    newData: { ...newClaimData, pol:"pro" },
                };
            
                actions.push(claimAction);
                const newConnectorData = newConnector({
                    source: newClaimData.id,
                    target: flowDataState.debate.mainClaimId as string,
                    proTarget: true,
                    affects: "confidence"
                });
                const connectorAction: ConnectorActions = {
                    type: "add",
                    newData: newConnectorData,
                };
            
                actions.push(connectorAction);
                flowDataState.dispatch(actions);

                setTimeout(() => {
                    reactFlowInstance.fitView();
                }, 500);

            }, [], ">1")
        
        
            .to({ text: "", id: "1", }, {
                text: "Second ANimated Text",
                duration: 3,
                onUpdate: onUpdate
            })
            // .call(function () {
            //     console.log("called2", tl.progress())
            // }, [], ">1")


        // tl.progress(sliderValue);
    }, { dependencies: [] });

    function onUpdate(this: any) {
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
    };

    const pauseTimeline = () => {
        timelineRef.current.pause();
    };

    const resetTimeline = () => {
        timelineRef.current.restart();
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


