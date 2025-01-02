import dagre from "dagre";
// import { Node, Edge } from "reactflow";

const nodeWidth = 600;
const nodeHeight = 125;

interface Node {
    position: {
        x: number;
        y: number;
    };
    id: string;
    data: { collapsed?: boolean };
}

interface Edge {
    source: string;
    target: string;
    sourceHandle?: string | null | undefined;
    targetHandle?: string | null | undefined;
}

const getLayoutedElements = <N extends Node, E extends Edge>(nodes: N[], edges: E[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: 'RL' });

    // const confidenceNodes = nodes.filter(node => node.data.affects === "confidence"); // TODO try
    // const confidenceEdges = edges.filter(edge => edge.sourceHandle === "confidence"); // TODO try

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, node.data.collapsed ?
            { width: 0, height: 0 } :
            { width: nodeWidth, height: nodeHeight });
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

        node.position = {
            x: nodeWithPosition.x,
            y: nodeWithPosition.y,
        };

        // if (edgeType === "relevance") {
        //     if (!targetNode) return console.log("No target node found for edge", edge);

        //     // const dagreRelevance = new dagre.graphlib.Graph();   // TODO try
        //     // dagreConfidence.setGraph({ rankdir: 'BT' });         // TODO try
        //     // dagreRelevance.setDefaultEdgeLabel(() => ({}));      // TODO try

        //     const relevanceEdges = edges.filter(e => e.target === targetNode.id && e.targetHandle === "relevance");
        //     const index = relevanceEdges.findIndex(edge => edge.source === node.id);
        //     const yOffset = index * -150;
        //     console.log("yOffset relevance", yOffset)

        //     node.position = {
        //         x: targetNode.position.x + 150,
        //         y: targetNode.position.y - 200 + yOffset
        //     };
        // } else {

        //     const siblings = edges
        //         .filter(e => e.target === targetNode?.id && e.targetHandle === "confidence")
        //         .map(e => e.source);
        //     const indexInSiblings = siblings.findIndex(id => id === node.id);
        //     const relevanceEdges = edges.filter(e => e.target === node.id && e.targetHandle === "relevance");
        //     const yOffset = indexInSiblings > 0 ? relevanceEdges.length * -150 : 0;
        //     console.log("yOffset confidence", yOffset)

        //     node.position = {
        //         x: nodeWithPosition.x - nodeWidth / 2,
        //         y: nodeWithPosition.y - nodeHeight / 2 - yOffset,
        //     };
        // }

        return node;
    });
    
    const lastNode = nodes[nodes.length - 1];
    const yOffset = lastNode.position.y;

    nodes.forEach((node) => {
        node.position.y -= yOffset;
    });
    return { nodes, edges };
};

export default getLayoutedElements;