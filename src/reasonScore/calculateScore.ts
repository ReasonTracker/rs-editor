import { Score } from "./rs";

export interface iCalculateScore {
    ({ childScores }: {
        /** An array of grouped edges and claims*/
        childScores?: Score[];
    }): Partial<Score>
}

/**
 * Calculates a new score based on the child scores passed in.
 */
export function calculateScore({ childScores = [], reversible = true }: {
    /** An array of grouped edges and claims*/
    childScores?: Score[];
    /** Can this score fall below a 0 confidence (have a negative confidence) */
    reversible?: boolean
} = {},
): Partial<Score> {
    // TODO: Simplify all this math and maybe break it up between base functionality and additional scoring (like the points)
    const newScore: Partial<Score> = {};
    newScore.confidence = 0;
    newScore.relevance = 1;
    newScore.childrenAveragingWeight = 0;
    newScore.childrenConfidenceWeight = 0;
    newScore.childrenRelevanceWeight = 0;
    newScore.childrenWeight = 0;
    // newScore.childrenProWeight = 0;
    // newScore.childrenConWeight = 0;

    let maxChildWeight = 0


    if (childScores.filter(s => s.affects === 'confidence').length < 1) {
        // Defaults if there are no children
        newScore.confidence = 1; // assume 100% confident
        newScore.relevance = 1; // assume 100% relevant
        newScore.childrenAveragingWeight = 1;
        newScore.childrenConfidenceWeight = 1;
        newScore.childrenRelevanceWeight = 1;
        newScore.childrenWeight = 1;
        newScore.weight = 1;
    }

    //Gather children Weights totals for processing further down
    for (const childScore of childScores) {
        // //Ensure calculations for non-reversible scores don't allow the confidence to be below 0
        // //TODO: Is this needed in the totals seciton?
        // let confidence = childScore.confidence
        // if (!childScore.reversible && childScore.confidence < 0) {
        //     confidence = 0
        // }

        childScore.weight = calcWeight(childScore); //TODO: Just in case a child score comes in uncalculated - maybe should be removed
        newScore.childrenAveragingWeight += 1;
        // if (childScore.affects = "confidence") {
        newScore.childrenConfidenceWeight += Math.abs(childScore.confidence);
        // } else {
        newScore.childrenRelevanceWeight += childScore.relevance;
        // }
        if (childScore.affects === "confidence") {
            newScore.childrenWeight += childScore.weight;
            if (childScore.weight > maxChildWeight) {
                maxChildWeight = childScore.weight;
            }
        }

        // //TODO: Experimantal
        // if (confidence > 0) {
        //     if (childScore.pro) {
        //         newScore.childrenProWeight += confidence
        //     }
        //     if (!childScore.pro) {
        //         newScore.childrenConWeight += confidence
        //     }
        // } else if (confidence < 0) {
        //     if (childScore.pro) {
        //         newScore.childrenConWeight += confidence
        //     }
        //     if (!childScore.pro) {
        //         newScore.childrenProWeight += confidence
        //     }
        // }
    }

    // Loop through to calculate the final confidence
    for (const childScore of childScores) {
        const polarity = childScore.proParent ? 1 : -1

        if (childScore.affects === "confidence") {
            if (newScore.childrenWeight === 0) {
                childScore.percentOfWeight = 0;
                newScore.confidence = 0;
            } else {

                childScore.percentOfWeight =
                    childScore.weight /
                    newScore.childrenWeight;

                newScore.confidence +=
                    childScore.percentOfWeight *
                    childScore.confidence * polarity;
            }
        }

        // if (childScore.pro) {
        //     childScore.percentAgreeWeight = confidence / newScore.childrenProWeight
        // } else {
        //     childScore.percentAgreeWeight = confidence / newScore.childrenConWeight
        // }

        childScore.scaledWeight = (childScore.weight / maxChildWeight)

    }

    // Loop through to calculate the final relevance
    for (const childScore of childScores) {
        if (childScore.affects === "relevance") {
            // Process Relevance child claims

            let confidence = childScore.confidence
            if (!childScore.reversible && childScore.confidence < 0) {
                confidence = 0
            }

            if (newScore.relevance == undefined) {
                newScore.relevance = 1;
            }

            if (childScore.proParent) {
                // newScore.relevance = newScore.relevance * 2;
                newScore.relevance += confidence;
            } else {
                // newScore.relevance = newScore.relevance / 2;
                newScore.relevance -= confidence / 2
            }
        }
    }


    // Protect against negative zero 
    if (Object.is(newScore.confidence, -0)) {
        newScore.confidence = 0;
    }

    let confidence = Math.abs(newScore.confidence)
    if (!newScore.reversible && newScore.confidence < 0) {
        confidence = 0
    }

    newScore.weight = calcWeight(newScore);
    newScore.scaledWeight = newScore.weight;

    return newScore;
}

function calcWeight(score: Partial<Score>) {
    if (score.confidence !== undefined && score.relevance !== undefined) {
        let confidence = Math.abs(score.confidence)
        if (!score.reversible && score.confidence < 0) {
            confidence = 0
        }
        return confidence * score.relevance;
    } else {
        return 1;
    }
}
