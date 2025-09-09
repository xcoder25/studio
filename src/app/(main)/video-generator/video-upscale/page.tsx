'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize, FileUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function VideoUpscalePage() {
    return (
        <div className="p-4 flex justify-center items-center">
            <Card className="w-full max-w-2xl bg-card/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Maximize />
                        Video Upscale
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Upload Video</Label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-10 h-10 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">Drag & drop your video here or click to upload</p>
                                    <p className="text-xs text-muted-foreground">Max file size: 50MB</p>
                                </div>
                                <input id="video-upload" type="file" className="hidden" accept="video/*" />
                            </label>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Target Resolution</Label>
                        <Select defaultValue="2x">
                            <SelectTrigger>
                                <SelectValue placeholder="Select upscale factor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2x">2x (e.g., 1080p to 4K)</SelectItem>
                                <SelectItem value="4x" disabled>4x (Coming Soon)</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                    <Button className="w-full" disabled>Upscale Video</Button>
                </CardContent>
            </Card>
        </div>
    )
}
