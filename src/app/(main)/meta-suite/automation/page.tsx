
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AutomationPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40 items-center justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle>Automation Center</CardTitle>
                    <CardDescription>This feature is coming soon! Set up automated responses, chatbots, and more.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button>
                        <Plus className="mr-2"/>
                        Create Automation
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
