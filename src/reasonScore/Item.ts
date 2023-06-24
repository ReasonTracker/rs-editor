export interface Item {
    type: ItemTypes,
    id: string,
}

/**
 * Different types of items/data that can be a target of an edge
 * Can be supported or dispted by claims
 */
export type ItemTypes =
    "claim" |
    "claimEdge" |
    "score" |
    "scoreTree";


