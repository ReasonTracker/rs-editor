import { DebateData } from "@/reasonScoreNext/DebateData";
import { DisplayEdgeData, DisplayNodeData } from "../types/types";
import { Edge, Node } from "reactflow";

const mainClaim = "The Apollo moon landings were faked"
const pro1 = "The moon landing photos contain inconsistencies"
const pro2 = "Astronauts couldn't survive the Van Allen belts' radiation"
const pro3 = "1960s technology was too primitive for a moon landing"

const con1 = "Verified artifacts and independent tracking confirm the moon landings"
const con2 = "Ongoing space missions validate the Apollo program's achievements"

// TODO change to generated
// so that dagre changes take effect

export const initialDisplayEdges: Edge<DisplayEdgeData>[] = [
    {
        "id": "W8zs6Auj33jz",
        "source": "W8zs6Aus8ZqQ",
        "targetHandle": "confidence",
        "target": "W8zs7713oOLi",
        "type": "rsEdge",
        "data": {
            "pol": "pro",
            "type": "confidence",
            "maxImpact": 1,
            "maxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedMaxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "consolidatedStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "scaledTo1Stacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impact": 1,
            "targetTop": 1
        }
    },
    {
        "id": "W8zs6slrqItB",
        "source": "W8zs6sl1Vn2t",
        "targetHandle": "confidence",
        "target": "W8zs7713oOLi",
        "type": "rsEdge",
        "data": {
            "pol": "pro",
            "type": "confidence",
            "maxImpact": 1,
            "maxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedMaxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "consolidatedStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "scaledTo1Stacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impact": 1,
            "targetTop": 1
        }
    },
    {
        "id": "W8zs6bikubt2",
        "source": "W8zs6biOiqLT",
        "targetHandle": "confidence",
        "target": "W8zs7713oOLi",
        "type": "rsEdge",
        "data": {
            "pol": "pro",
            "type": "confidence",
            "maxImpact": 1,
            "maxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedMaxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "consolidatedStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "scaledTo1Stacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impact": 1,
            "targetTop": 1
        }
    },
    {
        "id": "W8zs5HQ1j6HC",
        "source": "W8zs5HQC6WKF",
        "targetHandle": "confidence",
        "target": "W8zs7713oOLi",
        "type": "rsEdge",
        "data": {
            "pol": "con",
            "type": "confidence",
            "maxImpact": 1,
            "maxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedMaxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "consolidatedStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "scaledTo1Stacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impact": 1,
            "targetTop": 1
        }
    },
    {
        "id": "W8zs4zuGZz7C",
        "source": "W8zs4zu8QoYY",
        "targetHandle": "confidence",
        "target": "W8zs7713oOLi",
        "type": "rsEdge",
        "data": {
            "pol": "con",
            "type": "confidence",
            "maxImpact": 1,
            "maxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "reducedMaxImpactStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "consolidatedStacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "scaledTo1Stacked": {
                "top": 1,
                "bottom": 1,
                "center": 1
            },
            "impact": 1,
            "targetTop": 1
        }
    }
]
export const initialDisplayNodes: Node<DisplayNodeData>[] = [
    {
        "id": "W8zs7713oOLi",
        "type": "rsNode",
        "position": {
            "x": 0,
            "y": 350
        },
        "data": {
            "pol": "pro",
            "score": {
                "type": "score",
                "id": "W8zs7713oOLi",
                "relevance": 1,
                "confidence": 1
            },
            "claim": {
                "content": `${mainClaim}`,
                "type": "claim",
                "id": "W8zs7713oOLi",
                "pol": "pro"
            },
            "scoreNumberText": "scoreNumberText",
            "scoreNumber": 50,
            "cancelOutStacked": {
                "top": 0,
                "bottom": 0,
                "center": 0
            }
        },
        "width": 375,
        "height": 155
    },
    {
        "id": "W8zs6Aus8ZqQ",
        "type": "rsNode",
        "position": {
            "x": 650,
            "y": 0
        },
        "data": {
            "pol": "pro",
            "score": {
                "type": "score",
                "id": "W8zs6Aus8ZqQ",
                "relevance": 1,
                "confidence": 1
            },
            "claim": {
                "content": `${pro1}`,
                "type": "claim",
                "id": "W8zs6Aus8ZqQ",
                "pol": "pro"
            },
            "scoreNumberText": "scoreNumberText",
            "scoreNumber": 50,
            "cancelOutStacked": {
                "top": 0,
                "bottom": 0,
                "center": 0
            }
        },
        "width": 200,
        "height": 155
    },
    {
        "id": "W8zs6sl1Vn2t",
        "type": "rsNode",
        "position": {
            "x": 650,
            "y": 175
        },
        "data": {
            "pol": "pro",
            "score": {
                "type": "score",
                "id": "W8zs6sl1Vn2t",
                "relevance": 1,
                "confidence": 1
            },
            "claim": {
                "content": `${pro2}`,
                "type": "claim",
                "id": "W8zs6sl1Vn2t",
                "pol": "pro"
            },
            "scoreNumberText": "scoreNumberText",
            "scoreNumber": 50,
            "cancelOutStacked": {
                "top": 0,
                "bottom": 0,
                "center": 0
            }
        },
        "width": 200,
        "height": 119
    },
    {
        "id": "W8zs6biOiqLT",
        "type": "rsNode",
        "position": {
            "x": 650,
            "y": 350
        },
        "data": {
            "pol": "pro",
            "score": {
                "type": "score",
                "id": "W8zs6biOiqLT",
                "relevance": 1,
                "confidence": 1
            },
            "claim": {
                "content": `${pro3}`,
                "type": "claim",
                "id": "W8zs6biOiqLT",
                "pol": "pro"
            },
            "scoreNumberText": "scoreNumberText",
            "scoreNumber": 50,
            "cancelOutStacked": {
                "top": 0,
                "bottom": 0,
                "center": 0
            }
        },
        "width": 375,
        "height": 137
    },
    {
        "id": "W8zs5HQC6WKF",
        "type": "rsNode",
        "position": {
            "x": 650,
            "y": 525
        },
        "data": {
            "pol": "con",
            "score": {
                "type": "score",
                "id": "W8zs5HQC6WKF",
                "relevance": 1,
                "confidence": 1
            },
            "claim": {
                "content": `${con1}`,
                "type": "claim",
                "id": "W8zs5HQC6WKF",
                "pol": "con"
            },
            "scoreNumberText": "scoreNumberText",
            "scoreNumber": 50,
            "cancelOutStacked": {
                "top": 0,
                "bottom": 0,
                "center": 0
            }
        },
        "width": 200,
        "height": 155
    },
    {
        "id": "W8zs4zu8QoYY",
        "type": "rsNode",
        "position": {
            "x": 650,
            "y": 700
        },
        "data": {
            "pol": "con",
            "score": {
                "type": "score",
                "id": "W8zs4zu8QoYY",
                "relevance": 1,
                "confidence": 1
            },
            "claim": {
                "content": `${con2}`,
                "type": "claim",
                "id": "W8zs4zu8QoYY",
                "pol": "con"
            },
            "scoreNumberText": "scoreNumberText",
            "scoreNumber": 50,
            "cancelOutStacked": {
                "top": 0,
                "bottom": 0,
                "center": 0
            }
        },
        "width": 200,
        "height": 155
    }
]
export const initialDebateData: DebateData =
{
    "claims": {
        "W8zs7713oOLi": {
            "content": `${mainClaim}`,
            "type": "claim",
            "id": "W8zs7713oOLi",
            "pol": "pro"
        },
        "W8zs6Aus8ZqQ": {
            "content": `${pro1}`,
            "type": "claim",
            "id": "W8zs6Aus8ZqQ",
            "pol": "pro"
        },
        "W8zs6sl1Vn2t": {
            "content": `${pro2}`,
            "type": "claim",
            "id": "W8zs6sl1Vn2t",
            "pol": "pro"
        },
        "W8zs6biOiqLT": {
            "content": `${pro3}`,
            "type": "claim",
            "id": "W8zs6biOiqLT",
            "pol": "pro"
        },
        "W8zs5HQC6WKF": {
            "content": `${con1}`,
            "type": "claim",
            "id": "W8zs5HQC6WKF",
            "pol": "con"
        },
        "W8zs4zu8QoYY": {
            "content": `${con2}`,
            "type": "claim",
            "id": "W8zs4zu8QoYY",
            "pol": "con"
        }
    },
    "connectors": {
        "W8zs6Auj33jz": {
            "source": "W8zs6Aus8ZqQ",
            "target": "W8zs7713oOLi",
            "proTarget": true,
            "affects": "confidence",
            "type": "connector",
            "id": "W8zs6Auj33jz"
        },
        "W8zs6slrqItB": {
            "source": "W8zs6sl1Vn2t",
            "target": "W8zs7713oOLi",
            "proTarget": true,
            "affects": "confidence",
            "type": "connector",
            "id": "W8zs6slrqItB"
        },
        "W8zs6bikubt2": {
            "source": "W8zs6biOiqLT",
            "target": "W8zs7713oOLi",
            "proTarget": true,
            "affects": "confidence",
            "type": "connector",
            "id": "W8zs6bikubt2"
        },
        "W8zs5HQ1j6HC": {
            "source": "W8zs5HQC6WKF",
            "target": "W8zs7713oOLi",
            "proTarget": false,
            "affects": "confidence",
            "type": "connector",
            "id": "W8zs5HQ1j6HC"
        },
        "W8zs4zuGZz7C": {
            "source": "W8zs4zu8QoYY",
            "target": "W8zs7713oOLi",
            "proTarget": false,
            "affects": "confidence",
            "type": "connector",
            "id": "W8zs4zuGZz7C"
        }
    }
}

