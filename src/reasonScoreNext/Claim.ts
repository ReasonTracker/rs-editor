import { newId } from "./newId";
import { Item } from "./Item";

/**
 * A claim is a statement about reality that can be true or false.
 * It is usually not a statement someone has made at a point in time but is instead a claim about reality.
 */
export interface Claim extends Item {
    type: 'claim'

    /** the clearest description of the claim. As markdown.   */
    content: string
}

/** Populates defaults */
export function newClaim(partialItem: Partial<Claim> = {}): Claim {

    const itemType: { type: 'claim' } = {
        type: 'claim',
    }

    const newItem = {
        ...partialItem,
        ...itemType,
        content: partialItem.content ?? "",
        id: partialItem.id ?? newId(),
    };
    return newItem
}

export function isClaim(item: any): item is Claim {
    return item.type === 'claim'
}

