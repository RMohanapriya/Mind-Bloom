"use client";

import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import type { AnalyzeSentimentOutput } from "@/ai/flows/analyze-sentiment";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type JournalEntry = {
    id: string;
    text: string;
    analysis: AnalyzeSentimentOutput;
    date: string;
    userId: string;
};

// Function to add a new journal entry
export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'date'>): Promise<string> {
  const token = localStorage.getItem('token');
  if (!token) {
      throw new Error("User not authenticated.");
  }
  
  try {
      const response = await fetch(`${BACKEND_URL}/api/journal`, {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(entry),
      });

      const data = await response.json();

      if (response.ok) {
          return data.id;
      } else {
          throw new Error(data.message || 'Failed to add journal entry.');
      }
  } catch (error: any) {
      console.error("Error adding document: ", error);
      toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
      });
      throw error;
  }
}

// Function to get all journal entries for a user
export async function getJournalEntries(): Promise<JournalEntry[]> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("User not authenticated.");
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/journal`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Failed to retrieve journal entries.');
        }
    } catch (error: any) {
        console.error("Error getting documents: ", error);
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
        });
        throw error;
    }
}
