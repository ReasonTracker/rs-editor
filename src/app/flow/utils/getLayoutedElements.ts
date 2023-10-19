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
        const nodeWithPosition = dagreGraph.node(node.id);
        
        // These seem to have no effect
        // node.targetPosition = 'left'
        // node.sourcePosition = 'right'

        // TODO calculate node with position set already here
        // new nodes have node.position.x === 0 && node.position.y === 0)
        // Probably want to add a flag with onNodeChange to set it's position

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

export default getLayoutedElements;