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
} from "@/types/types";

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
    const newDisplayNodes: Node<DisplayNodeData>[] = [];
    for (const score of Object.values(newScores)) {
      newDisplayNodes.push({
        id: score.id,
        type: "rsNode",
        position: { x: 20, y: 20 },
        data: {
          pol: "pro",
          score: score,
          claim: newDebateData.claims[score.id.substring(1)],
          scoreNumberText: "scoreNumberText",
          scoreNumber: 50,
        },
      });
    }
    setDisplayNodes((oldNodes) => oldNodes.concat(newDisplayNodes));
    console.log(`newDisplayNodes`, newDisplayNodes);
    //setDisplayEdges((oldEdges) => oldEdges);

    return newDebateData;
  });
}
