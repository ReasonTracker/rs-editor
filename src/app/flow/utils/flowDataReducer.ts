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

export function flowDataReducer({
  actions,
  setDisplayNodes,
  setDisplayEdges,
  setDebateData,
}: {
  actions: ActionTypes[];
  setDisplayNodes: DispatchType<NodeArray>;
  setDisplayEdges: DispatchType<EdgeArray>;
  setDebateData: Dispatch<SetStateAction<DebateData>>;
}) {
  // TODO: Right now all data changes so does a lot of screen updating. Refactor
  //  * Apply actions to reasonScore debate data
  setDebateData((oldDebateData) => {
    const newDebateData = rsReducer(actions, oldDebateData);
    const newScores = calculateScores(newDebateData);

    // TODO: Figure out new nodes and new edges
    let newDisplayNodes: Node<DisplayNodeData>[] = [];
    for (const score of Object.values(newScores)) {
      // if (oldDebateData.claims[score.id]) continue
      newDisplayNodes.push({
        id: score.id,
        type: "rsNode",
        position: { x: 20, y: 20 },
        data: {
          pol: "pro",
          score: score,
          claim: newDebateData.claims[score.id],
          scoreNumberText: "scoreNumberText",
          scoreNumber: 50,
        },
      });
    }
    setDisplayNodes(newDisplayNodes);
    
    // WIP
    let newDisplayEdges: Edge<DisplayEdgeData>[] = [];
    for (const edge of Object.values(newDebateData.connectors)) {
      // if (oldDebateData.connectors[edge.id]) continue
      const stacked = {
        top: 1,
        bottom: 1,
        center: 1,
      };
      newDisplayEdges.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "rsEdge",
        data: {
          pol: "pro",
          type: "confidence",
          maxImpactStacked: stacked,
          impactStacked: stacked,
          reducedImpactStacked: stacked,
          reducedMaxImpactStacked: stacked,
          consolidatedStacked: stacked,
          scaledTo1Stacked: stacked,
          impact: 1,
          targetTop: 1,
          maxImpact: 1,
        },
      });
    }
    setDisplayEdges(newDisplayEdges);

    return newDebateData;
  });

}
