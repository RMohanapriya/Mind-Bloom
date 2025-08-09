"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzeSentimentOutput } from "@/ai/flows/analyze-sentiment";
import { performSentimentAnalysis } from "./actions";
import { addJournalEntry, getJournalEntries, type JournalEntry } from "@/services/journal";
// REMOVED: Firebase authentication imports
// import { auth } from "@/lib/firebase";
// import { onAuthStateChanged, type User } from "firebase/auth";

import {
  BarChart,
  Bot,
  BookOpen,
  Frown,
  Loader2,
  Meh,
  Send,
  Smile,
  Sparkles,
  Lightbulb,
  Tags,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import jwt, { JwtPayload } from 'jsonwebtoken'; // Add JWT library to decode token

// You'll need to install this library: npm install jsonwebtoken @types/jsonwebtoken
// It's client-side only for decoding, not for security.

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [journalEntry, setJournalEntry] = useState("");
  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalyzeSentimentOutput | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Use a simple string for the user ID
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [isAnalyzing, startAnalyzingTransition] = useTransition();

  useEffect(() => {
    // Replaced Firebase with a token-based authentication check
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as JwtPayload;
        setUserId(decodedToken.id);
      } catch (error) {
        console.error('Invalid token:', error);
        router.push("/");
      }
    } else {
      router.push("/"); // Redirect to login if no token
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      setLoadingHistory(true);
      getJournalEntries(userId)
        .then(entries => {
            setJournalHistory(entries);
            if (entries.length > 0) {
              setCurrentAnalysis(entries[0].analysis);
            }
        })
        .catch(() => {
            toast({
                title: "Error",
                description: "Could not load journal history.",
                variant: "destructive",
            });
        })
        .finally(() => {
            setLoadingHistory(false);
        });
    }
  }, [userId, toast]);


  const handleAnalyze = () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Empty Entry",
        description: "Please write something in your journal.",
        variant: "destructive",
      });
      return;
    }
    if (!userId) {
        toast({
            title: "Not signed in",
            description: "You must be signed in to save an entry.",
            variant: "destructive",
        });
        return;
    }

    startAnalyzingTransition(async () => {
      try {
        const userHistoryText = journalHistory
          .map((entry) => entry.text)
          .join("\n---\n");
        const result = await performSentimentAnalysis({
          journalEntry,
          userHistory: userHistoryText,
        });

        const newDbEntry = {
            text: journalEntry,
            analysis: result,
            userId: userId,
        };

        const newEntryId = await addJournalEntry(newDbEntry);
        
        const newEntryForState: JournalEntry = {
            id: newEntryId,
            ...newDbEntry,
            date: new Date().toLocaleString(),
        };

        setJournalHistory([newEntryForState, ...journalHistory]);
        setCurrentAnalysis(result);
        setJournalEntry("");
        
        toast({
          title: "Analysis Complete",
          description: "Your journal entry has been analyzed and saved.",
        });

        // Navigate to the AI companion page after analysis
        router.push('/dashboard/ai-companion');

      } catch (error) {
        toast({
          title: "Analysis Failed",
          description: "There was an error analyzing your entry.",
          variant: "destructive",
        });
      }
    });
  };
    
  const getSentimentIcon = (label: string) => {
    if (label.toLowerCase() === 'positive') return <Smile className="h-8 w-8 text-green-500" />;
    if (label.toLowerCase() === 'negative') return <Frown className="h-8 w-8 text-red-500" />;
    return <Meh className="h-8 w-8 text-yellow-500" />;
  };

  return (
    <div className="bg-background">
      <main className="grid flex-1 grid-cols-1 gap-6 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <BookOpen className="h-6 w-6" />
                New Journal Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What's on your mind? Let it all out..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="min-h-[150px] text-base"
              />
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !userId} className="mt-4 w-full">
                {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Entry
              </Button>
            </CardContent>
          </Card>

          {currentAnalysis && (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    Sentiment Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                        {getSentimentIcon(currentAnalysis.sentimentLabel)}
                        <div>
                            <p className="font-bold text-lg capitalize">{currentAnalysis.sentimentLabel}</p>
                            <p className="text-sm text-muted-foreground">Score: {currentAnalysis.sentimentScore.toFixed(2)}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Detailed Analysis:</h4>
                        <p className="text-muted-foreground">{currentAnalysis.analysis}</p>
                    </div>

                    {currentAnalysis.keyThemes && currentAnalysis.keyThemes.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Tags className="h-5 w-5 text-primary" />
                          Key Themes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.keyThemes.map((theme, index) => (
                            <Badge key={index} variant="secondary">{theme}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentAnalysis.positiveAffirmation && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Positive Affirmation
                        </h4>
                          <p className="text-muted-foreground italic">"{currentAnalysis.positiveAffirmation}"</p>
                      </div>
                    )}

                    {currentAnalysis.actionableAdvice && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-primary" />
                          Actionable Advice
                        </h4>
                        <p className="text-muted-foreground">{currentAnalysis.actionableAdvice}</p>
                      </div>
                    )}
                </CardContent>
            </Card>
          )}

        </div>

        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Journal History</CardTitle>
              <CardDescription>Review your past entries.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                {loadingHistory ? (
                   <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                        <Loader2 className="h-12 w-12 animate-spin mb-2"/>
                        <p>Loading your history...</p>
                    </div>
                ) : journalHistory.length > 0 ? (
                  <Accordion type="single" collapsible>
                    {journalHistory.map((entry, index) => (
                      <AccordionItem value={`item-${index}`} key={entry.id}>
                        <AccordionTrigger>{entry.date}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                          {entry.text}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                        <BookOpen className="h-12 w-12 mb-2"/>
                        <p>Your past entries will appear here.</p>
                    </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
