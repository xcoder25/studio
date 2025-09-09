
'use client';

import React, { useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Text, ImageIcon, Shapes, Music, Settings, ChevronDown } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import type { GenerationMode } from '@/app/(main)/video-generator/page';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUri = reader.result as string;
            setImagePreview(dataUri);
            setImageDataUri(dataUri);
        };
        reader.readAsDataURL(file);
    }
  };

    const ImageUploadArea = useCallback(() => {
        return (
          <div className="space-y-2 mt-4">
            <label
              htmlFor="image-upload"
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
              className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-lg p-2" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-10 h-10 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-center text-muted-foreground">
                    <span className="font-semibold">Drag & drop an image</span>
                    <br />
                    or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
                </div>
              )}
            </label>
            <Input 
              id="image-upload"
              ref={fileInputRef} 
              type="file" 
              className="hidden" 
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange} 
            />
          </div>
        )
      }, [imagePreview]);


  return (
    <div className="space-y-4 h-full flex flex-col">
        <Card>
            <CardHeader>
                <CardTitle>Create New Video</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Button variant={mode === 'text-to-video' ? 'secondary' : 'outline'} onClick={() => setMode('text-to-video')}><Text className="mr-2"/> Text</Button>
                <Button variant={mode === 'image-to-video' ? 'secondary' : 'outline'} onClick={() => setMode('image-to-video')}><ImageIcon className="mr-2"/> Image</Button>
                <Button variant="outline" disabled><Shapes className="mr-2"/> Element</Button>
                <Button variant="outline" disabled><Music className="mr-2"/> Audio</Button>
            </CardContent>
        </Card>
        
        <Card className="flex-grow">
            <CardContent className="p-4 space-y-4">
                <div>
                    <Label>Model</Label>
                    <Select defaultValue="veo3">
                        <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="veo3">Veo3</SelectItem>
                            <SelectItem value="veo2" disabled>Veo2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {mode === 'image-to-video' && <ImageUploadArea />}
                
                <div>
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                        id="prompt"
                        placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[120px] mt-2"
                    />
                </div>
                 <div>
                    <Label>Settings</Label>
                    <div className="space-y-2 mt-2">
                         <div className="flex items-center justify-between">
                            <Label>Audio</Label>
                            <Switch disabled={isLoading} />
                        </div>
                        <div>
                            <Label>Aspect Ratio</Label>
                            <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Aspect Ratio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
                 <div className="w-full">
                    <p className="text-sm text-muted-foreground">Credits: 40/40 remaining</p>
                    <Button variant="link" className="p-0 h-auto">Upgrade</Button>
                </div>
                <Button onClick={handleGenerateVideo} disabled={isLoading} className="w-full">
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
