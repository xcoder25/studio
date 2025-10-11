
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Video, ImageIcon, Mic, Clapperboard, Loader2, Play, Scissors } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploadArea } from '@/components/video-generator/image-upload-area';
import { useToast } from '@/hooks/use-toast';
import { generateVideo } from '@/ai/flows/generate-video';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';
import { lipSync } from '@/ai/flows/lip-sync';
import OutputPanel from '@/components/video-generator/output-panel';
import { useLoading } from '@/context/loading-context';
import Link from 'next/link';

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

export default function VideoEditorPage() {
    const { toast } = useToast();
    const { showLoading, hideLoading } = useLoading();

    // Shared State
    const [videoUrl, setVideoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Text/Image to Video State
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);

    // Lip-Sync State
    const [lipSyncImagePreview, setLipSyncImagePreview] = useState<string | null>(null);
    const [lipSyncImageDataUri, setLipSyncImageDataUri] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [voice, setVoice] = useState(voices[0].id);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    
    const handleGenerateVideo = async (mode: 'text-to-video' | 'image-to-video') => {
        if (!prompt) {
          toast({ variant: 'destructive', title: 'Prompt is required' });
          return;
        }
        if (mode === 'image-to-video' && !imageDataUri) {
            toast({ variant: 'destructive', title: 'Image is required' });
            return;
        }
    
        setIsLoading(true);
        setVideoUrl('');
        showLoading();
    
        try {
          const result = await generateVideo({
            prompt,
            imageDataUri: mode === 'image-to-video' ? (imageDataUri || undefined) : undefined,
            aspectRatio,
          });
          setVideoUrl(result.videoUrl);
          toast({ title: 'Video generated successfully!' });
        } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Video Generation Failed' });
        } finally {
          setIsLoading(false);
          hideLoading();
        }
    };
    
    const handleGenerateAudio = async () => {
        if (!text) {
            toast({ variant: 'destructive', title: 'Text is required' });
            return;
        }
        setIsGeneratingAudio(true);
        setAudioUrl(null);
        showLoading();
        try {
            const result = await generateAudioFromText({ text, voice });
            setAudioUrl(result.audioUrl);
            toast({ title: 'Audio generated successfully!' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Audio generation failed' });
        } finally {
            setIsGeneratingAudio(false);
            hideLoading();
        }
    };

    const handleGenerateLipSync = async () => {
        if (!lipSyncImageDataUri) {
            toast({ variant: 'destructive', title: 'Image is required' });
            return;
        }
        if (!audioUrl) {
            toast({ variant: 'destructive', title: 'Audio is required. Please generate audio first.' });
            return;
        }

        setIsLoading(true);
        setVideoUrl('');
        showLoading();
        try {
            const result = await lipSync({ imageDataUri: lipSyncImageDataUri, audioDataUri: audioUrl });
            setVideoUrl(result.videoUrl);
            toast({ title: 'Lip-sync video generated successfully!' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Lip-sync generation failed.' });
        } finally {
            setIsLoading(false);
            hideLoading();
        }
    };

    const isAnyTaskRunning = isLoading || isGeneratingAudio;

    return (
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
            <div className="col-span-4 lg:col-span-3 h-full">
                <Card className="h-full flex flex-col bg-card/50">
                    <CardHeader>
                        <CardTitle>AI Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-2 pt-0">
                        <Tabs defaultValue="text-to-video" className="h-full flex flex-col">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="text-to-video" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs p-1 h-auto"><Video className="size-4 mb-1"/>Text2Video</TabsTrigger>
                                <TabsTrigger value="image-to-video" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs p-1 h-auto"><ImageIcon className="size-4 mb-1"/>Image2Video</TabsTrigger>
                                <TabsTrigger value="lip-sync" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs p-1 h-auto"><Mic className="size-4 mb-1"/>Lip-Sync</TabsTrigger>
                            </TabsList>
                            
                            {/* Text to Video Panel */}
                            <TabsContent value="text-to-video" className="flex-grow mt-4 p-2 space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="prompt-t2v">Prompt</Label>
                                    <Textarea id="prompt-t2v" placeholder="A majestic dragon soaring..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[100px]" disabled={isAnyTaskRunning}/>
                                </div>
                                <div className="space-y-1">
                                    <Label>Aspect Ratio</Label>
                                    <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isAnyTaskRunning}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="16:9">16:9</SelectItem>
                                            <SelectItem value="9:16">9:16</SelectItem>
                                            <SelectItem value="1:1">1:1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={() => handleGenerateVideo('text-to-video')} disabled={isAnyTaskRunning || !prompt}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2"/> : <Video className="mr-2"/>}
                                    Generate
                                </Button>
                            </TabsContent>

                            {/* Image to Video Panel */}
                             <TabsContent value="image-to-video" className="flex-grow mt-4 p-2 space-y-4">
                                <ImageUploadArea imagePreview={imagePreview} setImagePreview={setImagePreview} setImageDataUri={setImageDataUri} isLoading={isAnyTaskRunning} />
                                <div className="space-y-1">
                                    <Label htmlFor="prompt-i2v">Prompt</Label>
                                    <Textarea id="prompt-i2v" placeholder="Make the person wave..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[80px]" disabled={isAnyTaskRunning}/>
                                </div>
                                <Button onClick={() => handleGenerateVideo('image-to-video')} disabled={isAnyTaskRunning || !prompt || !imageDataUri}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2"/> : <ImageIcon className="mr-2"/>}
                                    Animate
                                 </Button>
                            </TabsContent>

                             {/* Lip-Sync Panel */}
                             <TabsContent value="lip-sync" className="flex-grow mt-4 p-2 space-y-4 flex flex-col">
                                <ImageUploadArea imagePreview={lipSyncImagePreview} setImagePreview={setLipSyncImagePreview} setImageDataUri={setLipSyncImageDataUri} isLoading={isAnyTaskRunning} />
                                <div className="space-y-1">
                                    <Label htmlFor="lip-sync-text">Text</Label>
                                    <Textarea id="lip-sync-text" placeholder="Enter the text to speak..." value={text} onChange={(e) => setText(e.target.value)} className="min-h-[80px]" disabled={isAnyTaskRunning}/>
                                </div>
                                <div className="space-y-1">
                                    <Label>Voice</Label>
                                    <Select value={voice} onValueChange={setVoice} disabled={isAnyTaskRunning}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {voices.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {audioUrl && <audio src={audioUrl} controls className="w-full h-10"/>}
                                <Button variant="secondary" onClick={handleGenerateAudio} disabled={isAnyTaskRunning || !text}>
                                    {isGeneratingAudio ? <Loader2 className="animate-spin mr-2"/> : <Play className="mr-2"/>}
                                    Generate Audio
                                </Button>
                                <Button onClick={handleGenerateLipSync} disabled={isAnyTaskRunning || !audioUrl || !lipSyncImageDataUri}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2"/> : <Mic className="mr-2"/>}
                                    Generate Lip-Sync
                                </Button>
                             </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="p-2">
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/video-generator/elements-to-video">
                                <Scissors className="mr-2" /> Open Timeline Editor
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="col-span-8 lg:col-span-9 h-full flex flex-col gap-4">
                <div className="flex-grow-[3]">
                    <OutputPanel isLoading={isLoading} videoUrl={videoUrl} />
                </div>
                 <Card className="flex-grow-[1] bg-card/50">
                    <CardHeader>
                        <CardTitle>Generated Clips</CardTitle>
                    </CardHeader>
                     <CardContent className="p-4 pt-0">
                         <div className="w-full h-24 bg-background/50 rounded-lg flex items-center justify-center">
                             <p className="text-muted-foreground">Your generated clips will appear here</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
