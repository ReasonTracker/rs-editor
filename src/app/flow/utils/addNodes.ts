import { ClaimActions, ConnectorActions } from "@/reasonScoreNext/ActionTypes";
import { newClaim } from "@/reasonScoreNext/Claim";
import { DisplayNodeData, FlowDataState, Polarity } from "../types/types";
import generateSimpleAnimalClaim from "./generateClaimContent";
import { newConnector, Affects } from "@/reasonScoreNext/Connector";
import { newId } from "@/reasonScoreNext/newId";

export type AddNodeType = {
    flowDataState: FlowDataState;
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
        }, i * 100);
    }
};

type Options = {
    typeOut?: boolean;
    typeOutDelay?: number;
}

const addNodes = async ({
    nodes,
    options = {},
}: {
    nodes: AddNodeType[];
    options?: Options;
}) => {
    const {
        typeOut = false,
        typeOutDelay = 0
    } = options

    // TODO, can we batch distpatch?  or if nodes have targets that doesn't exist yet, will that break it?
    for (const node of nodes) {
        const {
            flowDataState,
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

            if (typeOut) {
                await delay(typeOutDelay)
                typeOutContent({ flowDataState, content, id });
            }
    }
};

export default addNodes;
