
"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function TrendsPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center">
                <h1 className="font-semibold text-lg md:text-2xl">Trends</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline">
                        <BarChart className="h-6 w-6" />
                        Sentiment Trends
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                        <BarChart className="h-16 w-16 mb-4"/>
                        <p className="text-lg">Sentiment trends will be displayed here.</p>
                        <p>Analyze journal entries to see your trends over time.</p>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
