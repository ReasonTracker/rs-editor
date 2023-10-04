import { newClaim } from "@/reasonScoreNext/Claim";
import { newConnector } from "@/reasonScoreNext/Connector";
import { DebateData } from "@/reasonScoreNext/DebateData";
import { getNewScore } from "@/reasonScoreNext/scoring/TypeA/Score";

export const initialDebateData: DebateData = {
  claims: {},
  connectors: {},
};

const claim1 = newClaim({
  content: "Cats are better pets than dogs.",
});
const claim2 = newClaim({
  content: "Dogs are loyal and protective.",
});

const score1 = getNewScore({
  id: "s" + claim1.id,
  type: "score",
  confidence: 0.5,
  relevance: 1,
});

// TEMP - REMOVE
let scoreNumber = 0;
let scoreNumberText = "--";
let confidence = score1.confidence < 0 ? 0 : score1.confidence;
scoreNumber = Math.round(confidence * score1.relevance * 100);
if (true) {
    const sign = "X"
    scoreNumberText = `${sign} ${(score1.relevance + 1).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
} 
// else {
//     if (scoreNumber === 100) scoreNumber = 99;
//     scoreNumberText = `${scoreNumber.toString().padStart(2, " ")}%`;
// }

initialDebateData.claims[claim1.id] = claim1;

const connector = newConnector({
  target: claim1.id,
  source: claim2.id,
  proTarget: false,
  affects: "confidence",
});

initialDebateData.connectors[connector.id] = connector;

export const initialNodes = [
  {
    id: claim1.id,
    type: "rsNode",
    data: {
      claim: claim1,
      score: score1,
      pol: "pro" as "pro" | "con",
      scoreNumberText: scoreNumberText,
      scoreNumber: scoreNumber
    },
    position: {
      x: 250,
      y: 5,
    },
  },
];

// Uncomment if needed.
// export const initialEdges = [
//   {
//     id: "edge-" + connector.id,
//     source: claim1.id,
//     target: claim2.id,
//     animated: true,
//     type: "rsEdge",
//   },
// ];
