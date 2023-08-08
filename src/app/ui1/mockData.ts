import { newId } from "@/reasonScore/newId";
import { Edge } from "reactflow";
import { ConfidenceEdgeData, DisplayNodeData } from "./pageData";
import { Score, Claim, ClaimEdge } from "./rs";
import { Stacked } from "./stackSpace";

// Generate Mock Data
const claimId = "claimId" + newId();
const newScoreId = `${claimId}Score` 
const nodeId = newScoreId
const claimEdgeId = "claimEdgeId" + newId();
const newEdgeId = "newEdgeId-" + newId();

// const scoreRootId = rsRepo.rsData.ScoreRootIds[0];
// const newNodeScore = new Score(claimId, scoreRootId, undefined, undefined, false, true, "confidence", 1, 1, newScoreId);

// Mock Data

const claim: Claim = {
  id: claimId,
  content: `new claim ${claimId}`,
  reversible: false,
  type: `claim`,
}
const newScore: Score = {
  type: 'score',
  sourceClaimId: claimId,
  scoreRootId: 'ScoreRoot',
  parentScoreId,
  sourceEdgeId: claimEdgeId,
  reversible: true,
  pro: true,
  affects: 'confidence',
  confidence: 0.9,
  relevance: 1.2,
  id: newScoreId,
  priority: 'high',
  content: 'why does score have content?  I thought score used claim content?',
  scaledWeight: 0.7,
  descendantCount: 3,
  generation: 2,
  fractionSimple: 0.8,
  fraction: 0.6,
  childrenAveragingWeight: 0.7,
  childrenConfidenceWeight: 0.9,
  childrenRelevanceWeight: 0.5,
  childrenWeight: 0.4,
  weight: 0.6,
  percentOfWeight: 0.75,
  proMain: true
}
const claimEdge: ClaimEdge = {
  parentId: parentClaimId,
  childId: claimId,
  affects: 'confidence',
  pro: true,
  proMain: true,
  id: claimEdgeId,
  priority: 'high',
  type: 'claimEdge',
}
const stacked: Stacked = {
  top: 2.5,
  center: 3,
  bottom: 3.5
}
const confidenceEdgeData: ConfidenceEdgeData = {
  pol,
  claimEdge,
  sourceScore: parentScore[0],
  maxImpactStacked: stacked,
  impactStacked: stacked,
  reducedImpactStacked: stacked,
  reducedMaxImpactStacked: stacked,
  consolidatedStacked: stacked,
  scaledTo1Stacked: stacked,
  type: "confidence",

  // TODO: Remove all below
  impact: 0,
  targetTop: 0,
  maxImpact: 0,
}
const edgeConfidenceEdgeData: Edge<ConfidenceEdgeData> = {
  id: newEdgeId,
  type: "rsEdge",
  target: isTarget ? connectingNode.current.nodeId! : nodeId, // Fix the !
  targetHandle: isTarget ? connectingNode.current.handleId : 'confidence',
  source: isTarget ? nodeId : connectingNode.current.nodeId!, // Fix the !
  // data: confidenceEdgeData
}
const node: Node<DisplayNodeData> = { 
  id: nodeId,
  type: 'rsNode',
  position: project({
    x: clientX - left - 75,
    y: clientY - top,
  }),
  data: {
    claim,
    score: newNodeScore,
    pol,
    scoreNumber: 1,
    scoreNumberText: "replaceMe",
    cancelOutStacked: { top: 1, center: 1, bottom: 1 },
  },   
};