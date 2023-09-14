import { Action, Claim, ClaimEdge, RsData, Score, ScoreRoot } from "../rs";


export class RepositoryLocalBase {

    constructor(
        public rsData: RsData = new RsData()
    ) {
    }

    async getClaimIdBySourceId(sourceId: string): Promise<string | undefined> {
        if (sourceId in this.rsData.items) {
            const item = this.rsData.items[sourceId];
            if ('sourceClaimId' in item) {
                return item.sourceClaimId;
            }
        }
    }
    
    async getClaim(id: string): Promise<Claim | undefined> {
        return this.rsData.items[id] as Claim;
    }
    async updateClaim(id:string, text: string): Promise<void> {
        const claim = this.rsData.items[id] as Claim;
        if (claim)claim.content = text;
    }
    async getClaimEdge(id: string): Promise<ClaimEdge | undefined> {
        return this.rsData.items[id] as ClaimEdge;
    }
    async getScore(id: string): Promise<Score | undefined> {
        return this.rsData.items[id] as Score;
    }
    async getScoreRoot(id: string): Promise<ScoreRoot | undefined> {
        return this.rsData.items[id] as ScoreRoot;
    }
    async getClaimEdgesByParentId(parentId: string): Promise<ClaimEdge[]> {
        const claimEdgeIdStrings = this.rsData.claimEdgeIdsByParentId[parentId];
        const claimEdges: ClaimEdge[] = [];
        if (claimEdgeIdStrings) {
            for (const claimEdgeIdString of claimEdgeIdStrings) {
                const claimEdge = await this.getClaimEdge(claimEdgeIdString)
                if (claimEdge) claimEdges.push(claimEdge)
            }
        }
        return claimEdges
    }
    async getSourceEdgeIdBySourceId(sourceId: string): Promise<string | undefined > {
        if (sourceId in this.rsData.items) {
            const item = this.rsData.items[sourceId];
            if ('sourceEdgeId' in item) {
                return item.sourceEdgeId ? item.sourceEdgeId : undefined;
            }
        }
    }
    async getClaimEdgesByChildId(childId: string): Promise<ClaimEdge[]> {
        const claimEdges: ClaimEdge[] = [];
        const claimEdgeIdStrings = this.rsData.claimEdgeIdsByChildId[childId];
        if (claimEdgeIdStrings) {
            for (const claimEdgeIdString of claimEdgeIdStrings) {
                const claimEdge = await this.getClaimEdge(claimEdgeIdString)
                if (claimEdge) claimEdges.push(claimEdge)
            }
        }
        return claimEdges
    }
    async getScoresBySourceId(sourceClaimId: string): Promise<Score[]> {
        const scoreIdStrings = this.rsData.scoreIdsBySourceId[sourceClaimId];
        const scores: Score[] = [];
        if (scoreIdStrings) {
            for (const scoreIdString of scoreIdStrings) {
                const score = await this.getScore(scoreIdString)
                if (score) scores.push(score)
            }
        }
        return scores
    }
    async getChildrenByScoreId(parentScoreId: string): Promise<Score[]> {
        const childIdStrings = this.rsData.childIdsByScoreId[parentScoreId];
        const scores: Score[] = [];
        if (childIdStrings) {
            for (const scoreIdString of childIdStrings) {
                const score = await this.getScore(scoreIdString)
                if (score) scores.push(score)
            }
        }
        return scores
    }
    async getDescendantScoresById(mainScoreId: string): Promise<Score[]> {
        // TODO: This assumes no loops in the tree
        const scores: Score[] = [];
        const scoresToProcess = await this.getChildrenByScoreId(mainScoreId);
        while (scoresToProcess.length > 0) {
            const currentScore = scoresToProcess.pop();
            if (currentScore) {
                scores.push(currentScore);
                const childScores = await this.getChildrenByScoreId(currentScore.id);
                scoresToProcess.push(...childScores)
            }
        }
        return scores
    }

}