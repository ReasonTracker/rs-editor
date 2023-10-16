import { ClaimActions, ConnectorActions } from "@/reasonScoreNext/ActionTypes";
import { newClaim } from "@/reasonScoreNext/Claim";
import { FlowDataState } from "../components/FlowDataProvider";
import generateSimpleAnimalClaim from "./generateClaimContent";
import { newConnector, Affects } from "@/reasonScoreNext/Connector";


const addNode = ({
  x,
  sourceId,
  proTarget,
  affects,
}: {
  x: FlowDataState;
  sourceId?: string;
  proTarget?: boolean;
  affects?: Affects;
}) => {
  let actions = [];

  const newClaimData = newClaim({ content: generateSimpleAnimalClaim() });

  const claimAction: ClaimActions = {
    type: "add",
    newData: newClaimData,
  };

  // If there is no sourceId, add orphan claim
  actions.push(claimAction);
  if (!sourceId) return x.dispatch(actions);

  const newConnectorData = newConnector({
    source: newClaimData.id,
    target: sourceId,
    proTarget: proTarget || true,
    affects: affects || "confidence",
  });
  const connectorAction: ConnectorActions = {
    type: "add",
    newData: newConnectorData,
  };

  actions.push(connectorAction);
  x.dispatch(actions);
};

export default addNode;