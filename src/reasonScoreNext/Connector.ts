import { newId } from "./newId";
import { Item } from "./Item";

/**
 * A connector establishes a relationship between two distinct claims (target and source).
 * A source claim can either attack or support the confidence or relevance of a target claim.
 * A connector can only appear in one graph and only once in that graph.
 */
export interface Connector extends ConnectorRequired, Item {
    type: 'connector'
    /** indicates if the source claim is attacking (pro:false) or supporting (pro:true) */
    pro: boolean

    /** indicates if the source claim is affecting the target claim's confidence or relevance */
    affects: Affects
}

interface ConnectorRequired {
    /** the id of the claim that is being attacked or supported. */
    target: string

    /** the id of the claim that is doing the attacking or supporting of the target claim. */
    source: string
}

/** Populates defaults */
export function newConnector(partialItem: Partial<Connector> & ConnectorRequired): Connector {
    const itemType: { type: 'connector' } = {
        type: 'connector',
    }

    const newItem = {
        ...partialItem,
        ...itemType,
        id: partialItem.id ?? newId(),
        pro: partialItem.pro ?? true,
        affects: partialItem.affects ?? "confidence",
    };
    return newItem
}

export function isConnector(item: any): item is Connector {
    return item.type === 'connector'
}

export type Affects =
    "confidence" |
    "relevance";

