import { SequenceStep } from "../components/VideoPlayer";

export const animalAudioUrl = "/dev/elevenlabs-generated-claims.mp3"
export const getAnimalSequence = (mainClaimId: string): SequenceStep[] => [
    {
        audio: { start: 0, end: 14.5 }
    },
    {
        nodes: [{ isNewNodePro: true, claimContent: "insects are Gorgeous and Handcrafted.", claimId: mainClaimId }],
        audio: { start: 15, end: 31 }
    },
    {
        delay: 1500,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "cats are Small and Gorgeous.", sourceId: mainClaimId, claimId: "claim1" }],
        audio: { start: 31, end: 44, delay: true }
    },
    {
        delay: 1500,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: true, claimContent: "birds are Bespoke and Unbranded.", sourceId: mainClaimId, claimId: "claim2" }],
        audio: { start: 45, end: 56.5, delay: true }
    },
    {
        delay: 1000,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: true, claimContent: "cetaceans are Bespoke and Recycled.", sourceId: mainClaimId, claimId: "claim3" }],
        audio: { start: 56.5, end: 70.5, delay: true }
    },
    {
        delay: 1500,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "cetaceans are Small and Elegant.", sourceId: mainClaimId, claimId: "claim4" }],
        audio: { start: 70.5, end: 79, delay: true }
    },
    {
        delay: 1500,
        nodes: [{ targetNodePolarity: "con", isNewNodePro: true, claimContent: "snakes are Incredible and Bespoke.", sourceId: "claim1", claimId: "claim5" }],
        audio: { start: 80, end: 89, delay: true }
    },
    {
        delay: 1000,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "horses are Handcrafted and Ergonomic.", sourceId: "claim1", claimId: "claim6" }],
        audio: { start: 89, end: 100, delay: true }
    },
    {
        delay: 1500,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: true, claimContent: "bears are Sleek and Ergonomic.", sourceId: "claim1", claimId: "claim7" }],
        audio: { start: 100, end: 111, delay: true }
    },
    {
        delay: 1500,
        nodes: [{ targetNodePolarity: "pro", isNewNodePro: false, claimContent: "dogs are Gorgeous and Oriental.", sourceId: "claim7", claimId: "claim8" }],
        audio: { start: 111, end: 122.5, delay: true }
    },
    {
        audio: { start: 122.5, end: 144 }
    },
]