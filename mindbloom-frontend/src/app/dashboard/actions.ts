
"use server";

import {
  analyzeSentiment,
  type AnalyzeSentimentInput,
  type AnalyzeSentimentOutput,
} from "@/ai/flows/analyze-sentiment";
import {
  contextualChatbot,
  type ContextualChatbotInput,
  type ContextualChatbotOutput,
} from "@/ai/flows/contextual-chatbot";

export async function performSentimentAnalysis(
  input: AnalyzeSentimentInput
): Promise<AnalyzeSentimentOutput> {
  // Add a delay to simulate network latency for better UX
  // A 1-second delay was here, but it's removed for production to improve performance
  return await analyzeSentiment(input);
}

export async function getChatbotResponse(
  input: ContextualChatbotInput
): Promise<ContextualChatbotOutput> {
  // Add a delay to simulate network latency for better UX
  // A 1-second delay was here, but it's removed for production to improve performance
  return await contextualChatbot(input);
}
