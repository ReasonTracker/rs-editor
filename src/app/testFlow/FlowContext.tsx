"use client";
import { createContext, useContext, useReducer } from "react";
import { useReactFlow } from "reactflow";

const NodesContext = createContext(null);
const EdgesContext = createContext(null);

const NodesDispatchContext = createContext(null);
const EdgesDispatchContext = createContext(null);

export function useNodes() {
  return useContext(NodesContext);
}

export function useEdges() {
  return useContext(EdgesContext);
}

export function useNodesDispatch() {
  return useContext(NodesDispatchContext);
}

export function useEdgesDispatch() {
  return useContext(EdgesDispatchContext);
}

const initialNodes: Node[] = [
  {
    id: "provider-1",
    type: "input",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 },
  },
  { id: "provider-2", data: { label: "Node 2" }, position: { x: 100, y: 100 } },
  { id: "provider-3", data: { label: "Node 3" }, position: { x: 400, y: 100 } },
  { id: "provider-4", data: { label: "Node 4" }, position: { x: 400, y: 200 } },
];

const initialEdges: Edge[] = [
  {
    id: "provider-e1-2",
    source: "provider-1",
    target: "provider-2",
    animated: true,
  },
  { id: "provider-e1-3", source: "provider-1", target: "provider-3" },
];

export function FlowProvider({ children }) {
  const { setNodes, addNodes } = useReactFlow();
  const [nodes, dispatchNodes] = useReducer(nodesReducer, initialNodes);
  const [edges, dispatchEdges] = useReducer(edgesReducer, initialEdges);

  function nodesReducer(nodes, action) {
    console.log("nodesReducer", nodes, action);
    console.log("action: " + action.type);
    switch (action.type) {
      case "addNode": {
        const node = {
          id: "123",
          type: "input",
          data: { label: "Node 1" },
          position: { x: 250, y: 5 },
        };
        return setNodes(nodes.concat(node));
      }
      case "updateNode": {
        // logic for updating a node
      }
      // add more cases as needed
      default: {
        console.log("nodesReducer", nodes, action);
        console.log("Unknown action: " + action.type);
      }
    }
  }

  function edgesReducer(edges, action) {
    switch (action.type) {
      case "addEdge": {
        // logic for adding an edge
      }
      case "updateEdge": {
        // logic for updating an edge
      }
      // add more cases as needed
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  }

  return (
    <NodesContext.Provider value={nodes}>
      <NodesDispatchContext.Provider value={dispatchNodes}>
        <EdgesContext.Provider value={edges}>
          <EdgesDispatchContext.Provider value={dispatchEdges}>
            {children}
          </EdgesDispatchContext.Provider>
        </EdgesContext.Provider>
      </NodesDispatchContext.Provider>
    </NodesContext.Provider>
  );
}
