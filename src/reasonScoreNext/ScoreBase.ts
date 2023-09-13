import { Item } from "./Item";

/**
 * A score base in the minimum requirements for a score about a claim. 
 * similar to a connector that has a source claim except for the MainScore which matched to the mainClaim.
 * There are potentially many different types of scores.
 * The actual scoring is calculated elsewhere
 */
export interface ScoreBase extends Item {
    type: 'score'

    /** The parent of this score in the score tree graph */
    parentScoreId: string,

    /** The Edge to which this score belongs */
    sourceConnectorId: string,
}

/**
 * Is a score for the Main claim, so it has no connector above it.
 */
export interface MainScoreBase extends Item { 
    type: 'score'

    /** The claim to which this score belongs */
    sourceClaimId: string,

}
