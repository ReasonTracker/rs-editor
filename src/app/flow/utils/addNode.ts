import { ClaimActions, ConnectorActions } from "@/reasonScoreNext/ActionTypes";
import { newClaim } from "@/reasonScoreNext/Claim";
import { DisplayNodeData, FlowDataState } from "../types/types";
import generateSimpleAnimalClaim from "./generateClaimContent";
import { newConnector, Affects } from "@/reasonScoreNext/Connector";


const addNode = ({
    x,
    sourceId,
    isNewNodePro,
    affects = "confidence",
    targetNodeData
}: {
    x: FlowDataState;
    sourceId?: string;
    affects?: Affects;
    isNewNodePro: boolean;
    targetNodeData?: DisplayNodeData
}) => {
    let actions = [];

    const newClaimData = newClaim({ content: generateSimpleAnimalClaim() });

    const pol = isNewNodePro ? "pro" : "con";

    const claimAction: ClaimActions = {
        type: "add",
        newData: { ...newClaimData, pol },
    };

    // If there is no sourceId, add orphan claim
    actions.push(claimAction);
    if (!sourceId) {
        console.log("no sourceId")
        return x.dispatch(actions);
    }
    const proTarget = (isNewNodePro === (targetNodeData?.pol === "pro"));
    const newConnectorData = newConnector({
        source: newClaimData.id,
        target: sourceId,
        proTarget,
        affects
    });
    const connectorAction: ConnectorActions = {
        type: "add",
        newData: newConnectorData,
    };

    actions.push(connectorAction);
    x.dispatch(actions);
};

export default addNode;