import { newId } from "./newId";
import { Item, ItemTypes } from "./Item";
import { Affects } from "./ClaimEdge";
/**
 * Stores the score for a claim. Just a data transfer object. Does not contain any logic.
 */
export class Score implements Item {
    type: ItemTypes = 'score'

    constructor(
        /** The claim to which this score belongs */
        public sourceClaimId: string,
        /** The top of the tree of scores that this belongs to. Used for indexing */
        public scoreTreeId: string,
        /** The parent of this score in the score tree graph */
        public parentScoreId: string | null = null, // Use null because Firestore does not allow undefined
        /** The Edge to which this score belongs */
        public sourceEdgeId: string | null = null,

        public reversible: boolean = false,
        /** Is this score a pro of it's parent (false if it is a con) */
        public pro: boolean = true,
        /** How the child affects the parent score */
        public affects: Affects = "confidence",
        /** how confident we should be in the claim. (AKA True) */
        public confidence: number = 1,
        /** How relevent this claim is to it's parent claim. Ranges from 0 to infinity.
         * A multiplier set by all the child edges that affect 'relevance'*/
        public relevance: number = 1,
        public id: string = newId(),
        public priority: string = "",
        public content: string = "",
        /** the impact/weight of this score on it's parent score but scaled so all the children are less than 1  */
        public scaledWeight: number = 0,
    ) {
    }

    /** number of total claims below this one */
    public descendantCount: number = 0;
    public generation: number = 0;

    /** What fraction of tree is this disregarding all scores */
    public fractionSimple: number = 1;
    /** What fraction of mainScore is this score and it's descendants responsible for */
    public fraction: number = 1;

    public childrenAveragingWeight: number = 1;
    public childrenConfidenceWeight: number = 1;
    public childrenRelevanceWeight: number = 1;
    public childrenWeight: number = 1;
    public weight: number = 1;
    public percentOfWeight: number = 1;
    /** Is this score pro the main top claim */
    public proMain: boolean = true; // TODO: should this start undefined?


    // //TODO:Experimental
    // public childrenProWeight: number = 0;
    // public childrenConWeight: number = 0;
    // public percentAgreeWeight: number = 0;
    // public parentFractionSimple: number = 0;
}

