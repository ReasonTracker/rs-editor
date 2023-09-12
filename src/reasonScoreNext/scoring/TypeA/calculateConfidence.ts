import { Score } from "./Score";

/**
 * an average of all the children confidences weighted by their relevance and reversed if they are a con
 * @param children only child scores that affect confidence
 */
export function calculateConfidence(children: Score[]) {

    // If there are no confidence Children then we assume a confidence of 1
    if (children.length < 1) { return 1; }

    let ChildrenWeight = 0;
    for (const child of children) {
        ChildrenWeight += weight(child);
    }

    let confidence = 0;
    for (const child of children) {
        confidence +=
            child.confidence
            * weight(child) / ChildrenWeight // multiply by the percentage of the total children weight
            * (child.pro ? 1 : -1); // Flip it if it is a con (not pro)
    }

    return confidence;
}

function weight(score: Score) {
    return Math.abs(score.confidence) * score.relevance
}