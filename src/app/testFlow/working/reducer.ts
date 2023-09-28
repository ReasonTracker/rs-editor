import { ActionTypes, ClaimActions, ConnectorActions, ItemAction, generateItemActionType, hasItemData } from "../../../reasonScoreNext//ActionTypes";
import { Claim, isClaim } from "../../../reasonScoreNext/Claim"
import { Connector, isConnector } from "../../../reasonScoreNext//Connector";
import { DebateData } from "../../../reasonScoreNext//DebateData";
import { Item } from "../../../reasonScoreNext//Item";

export function rsReducer(actions: ActionTypes[], debateData: DebateData) {
    const newDebateData = { ...debateData }; //TODO: we assume a change will happen, should we?

    const claimActions = actions.filter((action): action is ClaimActions => hasItemData(action) && isClaim(action.newData));
    debateData.claims = ApplyItemActions<Claim>(debateData.claims, claimActions);

    const connectorActions = actions.filter((action): action is ConnectorActions => hasItemData(action) && isConnector(action.newData));
    debateData.connectors = ApplyItemActions<Connector>(debateData.connectors, connectorActions);

    return newDebateData;
}

function ApplyItemActions<T extends Item>(index: { [id: string]: T }, actions: generateItemActionType<T>[]): { [id: string]: T } {
    if (actions.length === 0) return index;
    const newIndex = { ...index };
    actions.forEach(action => {
        if (action.type === `add`) {
            newIndex[action.newData.id] = action.newData;
        } else if (action.type === `modify`) {
            newIndex[action.newData.id] = { ...index[action.newData.id], ...action.newData };
        } else if (action.type === `delete`) {
            delete newIndex[action.newData.id];
        }
    });
    return newIndex;
}