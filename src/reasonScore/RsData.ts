import { Action } from "./Action";
import { Claim } from "./Claim";
import { ClaimEdge } from "./ClaimEdge";
import { Score } from "./Score";
import { ScoreRoot } from "./ScoreRoot";

export interface Index<T> { [searchIndex: string]: T; } //Store the string for the ID
export interface IndexArray { [searchIndex: string]: string[]; } //Store the string for the ID

export class RsData {
    constructor(
        public actionsLog: { actions: Action[] }[] = [],
        // Claim data
        /** Stores all the current items */
        public items: { [id: string]: Score | ScoreRoot | ClaimEdge | Claim } = {},

        // Claim Indexes - Local
        public claimEdgeIdsByParentId: IndexArray = {},
        public claimEdgeIdsByChildId: IndexArray = {},

        //Score Indexes - Local
        public scoreIdsBySourceId: IndexArray = {},
        public childIdsByScoreId: IndexArray = {},
        public ScoreRootIds: string[] = [],
    ) {
    }
}
