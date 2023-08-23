import { rsData } from './rsData';
import { Action, Claim, ClaimEdge, RepositoryLocalPure, Score, calculateScoreActions, isClaimEdge, isScore } from './rs';
import { Edge, Node } from 'reactflow';
import { maxStrokeWidth } from './config';
import { Stacked, scaleStacked, sizeStacked, stackSpace } from './stackSpace';

const gutter = .25;

export function isConfidenceEdgeData(data: ConfidenceEdgeData | RelevenceEdgeData | undefined): data is ConfidenceEdgeData {
    return data?.type === "confidence";
}

export function isRelevanceEdgeData(data: ConfidenceEdgeData | RelevenceEdgeData | undefined): data is RelevenceEdgeData {
    return data?.type === "relevance";
}

export interface DisplayNodeData {
    pol: "pro" | "con"
    score: Score
    claim: Claim
    scoreNumberText: string
    scoreNumber: number
    cancelOutStacked: Stacked
}

export interface ConfidenceEdgeData {
    pol: string
    claimEdge: ClaimEdge
    sourceScore: Score
    maxImpactStacked: Stacked
    impactStacked: Stacked
    reducedImpactStacked: Stacked
    reducedMaxImpactStacked: Stacked
    consolidatedStacked: Stacked
    scaledTo1Stacked: Stacked
    type: "confidence"


    // TODO: Remove all below
    impact: number
    targetTop: number
    maxImpact: number
}

export interface RelevenceEdgeData {
    pol: string
    claimEdge: ClaimEdge
    sourceScore: Score
    type: "relevance"
    maxImpact: number
}

type ProcessEdgesProps = {
    rsRepo: RepositoryLocalPure,
    targetScore: Score,
    existingDisplayEdges: Edge<ConfidenceEdgeData | RelevenceEdgeData>[]
   }
  
type ProcessClaimsProps = {
    rsRepo: RepositoryLocalPure,
    targetScore: Score,
    generationItems?: { [key: string]: number },
    existingDisplayNodes: Node<DisplayNodeData>[],
    position?: { x: number, y: number }
  };

const initialPositions: { [key: string]: { x: number, y: number } } = {
    "mainClaim": {
        "x": 100,
        "y": 0
    },
    "footTraffic": {
        "x": 600,
        "y": -130
    }
    ,
    "payoff": {
        "x": 750,
        "y": -285
    }
    ,
    "traintracks": {
        "x": 1100,
        "y": 203
    }
    ,
    "children": {
        "x": 750,
        "y": -14
    }
    ,
    "test": {
        "x": 1100,
        "y": 127
    }
    ,
    "test2": {
        "x": 1100,
        "y": 49
    }
    ,
    "resedential": {
        "x": 600,
        "y": 111
    },
    "cost": {
        "x": 600,
        "y": 263
    }
}

export async function processConfidenceEdges({ rsRepo, targetScore, existingDisplayEdges}: ProcessEdgesProps) {
    // get the score's confidence edges
    const claimEdges = await rsRepo.getClaimEdgesByParentId(targetScore.sourceClaimId);
    const confidenceEdges = claimEdges.filter(ce => ce.affects === "confidence");
    confidenceEdges.sort((a, b) => a.proMain === targetScore.proMain ? -1 : 1);
    let lastBottom = 0;
    const maxImpactStack = stackSpace(gutter);
    const consolidatedStack = stackSpace();
    const scaledTo1Stack = stackSpace();
    // let lastProMain = undefined;
    let displayEdgesToAdd: Edge<ConfidenceEdgeData | RelevenceEdgeData>[] = []
    for (const confidenceEdge of confidenceEdges) {
        const sourceScore = (await rsRepo.getScoresBySourceId(confidenceEdge.childId))[0];
        const impact = Math.max(sourceScore.confidence, 0) * sourceScore.relevance;
        const maxImpact = sourceScore.relevance;
        // const proChangeGap = lastProMain === true && sourceScore.proMain === false ? 1 : 0
        const maxImpactStacked = maxImpactStack(sourceScore.relevance);
        const impactStacked = sizeStacked(maxImpactStacked, impact);
        const reducedImpactStacked = scaleStacked(impactStacked, sourceScore.confidence);
        const reducedMaxImpactStacked = scaleStacked(maxImpactStacked, sourceScore.confidence);
        const consolidatedStacked = consolidatedStack(impact * sourceScore.confidence);
        const scaledTo1Stacked = scaledTo1Stack(sourceScore.percentOfWeight);

        if (existingDisplayEdges.some(edge => edge.id === confidenceEdge.id)) {
            continue;
        }
        const edge: Edge<ConfidenceEdgeData> = {
            id: confidenceEdge.id,
            type: "rsEdge",
            target: targetScore.id,
            targetHandle: 'confidence',
            source: sourceScore.id,
            data: {
                pol: sourceScore.proMain ? "pro" : "con",
                maxImpact,
                impact: impact,
                targetTop: lastBottom,
                claimEdge: confidenceEdge,
                sourceScore,
                maxImpactStacked,
                impactStacked,
                reducedImpactStacked,
                reducedMaxImpactStacked,
                consolidatedStacked,
                scaledTo1Stacked,
                type: "confidence",
            }
        };

        lastBottom += maxImpact;
        lastBottom += gutter;
        // lastProMain = sourceScore.proMain;
        displayEdgesToAdd.push(edge);
    }
    return displayEdgesToAdd
}

export async function processRelevanceEdges({ rsRepo, targetScore, existingDisplayEdges }: ProcessEdgesProps) {
    const claimEdges = await rsRepo.getClaimEdgesByParentId(targetScore.sourceClaimId);
    const relevanceEdges = claimEdges.filter(ce => ce.affects === "relevance");
    let displayEdgesToAdd: Edge<ConfidenceEdgeData | RelevenceEdgeData>[] = []
    for (const relevanceEdge of relevanceEdges) {
        const sourceScore = (await rsRepo.getScoresBySourceId(relevanceEdge.childId))[0];
        const maxImpact = sourceScore.relevance;
        if (existingDisplayEdges.some(edge => edge.id === relevanceEdge.id)) {
            continue;
        }
        const edge: Edge<RelevenceEdgeData> = {
            id: relevanceEdge.id,
            type: "rsEdge",
            target: targetScore.id,
            targetHandle: 'relevance',
            source: sourceScore.id,
            data: {
                pol: sourceScore.proMain ? "pro" : "con",
                claimEdge: relevanceEdge,
                sourceScore,
                maxImpact,
                type: "relevance",
            }
        };

        displayEdgesToAdd.push(edge);
    }
    return displayEdgesToAdd
}
  
export async function processClaims({
    rsRepo,
    targetScore,
    generationItems = {},
    existingDisplayNodes,
    position
  }: ProcessClaimsProps) {
    const claim = await rsRepo.getClaim(targetScore.sourceClaimId);
    if (!generationItems[targetScore.generation]) generationItems[targetScore.generation] = 0;

    // TODO: Math and text ---------- move to a central function
    let scoreNumber = 0;
    let scoreNumberText = "--";
    let confidence = targetScore.confidence < 0 ? 0 : targetScore.confidence;
    scoreNumber = Math.round(confidence * targetScore.relevance * 100);
    if (targetScore.affects === "relevance") {
        const sign = targetScore.pro ? "X" : "÷";
        scoreNumberText = `${sign} ${(targetScore.relevance + 1).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
    } else {
        if (scoreNumber === 100) scoreNumber = 99;
        scoreNumberText = `${scoreNumber.toString().padStart(2, " ")}%`;
    }
    // end TODO
    if (existingDisplayNodes.some(node => node.id === targetScore.id)) {
        return;
    }
    if (!claim) return

    const positionToSet = position || initialPositions[claim.id] || {
        y: (generationItems[targetScore.generation]),
        x: (targetScore.generation * 500) + 100,
    };
    const cancelOut = stackSpace();
    const cancelOutStacked = cancelOut(targetScore.confidence);
    let displayNodesToAdd:Node<DisplayNodeData>[] = [];
    const node: Node<DisplayNodeData> = {
        id: targetScore.id,
        type: 'rsNode',
        position: positionToSet,
        data: {
            pol: targetScore.proMain ? "pro" : "con",
            score: targetScore,
            claim: claim,
            scoreNumberText: scoreNumberText,
            scoreNumber: scoreNumber,
            cancelOutStacked
        }
    };
    
    displayNodesToAdd.push(node);
    generationItems[targetScore.generation] += (maxStrokeWidth * 2) + ((claim?.content?.length || 0) * 1.1);
    return displayNodesToAdd
}

export async function getEdgesAndNodes(
    rsRepo: RepositoryLocalPure, 
    existingDisplayNodes: Node<DisplayNodeData>[] = [],
    existingDisplayEdges: Edge<ConfidenceEdgeData | RelevenceEdgeData>[] = [],
    position?: { x: number, y: number }
    ) {
        let scores: Score[] = [];
        const mainScoreId = (await rsRepo.getScoreRoot(rsData.ScoreRootIds[0]))?.topScoreId;
        const mainScore = await rsRepo.getScore(mainScoreId || "");
        scores = await rsRepo.getDescendantScoresById(mainScoreId || "");
        scores.reverse();
        scores.sort((a, b) => a.proMain ? -1 : 1)
        if (mainScore) scores.unshift(mainScore);
        let newDisplayNodes:Node<DisplayNodeData>[] = [];
        let newDisplayEdges:Edge<ConfidenceEdgeData | RelevenceEdgeData>[] = [];
        for (const targetScore of scores) {
            const newEdgesFromConfidence = await processConfidenceEdges({rsRepo, targetScore, existingDisplayEdges});
            const newEdgesFromRelevance = await processRelevanceEdges({rsRepo, targetScore, existingDisplayEdges});
            newDisplayEdges.push(...newEdgesFromConfidence, ...newEdgesFromRelevance || [])
            const nodesToAdd = await processClaims({rsRepo, targetScore, existingDisplayNodes: existingDisplayNodes, position});
            newDisplayNodes.push(...nodesToAdd || [])
        }
        return { newDisplayNodes, newDisplayEdges }
}
