import { RsData } from "./rs";

export const rsData: RsData = {
    "ScoreTreeIds": [
        "ScoreTree"
    ],
    "actionsLog": [],
    "childIdsByScoreId": {
        "Y1ZYuT1ozBD8": [
            "Y1ZYuT0bKI5U",
            "Y1ZYuT0Zkwlc"
        ],
        "Y1ZYuT2nraY0": [
            "Y1ZYuT1V7BaV"
        ],
        "footTrafficScore": [
            "payoffScore"
        ],
        "mainClaimScore": [
            "footTrafficScore",
            "resedentialScore",
            "costScore"
        ],
        "mainScore": [
            "Y1ZYuT2nraY0",
            "Y1ZYuT1ozBD8",
            "Y1ZYuT0q7JV6"
        ],
        "resedentialScore": [
            "childrenScore",
            "traintracksScore"
        ]
    },
    "claimEdgeIdsByChildId": {
        "children": [
            "childrenEdge"
        ],
        "cost": [
            "costEdge"
        ],
        "footTraffic": [
            "footTrafficEdge"
        ],
        "payoff": [
            "payoffEdge"
        ],
        "resedential": [
            "resedentialEdge"
        ],
        "traintracks": [
            "traintracksEdge"
        ]
    },
    "claimEdgeIdsByParentId": {
        "footTraffic": [
            "payoffEdge"
        ],
        "mainClaim": [
            "footTrafficEdge",
            "resedentialEdge",
            "costEdge"
        ],
        "resedential": [
            "childrenEdge",
            "traintracksEdge"
        ]
    },
    "items": {
        "ScoreTree": {
            "confidence": 1,
            "descendantCount": 6,
            "id": "ScoreTree",
            "sourceClaimId": "mainClaim",
            "topScoreId": "mainScore",
            "type": "scoreTree"
        },
        "payoffEdge": {
            "affects": "relevance",
            "childId": "payoff",
            "id": "payoffEdge",
            "parentId": "footTraffic",
            "priority": "",
            "pro": true,
            "type": "claimEdge"
        },
        "childrenEdge": {
            "affects": "relevance",
            "childId": "children",
            "id": "childrenEdge",
            "parentId": "resedential",
            "priority": "",
            "pro": true,
            "type": "claimEdge"
        },
        "cost": {
            "content": "The conversion will cost 2 Million dollars.",
            "id": "cost",
            "reversible": false,
            "type": "claim"
        },
        "costEdge": {
            "affects": "confidence",
            "childId": "cost",
            "id": "costEdge",
            "parentId": "mainClaim",
            "priority": "",
            "pro": false,
            "type": "claimEdge"
        },
        "costScore": {
            "affects": "confidence",
            "childrenAveragingWeight": 1,
            "childrenConfidenceWeight": 1,
            "childrenRelevanceWeight": 1,
            "childrenWeight": 1,
            "confidence": 1,
            "content": "",
            "descendantCount": 0,
            "fraction": 0.5,
            "fractionSimple": 0.25,
            "generation": 1,
            "id": "costScore",
            "parentScoreId": "mainClaimScore",
            "percentOfWeight": 0.3333333333333333,
            "priority": "",
            "pro": false,
            "relevance": 1,
            "reversible": false,
            "scoreTreeId": "ScoreTree",
            "sourceClaimId": "cost",
            "sourceEdgeId": "costEdge",
            "type": "score",
            "weight": 1
        },
        "footTraffic": {
            "content": "This will increase foot traffic to local shops by 15%.",
            "id": "footTraffic",
            "reversible": false,
            "type": "claim"
        },
        "footTrafficEdge": {
            "affects": "confidence",
            "childId": "footTraffic",
            "id": "footTrafficEdge",
            "parentId": "mainClaim",
            "priority": "",
            "pro": true,
            "type": "claimEdge"
        },
        "footTrafficScore": {
            "affects": "confidence",
            "childrenAveragingWeight": 2,
            "childrenConfidenceWeight": 2,
            "childrenRelevanceWeight": 2,
            "childrenWeight": 2,
            "confidence": 1,
            "content": "",
            "descendantCount": 1,
            "fraction": 0.5,
            "fractionSimple": 0.25,
            "generation": 1,
            "id": "footTrafficScore",
            "parentScoreId": "mainClaimScore",
            "percentOfWeight": 0.6666666666666666,
            "priority": "",
            "pro": true,
            "relevance": 2,
            "reversible": false,
            "scoreTreeId": "ScoreTree",
            "sourceClaimId": "footTraffic",
            "sourceEdgeId": "footTrafficEdge",
            "type": "score",
            "weight": 2
        },
        "mainClaim": {
            "content": "Would Fictional City benefit overall from converting Elm Street to pedestrian use only?",
            "id": "mainClaim",
            "labelMax": "benefit",
            "labelMid": "unknown",
            "labelMin": "disadvantage",
            "reversible": true,
            "type": "claim"
        },
        "mainClaimScore": {
            "affects": "confidence",
            "childrenAveragingWeight": 3,
            "childrenConfidenceWeight": 2,
            "childrenRelevanceWeight": 5,
            "childrenWeight": 3,
            "confidence": 0.3333333333333333,
            "content": "",
            "descendantCount": 6,
            "fraction": 1,
            "fractionSimple": 1,
            "generation": 0,
            "id": "mainClaimScore",
            "parentScoreId": null,
            "percentOfWeight": 1,
            "priority": "",
            "pro": true,
            "relevance": 1,
            "reversible": false,
            "scoreTreeId": "ScoreTree",
            "sourceClaimId": "mainClaim",
            "sourceEdgeId": null,
            "type": "score",
            "weight": 1
        },
        "payoff": {
            "content": "The increase in revenue is expected to pay off the expense in under 2 years.",
            "id": "payoff",
            "reversible": false,
            "type": "claim"
        },
        "children": {
            "content": "Child safety is more important than local shops profit.",
            "id": "children",
            "reversible": false,
            "type": "claim"
        },
        "payoffScore": {
            "affects": "relevance",
            "childrenAveragingWeight": 1,
            "childrenConfidenceWeight": 1,
            "childrenRelevanceWeight": 1,
            "childrenWeight": 1,
            "confidence": 1,
            "content": "",
            "descendantCount": 0,
            "fraction": 0.5,
            "fractionSimple": 0.25,
            "generation": 2,
            "id": "payoffScore",
            "parentScoreId": "footTrafficScore",
            "percentOfWeight": 1,
            "priority": "",
            "pro": true,
            "relevance": 1,
            "reversible": false,
            "scoreTreeId": "ScoreTree",
            "sourceClaimId": "payoff",
            "sourceEdgeId": "payoffEdge",
            "type": "score",
            "weight": 1
        },
        "childrenScore": {
            "affects": "relevance",
            "childrenAveragingWeight": 1,
            "childrenConfidenceWeight": 1,
            "childrenRelevanceWeight": 1,
            "childrenWeight": 1,
            "confidence": 1,
            "content": "",
            "descendantCount": 0,
            "fraction": 0,
            "fractionSimple": 0.5,
            "generation": 2,
            "id": "childrenScore",
            "parentScoreId": "resedentialScore",
            "percentOfWeight": 1,
            "priority": "",
            "pro": true,
            "relevance": 1,
            "reversible": false,
            "scoreTreeId": "ScoreTree",
            "sourceClaimId": "children",
            "sourceEdgeId": "childrenEdge",
            "type": "score",
            "weight": 1
        },
        "resedential": {
            "content": "The conversion will divert traffic down residential streets endangering the lives of children.",
            "id": "resedential",
            "reversible": false,
            "type": "claim"
        },
        "resedentialEdge": {
            "affects": "confidence",
            "childId": "resedential",
            "id": "resedentialEdge",
            "parentId": "mainClaim",
            "priority": "",
            "pro": false,
            "type": "claimEdge"
        },
        "resedentialScore": {
            "affects": "confidence",
            "childrenAveragingWeight": 2,
            "childrenConfidenceWeight": 2,
            "childrenRelevanceWeight": 2,
            "childrenWeight": 2,
            "confidence": -0.5,
            "content": "",
            "descendantCount": 2,
            "fraction": 0,
            "fractionSimple": 0.5,
            "generation": 1,
            "id": "resedentialScore",
            "parentScoreId": "mainClaimScore",
            "percentOfWeight": 0,
            "priority": "",
            "pro": false,
            "relevance": 2,
            "reversible": false,
            "scoreTreeId": "ScoreTree",
            "sourceClaimId": "resedential",
            "sourceEdgeId": "resedentialEdge",
            "type": "score",
            "weight": 0
        },
        "traintracks": {
            "content": "A set of railroad tracks are no longer in use and the City can convert that to a new street.",
            "id": "traintracks",
            "reversible": false,
            "type": "claim"
        },
        "traintracksEdge": {
            "affects": "confidence",
            "childId": "traintracks",
            "id": "traintracksEdge",
            "parentId": "resedential",
            "priority": "",
            "pro": false,
            "type": "claimEdge"
        },
        "traintracksScore": {
            "affects": "confidence",
            "childrenAveragingWeight": 1,
            "childrenConfidenceWeight": 1,
            "childrenRelevanceWeight": 1,
            "childrenWeight": 1,
            "confidence": 1,
            "content": "",
            "descendantCount": 0,
            "fraction": 0,
            "fractionSimple": 0.5,
            "generation": 2,
            "id": "traintracksScore",
            "parentScoreId": "resedentialScore",
            "percentOfWeight": 0.5,
            "priority": "",
            "pro": false,
            "relevance": 1,
            "reversible": false,
            "scoreTreeId": "ScoreTree",
            "sourceClaimId": "traintracks",
            "sourceEdgeId": "traintracksEdge",
            "type": "score",
            "weight": 1
        }
    },
    "scoreIdsBySourceId": {
        "children": [
            "childrenScore",
            "Y1ZYuT0bKI5U"
        ],
        "childrenEdge": [
            "childrenScore",
            "Y1ZYuT0bKI5U"
        ],
        "cost": [
            "costScore",
            "Y1ZYuT0q7JV6"
        ],
        "costEdge": [
            "costScore",
            "Y1ZYuT0q7JV6"
        ],
        "footTraffic": [
            "footTrafficScore",
            "Y1ZYuT2nraY0"
        ],
        "footTrafficEdge": [
            "footTrafficScore",
            "Y1ZYuT2nraY0"
        ],
        "mainClaim": [
            "mainClaimScore",
            "mainScore"
        ],
        "payoff": [
            "payoffScore",
            "Y1ZYuT1V7BaV"
        ],
        "payoffEdge": [
            "payoffScore",
            "Y1ZYuT1V7BaV"
        ],
        "resedential": [
            "resedentialScore",
            "Y1ZYuT1ozBD8"
        ],
        "resedentialEdge": [
            "resedentialScore",
            "Y1ZYuT1ozBD8"
        ],
        "traintracks": [
            "traintracksScore",
            "Y1ZYuT0Zkwlc"
        ],
        "traintracksEdge": [
            "traintracksScore",
            "Y1ZYuT0Zkwlc"
        ]
    }
}