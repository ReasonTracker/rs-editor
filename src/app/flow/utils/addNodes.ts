import { ClaimActions, ConnectorActions } from "@/reasonScoreNext/ActionTypes";
import { newClaim } from "@/reasonScoreNext/Claim";
import { DisplayNodeData, FlowDataState, Polarity } from "../types/types";
import generateSimpleAnimalClaim from "./generateClaimContent";
import { newConnector, Affects } from "@/reasonScoreNext/Connector";
import { newId } from "@/reasonScoreNext/newId";
import { ReactFlowInstance } from "reactflow";

export type AddNodeType = {
    sourceId?: string;
    affects?: Affects;
    isNewNodePro: boolean;
    targetNodePolarity?: Polarity;
    claimId?: string;
    claimContent?: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const typeOutContent = async ({
    flowDataState,
    content,
    id,
}: {
    flowDataState: FlowDataState;
    content: string;
    id: string;
}) => {
    await new Promise<void>((resolve) => {
        for (let i = 0; i <= content.length; i++) {
            setTimeout(() => {
                flowDataState.dispatch([
                    {
                        type: "modify",
                        newData: {
                            id,
                            content: content.substring(0, i),
                            type: "claim",
                        },
                    },
                ]);
                // Resolve the promise on the last iteration
                if (i === content.length) {
                    resolve();
                }
            }, i * 100);
        }
    });
};

type FitViewType = {
    reactFlowInstance: ReactFlowInstance,
    duration?: number;
    fitViewDelay?: number;
    padding?: number;
}
type TypeOutType = {
    typeOutDelay: number;
}
type Options = {
    typeOut?: TypeOutType;
    fitView?: FitViewType
}

const addNodes = async ({
    flowDataState,
    nodes,
    options = {},
}: {
    flowDataState: FlowDataState;
    nodes: AddNodeType[];
    options?: Options;
}) => {
    const { typeOut, fitView } = options
    // TODO, can we batch distpatch?  or if nodes have targets that doesn't exist yet, will that break it?
    for (const node of nodes) {
        const {
            sourceId,
            isNewNodePro,
            affects = "confidence",
            targetNodePolarity,
            claimId,
            claimContent,
        } = node;
        let actions = [];

        const content = claimContent || generateSimpleAnimalClaim();
        const id = claimId || newId();
        const newClaimData = newClaim({
            content: typeOut ? "" : content,
            id,
        });

        const pol = isNewNodePro ? "pro" : "con";
        const claimAction: ClaimActions = {
            type: "add",
            newData: { ...newClaimData, pol },
        };
        actions.push(claimAction);

        if (sourceId) {
            const proTarget = isNewNodePro === (targetNodePolarity === "pro");
            const newConnectorData = newConnector({
                source: newClaimData.id,
                target: sourceId,
                proTarget,
                affects,
            });
            const connectorAction: ConnectorActions = {
                type: "add",
                newData: newConnectorData,
            };
            actions.push(connectorAction);
        } else {
            console.log("no sourceId");
        }

        flowDataState.dispatch(actions);

        if (fitView) {
            const { reactFlowInstance, duration, fitViewDelay, padding } = fitView
            if (fitViewDelay) await delay(fitViewDelay);
            // skip a beat so reactflow can get proper bounds
            setTimeout(() => {
                reactFlowInstance.fitView({ duration, padding, });
            }, 1000);
            await delay(duration || 0);
        }

        if (typeOut) {
            await delay(typeOut.typeOutDelay)
            await typeOutContent({ flowDataState, content, id });
        }
    }
};

export default addNodes;
