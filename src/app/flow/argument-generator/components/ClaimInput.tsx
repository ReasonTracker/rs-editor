import React, { useState } from 'react';
import { FlowDataState } from '../../types/types';
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import addNodes, { AddNodeType } from '../../utils/addNodes';

type ArgumentMapSchemaType = {
    pros: string[];
    cons: string[];
};

const argumentMapSchema = z.object({
    pros: z.array(z.string()),
    cons: z.array(z.string()),
});

const schema = zodToJsonSchema(argumentMapSchema);

const systemMessage = `Generate an argument map (only text, not a list) like this example
  
  BEGIN EXAMPLE:
  pros: [
      'It is a violation of human rights to take a person\'s life, regardless of their actions.',
      'There is a risk of executing innocent individuals.',
      'The death penalty is disproportionately applied to minorities and those from disadvantaged backgrounds.',
      'Life imprisonment without parole is a viable alternative that ensures public safety.',
      'The death penalty does not deter crime effectively.'
    ],
      cons: [
      'The death penalty serves as a deterrent to potential criminals.',
      'It provides closure to victims\' families and a sense of justice.',
      'Some crimes are so heinous that they warrant the ultimate punishment.',
      'The cost of housing death row inmates for life may be higher than the cost of execution.'
    ]
  END EXAMPLE
  
  Starting Claim:`;

const ClaimInput = ({ flowDataState }: { flowDataState: FlowDataState }) => {
    const [claim, setClaim] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleClaimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClaim(e.target.value);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") handleSubmit();
    };

    const handleSubmit = async () => {

        setIsLoading(true);

        try {
            const response = await fetch(
                "http://localhost:3000/api/structured-output",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        input: claim,
                        systemMessage,
                        schema,
                    }),
                }
            );

            const data: ArgumentMapSchemaType = await response.json();

            const mainClaim: AddNodeType = {
                flowDataState,
                isNewNodePro: true,
                claimId: "mainClaim",
                claimContent: claim
            }
            // create proMainClaims for each pros in data
            const proMainClaims: AddNodeType[] = []
            data.pros.forEach((pro) => {
                const proMainClaim: AddNodeType = {
                    flowDataState,
                    isNewNodePro: true,
                    claimContent: pro,
                    sourceId: "mainClaim",
                    targetNodePolarity: "pro"
                }
                proMainClaims.push(proMainClaim);
            });

            const conMainClaims: AddNodeType[] = []
            data.cons.forEach((con) => {
                const conMainClaim: AddNodeType = {
                    flowDataState,
                    isNewNodePro: false,
                    claimContent: con,
                    sourceId: "mainClaim",
                    targetNodePolarity: "con"
                }
                conMainClaims.push(conMainClaim);
            });

            addNodes([mainClaim, ...proMainClaims, ...conMainClaims]);

        } catch (error) {
            console.error("Failed to fetch the argument map:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute top-0 w-full z-10">
            <div className="flex flex-col sm:flex-row justify-center mb-4 pt-2">
                <input
                    placeholder="Enter a claim"
                    className="mr-8 max-w-2xl"
                    id="claim-input"
                    value={claim}
                    onChange={handleClaimChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <button onClick={handleSubmit} disabled={isLoading}>
                    Generate Argument Map
                </button>
            </div>
        </div>
    );
};

export default ClaimInput;