import { Claim, isClaim } from "./Claim";
import { Connector, isConnector } from "./Connector";

/**
 *  Generates a consistent scoreId which starts with mainClaimId
 *  Then all the connecotr IDs sorted alphabetically
 *  All the Ids are then joined with a dash '-' between them
 * The connectors included are only the ones which the 
 *  TODO: Which connectors. targets? sources? both?
 */
function genScoreId(mainClaim: Claim, connectors: Connector[]): string;
function genScoreId(mainClaimId: string, connectorIds: string[]): string;
function genScoreId(mainClaimOrId: Claim | string, connectorsOrIds: Connector[] | string[]): string {
    const ids: string[] = [];
    connectorsOrIds.forEach(c => isConnector(c) ? ids.push(c.id) : ids.push(c))
    ids.sort();
    ids.unshift(isClaim(mainClaimOrId) ? mainClaimOrId.id : mainClaimOrId)
    return ids.join('-');
}

export { genScoreId };