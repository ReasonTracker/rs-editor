import { DebateData } from "../..//DebateData";
import { Connector } from "../../Connector";
import { Score } from "./Score";
import { sortSourceIdsFirst } from "../../sortSourceIdsFirst";
import { calculateRelevance } from "./calculateRelevance";
import { calculateConfidence } from "./calculateConfidence";

export function calculateScores(debateData: DebateData) {
    const ids = sortSourceIdsFirst(debateData.connectors);
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