import React, { useContext, useState } from 'react';
import { FlowDataState } from '../../types/types';
import addNodes, { AddNodeType } from '../../utils/addNodes';
import { Button, InputGroup } from '@blueprintjs/core';
import { LoadingContext } from '../page';
import { newProConSystemMessage } from '../utils/newProConSystemMessage';
import { ArgumentMapSchemaType, argumentMapSchema } from '../utils/newProConSchema';

const ClaimInput = ({ flowDataState }: { flowDataState: FlowDataState }) => {
    const [claim, setClaim] = useState('');
    const { isLoading, setIsLoading } = useContext(LoadingContext);

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
                        systemMessage: newProConSystemMessage(),
                        schema: argumentMapSchema,
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

            const proMainClaims: AddNodeType[] = []
            if (data.pros && data.pros.length > 0) {
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
            }

            const conMainClaims: AddNodeType[] = []
            if (data.cons && data.cons.length > 0) {
                data.cons.forEach((con) => {
                    const conMainClaim: AddNodeType = {
                        flowDataState,
                        isNewNodePro: false,
                        claimContent: con,
                        sourceId: "mainClaim",
                        targetNodePolarity: "con"
                    }
                    conMainClaims.push(conMainClaim);
                })
            }


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
                <InputGroup
                    placeholder="Enter a claim"
                    className="mr-8 w-2/5 min-w-[300px]"
                    id="claim-input"
                    value={claim}
                    onChange={handleClaimChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <Button onClick={handleSubmit} disabled={isLoading}>
                    Generate Argument Map
                </Button>
            </div>
        </div>
    );
};

export default ClaimInput;