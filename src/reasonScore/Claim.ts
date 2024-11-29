import { ItemTypes } from "./Item";
import { newId } from "../utils/newId";
import { Item } from "./Item";

export class Claim implements Item {
    type: ItemTypes = 'claim'

    constructor(
        public content: string = "",
        public id: string = newId(),
        public reversible: boolean = false,
        public labelMax?: string,
        public labelMid?: string,
        public labelMin?: string
    ) {
    }
}


export function isClaim(item: any): item is Claim {
    return item.type === "claim"
}
