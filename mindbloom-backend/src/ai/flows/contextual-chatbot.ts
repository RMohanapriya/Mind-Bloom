import { z } from 'zod';
import { defineFlow, generate } from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';
import { Message, MessageSchema } from './types';

export const ContextualChatbotInputSchema = z.object({
  messages: z.array(MessageSchema).describe('The full conversation history.'),
});

export const ContextualChatbotOutputSchema = z.object({
  response: z.string().describe('The AI companion\'s response.'),
});

export type ContextualChatbotInput = z.infer<typeof ContextualChatbotInputSchema>;
export type ContextualChatbotOutput = z.infer<typeof ContextualChatbotOutputSchema>;

export const contextualChatbot = defineFlow(
  {
    name: 'contextualChatbot',
    inputSchema: ContextualChatbotInputSchema,
    outputSchema: ContextualChatbotOutputSchema,
  },
  async ({ messages }) => {
    const prompt = `You are an AI mental wellness companion. Your role is to provide empathetic, supportive, and helpful responses to the user's messages. Your responses should be conversational, positive, and encouraging.

    Conversation History:
    ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

    Your Turn:
    `;

    const { output } = await generate({
      model: gemini15Flash,
      prompt,
      output: {
        schema: ContextualChatbotOutputSchema,
      },
    });

    return output;
  }
);
