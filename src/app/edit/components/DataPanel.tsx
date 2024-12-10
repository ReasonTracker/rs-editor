import React, { useContext, useState } from "react";
import { FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button, IconName, TextArea } from "@blueprintjs/core";
import saveToLocalFile from "@/utils/localFiles/saveToLocalFile";
import readFromLocalFile from "@/utils/localFiles/readFromLocalFile";
import { useReactFlow } from "reactflow";
import { Debate } from "@/reasonScore/types/Debate";
import { DebateData } from "@/reasonScore/types/DebateData";
import { Claim } from "@/reasonScore/types/Claim";
import { createDict } from "@/utils/createDict";

const DataPanelButton = ({
    label,
    onClick,
}: {
    label: string;
    onClick: () => void;
}) => {
    return (
        <Button
            className="w-full justify-start"
            onClick={onClick}
            text={label}
        />
    );
};

const DataPanel = () => {
    const flowDataState = useContext(FlowDataContext);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const reactFlowInstance = useReactFlow()

    return (
        <div>
            <Button
                hidden={isPanelOpen}
                // className={"absolute bottom-0 right-0 focus:outline-none"}
                onClick={() => {
                    console.log("open panel")
                    setIsPanelOpen(true)
                }}
                icon="chevron-left"
                minimal
                style={{ opacity: 0.25 }}
            >
                Data
            </Button>
            <Drawer
                hasBackdrop={false}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Data"
                canOutsideClickClose={false}
                canEscapeKeyClose={true}
                position="right"
                size={"200px"}
                className={"bp5-dark"}
                usePortal={false}
                enforceFocus={false}
                autoFocus={false}
                style={{
                    position: "fixed", // Odd that this is needed Otherwise the drawer is transparent
                }}
            >
                <div className="flex flex-col space-y-2 mt-4"
                    style={{ padding: "0 .5rem" }}
                >

<h1>Local Files</h1>

                    <DataPanelButton
                        onClick={() => {
                            const { debate, debateData } = flowDataState
                            saveToLocalFile(JSON.stringify({
                                debate,
                                debateData
                            }), "debateData.json");
                        }}
                        label={"Save Data to a file"}
                    />

                    <DataPanelButton
                        onClick={async () => {
                            console.log("reading from file");
                            const { debate, debateData } = await readFromLocalFile().catch((e) => {
                                console.error(e);
                            }) as { debate: Debate, debateData: DebateData };

                            flowDataState.dispatchReset([], debateData, debate);

                            setTimeout(() => {
                                reactFlowInstance.fitView();
                            }, 500);
                        }}
                        label={"load Data from a file"}
                    />

                    <DataPanelButton
                        onClick={async () => {
                            console.log("reading from file");
                            const fileResult = await readFromLocalFile<Array<any>>(
                                (data) => {
                                    data = `[${data.slice(0, -1)}]`
                                    console.log(data)
                                    return data
                                }
                            ).catch((e) => {
                                console.error(e);
                            }) as Array<any>;

                            console.log(fileResult)
                            const debate: Debate = {
                                "mainClaimId": fileResult[0].id,
                                "type": "debate",
                                "name": "",
                                "description": "",
                                "id": fileResult[0].id
                            }
                            const debateData: DebateData = {
                                "claims": createDict(fileResult.filter((item: Claim) => item.type === "claim"), "id"),
                                "connectors": createDict(fileResult.filter((item: any) => item.type === "connector"), "id")
                            }
                            flowDataState.dispatchReset([], debateData, debate)

                            console.log({ debateData, debate })

                            setTimeout(() => {
                                reactFlowInstance.fitView();
                            }, 500);
                        }}
                        label={"Load Airtable data from a file"}
                    />
                    <hr style={{ margin: "20px" }} />
                    <h1>Cut and paste</h1>
<TextArea id="dataIn"/>
<DataPanelButton
                        onClick={async () => {
                            const dataInElement = document.getElementById("dataIn") as HTMLTextAreaElement;
                             const dataString = `[${dataInElement.value.slice(0, -1)}]`
                            const dataObject = JSON.parse(dataString) as any[];

                            console.log(dataObject)
                            const debate: Debate = {
                                "mainClaimId": dataObject[0].id,
                                "type": "debate",
                                "name": "",
                                "description": "",
                                "id": dataObject[0].id
                            }
                            const debateData: DebateData = {
                                "claims": createDict(dataObject.filter((item: Claim) => item.type === "claim"), "id"),
                                "connectors": createDict(dataObject.filter((item: any) => item.type === "connector"), "id")
                            }
                            flowDataState.dispatchReset([], debateData, debate)

                            console.log({ debateData, debate })

                            setTimeout(() => {
                                reactFlowInstance.fitView();
                            }, 500);
                        }}
                        label={"Load Airtable data from text above"}
                    />
                </div>
            </Drawer>
        </div>
    );
};

export default DataPanel;
