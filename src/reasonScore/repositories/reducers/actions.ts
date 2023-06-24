import { Action } from "../../Action"
import { RsData } from "../../RsData"

export function actions(state: RsData, action: Action[]): RsData {
    return {
        ...state,
        actionsLog: [...action,
        ...state.actionsLog
        ]
    } as RsData
}