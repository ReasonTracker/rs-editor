import { ActionTypes } from "@/reasonScoreNext/ActionTypes";
import { Dispatch, SetStateAction } from "react";
import { Node, Edge, useReactFlow } from "reactflow";
import { DisplayNodeData, ConfidenceEdgeData, RelevenceEdgeData } from "./pageData";
import { rsReducer } from "@/reasonScoreNext/rsReducer";
import { DebateData } from "@/reasonScoreNext/DebateData";
import { calculateScores } from "@/reasonScoreNext/scoring/TypeA/calculateScores";


export function flowDataReducer({ actions, setDebateData }: {
    actions: ActionTypes[],
    setDebateData: Dispatch<SetStateAction<DebateData>>
}) {
    // TODO: Right now all data changes so does a lot of screen updating. Refactor
    const { setEdges, setNodes } = useReactFlow();
    //  * Apply actions to reasonScore debate data
    setDebateData((oldDebateData) => {
        const newDebateData = rsReducer(actions, oldDebateData);
        const newScores = calculateScores(newDebateData);

        // TODO: Figure out new nodes and new edges
        setNodes((oldNodes) => oldNodes);
        setEdges((oldEdges) => oldEdges);
        
        return newDebateData;
    });

}
