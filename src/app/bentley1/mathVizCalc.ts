import { RsData } from "./rs";

export function getTargetPositions(targetClaimId: string, rsData: RsData) {
    const targeEdgeIds = rsData.claimEdgeIdsByParentId[targetClaimId];
}