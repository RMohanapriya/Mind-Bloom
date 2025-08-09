"use server";

import type { AnalyzeSentimentOutput } from "@/ai/flows/analyze-sentiment";
import { fetch } from 'next/dist/compiled/@edge-runtime/primitives/fetch';

export async function performSentimentAnalysis(
  input: { journalEntry: string; userHistory: string }
): Promise<AnalyzeSentimentOutput> {
  const token = (await import('jsonwebtoken')).sign({}, 'fake-secret'); // This is a temporary placeholder.
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/analyze-sentiment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to perform sentiment analysis.');
  }

  return response.json() as Promise<AnalyzeSentimentOutput>;
}

export async function getChatbotResponse(
  input: { messages: { role: string; content: string }[] }
): Promise<{ response: string }> {
  const token = (await import('jsonwebtoken')).sign({}, 'fake-secret'); // This is a temporary placeholder.
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/contextual-chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get chatbot response.');
  }

  return response.json() as Promise<{ response: string }>;
}
