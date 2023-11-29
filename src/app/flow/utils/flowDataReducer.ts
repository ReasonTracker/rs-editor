import { ActionTypes } from "@/reasonScoreNext/ActionTypes";
import { Dispatch, SetStateAction } from "react";
import { Node, Edge } from "reactflow";
import { rsReducer } from "@/reasonScoreNext/rsReducer";
import { DebateData } from "@/reasonScoreNext/DebateData";
import { calculateScores } from "@/reasonScoreNext/scoring/TypeA/calculateScores";
import {
    DisplayNodeData,
    NodeArray,
    EdgeArray,
    DispatchType,
    DisplayEdgeData,
} from "@/app/flow/types/types";
import getLayoutedElements from "./getLayoutedElements";
import { scaleStacked, sizeStacked, stackSpace } from "@/utils/stackSpace";
import { GUTTER } from "../data/config";
import { getNewScore } from "@/reasonScoreNext/scoring/TypeA/Score";

export function flowDataReducer({
    actions,
    setDisplayNodes,
    setDisplayEdges,
    setDebateData,
    displayNodes
}: {
    actions: ActionTypes[];
    setDisplayNodes: DispatchType<NodeArray>;
    setDisplayEdges: DispatchType<EdgeArray>;
    setDebateData: Dispatch<SetStateAction<DebateData>>;
    displayNodes: Node<DisplayNodeData>[];
}) {
    // TODO: Right now all data changes so does a lot of screen updating. Refactor
    //  * Apply actions to reasonScore debate data
    setDebateData((oldDebateData) => {
        const newDebateData = rsReducer(actions, oldDebateData);
        const newScores = calculateScores(newDebateData, displayNodes);
        const connectors = newDebateData.connectors;

        const cancelOut = stackSpace();

        // TODO: Figure out new nodes and new edges
        let newDisplayNodes: Node<DisplayNodeData>[] = [];
        for (const score of Object.values(newScores)) {

            const claim = newDebateData.claims[score.id]
            const cancelOutStacked = cancelOut(score.confidence);


            // TODO update, add position to debateData
            // TODO probably remove, irrelevant with dagre now I think
            const position = () => {

                const existingPosition = displayNodes.find((node) => node.id === score.id)?.position
                if (existingPosition) return existingPosition

                // Identify Connector
                let connector = Object.values(connectors).find(conn => conn.source === score.id);

                // Identify Source ID
                let targetId = connector?.target;

                // Locate Source ID Position in displayNodes
                let sourceNode = displayNodes.find(node => node.id === targetId);
                if (!sourceNode) return { x: 0, y: 0 }

                return {
                    x: sourceNode.position.x + 600,
                    y: sourceNode.position.y
                }
            }

            // if (oldDebateData.claims[score.id]) continue
            newDisplayNodes.push({
                id: score.id,
                type: "rsNode",
                position: { x: 0, y: 0 }, // position()
                data: {
                    pol: claim.pol || "pro",
                    score: score,
                    claim: newDebateData.claims[score.id],
                    scoreNumberText: "scoreNumberText",
                    scoreNumber: 50,
                    cancelOutStacked
                },
            });
        }

        // WIP
        let lastBottom = 0;
        const maxImpactStack = stackSpace(GUTTER);
        const consolidatedStack = stackSpace();
        const scaledTo1Stack = stackSpace();

        let newDisplayEdges: Edge<DisplayEdgeData>[] = [];
        for (const edge of Object.values(newDebateData.connectors)) {
            // if (oldDebateData.connectors[edge.id]) continue

            let sourceScore = displayNodes.find((node) => node.id === edge.source)?.data?.score;
            if (!sourceScore) {
                sourceScore = getNewScore({ id: edge.id, type: "score" })
                console.log("new score generated")
            }

            const impact = Math.max(sourceScore.confidence, 0) * sourceScore.relevance;
            const maxImpact = sourceScore.relevance;

            const maxImpactStacked = maxImpactStack(sourceScore.relevance);
            const impactStacked = sizeStacked(maxImpactStacked, impact);
            const reducedImpactStacked = scaleStacked(impactStacked, sourceScore.confidence);
            const reducedMaxImpactStacked = scaleStacked(maxImpactStacked, sourceScore.confidence);
            const consolidatedStacked = consolidatedStack(impact * sourceScore.confidence);
            // const scaledTo1Stacked = scaledTo1Stack(sourceScore.percentOfWeight); //percentOfWeight doesn't exist
            const scaledTo1Stacked = scaledTo1Stack(.5); // temp


            const pol = edge.proTarget ? "pro" : "con"
            const type = edge.affects

            const persistedData = {
                pol,
                // claimEdge: ClaimEdge,
                sourceScore,
                type,
            }
            const calculatedData = {
                maxImpactStacked,
                impactStacked,
                reducedImpactStacked,
                reducedMaxImpactStacked,
                consolidatedStacked,
                scaledTo1Stacked,
                impact: 1,
                targetTop: lastBottom,
                maxImpact,
            }
            const data = {
                ...persistedData,
                ...calculatedData
            }

            newDisplayEdges.push({
                id: edge.id,
                source: edge.source,
                targetHandle: edge.affects,
                target: edge.target,
                type: "rsEdge",
                data
            });

            lastBottom += maxImpact;
            lastBottom += GUTTER;
        }

        const { nodes, edges } = getLayoutedElements(newDisplayNodes, newDisplayEdges)

        setDisplayNodes(nodes);
        setDisplayEdges(edges);

        return newDebateData;
    });

}
