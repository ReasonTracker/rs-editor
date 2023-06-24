import { RsData } from "../../RsData";
export function IndexReducer(state: any, index: string, keyId: string | null | undefined, id: string): RsData {
    if (keyId) {
        //TODO: remove this, can I use "...state[index][keyId] || []" below?
        if (!state[index][keyId]) {
            state[index][keyId] = [];
        }
        if (state[index][keyId].indexOf(id) == -1) {
            state = {
                ...state,
                [index]: {
                    ...state[index],
                    [keyId]: [
                        ...state[index][keyId],
                        id
                    ]
                }
            };
        }
    }
    return state;
}
