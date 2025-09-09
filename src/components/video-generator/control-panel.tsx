
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Text, ImageIcon, Shapes, Music } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { GenerationMode } from '@/app/(main)/video-generator/page';
import { ImageUploadArea } from './image-upload-area';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ControlPanelProps {
    mode: GenerationMode;
    setMode: (mode: GenerationMode) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    aspectRatio: string;
    setAspectRatio: (ratio: string) => void;
    isLoading: boolean;
    handleGenerateVideo: () => void;
    imagePreview: string | null;
    setImagePreview: (preview: string | null) => void;
    setImageDataUri: (uri: string | null) => void;
}

export default function ControlPanel({
    mode,
    setMode,
    prompt,
    setPrompt,
    aspectRatio,
    setAspectRatio,
    isLoading,
    handleGenerateVideo,
    imagePreview,
    setImagePreview,
    setImageDataUri
}: ControlPanelProps) {
  
  const router = useRouter();

  const handleModeChange = (newMode: string) => {
    const typedMode = newMode as GenerationMode;
    setMode(typedMode);
    if(typedMode === 'text-to-video') {
      router.push('/video-generator');
    } else {
      router.push('/video-generator/image-to-video');
    }
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
        
        <Card className="flex-grow flex flex-col bg-card/80">
             <CardHeader>
                <CardTitle>Create New Video</CardTitle>
                 <Tabs value={mode} onValueChange={handleModeChange} className='mt-2'>
                    <TabsList>
                        <TabsTrigger value="text-to-video"><Text className="mr-2"/>Text to Video</TabsTrigger>
                        <TabsTrigger value="image-to-video"><ImageIcon className="mr-2"/>Image to Video</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4 flex-grow flex flex-col">
                <div>
                    <Label>Model</Label>
                    <Select defaultValue="veo3" disabled={isLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="veo3">Veo 3</SelectItem>
                            <SelectItem value="veo2" disabled>Veo 2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {mode === 'image-to-video' && (
                  <ImageUploadArea 
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    setImageDataUri={setImageDataUri}
                    isLoading={isLoading}
                  />
                )}
                
                <div className="flex-grow flex flex-col">
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                        id="prompt"
                        placeholder={mode === 'image-to-video' ? "e.g., Make the person wave." : "e.g., A majestic dragon soaring over a mystical forest at dawn."}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[120px] mt-1 flex-grow bg-transparent"
                    />
                </div>
                 <div>
                    <Label>Settings</Label>
                    <div className="space-y-3 mt-1">
                        <div>
                            <Label htmlFor="aspect-ratio" className="text-sm font-normal">Aspect Ratio</Label>
                            <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isLoading}>
                                <SelectTrigger id="aspect-ratio">
                                    <SelectValue placeholder="Aspect Ratio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="audio-switch" className="flex flex-col gap-1">
                                <span>Audio</span>
                                <span className="font-normal text-xs text-muted-foreground">Enable to generate video with sound.</span>
                            </Label>
                            <Switch id="audio-switch" disabled={isLoading} />
                        </div>
                    </div>
                </div>

            </CardContent>
            <CardFooter>
                <Button onClick={handleGenerateVideo} disabled={isLoading} className="w-full" size="lg">
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                    ) : (
                    'Generate'
                    )}
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
