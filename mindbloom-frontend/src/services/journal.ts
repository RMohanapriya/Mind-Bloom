// mindbloom-frontend/src/services/journal.ts
import jwt, { JwtPayload } from 'jsonwebtoken'; // For token decoding
import { toast } from "@/hooks/use-toast"; // For displaying notifications

// The base URL for your backend API
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type JournalEntry = {
    id: string;
    text: string;
    analysis: any; // Use 'any' or define a specific type for your analysis object
    date: string;
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
            return data.id; // Assuming your backend returns the new entry's ID
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
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
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
            // The backend returns an array of entries
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
