import { FlowDataState } from "../../types/types";
import { ArgumentMapSchemaType, argumentMapSchema } from "./newProConSchema";
import addNodes, { AddNodeType } from "../../utils/addNodes";
import { newProConSystemMessage } from "./newProConSystemMessage";

const addAiNodes = async ({
    flowDataState,
    claim,
    sourceId,
}: {
    flowDataState: FlowDataState;
    claim: string;
    sourceId: string;
}) => {

    const nodes = flowDataState.displayNodes.map((node) => node.data.claim.content);
    const currentArgumentMap = nodes ? nodes.join(' | ') : ''
    
    try {
        const response = await fetch(
            "http://localhost:3000/api/structured-output",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    systemMessage: newProConSystemMessage({currentArgumentMap}),
                    input: claim,
                    schema: argumentMapSchema,
                }),
            }
        );

        const data: ArgumentMapSchemaType = await response.json();

        const proMainClaims: AddNodeType[] = [];
        if (data.pros && data.pros.length > 0) {
            data.pros.forEach((pro) => {
                const proMainClaim: AddNodeType = {
                    flowDataState,
                    sourceId,
                    isNewNodePro: true,
                    claimContent: pro,
                    targetNodePolarity: "pro",
                };
                proMainClaims.push(proMainClaim);
            });
        }

        const conMainClaims: AddNodeType[] = [];
        if (data.cons && data.cons.length > 0) {
            data.cons.forEach((con) => {
                const conMainClaim: AddNodeType = {
                    flowDataState,
                    sourceId,
                    isNewNodePro: false,
                    claimContent: con,
                    targetNodePolarity: "con",
                };
                conMainClaims.push(conMainClaim);
            });
        }

        addNodes([...proMainClaims, ...conMainClaims]);
    } catch (error) {
        console.error("Failed to fetch the argument map:", error);
    }
};

export default addAiNodes;
