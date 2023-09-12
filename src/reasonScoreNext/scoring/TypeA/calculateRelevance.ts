
import { Score } from "./Score";

/**
 * 
 * @param children only child scores that affect relevance
 */
export function calculateRelevance(children: Score[]) {

    // If there are no relevance Children then we assume a relevance of 1
    if (children.length < 1) { return 1; }

    let relevance = 0;
    for (const child of children) {
        if (child.confidence > 0) { // skip if the confidence is less than zero (not reversable)
            if (child.pro) {
                relevance += child.confidence;
            } else {
                relevance -= child.confidence / 2
            }
        }
    }

    return relevance;
}
