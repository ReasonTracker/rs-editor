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

export type ActionTypes =
    "add_claim" |
    "modify_claim" |
    "delete_claim" |
    "sync_claim" |

    "add_claimEdge" |
    "modify_claimEdge" |
    "delete_claimEdge" |
    "sync_claimEdge" |

    "add_score" |
    "modify_score" |
    "delete_score" |
    "sync_score" |

    "add_scoreTree" |
    "modify_scoreTree" |
    "delete_scoreTree" |
    "sync_scoreTree" 