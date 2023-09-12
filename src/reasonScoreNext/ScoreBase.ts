import { Item } from "./Item";

/**
 * A score base in the minimum requirements for a score about a claim. 
 * There are potentially many different types of scores.
 * The actual scoring is calculated elsewhere
 */
export interface ScoreBase {
    type: 'score'
    /** The claim to which this score belongs */
    sourceClaimId: string,
    /** The parent of this score in the score tree graph */
    parentScoreId: string,
    /** The Edge to which this score belongs */
    sourceEdgeId: string,
}

export function isScore<ScoreType extends ScoreBase>(item: any): item is ScoreType {
    return item.type === 'score'
}

