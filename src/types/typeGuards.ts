import { ConfidenceEdgeData, RelevanceEdgeData } from "@/types/types";

export function isConfidenceEdgeData(data: ConfidenceEdgeData | RelevanceEdgeData | undefined): data is ConfidenceEdgeData {
    return data?.type === "confidence";
}

export function isRelevanceEdgeData(data: ConfidenceEdgeData | RelevanceEdgeData | undefined): data is RelevanceEdgeData {
    return data?.type === "relevance";
}