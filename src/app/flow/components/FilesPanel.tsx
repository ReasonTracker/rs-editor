import React, { useContext, useState } from "react";
import { FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button, IconName } from "@blueprintjs/core";
import saveToLocalFile from "@/utils/localFiles/saveToLocalFile";
import readFromLocalFile from "@/utils/localFiles/readFromLocalFile";
import { useReactFlow } from "reactflow";
import { Debate } from "@/reasonScore/Debate";
import { DebateData } from "@/reasonScore/DebateData";

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
                style={{opacity: 0.25}}
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
                style={
                    { position: "fixed" } // Odd that this is needed Otherwise the drawer is transparent
                }
            >
                <div className="flex flex-col space-y-2 mt-4">

                    <FilesPanelButton
                        onClick={() => {
                            const { debate, debateData } = flowDataState
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
                            const { debate, debateData } = await readFromLocalFile().catch((e) => {
                                console.error(e);
                            }) as { debate: Debate, debateData: DebateData };

                            flowDataState.dispatchReset([], debateData, debate);

                            setTimeout(() => {
                                reactFlowInstance.fitView();
                            }, 500);
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
