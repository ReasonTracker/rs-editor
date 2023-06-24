import { Action } from "../../Action"
import { RsData } from "../../RsData"
import { Score } from "../../Score"
import { IndexReducer } from "./IndexReducer";

export function scores(state: RsData, action: Action, reverse: boolean = false): RsData {
    switch (action.type) {
        case "add_score":
        case "modify_score":
        case "sync_score":
            {
                let newItem = state.items[action.dataId] as Score
                if (!newItem) {
                    newItem = new Score("", "")
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
                state = IndexReducer(state, "childIdsByScoreId", newItem.parentScoreId, action.dataId);
                state = IndexReducer(state, "scoreIdsBySourceId", newItem.sourceClaimId, action.dataId);
                state = IndexReducer(state, "scoreIdsBySourceId", newItem.sourceEdgeId, action.dataId);
                return state
            }
        default:
            return state
    }
}


