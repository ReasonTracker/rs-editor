import { Claim, isClaim } from "./Claim";
import { Connector, isConnector } from "./Connector";

function genScoreId(mainClaim: Claim, connector: Connector): string;
function genScoreId(mainClaimId: string, connectorId: string): string;
function genScoreId(mainClaimOdId: Claim | string, connectorOrId: Connector | string): string {
    let mainClaimId = isClaim(mainClaimOdId) ? mainClaimOdId.id : mainClaimOdId;
    let connectorId = isConnector(connectorOrId) ? connectorOrId.id : connectorOrId;
    return mainClaimId + '-' + connectorId;
}

export { genScoreId  };