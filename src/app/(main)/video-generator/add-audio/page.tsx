'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Music } from "lucide-react";

export default function AddAudioPage() {
    return (
        <div className="p-4 flex justify-center items-center">
            <Card className="w-full max-w-2xl bg-card/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Music />
                        Add Audio to Video
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Upload Video</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">Drag & drop video file or click</p>
                                </div>
                                <input id="video-upload" type="file" className="hidden" accept="video/*" />
                            </label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Upload Audio</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="audio-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">Drag & drop audio file or click</p>
                                </div>
                                <input id="audio-upload" type="file" className="hidden" accept="audio/*" />
                            </label>
                        </div>
                    </div>
                    <Button className="w-full" disabled>Combine</Button>
                </CardContent>
            </Card>
        </div>
    )
}
