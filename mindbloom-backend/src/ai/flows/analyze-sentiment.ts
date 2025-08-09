import { z } from 'zod';
import { defineFlow, generate } from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';

export const AnalyzeSentimentInputSchema = z.object({
  journalEntry: z.string().describe('The user\'s new journal entry.'),
  userHistory: z.string().describe('The user\'s past journal entries, for context.'),
});

export const AnalyzeSentimentOutputSchema = z.object({
  sentimentLabel: z.enum(['positive', 'negative', 'neutral']).describe('The overall sentiment of the journal entry.'),
  sentimentScore: z.number().describe('A numerical score from -1.0 (negative) to 1.0 (positive).'),
  analysis: z.string().describe('A detailed analysis of the entry\'s sentiment and emotional tone.'),
  keyThemes: z.array(z.string()).describe('A list of the main topics or themes identified in the entry.'),
  positiveAffirmation: z.string().describe('A concise, positive affirmation based on the entry.'),
  actionableAdvice: z.string().describe('A single piece of actionable advice to help the user grow.'),
});

export type AnalyzeSentimentInput = z.infer<typeof AnalyzeSentimentInputSchema>;
export type AnalyzeSentimentOutput = z.infer<typeof AnalyzeSentimentOutputSchema>;

export const analyzeSentiment = defineFlow(
  {
    name: 'analyzeSentiment',
    inputSchema: AnalyzeSentimentInputSchema,
    outputSchema: AnalyzeSentimentOutputSchema,
  },
  async ({ journalEntry, userHistory }) => {
    const prompt = `You are a mental wellness AI assistant. Analyze the following journal entry for sentiment, key themes, and emotional tone. The user's past history is provided for additional context. Respond with a detailed analysis, key themes, a positive affirmation, and actionable advice.

    User's New Entry:
    "${journalEntry}"

    User's Past History:
    "${userHistory}"

    Return a JSON object with the following keys:
    - sentimentLabel: 'positive', 'negative', or 'neutral'
    - sentimentScore: A number from -1.0 to 1.0
    - analysis: A detailed paragraph on the sentiment.
    - keyThemes: An array of strings with the main topics.
    - positiveAffirmation: A single, uplifting sentence.
    - actionableAdvice: A single, practical tip.
    `;

    const { output } = await generate({
      model: gemini15Flash,
      prompt,
      output: {
        schema: AnalyzeSentimentOutputSchema,
      },
    });

    return output;
  }
);
