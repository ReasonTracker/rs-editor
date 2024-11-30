import React, { useContext, useState } from "react";
import { FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button } from "@blueprintjs/core";
import { useReactFlow } from "reactflow";
import { gsap } from "gsap";
// import { TextPlugin } from "gsap/TextPlugin";
// gsap.registerPlugin(TextPlugin)

const TimelinePanel = () => {
    const flowDataState = useContext(FlowDataContext);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const reactFlowInstance = useReactFlow()

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
                title="Files"
                canOutsideClickClose={false}
                canEscapeKeyClose={true}
                position="bottom"
                size={"100px"}
                className={"bp5-dark"}
                usePortal={false}
                enforceFocus={false}
                autoFocus={false}
                style={
                    { position: "fixed" } // Odd that this is needed Otherwise the drawer is transparent
                }
            >

                <Button
                    onClick={() => {
                        const dummyObject = { text: "" };
                        var tl = gsap.timeline({});
                        tl.to(dummyObject, {
                            text: "This is the animated text!",
                            duration: 3,
                            onUpdate: onUpdate
                            // flowDataState.dispatch([{
                            //     type: "modify", newData: {
                            //         id: flowDataState.debate.mainClaimId || "",
                            //         type: "claim",
                            //         content: dummyObject.text,
                            //     }
                            // }]);
                            // @ts-ignore
                            //     console.log(this);
                            // },
                            // modifiers: {
                            //     text: (value) => {
                            //         console.log("value:",value);
                            //     // Ensure progressive updates for plain object
                            //     const target = "This is the animated text!";
                            //     const length = Math.min(value.length, target.length);
                            //     return target.substring(0, length);
                            //   },
                            // },
                        });

                        function onUpdate(this: any) {
                            const target = this.targets()[0];
                            target.text = this.vars.text.substring(0, this.progress() * this.vars.text.length);
                            // myObject.text = targetText.substring(0, length)
                            console.log(target.text);
                            flowDataState.dispatch([{
                                type: "modify", newData: {
                                    id: flowDataState.debate.mainClaimId || "",
                                    type: "claim",
                                    content: target.text,
                                }
                            }]);

                        }

                    }}
                    style={{
                        width: "min-content",
                        marginLeft: "50px",
                        marginTop: "10px",
                    }}
                >
                    Test
                </Button>

            </Drawer>
        </div>
    );
};

export default TimelinePanel;
