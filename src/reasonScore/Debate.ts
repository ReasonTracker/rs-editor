'use client';

import { newId } from '@/reasonScore/newId';
import { Item } from "./Item";

/**
 * A Debate is a goup of claims and connectors where:
 * - All claims are connected to at least one other claim (Except maybe for some that are in a scratch pad)
 * - There is only one Main Claim
 */
export interface Debate extends Item {
    type: 'debate'

    /** A general description of the debate. As markdown.   */
    description: string

    /** a short name for the debate. Often similar to the main claim. As markdown. */
    name: string

    /** the ID of the main claim the debate is about. a claim that is not attacking or aupporting another claim. Is not a Source in any connectors  */
    mainClaimId?: string
}

/** Populates defaults */
export function newDebate(partialItem: Partial<Debate> = {}): Debate {

    const itemType: { type: 'debate' } = {
        type: 'debate',
    }

    const newItem: Debate = {
        ...partialItem,
        ...itemType,
        name: partialItem.name ?? "",
        description: partialItem.description ?? "",
        id: partialItem.id ?? newId(),
    };
    return newItem
}

export function isClaim(item: any): item is Debate {
    return item.type === 'debate'
}

