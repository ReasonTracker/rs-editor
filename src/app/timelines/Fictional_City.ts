import { ClaimActions, ConnectorActions } from "@/reasonScore/types/ActionTypes";
import { Claim, newClaim } from "@/reasonScore/types/Claim";
import { newConnector } from "@/reasonScore/types/Connector";
import { timelineMeta, TimelineProps } from "./_timelines"
import { Debate } from "@/reasonScore/types/Debate";
import { DebateData } from "@/reasonScore/types/DebateData";

export const Fictional_City: timelineMeta = {
    name: "Fictional City",
    id: "Fictional_City",
    timelineConstructor: function (props: TimelineProps) {
        const { refs, gsap } = props

        function typeContent(this: any) {
            //  console.log("onUpdate", this.vars.text, this.progress())
            const target = this.targets()[0];
            //target.text = this.vars.text.substring(0, this.progress() * this.vars.text.length);
            // myObject.text = targetText.substring(0, length)
            refs.current.flowDataState.dispatch([{
                type: "modify", newData: {
                    id: target.id,
                    type: "claim",
                    content: this.vars.content.substring(0, this.progress() * this.vars.content.length),
                    forceConfidence: this.progress(),
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

        const timelineItems: (
            { actionType: "debate", debate: Debate, debateData: DebateData } |
            { actionType: "pause", duration: number, } |
            ({ actionType: "updateClaim", duration: number, parentId?: string } & Partial<Claim>) |
            ({ actionType: "createClaim", duration: number, parentId: string, zoom?: "fitView", affects?: "relevance" } & Partial<Claim>)
        )[] = [
                {
                    actionType: "debate",
                    debate: { type: "debate", name: "", description: "", id: "Fictional_City", mainClaimId: "motion" },
                    debateData: {
                        claims: {
                            "motion": { type: "claim", id: "motion", content: "", pol: "pro" }
                        },
                        connectors: {}
                    }
                },
                {
                    actionType: "updateClaim",
                    content: "Would Fictional City benefit overall from converting Elm Street to pedestrian use only?",
                    id: "motion",
                    duration: 2,
                },
                { actionType: "pause", duration: 2, },
                {
                    actionType: "createClaim",
                    content: "increase foot traffic to local shops by 12%",
                    id: "footTraffic", parentId: "motion", type: "claim", pol: "pro",
                    duration: 2, zoom: "fitView",
                },
                { actionType: "pause", duration: 2, },
                // {
                //     content: "Costs 2 Million dollars.",
                //     actionType: "createClaim",
                //     id: "cost", parentId: "motion", type: "claim", pol: "con",
                //     duration: 2, zoom: "fitView",
                // },
                { actionType: "pause", duration: 2, },
                {
                    actionType: "createClaim",
                    content: "divert traffic down residential streets",
                    id: "traffic", parentId: "motion", type: "claim", pol: "con",
                    duration: 2, zoom: "fitView",
                },
                { actionType: "pause", duration: 2, },
                {
                    actionType: "createClaim",
                    content: "Children safety is more important than profit for local shops.",
                    id: "SafetyImportance", parentId: "traffic", type: "claim", pol: "con", affects: "relevance",
                    duration: 2, zoom: "fitView",
                },
                { actionType: "pause", duration: 2, },
                {
                    actionType: "createClaim",
                    content: "A set of railroad tracks are no longer in use and the City can convert that to a new street.",
                    id: "railroad", parentId: "traffic", type: "claim", pol: "pro",
                    duration: 2, zoom: "fitView",
                },
                { actionType: "pause", duration: 2, },
                {
                    actionType: "createClaim",
                    content: "Costs 2 Million dollars.",
                    id: "costs", parentId: "motion", type: "claim", pol: "con",
                    duration: 2, zoom: "fitView",
                },
            ]


        timelineItems.forEach((item) => {
            if (item.actionType === "debate") {
                // ToDo , in the future we might need to do this at a particular time in the timeline and undo it , but for now we assume it only happens once at the beginning
                refs.current.flowDataState.dispatchReset([], item.debateData, item.debate)
                return;
            }

            if (item.actionType === "pause") {
                tl.to({}, { duration: item.duration })
                return;
            }

            if (item.actionType === "updateClaim") {
                tl.to({ content: "", id: item.id || "", }, {
                    content: item.content,
                    duration: item.duration,
                    onUpdate: typeContent,
                    onComplete: function (this: any) {
                        const target = this.targets()[0];
                        refs.current.flowDataState.dispatch([{
                            type: "modify", newData: {
                                id: target.id,
                                type: "claim",
                                content: this.vars.content,
                                forceConfidence: undefined,
                            }
                        }]);
                    }
                })
                return;
            }

            if (item.actionType === "createClaim") {

                tl.to(item, {
                    content: item.content,
                    duration: item.duration,
                    onUpdate: function (this: any) {

                        // If the time is before then delete the claim
                        if (tl.time() < this.startTime()) {
                            refs.current.flowDataState.dispatch([
                                { type: "delete", newData: { id: item.id || "", type: "claim", } },
                                { type: "delete", newData: { id: "c-" + item.id || "", type: "connector", } },
                            ])
                            return;
                        }

                        // If the claim does not exist, then create the claim and the connector
                        if (!refs.current.flowDataState.debateData.claims[item.id || ""]) {
                            const newClaimData = newClaim({ content: "", id: item.id || "" });
                            const claimAction: ClaimActions = {
                                type: "add",
                                newData: { ...newClaimData, pol: item.pol || "pro" },
                            };

                            const parent = refs.current.flowDataState.debateData.claims[item.parentId || ""]

                            const newConnectorData = newConnector({
                                id: "c-" + item.id || "",
                                source: item.id || "",
                                target: item.parentId,
                                proTarget: item.pol === parent.pol,
                                affects: item.affects ?? "confidence"
                            });
                            const connectorAction: ConnectorActions = {
                                type: "add",
                                newData: newConnectorData
                            }
                            refs.current.flowDataState.dispatch([claimAction, connectorAction])

                            if (item.zoom === "fitView") {
                                fitView();
                            }
                        }
                        typeContent.bind(this)()

                    },
                    onComplete: function (this: any) {
                        const target = this.targets()[0];
                        refs.current.flowDataState.dispatch([{
                            type: "modify", newData: {
                                id: target.id,
                                type: "claim",
                                content: this.vars.content,
                                forceConfidence: undefined,
                            }
                        }]);
                    }
                })
            }
            // Which direction are we going and is it a seek
            // Does the claim need to be there or not
            // If it needs to be there does it exist or do I need to create it?
            // If it need to not be there does it not exist or do I need to delete it?
        })

        return tl
    }
}