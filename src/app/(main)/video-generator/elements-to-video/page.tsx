'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shapes, PlusCircle } from "lucide-react";

export default function ElementsToVideoPage() {
    return (
        <div className="p-4 flex justify-center items-center">
            <Card className="w-full max-w-4xl bg-card/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shapes />
                        Elements to Video
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-4">
                        <div className="w-full aspect-video bg-background/50 rounded-lg flex items-center justify-center">
                            <p className="text-muted-foreground">Timeline / Canvas Area</p>
                        </div>
                        <div className="h-24 bg-background/50 rounded-lg flex items-center justify-center">
                             <p className="text-muted-foreground">Timeline Control</p>
                        </div>
                    </div>
                    <div className="col-span-1 space-y-4">
                         <div className="h-full bg-background/50 rounded-lg flex flex-col items-center justify-center p-4">
                             <p className="text-muted-foreground text-center">Elements Library</p>
                             <Button variant="outline" className="mt-4 w-full">
                                <PlusCircle className="mr-2" />
                                Add Element
                             </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
