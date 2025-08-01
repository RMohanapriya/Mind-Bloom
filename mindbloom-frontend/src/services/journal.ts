import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, getDocs, serverTimestamp, where } from 'firebase/firestore';
import type { AnalyzeSentimentOutput } from '@/ai/flows/analyze-sentiment';

export type JournalEntry = {
  id?: string;
  text: string;
  analysis: AnalyzeSentimentOutput;
  date: any; // Firestore timestamp
  userId: string;
};

const JOURNAL_COLLECTION = 'journal_entries';

// Function to add a new journal entry
export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'date'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, JOURNAL_COLLECTION), {
        ...entry,
        date: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to add journal entry.");
  }
}

// Function to get all journal entries for a user
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
    try {
        const q = query(
            collection(db, JOURNAL_COLLECTION),
            where("userId", "==", userId),
            orderBy('date', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const entries: JournalEntry[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            entries.push({
                id: doc.id,
                ...data,
                date: data.date?.toDate().toLocaleString() ?? new Date().toLocaleString(),
            } as JournalEntry);
        });
        return entries;
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw new Error("Failed to retrieve journal entries.");
    }
}
