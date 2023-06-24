import { Action } from "./Action";
import { Claim } from "./Claim";
import { ClaimEdge } from "./ClaimEdge";
import { Item } from "./Item";
import { Score } from "./Score";
import { ScoreTree } from "./ScoreTree";

export interface Index<T> { [searchIndex: string]: T; } //Store the string for the ID
export interface IndexArray { [searchIndex: string]: string[]; } //Store the string for the ID

export class RsData {
    constructor(
        public actionsLog: { actions: Action[] }[] = [],
        // Claim data
        /** Stores all the current items */
        public items: { [id: string]: Score | ScoreTree | ClaimEdge | Claim } = {},

        // Claim Indexes - Local
        public claimEdgeIdsByParentId: IndexArray = {},
        public claimEdgeIdsByChildId: IndexArray = {},

        //Score Indexes - Local
        public scoreIdsBySourceId: IndexArray = {},
        public childIdsByScoreId: IndexArray = {},
        public ScoreTreeIds: string[] = [],
    ) {
    }
}
