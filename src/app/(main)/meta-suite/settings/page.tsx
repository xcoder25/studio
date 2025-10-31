
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40 items-center justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle>Business Settings</CardTitle>
                    <CardDescription>This feature is coming soon! Manage your business information, connected accounts, and team members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button>
                        Go to Settings
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
