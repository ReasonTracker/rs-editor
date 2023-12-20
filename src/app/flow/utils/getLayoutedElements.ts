import dagre from "dagre";
import { Node, Edge } from "reactflow";
import { DisplayNodeData, DisplayEdgeData } from "../types/types";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 600;
const nodeHeight = 125;

const getLayoutedElements = (nodes: Node<DisplayNodeData>[], edges: Edge<DisplayEdgeData>[]) => {
    dagreGraph.setGraph({ rankdir: 'RL' });

    // const confidenceNodes = nodes.filter(node => node.data.affects === "confidence"); // TODO try
    // const confidenceEdges = edges.filter(edge => edge.sourceHandle === "confidence"); // TODO try

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const edge = edges.find((edge) => edge.source === node.id)
        const edgeType = edge?.targetHandle;
        const targetNode = nodes.find(node => node.id === edge?.target)

        const nodeWithPosition = dagreGraph.node(node.id);

        // TODO calculate node with position set already here
        // new nodes have node.position.x === 0 && node.position.y === 0)
        // Probably want to add a flag with onNodeChange to set it's position

        if (edgeType === "relevance") {
            if (!targetNode) return console.log("No target node found for edge", edge);

            // const dagreRelevance = new dagre.graphlib.Graph();   // TODO try
            // dagreConfidence.setGraph({ rankdir: 'BT' });         // TODO try
            // dagreRelevance.setDefaultEdgeLabel(() => ({}));      // TODO try

            const relevanceEdges = edges.filter(e => e.target === targetNode.id && e.targetHandle === "relevance");
            const index = relevanceEdges.findIndex(edge => edge.source === node.id);
            const yOffset = index * -150;

            node.position = {
                x: targetNode.position.x + 150,
                y: targetNode.position.y - 200 + yOffset
            };
        } else {
            const siblings = edges
                .filter(e => e.target === targetNode?.id && e.targetHandle === "confidence")
                .map(e => e.source);
            const indexInSiblings = siblings.findIndex(id => id === node.id);
            const relevanceEdges = edges.filter(e => e.target === node.id && e.targetHandle === "relevance");
            const yOffset = indexInSiblings > 0 ? relevanceEdges.length * -150 : 0;

            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2 - yOffset,
            };
        }

        return node;
    });

    return { nodes, edges };
};

export default getLayoutedElements;