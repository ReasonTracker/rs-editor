import { Claim } from "./Claim"

export type ActionTypes =
    { type: `delete`, id: string, } |
    generateItemActionType<Claim>

type generateItemActionType<Type> = {
    type: `add`,
    newData: Type,
} | {
    type: `modify`,
    newData: Partial<Type> & { id: string },
}

