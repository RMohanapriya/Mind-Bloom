
"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Bot } from "lucide-react";


export default function AiCompanionPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center">
                <h1 className="font-semibold text-lg md:text-2xl">AI Companion</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline">
                        <Bot className="h-6 w-6" />
                        AI Companion
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                        <Bot className="h-16 w-16 mb-4"/>
                        <p className="text-lg">The AI Companion is ready to chat.</p>
                        <p>Analyze a new journal entry to start a conversation.</p>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
