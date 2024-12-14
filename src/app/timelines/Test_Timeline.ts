import { ClaimActions, ConnectorActions } from "@/reasonScore/types/ActionTypes";
import { newClaim } from "@/reasonScore/types/Claim";
import { newConnector } from "@/reasonScore/types/Connector";
import { TimelineProps } from "./_timelines"

export const Test_Timeline = function (props: TimelineProps) {
    const { refs, gsap } = props

    function onUpdate(this: any) {
        //  console.log("onUpdate", this.vars.text, this.progress())
        const target = this.targets()[0];
        target.text = this.vars.text.substring(0, this.progress() * this.vars.text.length);
        // myObject.text = targetText.substring(0, length)
        refs.current.flowDataState.dispatch([{
            type: "modify", newData: {
                id: target.id,
                type: "claim",
                content: target.text,
            }
        }]);

    }

    let fitView = (seconds: number = 1) => {
        setTimeout(() => {
            refs.current.reactFlowInstance.fitView({ padding: 0.5, duration: seconds * 1000 });
        }, 50);
    }

    let tl = gsap.timeline({
        paused: true,
    });

    tl
        .to({ text: "", id: refs.current.flowDataState.debate.mainClaimId || "", }, {
            text: "first text",
            duration: 3,
            onUpdate: onUpdate
        })

        .to({ text: "", id: refs.current.flowDataState.debate.mainClaimId || "", }, {
            text: "This is the animated text!",
            duration: 3,
            onUpdate: onUpdate
        })

        .call(function (this: any) {
            // if (tl.progress() < lastProgress) {
            if (tl.time() < this.startTime()) {
                refs.current.flowDataState.dispatch([
                    { type: "delete", newData: { id: "1", type: "claim", } },
                    { type: "delete", newData: { id: "l1", type: "connector", } },
                    { type: "delete", newData: { id: "2", type: "claim", } },
                    { type: "delete", newData: { id: "l2", type: "connector", } }
                ])
                fitView(.3);
                return;
            }

            let actions = [];
            const newClaimData = newClaim({ content: "", id: "1" });
            newClaimData.forceConfidence = 0;
            const claimAction: ClaimActions = {
                type: "add",
                newData: { ...newClaimData, pol: "con" },
            };

            const newClaimData2 = newClaim({ content: "", id: "2" });
            const claimAction2: ClaimActions = {
                type: "add",
                newData: { ...newClaimData2, pol: "pro" },
            };

            actions.push(claimAction, claimAction2);

            const newConnectorData = newConnector({
                id: "l1",
                source: newClaimData.id,
                target: refs.current.flowDataState.debate.mainClaimId as string,
                proTarget: false,
                affects: "confidence"
            });
            const connectorAction: ConnectorActions = {
                type: "add",
                newData: newConnectorData,
            };
            const newConnectorData2 = newConnector({
                id: "l2",
                source: newClaimData2.id,
                target: refs.current.flowDataState.debate.mainClaimId as string,
                proTarget: true,
                affects: "confidence"
            });
            const connectorAction2: ConnectorActions = {
                type: "add",
                newData: newConnectorData2,
            };

            actions.push(connectorAction, connectorAction2);
            refs.current.flowDataState.dispatch(actions);

            fitView();

        }, [], ">1.001")

        .to({ text: "", id: "1", }, {
            text: "Second Animated Text",
            duration: 3,
            onUpdate: onUpdate
        })

        .to({}, {
            duration: 10,
            onUpdate: function (this: any) {

                refs.current.flowDataState.dispatch([{
                    type: "modify", newData: {
                        id: "1",
                        type: "claim",
                        forceConfidence: this.progress(),
                    }
                }]);

            }
        })

    return {
        name: "Test",
        id: "Test_Timeline",
        timeline: tl
    }
}