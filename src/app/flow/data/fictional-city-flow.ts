import { SequenceStep } from "../components/VideoPlayer";

export const fictionalCityAudioUrl = "/dev/fictional-city.webm"
export const fictionalCitySequence = (mainClaim: string): SequenceStep[] => [
    {
        delay: 500,
        audio: { start: 0, end: 9.7 },
        nodes: [{ isNewNodePro: true, claimContent: "Would Fictional City benefit overall from converting Elm Street to pedestrian use only?", claimId: mainClaim }],
    },
    {
    },
    {
        delay: 500,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: true, claimContent: "This will increase foot traffic to local shops by 15%.", sourceId: mainClaim, claimId: "footTraffic" }],
        audio: { start: 23, end: 29.2, delay: true }
    },
    {
        delay: 500,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "The conversion will divert traffic down residential streets endangering the lives of children.", sourceId: mainClaim, claimId: "resedential" }],
        audio: { start: 29.2, end: 35.8, delay: true }
    },
    {
        audio: { start: 35.8, end: 40.95 }
    },
    {
        delay: 500,
        nodes: [{ targetNodePolarity: "con", isNewNodePro: false, claimContent: "Child safety is more important than local shops profit.", sourceId: "resedential", claimId: "children", affects: "relevance" }],
        audio: { start: 40.95, end: 50.3, delay: true }
    },
    {
        audio: { start: 50.3, end: 55.5 }
    },
    {
        delay: 500,
        nodes: [{ targetNodePolarity: "con", isNewNodePro: true, claimContent: "A set of railroad tracks are no longer in use and the City can convert that to a new street.", sourceId: "resedential", claimId: "traintracks" }],
        audio: { start: 55.5, end: 63.7, delay: true }
    },
    {
        audio: { start: 64.2, end: 71.80 }
    },
    {
        delay: 500,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "The conversion will cost 2 Million dollars.", sourceId: mainClaim, claimId: "cost" }],
        audio: { start: 71.87, end: 79, delay: true }
    },
    {
        delay: 500,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: true, claimContent: "The increase in revenue is expected to pay off the expense in under 2 years.", sourceId: mainClaim, claimId: "payoff" }],
        audio: { start: 82.38, end: 92, delay: true }
    },

    {
        audio: { start: 92.9, end: 100 }
    }
];
