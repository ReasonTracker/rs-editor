import { Claim, ClaimEdge, Score } from '@reasonscore/core';
import { rsData } from './rsData';

function isScore(item: any): item is Score {
    return item.type === "score"
}

function isClaimEdge(item: any): item is ClaimEdge {
    return item.type === "claimEdge"
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




