import { ConfidenceEdgeData, DisplayNodeData, RelevenceEdgeData } from './pageData';
import { DebateData } from '@/reasonScoreNext/DebateData';
import { Score } from '@/reasonScoreNext/scoring/TypeA/Score';
import { Connector } from '@/reasonScoreNext/Connector';

export function generateNodesAndEdgesData(debateData: DebateData, scores: { [id: string]: Score }) {
    const { claims, connectors } = debateData;
    const nodeDatas: DisplayNodeData[] = [];
    const edgeDatas: (ConfidenceEdgeData | RelevenceEdgeData)[] = [];

    for (const score of Object.values(scores)) { 
        const incomingConnectors = Object.values(connectors).filter(c => c.target === score.id);
        const confidenceConnectors = incomingConnectors.filter(c => c.affects === 'confidence');
        const relevanceConnectors = incomingConnectors.filter(c => c.affects === 'relevance');

        // TODO: continue from here
    }

    
    return { newNodeDatas: nodeDatas, newEdgeDatas: edgeDatas }
}

export function scoreViz(
    score: Score,
    confConn: Connector[],
    relConn: Connector[]
) {

}
