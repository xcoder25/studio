
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Video, Music, Type, Clapperboard, Plus } from "lucide-react";

export default function VideoEditorPage() {
    return (
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-10rem)]">
            {/* Asset and Tool Panel */}
            <div className="col-span-3 h-full">
                <Card className="h-full flex flex-col bg-card/50">
                    <CardHeader>
                        <CardTitle>Assets</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <Tabs defaultValue="media" className="h-full flex flex-col">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="media" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Video /></TabsTrigger>
                                <TabsTrigger value="audio" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Music /></TabsTrigger>
                                <TabsTrigger value="text" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Type /></TabsTrigger>
                                <TabsTrigger value="elements" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Clapperboard /></TabsTrigger>
                            </TabsList>
                            <TabsContent value="media" className="flex-grow mt-4">
                                <div className="h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground p-4">
                                    <p className="text-sm text-center">Your media library will appear here.</p>
                                    <Button variant="outline" className="mt-4"><Plus className="mr-2"/> Add Media</Button>
                                </div>
                            </TabsContent>
                             <TabsContent value="audio" className="flex-grow mt-4">
                                <div className="h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground p-4">
                                     <p className="text-sm text-center">Your audio library.</p>
                                     <Button variant="outline" className="mt-4"><Plus className="mr-2"/> Add Audio</Button>
                                </div>
                            </TabsContent>
                             <TabsContent value="text" className="flex-grow mt-4">
                                <div className="h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground p-4">
                                     <p className="text-sm text-center">Text style options.</p>
                                     <Button variant="outline" className="mt-4"><Plus className="mr-2"/> Add Text</Button>
                                </div>
                            </TabsContent>
                             <TabsContent value="elements" className="flex-grow mt-4">
                                <div className="h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground p-4">
                                     <p className="text-sm text-center">Stickers, shapes, etc.</p>
                                     <Button variant="outline" className="mt-4"><Plus className="mr-2"/> Add Element</Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Canvas and Timeline Panel */}
            <div className="col-span-9 h-full flex flex-col gap-4">
                <Card className="flex-grow-[3] bg-card/50">
                     <CardContent className="h-full p-4">
                        <div className="w-full h-full bg-background/50 rounded-lg flex items-center justify-center">
                            <p className="text-muted-foreground">Video Preview Canvas</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-grow-[1] bg-card/50">
                    <CardHeader>
                        <CardTitle>Timeline</CardTitle>
                    </CardHeader>
                     <CardContent className="p-4 pt-0">
                         <div className="w-full h-full bg-background/50 rounded-lg flex items-center justify-center">
                             <p className="text-muted-foreground">Timeline Controls</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
