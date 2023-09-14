import { Claim } from "./Claim"
import { Connector } from "./Connector"
import { Item } from "./Item";

export type ActionTypes =
    ClaimActions | 
    ConnectorActions

export type ItemAction = generateItemActionType<Item>;

export type ClaimActions = generateItemActionType<Claim>
export type ConnectorActions = generateItemActionType<Connector>

export type generateItemActionType<Type> = {
    type: `add`,
    newData: Type,
} | {
    type: `modify`,
    newData: Partial<Type> & { id: string },
}| {
    type: `delete`,
    newData: Partial<Type> & { id: string },
}

export function hasItemData(object: any): object is generateItemActionType<Item> {
    return object.newData !== undefined;
}
