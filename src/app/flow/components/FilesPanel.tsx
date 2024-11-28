import React, { useContext, useState } from "react";
import { DevContext, FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button, IconName, Divider } from "@blueprintjs/core";
import { ActionTypes, ClaimActions, ConnectorActions } from "@/reasonScoreNext/ActionTypes";
import { calculateScores } from "@/reasonScoreNext/scoring/TypeA/calculateScores";
import saveToLocalFile from "@/utils/localFiles/saveToLocalFile";
import readFromLocalFile from "@/utils/localFiles/readFromLocalFile";
import { Claim, newClaim } from "@/reasonScoreNext/Claim";
import generateSimpleAnimalClaim from "../utils/generateClaimContent";
import { Connector } from "@/reasonScoreNext/Connector";

const FilesPanelButton = ({
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

const FilesPanel = () => {
    const flowDataState = useContext(FlowDataContext);
    const dev = useContext(DevContext);
    const [isPanelOpen,setIsPanelOpen] = useState(false);

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
        <div className="bp5-dark">
            <Button
                hidden={isPanelOpen}
                className={"absolute bottom-0 right-0 focus:outline-none"}
                onClick={() =>{
                    console.log("open panel")
                    setIsPanelOpen(true)}}
                icon="chevron-left"
                minimal
            >
                Files
            </Button>
            <Drawer
                hasBackdrop={false}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Files"
                canOutsideClickClose={false}
                canEscapeKeyClose={true}
                position="right"
                size={"200px"}
                className={"bp5-dark"}
                usePortal={false}
                enforceFocus={false}
                autoFocus={false}
            >
                <div className="flex flex-col space-y-2 mt-4">

                    <FilesPanelButton
                        onClick={() => {
                            const {debate,debateData } = flowDataState
                            saveToLocalFile(JSON.stringify({
                                debate,
                                debateData
                            }), "debateData.json");
                        }}
                        icon={"console"}
                        label={"Save Data to a file"}
                    />

                    <FilesPanelButton
                        onClick={async () => {
                            console.log("reading from file");
                            const data = await readFromLocalFile().catch((e) => {
                                console.error(e);
                            }) as {
                                debateData: { claims: Claim[], connectors: Connector[] }
                            };;

                            deleteAll();
                            let actions: ActionTypes[] = [];
                            for (const claim of Object.values(data.debateData.claims)) { 
                                const claimAction: ClaimActions = {
                                    type: "add",
                                    newData: claim,
                                };
                                actions.push(claimAction);
                            }

                            for (const connector of Object.values(data.debateData.connectors)) { 
                                const connectorAction: ConnectorActions = {
                                    type: "add",
                                    newData: connector,
                                };
                                actions.push(connectorAction);
                            }

                            flowDataState.dispatch(actions);

                        }}
                        icon={"console"}
                        label={"load Data from a file"}
                    />

                </div>
            </Drawer>
        </div>
    );
};

export default FilesPanel;
