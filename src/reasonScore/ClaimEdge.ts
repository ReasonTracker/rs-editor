import { ItemTypes } from "./Item";
import { newId } from "./newId";
/**
 * Stores the relationship between a claim and an item (usually another claim).
 * This is directional as the edge points from one claim to it's parent.
 * This is just a data transfer object so it should have no logic in it
 * and only JSON compatible types string, number, object, array, boolean
 */
export class ClaimEdge {
    type: ItemTypes = 'claimEdge'

    constructor(
        /** The ID for the parent claim this edge points to */
        public parentId: string,
        /** The ID for the child claim this edge points from */
        public childId: string,
        /** How the child affects the parent score */
        public affects: Affects = 'confidence',
        /** Is the child claim a pro of it's parent (false if it is a con) */
        public proParent: boolean = true,

        public proMain?: boolean,

        public id: string = newId(),
        public priority: string = "",
    ) {
    }
}

export type Affects =
    "confidence" |
    "relevance";

export function isClaimEdge(item: any): item is ClaimEdge {
    return item.type === "claimEdge"
}
