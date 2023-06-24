import { rsData } from './rsData';
import { Claim, ClaimEdge, RepositoryLocalPure, Score, isClaimEdge, isScore } from './rs';
import { Edge, Node } from 'reactflow';

// let rsRepo: RepositoryLocalPure
// export const getRsRepository = () => {
//     if (!rsRepo) {
//         rsRepo = new RepositoryLocalPure(rsData)
//     }
//     return rsRepo;
// }

export interface DisplayNodeData {
    pol: string;
    score: Score;
    claim: Claim;
    scoreNumberText: string;
    scoreNumber: number;
}

export interface DisplayEdgeData {
    pol: string;
    impact: number;
    targetTop: number;
    sourceTop: number;
    claimEdge: ClaimEdge;
}

export async function getEdgesAndNodes() {
    const nodes: Node<DisplayNodeData>[] = []
    const edges: Edge<DisplayEdgeData>[] = []
    const rsRepo = new RepositoryLocalPure(rsData)
    const mainScoreId = (await rsRepo.getScoreRoot(rsData.ScoreRootIds[0]))?.topScoreId;
    const scores = await rsRepo.getDescendantScoresById(mainScoreId || "");
    scores.sort((a, b) => a.pro ? -1 : 1)

    const mainScore = await rsRepo.getScore(mainScoreId || "");
    if (mainScore) scores.unshift(mainScore);
    const generationItems: { [key: string]: Score[] } = {}
    for (const targetScore of scores) {
        // get the score's edges
        const claimEdges = await rsRepo.getClaimEdgesByParentId(targetScore.sourceClaimId);
        claimEdges.sort((a, b) => a.pro ? -1 : 1)
        let lastBottom = 0;
        for (const claimEdge of claimEdges) {
            const sourceScore = (await rsRepo.getScoresBySourceId(claimEdge.childId))[0];
            const impact = Math.max(sourceScore.confidence, 0) * sourceScore.relevance;
            if (lastBottom === 0) lastBottom = Math.max(impact, 1) / 2
            const edge: Edge<DisplayEdgeData> = {
                id: claimEdge.id,
                type: "rsEdge",
                target: targetScore.id,
                source: sourceScore.id,
                data: {
                    pol: claimEdge.pro ? "pro" : "con",
                    impact: impact,
                    targetTop: lastBottom,
                    sourceTop: Math.max(impact, 1) / 2,
                    claimEdge: claimEdge,
                }
            }
            lastBottom += impact > 1 ? 1 + ((impact - 1) / 2) : 1;
            edges.push(edge);
        }

        // get the score's claim
        const claim = await rsRepo.getClaim(targetScore.sourceClaimId);
        if (!generationItems[targetScore.generation]) generationItems[targetScore.generation] = [];
        generationItems[targetScore.generation].push(targetScore);

        // TODO: Math and text ---------- move to a central function
        let scoreNumber = 0;
        let scoreNumberText = "--";
        let confidence = targetScore.confidence < 0 ? 0 : targetScore.confidence;

        scoreNumber = Math.round(confidence * targetScore.relevance * 100)
        if (targetScore.affects === "relevance") {
            const sign = targetScore.pro ? "X" : "÷";
            scoreNumberText = `${sign} ${(targetScore.relevance + 1).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
        } else {
            if (scoreNumber === 100) scoreNumber = 99;
            scoreNumberText = `${scoreNumber.toString().padStart(2, " ")}%`
        }
        // end TODO

        if (claim) {
            const node: Node<DisplayNodeData> = {
                id: targetScore.id,
                type: 'rsNode',
                position: {
                    y: generationItems[targetScore.generation].length * 100,
                    x: (targetScore.generation * 500) + 100,
                }, data: {
                    pol: targetScore.pro ? "pro" : "con",
                    score: targetScore,
                    claim: claim,
                    scoreNumberText: scoreNumberText,
                    scoreNumber: scoreNumber,
                }
            }
            nodes.push(node);
        }

    }

    return { nodes, edges }
}


export const getNodes = () => {
    const nodes: any[] = []

    const generationItems: { [key: string]: Score[] } = {}

    for (const item of Object.values(rsData.items)) {
        if (isScore(item)) {
            const score = item;
            if (!generationItems[item.generation]) generationItems[item.generation] = []
            generationItems[item.generation].push(item)
            const claim = rsData.items[item.sourceClaimId] as Claim
            let confidence = score.confidence;
            let scoreNumber = 0;
            let scoreNumberText = "--";
            if (score) {

                // if (!score.pro) {
                //     proMain = !proMain;
                // }
                if (score.confidence < 0) {
                    confidence = 0;
                }
                scoreNumber = Math.round(score.confidence * score.relevance * 100)
                if (score.affects === "relevance") {
                    const sign = score.pro ? "X" : "÷";
                    scoreNumberText = `${sign} ${(score.relevance + 1).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
                } else {
                    if (scoreNumber === 100) scoreNumber = 99;
                    scoreNumberText = `${scoreNumber.toString().padStart(2, " ")}%`
                }
            }
            nodes.push(
                {
                    id: item.id,
                    type: 'rsNode',
                    position: {
                        y: generationItems[item.generation].length * 100,
                        x: (item.generation * 500) + 100,
                    }, data: {
                        pol: item.pro ? "pro" : "con",
                        score: item,
                        claim: claim,
                        scoreNumberText: scoreNumberText,
                        scoreNumber: scoreNumber,
                    }
                },
            )
        }

    }
    return nodes;
}

export const getEdges = () => {

    const edges: any[] = []

    const generationItems: { [key: string]: Score[] } = {}

    for (const item of Object.values(rsData.items)) {
        if (isClaimEdge(item)) {
            // { id: 'e2-1', type: "rsEdge", source: '2', target: '1', data: { pol: "pro", score: .75 } },
            const score = rsData.items[rsData.scoreIdsBySourceId[item.childId][0]] as Score;

            edges.push(
                {
                    id: item.id,
                    type: "rsEdge",
                    source: score.id,
                    target: rsData.items[rsData.scoreIdsBySourceId[item.parentId][0]].id,
                    data: {
                        pol: item.pro ? "pro" : "con",
                        score: Math.max(score.confidence, 0) * score.relevance,
                    }
                }
            )
        }
    }

    return edges;
}




