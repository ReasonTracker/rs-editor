import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export type ArgumentMapSchemaType = {
    pros: string[];
    cons: string[];
};

 const argumentMapZodSchema = z.object({
    pros: z.array(z.string()),
    cons: z.array(z.string()),
});

export const argumentMapSchema = zodToJsonSchema(argumentMapZodSchema);