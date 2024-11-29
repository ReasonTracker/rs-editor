import { Item } from "./Item";

/**
 * A score base in the minimum requirements for a score about a claim. 
 * in a debate, foreach claim there is one score. usually with the same ID but prefixed with an 's'.
 * There are potentially many different types of scores each using this base, but they need to be stored in differnt containers to prevent id conflicts
 * The actual scoring is calculated elsewhere.
 * Scores are completely calculable and are not for storing static data.
 */
export interface ScoreBase extends Item {
    type: 'score'

    // /** The parents of this score in the score tree graph
    //  * A score can have multiple targets in a single debate because a claim can attack/defend more than one other claim at a time.
    //  */
    // targetScoreIds: string[],

    // /** The Edge to which this score belongs */
    // sourceConnectorId: string,
}

/**
 * Is a score for the Main claim, so it has no connector above it.
 */
export interface MainScoreBase extends Item { 
    type: 'score'

    /** The claim to which this score belongs */
    sourceClaimId: string,

}
