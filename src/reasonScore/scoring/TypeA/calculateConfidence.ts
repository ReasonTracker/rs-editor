import { Connector } from "../../types/Connector";
import { Score } from "./Score";

/**
 * an average of all the children confidences weighted by their relevance and reversed if they are a con
 * @param children only child scores that affect confidence
 */
export function calculateConfidence(children: { score: Score, connector?: Connector }[]) {

    // If there are no confidence Children then we assume a confidence of 1
    if (children.length < 1) { return 1; }

    let ChildrenWeight = 0;
    for (const child of children) {
        if (!child.score) continue;
        ChildrenWeight += weight(child.score);
    }

    let confidence = 0;
    if (ChildrenWeight !== 0) {
        for (const child of children) {
            if (!child.score) continue;
            confidence +=
                child.score.confidence
                * weight(child.score) / ChildrenWeight // multiply by the percentage of the total children weight
                * (child.connector?.proTarget === false ? -1 : 1); // Flip it if it is a con (not pro)
        }
    }

    if (confidence < 0) confidence = 0;

    return confidence;
}

function weight(score: Score) {
    if (!score) return 0;
    return Math.abs(score.confidence) * score.relevance
}