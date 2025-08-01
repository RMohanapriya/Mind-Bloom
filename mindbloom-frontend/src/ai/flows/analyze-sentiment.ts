'use server';
/**
 * @fileOverview Sentiment analysis AI agent for journal entries.
 *
 * - analyzeSentiment - A function that analyzes the sentiment of journal entries.
 * - AnalyzeSentimentInput - The input type for the analyzeSentiment function.
 * - AnalyzeSentimentOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSentimentInputSchema = z.object({
  journalEntry: z.string().describe('The journal entry to analyze.'),
  userHistory: z.string().optional().describe('The user emotional history.'),
  currentEmotionalState: z
    .string()
    .optional()
    .describe('The current emotional state of the user.'),
});
export type AnalyzeSentimentInput = z.infer<typeof AnalyzeSentimentInputSchema>;

const AnalyzeSentimentOutputSchema = z.object({
  sentimentScore: z
    .number()
    .describe('The sentiment score of the journal entry, from -1 to 1.'),
  sentimentLabel: z
    .string()
    .describe('The sentiment label of the journal entry (positive, negative, or neutral).'),
  analysis: z.string().describe('A detailed analysis of the sentiment.'),
  keyThemes: z.array(z.string()).describe('Key themes identified in the journal entry.'),
  positiveAffirmation: z.string().describe('A positive affirmation based on the entry.'),
  actionableAdvice: z.string().describe('A small, actionable step the user can take.'),
});
export type AnalyzeSentimentOutput = z.infer<typeof AnalyzeSentimentOutputSchema>;

export async function analyzeSentiment(input: AnalyzeSentimentInput): Promise<AnalyzeSentimentOutput> {
  return analyzeSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSentimentPrompt',
  input: {schema: AnalyzeSentimentInputSchema},
  output: {schema: AnalyzeSentimentOutputSchema},
  prompt: `You are a sentiment analysis expert and empathetic companion. Analyze the sentiment of the journal entry provided, taking into account the user's history and current emotional state to derive emotional patterns and triggers.

Journal Entry: {{{journalEntry}}}
User History: {{{userHistory}}}
Current Emotional State: {{{currentEmotionalState}}}

1.  Provide a sentiment score between -1 and 1 and assign the label: positive, negative, or neutral.
2.  Write a detailed analysis of the sentiment.
3.  Identify the key themes in the journal entry (e.g., "Work," "Relationships," "Personal Growth").
4.  Generate a custom positive affirmation based on the entry.
5.  Provide a small, actionable piece of advice based on the entry.

Output should be in the following JSON format:
{
  "sentimentScore": number,
  "sentimentLabel": string,
  "analysis": string,
  "keyThemes": [string],
  "positiveAffirmation": string,
  "actionableAdvice": string
}
`,
});

const analyzeSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSentimentFlow',
    inputSchema: AnalyzeSentimentInputSchema,
    outputSchema: AnalyzeSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
