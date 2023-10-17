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
        const newScores = calculateScores(newDebateData);
        const connectors = newDebateData.connectors;

        // TODO: Figure out new nodes and new edges
        let newDisplayNodes: Node<DisplayNodeData>[] = [];
        for (const score of Object.values(newScores)) {

            const claim = newDebateData.claims[score.id]
            
            // TODO update, add position to debateData
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
                position: position(),
                data: {
                    pol: claim.pol || "pro", 
                    score: score,
                    claim: newDebateData.claims[score.id],
                    scoreNumberText: "scoreNumberText",
                    scoreNumber: 50,
                },
            });
        }

        // WIP
        let newDisplayEdges: Edge<DisplayEdgeData>[] = [];
        for (const edge of Object.values(newDebateData.connectors)) {
            // if (oldDebateData.connectors[edge.id]) continue

            const pol = edge.proTarget ? "pro" : "con"
            const type = edge.affects
            const stacked = {
                top: 1,
                bottom: 1,
                center: 1,
            };
            const commonData = {
                pol,
                // claimEdge: ClaimEdge,
                // sourceScore: Score,
                type,
                maxImpact: 1,
            }
            const confidenceData = {
                maxImpactStacked: stacked,
                impactStacked: stacked,
                reducedImpactStacked: stacked,
                reducedMaxImpactStacked: stacked,
                consolidatedStacked: stacked,
                scaledTo1Stacked: stacked,
                impact: 1,
                targetTop: 1,
            }
            const data = {
                ...commonData,
                ...confidenceData
            }

            newDisplayEdges.push({
                id: edge.id,
                source: edge.source,
                targetHandle: edge.affects,
                target: edge.target,
                type: "rsEdge",
                data
            });
        }

        const { nodes, edges } = getLayoutedElements(newDisplayNodes, newDisplayEdges)

        setDisplayNodes(nodes);
        setDisplayEdges(edges);

        return newDebateData;
    });

}
