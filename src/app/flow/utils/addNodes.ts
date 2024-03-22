import { ClaimActions, ConnectorActions } from "@/reasonScoreNext/ActionTypes";
import { newClaim } from "@/reasonScoreNext/Claim";
import { DisplayNodeData, FlowDataState, Polarity } from "../types/types";
import generateSimpleAnimalClaim from "./generateClaimContent";
import { newConnector, Affects } from "@/reasonScoreNext/Connector";

export type AddNodeType = {
    flowDataState: FlowDataState;
    sourceId?: string;
    affects?: Affects;
    isNewNodePro: boolean;
    targetNodePolarity?: Polarity;
    claimId?: string;
    claimContent?: string;
};

const addNodes = (nodes: AddNodeType[]) => {
    // TODO, can we batch distpatch?  or if nodes have targets that doesn't exist yet, will that break it?
    nodes.forEach(
        ({
            flowDataState,
            sourceId,
            isNewNodePro,
            affects = "confidence",
            targetNodePolarity,
            claimId,
            claimContent,
        }) => {
            let actions = [];

            const content = claimContent || generateSimpleAnimalClaim();
            const newClaimData = newClaim({ content, id: claimId });

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
        }
    );
};

export default addNodes;
