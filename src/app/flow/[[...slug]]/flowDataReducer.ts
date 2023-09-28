import { ActionTypes } from "@/reasonScoreNext/ActionTypes";
import { Dispatch, SetStateAction } from "react";
import { Node, Edge } from "reactflow";
import { DisplayNodeData, ConfidenceEdgeData, RelevenceEdgeData } from "./pageData";
import { rsReducer } from "@/reasonScoreNext/rsReducer";
import { DebateData } from "@/reasonScoreNext/DebateData";
import { calculateScores } from "@/reasonScoreNext/scoring/TypeA/calculateScores";


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
        console.log(`newDebateData`, newDebateData);
        const newScores = calculateScores(newDebateData);
        console.log(`newScores`, newScores);
        // TODO: Figure out new nodes and new edges
        setDisplayNodes((oldNodes) => oldNodes);
        setDisplayEdges((oldEdges) => oldEdges);
        
        return newDebateData;
    });

}