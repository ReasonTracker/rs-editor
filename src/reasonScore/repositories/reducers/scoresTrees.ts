import { Action } from "../../Action"
import { RsData } from "../../RsData"
import { ScoreTree } from "../../ScoreTree";
import { IndexReducer } from "./IndexReducer";

export function scoreTrees(state: RsData, action: Action, reverse: boolean = false): RsData {
    switch (action.type) {
        case "add_scoreTree":
        case "modify_scoreTree":
            {
                let newItem = state.items[action.dataId] as ScoreTree
                if (!newItem) {
                    newItem = new ScoreTree("", "")
                    newItem.id = action.dataId
                }
                newItem = { ...newItem, ...action.newData }

                state = {
                    ...state,
                    items: {
                        ...state.items,
                        [action.dataId]: newItem,
                    }
                }

                //TODO: Do I need to stop recreating the state so many times in this reducer?
                state = IndexReducer(state, "ScoreTreeIds", newItem.id, action.dataId);
                return state as RsData
            }
        default:
            return state
    }
}


