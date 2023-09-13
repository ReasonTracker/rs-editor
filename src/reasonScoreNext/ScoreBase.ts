import { Item } from "./Item";

/**
 * A score base in the minimum requirements for a score about a claim. 
 * A score can have two targets in a single debate because a claim can attack/defend more than one other claim at a time.
 * There are potentially many different types of scores.
 * The actual scoring is calculated elsewhere
 */
export interface ScoreBase extends Item {
    type: 'score'

    /** The parents of this score in the score tree graph
     * A score can have multiple targets in a single debate because a claim can attack/defend more than one other claim at a time.
     */
    targetScoreIds: string[],

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
