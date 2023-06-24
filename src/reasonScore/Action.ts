import { ActionTypes } from "./ActionTypes";

export class Action {
    constructor(
        public newData: any,
        public oldData: any,
        public type: ActionTypes,
        public dataId: string = "",
    ) {
        if (dataId === "") {
            this.dataId = newData.id
        }
    }
}