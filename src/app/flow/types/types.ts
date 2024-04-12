// starting to put types in here, then can separate out into separate files later
import { ClaimEdge } from '@/reasonScore/rs';
import { Score } from "@/reasonScoreNext/scoring/TypeA/Score";
import { Claim } from "@/reasonScoreNext/Claim";
import { Dispatch, SetStateAction } from 'react';
import { Node, Edge } from "reactflow";
import { ActionTypes } from '@/reasonScoreNext/ActionTypes';
import { EdgeChange, NodeChange } from 'reactflow';
import { DebateData } from '@/reasonScoreNext/DebateData';
import { Debate } from '@/reasonScoreNext/Debate';

export type Polarity = "pro" | "con"
export type DisplayNodeData = {
    scoreId: string
    pol: Polarity
    score: Score
    claim: Claim
    scoreNumberText: string
    scoreNumber: number
    cancelOutStacked?: Stacked
    collapsed?: boolean
}

export type ConfidenceEdgeData = {
    pol: string
    claimEdge?: ClaimEdge
    sourceScore?: Score
    maxImpactStacked: Stacked
    impactStacked: Stacked
    reducedImpactStacked: Stacked
    reducedMaxImpactStacked: Stacked
    consolidatedStacked: Stacked
    // scaledTo1Stacked: Stacked
    type: "confidence"


    // TODO: Remove all below
    impact: number
    targetTop: number
    maxImpact: number
}

export type RelevanceEdgeData = {
    pol: string
    claimEdge?: ClaimEdge
    sourceScore?: Score
    type: "relevance"
    maxImpact: number
}

export type DisplayEdgeData = ConfidenceEdgeData | RelevanceEdgeData

export type Stacked = {
    top: number
    bottom: number
    center: number
}

export type DevContextState = {
    isDev: boolean;
    setDevMode: DispatchType<boolean>;
  };

export type FlowDataState = {
    dispatch: (actions: ActionTypes[]) => void
    displayNodes: Node<DisplayNodeData, string | undefined>[]
    setDisplayNodes: Dispatch<SetStateAction<Node<DisplayNodeData, string | undefined>[]>>
    displayEdges: Edge<DisplayEdgeData>[]
    setDisplayEdges: Dispatch<SetStateAction<Edge<DisplayEdgeData>[]>>
    onNodesChange: OnChange<NodeChange>
    onEdgesChange: OnChange<EdgeChange>
    debateData: DebateData
    animating: boolean
    debate:Debate
    setIsAddingNode: Dispatch<SetStateAction<boolean>>
    isAddingNode: boolean
  }

export type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export type NodeArray = Node<DisplayNodeData, string | undefined>[];
export type EdgeArray = Edge<DisplayEdgeData>[];
export type DispatchType<T> = Dispatch<SetStateAction<T>>;
