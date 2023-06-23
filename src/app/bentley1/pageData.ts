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
            if (!generationItems[item.generation]) generationItems[item.generation] = []
            generationItems[item.generation].push(item)
            nodes.push(
                {
                    id: item.id,
                    type: 'rsNode',
                    position: {
                        y: generationItems[item.generation].length * 100,
                        x: (item.generation * 500) + 100,
                    }, data: {
                        label: (rsData.items[item.sourceClaimId] as Claim).content,
                        pol: item.pro ? "pro" : "con",
                        score: item.confidence,
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
            const child = rsData.items[rsData.scoreIdsBySourceId[item.childId][0]] as Score;
            edges.push(
                {
                    id: item.id,
                    type: "rsEdge",
                    source: child.id,
                    target: rsData.items[rsData.scoreIdsBySourceId[item.parentId][0]].id,
                    data: {
                        pol: item.pro ? "pro" : "con",
                        score: Math.abs(child.confidence),
                        data: {
                            startLabel: '<',
                            endLabel: '<',
                        },
                    }
                }
            )
        }
    }

    return edges;
}




