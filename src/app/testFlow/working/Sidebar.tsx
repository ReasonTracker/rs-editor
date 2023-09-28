"use client";
import React, { useContext, useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import { FlowDataContext } from "./DataProvider";
import { newClaim } from "@/reasonScoreNext/Claim";
import generateSimpleAnimalClaim from "./utils/generateClaimContent";
import { ClaimActions } from "@/reasonScoreNext/ActionTypes";
import { DebateData } from "@/reasonScoreNext/DebateData";

type transformSelector = (state: any) => any;
const transformSelector: transformSelector = (state) => state.transform;

export const Sidebar = () => {
  const [selectedClaim, setSelectedClaim] = useState("");
  const [claimContent, setClaimContent] = useState("");

  const { getNodes, getViewport } = useReactFlow();
  const nodes = getNodes();

  const { dispatch, debateData } = useContext(FlowDataContext);
  const [displayDebateData, setDisplayDebateData] = useState<DebateData | null>(
    null
  );

  useEffect(() => {
    setDisplayDebateData(debateData);
  }, [debateData]);

  const updateClaim = () => {
    dispatch([
      {
        type: "modify",
        newData: {
          type: "claim",
          id: selectedClaim,
          content: claimContent,
        },
      },
    ]);
  };
  const addNode = () => {
    const newClaimData = newClaim({ content: generateSimpleAnimalClaim() });
    const claimAction = {
      type: "add",
      newData: newClaimData,
    };

    dispatch([claimAction]);
  };

  return (
    <aside className="internalState">
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        {/* Nodes */}
        <div className="context-container">
          <div className="title">React Nodes {Object.keys(nodes).length}</div>
          <pre>{JSON.stringify(nodes, null, 2)}</pre>
        </div>

        <div className="context-container">
          <div className="title">
            Debate Data{" "}
            {
              Object.keys(displayDebateData ? displayDebateData.claims : {})
                .length
            }
          </div>
          <div>
            {displayDebateData ? (
              <pre>{JSON.stringify(displayDebateData, null, 2)}</pre>
            ) : null}
          </div>
        </div>

        {/* Update Nodes */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            onClick={addNode}
            style={{ width: "150px", marginBottom: "50px", padding: "10px" }}
          >
            Add Node
          </button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Update Nodes Form */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <select
                value={selectedClaim}
                onChange={(e) => {
                  setSelectedClaim(e.target.value);
                  const claim = debateData.claims[e.target.value];
                  if (claim) {
                    setClaimContent(claim.content);
                  }
                }}
              >
                <option value="" disabled>
                  Select a node
                </option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.data.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={claimContent}
                placeholder="Enter a claim"
                onChange={(e) => setClaimContent(e.target.value)}
              />
              <button onClick={updateClaim}>UPDATE CLAIM</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
