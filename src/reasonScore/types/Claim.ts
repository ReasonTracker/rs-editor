import { newId } from '@/reasonScore/newId';
import { Item } from "./Item";

/**
 * A claim is a statement about reality that can be true or false.
 * It is usually not a statement someone has made at a point in time but is instead a claim about reality.
 * A claim can exist only once in a single debate (for now) but it can be a source for multiple connectors.
 */
export interface Claim extends Item {
    type: 'claim'

    /** the clearest description of the claim. As markdown.   */
    content: string

    /** The polarity of the claim. */
    pol: 'pro' | 'con'
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
        pol: partialItem.pol ?? 'pro',
    };
    return newItem
}

export function isClaim(item: any): item is Claim {
    return item.type === 'claim'
}

