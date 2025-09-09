'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Mic, Loader2, Play } from "lucide-react";
import { ImageUploadArea } from '@/components/video-generator/image-upload-area';
import { useToast } from '@/hooks/use-toast';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';
import { lipSync } from '@/ai/flows/lip-sync';
import OutputPanel from '@/components/video-generator/output-panel';

const voices = [
    { id: 'Alloy', name: 'Alloy' },
    { id: 'Echo', name: 'Echo' },
    { id: 'Fable', name: 'Fable' },
    { id: 'Onyx', name: 'Onyx' },
    { id: 'Nova', name: 'Nova' },
    { id: 'Shimmer', name: 'Shimmer' },
    { id: 'Achernar', name: 'Achernar' },
    { id: 'Algenib', name: 'Algenib' },
];

export default function LipSyncPage() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [voice, setVoice] = useState(voices[0].id);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');

    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const { toast } = useToast();

    const handleGenerateAudio = async () => {
        if (!text) {
            toast({ variant: 'destructive', title: 'Text is required' });
            return;
        }
        setIsGeneratingAudio(true);
        setAudioUrl(null);
        try {
            const result = await generateAudioFromText({ text, voice });
            setAudioUrl(result.audioUrl);
            toast({ title: 'Audio generated successfully!' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Audio generation failed' });
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    const handleGenerateLipSync = async () => {
        if (!imageDataUri) {
            toast({ variant: 'destructive', title: 'Image is required' });
            return;
        }
        if (!audioUrl) {
            toast({ variant: 'destructive', title: 'Audio is required. Please generate audio first.' });
            return;
        }

        setIsGeneratingVideo(true);
        setVideoUrl('');
        try {
            const result = await lipSync({ imageDataUri, audioDataUri: audioUrl });
            setVideoUrl(result.videoUrl);
            toast({ title: 'Lip-sync video generated successfully!' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Lip-sync generation failed.' });
        } finally {
            setIsGeneratingVideo(false);
        }
    };

    return (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-10 gap-4 p-4 overflow-y-auto">
            <div className="lg:col-span-7 xl:col-span-6 h-full">
                <Card className="w-full h-full flex flex-col bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mic />
                            Lip-Sync Video
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow flex flex-col">
                        <ImageUploadArea 
                            imagePreview={imagePreview}
                            setImagePreview={setImagePreview}
                            setImageDataUri={setImageDataUri}
                            isLoading={isGeneratingVideo || isGeneratingAudio}
                        />

                        <div className="space-y-2 flex-grow flex flex-col">
                            <Label htmlFor="lip-sync-text">Text for Audio</Label>
                            <Textarea
                                id="lip-sync-text"
                                placeholder="Enter the text you want the character to say..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="min-h-[100px] flex-grow bg-transparent"
                                disabled={isGeneratingVideo || isGeneratingAudio}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div>
                                <Label>Voice</Label>
                                <Select value={voice} onValueChange={setVoice} disabled={isGeneratingVideo || isGeneratingAudio}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a voice" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {voices.map(v => (
                                            <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleGenerateAudio} disabled={isGeneratingAudio || !text}>
                                {isGeneratingAudio ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2"/>}
                                {isGeneratingAudio ? 'Generating Audio...' : 'Generate & Preview Audio'}
                            </Button>
                        </div>
                        
                        {audioUrl && (
                            <div className="space-y-2">
                                <Label>Generated Audio</Label>
                                <audio src={audioUrl} controls className="w-full" />
                            </div>
                        )}

                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleGenerateLipSync} disabled={isGeneratingVideo || !imageDataUri || !audioUrl}>
                            {isGeneratingVideo ? <Loader2 className="animate-spin mr-2" /> : <Mic className="mr-2"/>}
                            {isGeneratingVideo ? 'Generating Lip-Sync Video...' : 'Generate Lip-Sync Video'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="lg:col-span-5 xl:col-span-4 h-full">
                <OutputPanel
                    isLoading={isGeneratingVideo}
                    videoUrl={videoUrl}
                />
            </div>
        </main>
    )
}
