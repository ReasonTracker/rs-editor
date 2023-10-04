import React, { useContext, useEffect, useState } from "react";
import { DevContext, FlowDataContext } from "./FlowDataProvider";
import { Drawer, Button } from "@blueprintjs/core";
import { Claim, newClaim } from "@/reasonScoreNext/Claim";
import generateSimpleAnimalClaim from "../utils/generateClaimContent";

const DevPanel = () => {
  const x = useContext(FlowDataContext);
  const dev = useContext(DevContext);
  if (!x) return null;
  if (!dev) return null;

  useEffect(() => {
    dev.setDevMode(true);
  }, []);

  const addNode = () => {
    const newClaimData = newClaim({ content: generateSimpleAnimalClaim() });
    const claimAction: {
      type: "add";
      newData: Claim;
    } = {
      type: "add",
      newData: newClaimData,
    };

    x.dispatch([claimAction]);
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
        <div className="p-4">
          <Button className="mb-4" onClick={addNode}>
            Add node
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default DevPanel;
