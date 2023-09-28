import { newClaim } from "@/reasonScoreNext/Claim";
import { Connector, newConnector } from "@/reasonScoreNext/Connector";

// export const initialNodes = [
//     {
//       id: "provider-1",
//       type: "input",
//       data: { label: "Node 1" },
//       position: { x: 250, y: 5 },
//     },
//     {
//       id: "provider-2",
//       data: { label: "Node 2a" },
//       position: { x: 100, y: 100 },
//     },
//     {
//       id: "provider-3",
//       data: { label: "Node 3a" },
//       position: { x: 400, y: 100 },
//     },
//     {
//       id: "provider-4",
//       data: { label: "Node 4a" },
//       position: { x: 400, y: 200 },
//     },
//   ];
  
//   export const initialEdges = [
//     {
//       id: "provider-e1-2",
//       source: "provider-1",
//       target: "provider-2",
//       animated: true,
//     },
//     { id: "provider-e1-3", source: "provider-1", target: "provider-3" },
//   ];
  

export const initialDebateData = {
    claims: [
        newClaim({
            content: "Cats are better pets than dogs."
        }),
        newClaim({
            content: "Dogs are loyal and protective."
        })
    ],
    connectors: [] as Connector[]
};

const claim1Id = initialDebateData.claims[0].id;
const claim2Id = initialDebateData.claims[1].id;

const connector = newConnector({
    target: claim1Id,
    source: claim2Id,
    proTarget: false, 
    affects: "confidence"
});

initialDebateData.connectors.push(connector);


export const initialNodes = [
  {
    id: claim1Id,
    type: "input",
    data: { label: initialDebateData.claims[0].content },
    position: { x: 250, y: 5 },
  },
  {
    id: claim2Id,
    data: { label: initialDebateData.claims[1].content },
    position: { x: 100, y: 100 },
  }
];

export const initialEdges = [
  {
    id: "edge-" + connector.id,
    source: claim1Id,
    target: claim2Id,
    animated: true,
  }
];