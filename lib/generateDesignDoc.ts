import Anthropic from "@anthropic-ai/sdk";
import { getTemplateContext } from "./googleDrive";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateDesignDoc(userInput: string): Promise<string> {
  const templateContext = await getTemplateContext();

  const systemPrompt = `You are a Solutions Consultant at Proton AI (PRM Solutions, Inc.) writing a Solutions Design Document for a new customer implementation.

You have access to the following past design documents and templates for reference. Use them to understand the expected structure, tone, level of detail, and formatting:

${templateContext}

Always follow this structure:
1. Purpose
2. Proton Implementation Deliverables (broken into relevant sections based on scope)
3. Third-Party Software (if applicable)
4. Stakeholder Register
5. Scope of Services

Use professional language. Be specific about what Proton will and will not do. Include customer responsibilities. Match the formatting style of the examples.`;

  const message = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 8096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Create a full Solutions Design Document for the following implementation:\n\n${userInput}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}
