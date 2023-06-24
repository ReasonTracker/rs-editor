import { Item } from "./rs";
import { Action } from "./rs";
import { ActionTypes } from "./rs";

/** Compare two scores to see if they are different in what the score is.
 *  Just compares confidence and relavance
 */
export function hasItemChanged(scoreA: Item, scoreB: Item) {
    return !(JSON.stringify(scoreA, Object.keys(scoreA).sort()) ===
        JSON.stringify(scoreB, Object.keys(scoreB).sort()));
}

/** Compares two data objects and create apropriate change objects if necessary
 * If a property exists on old but not new, it is ignored as the new can be a partial and is not expected to have everything
 * If the propert exists on the new but not the old. It retunrs the property on the partialNewItem object
 * If the property exists on both items and has the same value, it is ignored
 * If the property exists on both items but the value differs, it is added to both partials in the return
 * If no changes are detected then undefined is returned so it can be easily checked.
 */
export function itemChanges(newItem: any, oldItem: any) {
    const partialOldItem: any = {};
    const partialNewItem: any = {};

    //Loop through the old item properties to see if they changed in the new item
    for (const prop in oldItem) {
        if (oldItem[prop] !== newItem[prop]) {
            partialOldItem[prop] = oldItem[prop];
            partialNewItem[prop] = newItem[prop];
        }
    }

    //Loop thgout the new item properties to see if there are any new props that should be included
    for (const prop in newItem) {
        if (oldItem[prop] === undefined) {
            partialNewItem[prop] = newItem[prop];
        }
    }

    if (Object.keys(partialNewItem).length > 0) {
        return {
            partialNewItem: partialNewItem,
            partialOldItem: partialOldItem
        }
    } else
        return undefined
}

export function pushActionIfChanged(actions: Action[], newItem: any, OldItem: any, type: ActionTypes, itemId?: string) {
    const checkResult = itemChanges(newItem, OldItem);
    if (checkResult) {
        actions.push(new Action(checkResult.partialNewItem, checkResult.partialNewItem, type, itemId));
    }
}
