import { Action } from "../../Action"
import { RsData } from "../../RsData"
import { ScoreRoot } from "../../ScoreRoot";
import { IndexReducer } from "./IndexReducer";

export function scoreRoots(state: RsData, action: Action, reverse: boolean = false): RsData {
    switch (action.type) {
        case "add_scoreRoot":
        case "modify_scoreRoot":
            {
                let newItem = state.items[action.dataId] as ScoreRoot
                if (!newItem) {
                    newItem = new ScoreRoot("", "")
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
                state = IndexReducer(state, "ScoreRootIds", newItem.id, action.dataId);
                return state as RsData
            }
        default:
            return state
    }
}


