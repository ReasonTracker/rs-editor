import { DebateData } from "../../types/DebateData";
import { Connector } from "../../types/Connector";
import { Score } from "./Score";
import { sortSourceIdsFirst } from "../../sortSourceIdsFirst";
import { calculateRelevance } from "./calculateRelevance";
import { calculateConfidence } from "./calculateConfidence";
import { createConnectorsIndexes } from "./createConnectorsByTarget";

export function calculateScores(debateData: DebateData) {
    let ids = sortSourceIdsFirst(debateData.connectors);
    if (ids.length === 0) { // In case no nodes are connected
        ids = Object.keys(debateData.claims)
    }

    let scores: { [id: string]: Score } = {};

    /** index for quickly finding connectors by target */
    let connectorsByTarget: { [id: string]: Connector[]; } = createConnectorsIndexes(debateData).byTarget;

    for (const id of ids) {
        const claim = debateData.claims[id];
        if (!claim) {
            console.error("No claim found for id:", id);
            continue;
        }
        const children = connectorsByTarget[id]?.map(connector => {
            const score = scores[connector.source]
            return { score, connector }
        }) ?? [];
        const confidenceChildren = children.filter(child => child.connector?.affects === 'confidence');
        const relevanceChildren = children.filter(child => child.connector?.affects === 'relevance');

        const { confidence, reversibleConfidence } = calculateConfidence(confidenceChildren);

        const newScore: Score = {
            type: 'score',
            id: claim.id,
            relevance: calculateRelevance(relevanceChildren),
            confidence: claim.forceConfidence || confidence,
            reversibleConfidence
        }
        scores[newScore.id] = newScore;
    }

    return scores;
}
