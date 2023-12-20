import dagre from "dagre";
import { Node, Edge } from "reactflow";
import { DisplayNodeData, DisplayEdgeData } from "../types/types";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 600;
const nodeHeight = 125;

const getLayoutedElements = (nodes: Node<DisplayNodeData>[], edges: Edge<DisplayEdgeData>[]) => {
    dagreGraph.setGraph({ rankdir: 'RL' });

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
            node.position = {
                x: targetNode.position.x + 150,
                y: targetNode.position.y - 200
            };

        } else {
            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            };
        }

        return node;
    });

    return { nodes, edges };
};

export default getLayoutedElements;