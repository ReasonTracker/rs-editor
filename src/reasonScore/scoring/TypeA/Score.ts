import { Item } from "../../types/Item";
import { ScoreBase } from "../../types/ScoreBase";
import { newId } from '@/reasonScore/newId';

export interface Score extends ScoreRequired, Omit<Item, 'type'> {
    /** how confident we should be in the claim (how true) based on the child claims so far. Ranges from 0 to 1 */
    confidence: number

    /** how confident we should be in the claim (how true) based on the child claims so far. Ranges from -1 to 1 */
    reversibleConfidence: number

    /** How relevent this claim is to it's parent claim. Ranges from 0 to infinity.
     * A multiplier set by all the child edges that affect 'relevance'*/
    relevance: number

}

export interface ScoreRequired extends ScoreBase { } // TODO: nothing reqired yet. consider removing

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
        confidence: partialItem.confidence ?? 1,
        reversibleConfidence: partialItem.reversibleConfidence ?? 1,
    };
    return newItem
}