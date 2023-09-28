import { newClaim } from "@/reasonScoreNext/Claim";
import { newConnector } from "@/reasonScoreNext/Connector";
import { DebateData } from "@/reasonScoreNext/DebateData";

export const initialDebateData: DebateData = {
  claims: {},
  connectors: {}
};

const claim1 = newClaim({
  content: "Cats are better pets than dogs.",
});
const claim2 = newClaim({
  content: "Dogs are loyal and protective.",
});

initialDebateData.claims[claim1.id] = claim1;
initialDebateData.claims[claim2.id] = claim2;

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
    type: "input",
    data: { label: claim1.content },
    position: { x: 250, y: 5 },
  },
  {
    id: claim2.id,
    data: { label: claim2.content },
    position: { x: 100, y: 100 },
  },
];

export const initialEdges = [
  {
    id: "edge-" + connector.id,
    source: claim1.id,
    target: claim2.id,
    animated: true,
  },
];
