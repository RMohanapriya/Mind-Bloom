// A chatbot that provides empathetic responses based on user's journal entries and emotional state.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualChatbotInputSchema = z.object({
  journalEntry: z.string().describe('The user\'s current journal entry.'),
  emotionalState: z.string().describe('The user\'s current emotional state.'),
  journalHistory: z.string().optional().describe('The user\'s past journal entries.'),
});
export type ContextualChatbotInput = z.infer<typeof ContextualChatbotInputSchema>;

const ContextualChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s empathetic response.'),
});
export type ContextualChatbotOutput = z.infer<typeof ContextualChatbotOutputSchema>;

export async function contextualChatbot(input: ContextualChatbotInput): Promise<ContextualChatbotOutput> {
  return contextualChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualChatbotPrompt',
  input: {schema: ContextualChatbotInputSchema},
  output: {schema: ContextualChatbotOutputSchema},
  prompt: `You are an empathetic chatbot designed to provide support and reflections based on user\'s journal entries and their emotional state.

  Your goal is to provide personalized responses, and NEVER provide any general advice.

  Here is the user\'s current journal entry: {{{journalEntry}}}
  Here is the user\'s current emotional state: {{{emotionalState}}}
  {{#if journalHistory}}
  Here is the user\'s journal history: {{{journalHistory}}}
  {{/if}}

  Respond with empathy and understanding, without giving general advice.
  `, 
});

const contextualChatbotFlow = ai.defineFlow(
  {
    name: 'contextualChatbotFlow',
    inputSchema: ContextualChatbotInputSchema,
    outputSchema: ContextualChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
