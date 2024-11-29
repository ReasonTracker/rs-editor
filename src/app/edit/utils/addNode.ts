import { ClaimActions, ConnectorActions } from "@/reasonScore/types/ActionTypes";
import { newClaim } from "@/reasonScore/types/Claim";
import { DisplayNodeData, FlowDataState } from "../types/types";
import generateSimpleAnimalClaim from "./generateClaimContent";
import { newConnector, Affects } from "@/reasonScore/types/Connector";


const addNode = ({
    flowDataState,
    sourceId,
    isNewNodePro,
    affects = "confidence",
    targetNodeData,
    claimId,
}: {
    flowDataState: FlowDataState;
    sourceId?: string;
    affects?: Affects;
    isNewNodePro: boolean;
    targetNodeData?: DisplayNodeData
    claimId?: string;
}) => {
    let actions = [];

    const newClaimData = newClaim({ content: generateSimpleAnimalClaim(), id: claimId});

    const pol = isNewNodePro ? "pro" : "con";

    const claimAction: ClaimActions = {
        type: "add",
        newData: { ...newClaimData, pol },
    };

    // If there is no sourceId, add orphan claim
    actions.push(claimAction);
    if (!sourceId) {
        console.log("no sourceId")
        return flowDataState.dispatch(actions);
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
    flowDataState.dispatch(actions);
};

export default addNode;