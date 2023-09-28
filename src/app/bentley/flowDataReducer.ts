import { ActionTypes } from "@/reasonScoreNext/ActionTypes";
import { Dispatch, SetStateAction } from "react";
import { Node, Edge } from "reactflow";
import { rsReducer } from "@/reasonScoreNext/rsReducer";
import { DebateData } from "@/reasonScoreNext/DebateData";
import { calculateScores } from "@/reasonScoreNext/scoring/TypeA/calculateScores";
import { Score } from "@/reasonScoreNext/scoring/TypeA/Score";
import { Claim } from "@/reasonScoreNext/Claim";
import { ConfidenceEdgeData, RelevenceEdgeData } from "../flow/[[...slug]]/pageData";

export interface DisplayNodeData {
    pol: "pro" | "con"
    score: Score
    claim: Claim
    scoreNumberText: string
    scoreNumber: number
}

export function flowDataReducer({ actions, setDisplayNodes, setDisplayEdges, setDebateData }: {
    actions: ActionTypes[],
    setDisplayNodes: Dispatch<SetStateAction<Node<DisplayNodeData, string | undefined>[]>>,
    setDisplayEdges: Dispatch<SetStateAction<Edge<ConfidenceEdgeData | RelevenceEdgeData>[]>>,
    setDebateData: Dispatch<SetStateAction<DebateData>>
}) {
    // TODO: Right now all data changes so does a lot of screen updating. Refactor

    //  * Apply actions to reasonScore debate data
    setDebateData((oldDebateData) => {
        const newDebateData = rsReducer(actions, oldDebateData);
        const newScores = calculateScores(newDebateData);
        // TODO: Figure out new nodes and new edges
        const newDisplayNodes: Node<DisplayNodeData>[] = [];
        for (const score of Object.values(newScores)) {
            newDisplayNodes.push(
                {
                    id: score.id,
                    type: 'rsNode',
                    position: { x: 20, y: 20 },
                    data: {
                        pol: "pro",
                        score: score,
                        claim: newDebateData.claims[score.id],
                        scoreNumberText: 'scoreNumberText',
                        scoreNumber: 50,
                    }
                }
            );
        }
        setDisplayNodes((oldNodes) => newDisplayNodes);
        console.log(`newDisplayNodes`, newDisplayNodes);
            //setDisplayEdges((oldEdges) => oldEdges);

        return newDebateData;
    });

}
