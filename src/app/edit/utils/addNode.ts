import { ClaimActions, ConnectorActions } from "@/reasonScore/types/ActionTypes";
import { newClaim } from "@/reasonScore/types/Claim";
import { DisplayNodeData, FlowDataState } from "../types/types";
// import generateSimpleAnimalClaim from "./generateClaimContent";
import { newConnector, Affects } from "@/reasonScore/types/Connector";


const addNode = ({
    flowDataState,
    sourceId,
    isNewNodePro,
    affects = "confidence",
    targetNodeData,
    claimId,
    content = "-"
}: {
    flowDataState: FlowDataState;
    sourceId?: string;
    affects?: Affects;
    isNewNodePro: boolean;
    targetNodeData?: DisplayNodeData
    claimId?: string;
    content?: string;
}) => {
    let actions = [];

    const newClaimData = newClaim({
        content: content, //generateSimpleAnimalClaim(),
        id: claimId,
        forceConfidence: 0,
    });

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

    //loop every tick to update the display
    const startTime = Date.now();
    const length = 5000
    const update = () => {
        flowDataState.dispatch([{
            type: "modify", newData: {
                id: newClaimData.id, type: "claim",
                forceConfidence: (Date.now() - startTime) / length
            }
        }]);
        if (Date.now() - startTime < length) {
            requestAnimationFrame(update);
        } else { 
            flowDataState.dispatch([{
                type: "modify", newData: {
                    id: newClaimData.id, type: "claim",
                    forceConfidence: undefined
                }
            }]);
        }
    };
    requestAnimationFrame(update);
};

export default addNode;