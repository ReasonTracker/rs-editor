import { ItemTypes } from "./ItemTypes";
import { newId } from "../newId";
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
