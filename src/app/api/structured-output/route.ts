import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/chains/popular/structured_output
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body", body);

    const inputText = body.input;
    const systemMessage = body.systemMessage;
    const schema = body.schema;
    const prompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(systemMessage),
        HumanMessagePromptTemplate.fromTemplate("{inputText}"),
      ],
      inputVariables: ["inputText"],
    });
    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: "gpt-3.5-turbo",
    });
    const functionCallingModel = model.bind({
      functions: [
        {
          name: "output_formatter",
          description: "Should always be used to properly format output",
          parameters: schema,
        },
      ],
      function_call: { name: "output_formatter" },
    });
    const outputParser = new JsonOutputFunctionsParser();
    const chain = prompt.pipe(functionCallingModel).pipe(outputParser);
    try {
      const result = await chain.invoke({ inputText });
      console.log("result", result);

      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      console.error("Failed to fetch the argument map:", error);
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
