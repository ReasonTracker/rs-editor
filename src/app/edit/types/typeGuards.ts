import { ConfidenceEdgeData, RelevanceEdgeData } from "@/app/edit/types/types";

export function isConfidenceEdgeData(data: ConfidenceEdgeData | RelevanceEdgeData | undefined): data is ConfidenceEdgeData {
    return data?.type === "confidence";
}

export function isRelevanceEdgeData(data: ConfidenceEdgeData | RelevanceEdgeData | undefined): data is RelevanceEdgeData {
    return data?.type === "relevance";
}