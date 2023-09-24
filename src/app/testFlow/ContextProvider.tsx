//@ts-nocheck
import { createContext, useContext, useReducer } from 'react';

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

  function nodesReducer(nodes, action) {
    switch (action.type) {
      case 'addNode': {
        // logic for adding a node
      }
      case 'updateNode': {
        // logic for updating a node
      }
      // add more cases as needed
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
  
  function edgesReducer(edges, action) {
    switch (action.type) {
      case 'addEdge': {
        // logic for adding an edge
      }
      case 'updateEdge': {
        // logic for updating an edge
      }
      // add more cases as needed
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
  

export function FlowProvider({ children }) {
    const [nodes, dispatchNodes] = useReducer(nodesReducer, initialNodes);
    const [edges, dispatchEdges] = useReducer(edgesReducer, initialEdges);
  
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
  
    