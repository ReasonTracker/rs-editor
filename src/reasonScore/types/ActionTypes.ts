import { Claim } from "./Claim"
import { Connector } from "./Connector"
import { Item } from "./Item";

export type ActionTypes =
    ClaimActions | 
    ConnectorActions

export type ItemAction = generateItemActionType<Claim | Connector>;

export type ClaimActions = generateItemActionType<Claim>
export type ConnectorActions = generateItemActionType<Connector>

export type generateItemActionType<Type extends Claim | Connector> = {
    type: `add`,
    newData: Type,
} | {
    type: `modify`,
    newData: Partial<Type> & { id: string, type: Type["type"]},
}| {
    type: `delete`,
    newData: Partial<Type> & { id: string, type: string },
}

export function hasItemData(object: any): object is generateItemActionType<Claim | Connector> {
    return object.newData !== undefined;
}
