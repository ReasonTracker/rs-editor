
import { Connector } from "@/reasonScoreNext/Connector";
import { Score } from "./Score";

/**
 * 
 * @param children only child scores that affect relevance
 */
export function calculateRelevance(children: { score: Score, connector?: Connector }[]) {

    // If there are no relevance Children then we assume a relevance of 1
    if (children.length < 1) { return 1; }

    let relevance = 0;
    for (const child of children) {
        if (child?.score?.confidence > 0) { // skip if the confidence is less than zero (not reversable)
            if (child.connector?.proTarget){
                relevance += child.score.confidence;
            } else {
                relevance -= child.score.confidence / 2
            }
        }
    }
    
    if (relevance < 0) relevance = 0;

    return relevance;
}
