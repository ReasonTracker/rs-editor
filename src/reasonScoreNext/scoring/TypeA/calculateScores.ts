import { DebateData } from "../..//DebateData";
import { Connector } from "../../Connector";
import { Score } from "./Score";
import { sortSourceIdsFirst } from "../../sortSourceIdsFirst";
import { calculateRelevance } from "./calculateRelevance";
import { calculateConfidence } from "./calculateConfidence";

export function calculateScores(debateData: DebateData) {
    let ids = sortSourceIdsFirst(debateData.connectors);
    if (ids.length === 0) { // In case no nodes are connected
        ids = Object.keys(debateData.claims);
    }
    const scores: { [id: string]: Score } = {};

    /** index for quickly finding connectors by source */
    const connectorsBySource: { [id: string]: Connector[] } = {}
    
    for (const id of ids) {
        const claim = debateData.claims[id];
        const children = connectorsBySource[id]?.map(connector => {
            const score = scores['s' + connector.target]
            return {score, connector}

        }) ?? [];
        const newScore: Score = {
            type: 'score',
            id: 's' + claim.id,
            relevance: calculateRelevance(children),
            confidence: calculateConfidence(children)
        }
        scores[newScore.id] = newScore;
    }

    return scores;
}