import { Item } from "../../Item";
import { ScoreBase } from "../../ScoreBase";
import { newId } from "../../newId";


export interface Score extends ScoreRequired, Omit<Item, 'type'> {
    /** how confident we should be in the claim (how true) based on the child claims so far. Ranges from 0 to 1 */
    confidence: number

    /** How relevent this claim is to it's parent claim. Ranges from 0 to infinity.
     * A multiplier set by all the child edges that affect 'relevance'*/
    relevance: number

}

export interface ScoreRequired extends ScoreBase {
    /** pro field from the connector */
    pro: boolean

}

/** Populates defaults */
export function getNewScore(partialItem: Partial<Score> & ScoreRequired): Score {

    const itemType: { type: 'score' } = {
        type: 'score',
    }

    const newItem: Score = {
        ...partialItem,
        ...itemType,
        id: partialItem.id ?? newId(),

        relevance: partialItem.relevance ?? 1,
        confidence: partialItem.confidence ?? 0,
    };
    return newItem
}