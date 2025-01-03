import React, { useContext } from "react";
import { DevContext, FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button, IconName, Divider } from "@blueprintjs/core";
import { ClaimActions, ConnectorActions } from "@/reasonScore/types/ActionTypes";
import { calculateScores } from "@/reasonScore/scoring/TypeA/calculateScores";
import { useReactFlow } from "reactflow";

const DevButton = ({
    label,
    icon,
    onClick,
}: {
    label: string;
    icon: IconName;
    onClick: () => void;
}) => {
    return (
        <Button
            className="w-full justify-start"
            onClick={onClick}
            icon={icon}
            minimal
            text={label}
        />
    );
};

const DevPanel = () => {
    const flowDataState = useContext(FlowDataContext);
    const dev = useContext(DevContext);
    const reactFlowInstance= useReactFlow()
    const deleteAll = () => {
        const nodeActions: Array<ClaimActions> = flowDataState.displayNodes.map((node) => ({
            type: "delete",
            newData: { id: node.id, type: "claim" },
        }));
        const edgeActions: Array<ConnectorActions> = flowDataState.displayEdges.map((edge) => ({
            type: "delete",
            newData: { id: edge.id, type: "connector" },
        }));

        flowDataState.dispatch([...nodeActions, ...edgeActions]);
    };

    return (
        <div >
            <Button
                hidden={dev.isDev}
                // className={"absolute top-0 right-0 focus:outline-none"}
                onClick={() => dev.setDevMode(true)}
                icon="chevron-left"
                minimal
                style={{opacity: 0.25}}

            >
                Dev
            </Button>
            <Drawer
                hasBackdrop={false}
                isOpen={dev.isDev}
                onClose={() => dev.setDevMode(false)}
                title="Dev"
                canOutsideClickClose={false}
                canEscapeKeyClose={true}
                position="right"
                size={"150px"}
                className={"bp5-dark"}
                usePortal={false}
                enforceFocus={false}
                autoFocus={false}
                style={
                    { position: "fixed" } // Odd that this is needed Otherwise the drawer is transparent
                }

            >
                <div className="flex flex-col space-y-2 mt-4">
                    {/* <DevButton
                        icon={"send-to-graph"}
                        onClick={() => addNode({ x })}
                        label={"Add Node"}
                    /> */}
                    <Divider />
                    <DevButton
                        icon={"console"}
                        onClick={() => console.log(flowDataState.displayNodes)}
                        label={"Nodes"}
                    />
                    <DevButton
                        icon={"console"}
                        onClick={() => console.log(flowDataState.displayEdges)}
                        label={"Edges"}
                    />
                    <DevButton
                        icon={"console"}
                        onClick={() => { console.log(flowDataState) }}
                        label={"DebateData"}
                    />
                    <Divider />
                    <DevButton
                        icon={"sort"}
                        onClick={() => {
                            const calcScore = calculateScores(flowDataState.debateData);
                            console.log(calcScore);
                        }}
                        label={"Calculate Score"}
                    />
                    <Divider />
                    <DevButton
                        onClick={deleteAll}
                        icon={"trash"}
                        label={"Delete All"}
                    />

                </div>
            </Drawer>
        </div>
    );
};

export default DevPanel;
