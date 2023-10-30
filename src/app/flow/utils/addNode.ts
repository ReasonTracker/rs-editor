import { ClaimActions, ConnectorActions } from "@/reasonScoreNext/ActionTypes";
import { newClaim } from "@/reasonScoreNext/Claim";
import { FlowDataState } from "../types/types";
import generateSimpleAnimalClaim from "./generateClaimContent";
import { newConnector, Affects } from "@/reasonScoreNext/Connector";


const addNode = ({
    x,
    sourceId,
    proTarget = true,
    affects = "confidence",
}: {
    x: FlowDataState;
    sourceId?: string;
    proTarget?: boolean;
    affects?: Affects;
}) => {
    let actions = [];

    const newClaimData = newClaim({ content: generateSimpleAnimalClaim() });

    // Probably need to adjust this?
    const pol = proTarget ? "pro" : "con";

    const claimAction: ClaimActions = {
        type: "add",
        newData: {...newClaimData, pol},
    };

    // If there is no sourceId, add orphan claim
    actions.push(claimAction);
    if (!sourceId) {
        console.log("no sourceId")
        return x.dispatch(actions);
    }
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