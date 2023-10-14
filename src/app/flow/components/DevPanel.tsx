import React, { useContext, useEffect } from "react";
import { DevContext, FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button, IconName } from "@blueprintjs/core";
import { newClaim } from "@/reasonScoreNext/Claim";
import generateSimpleAnimalClaim from "../utils/generateClaimContent";
import { newConnector } from "@/reasonScoreNext/Connector";
import { ClaimActions, ConnectorActions } from "@/reasonScoreNext/ActionTypes";

const DevPanel = () => {
  const x = useContext(FlowDataContext);
  const dev = useContext(DevContext);
  
  if (!x) return null;
  if (!dev) return null;

  const addNode = () => {
    const newClaimData = newClaim({ content: generateSimpleAnimalClaim() });
    const claimAction: ClaimActions = {
      type: "add",
      newData: newClaimData,
    };

    x.dispatch([claimAction]);
  };

  // WIP
  const addEdge = () => {
    const { source, target } = getRandomSourceAndTarget();
    if (!source || !target) {
      console.log("Couldn't find a source or target node");
      return;
    }
    const proTarget = Math.random() < 0.5;
    const affects = Math.random() < 0.5 ? "confidence" : "relevance";

    const newConnectorData = newConnector({
      source,
      target,
      proTarget,
      affects,
    });

    const connectorAction: ConnectorActions = {
      type: "add",
      newData: newConnectorData,
    };

    x.dispatch([connectorAction]);
  };

  const getRandomSourceAndTarget = () => {
    const nodes = x.displayNodes;
    if (nodes.length < 2) {
      console.error("Not enough nodes to get distinct source and target.");
      return { source: undefined, target: undefined };
  }
    const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
    let targetNode = nodes[Math.floor(Math.random() * nodes.length)];
    let loop = 20
    while (targetNode === sourceNode && loop-- > 0) {
      targetNode = nodes[Math.floor(Math.random() * nodes.length)];
    }
    if (loop <= 0) console.log("Couldn't find a target node that wasn't the source node")

    return { source: sourceNode.id, target: targetNode.id };
  };

  const DevButton = ({
    label,
    icon,
    onClick,
  }: {
    label: string;
    icon: IconName;
    onClick: () => void;
  }) => {
    return (
      <Button
        className="w-full justify-start"
        onClick={onClick}
        icon={icon}
        minimal
        text={label}
      />
    );
  };

  return (
    <div className="bp5-dark">
      <Button
        hidden={dev.isDev}
        className={"absolute top-0 right-0 focus:outline-none"}
        onClick={() => dev.setDevMode(true)}
        icon="chevron-left"
        minimal
      >
        Dev
      </Button>
      <Drawer
        hasBackdrop={false}
        isOpen={dev.isDev}
        onClose={() => dev.setDevMode(false)}
        title="Dev"
        canOutsideClickClose={false}
        canEscapeKeyClose={true}
        position="right"
        size={"150px"}
        className={"bp5-dark"}
        usePortal={false}
        enforceFocus={false}
        autoFocus={false}
      >
        <div className="flex flex-col space-y-2 mt-4">
          <DevButton
            icon={"send-to-graph"}
            onClick={addNode}
            label={"Add Node"}
          />
          <DevButton 
            icon={"one-to-one"} 
            onClick={addEdge} 
            label={"Add Edge"} />
          <DevButton
            icon={"console"}
            onClick={() => console.log(x.displayNodes)}
            label={"Nodes"}
          />
          <DevButton
            icon={"console"}
            onClick={() => console.log(x.displayEdges)}
            label={"Edges"}
          />
          <DevButton
            icon={"console"}
            onClick={() => console.log(x.debateData)}
            label={"DebateData"}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default DevPanel;
