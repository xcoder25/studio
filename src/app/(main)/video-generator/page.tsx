
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Video, Image as ImageIcon, Upload, Text, Settings, ChevronDown, Music, Sparkles, History, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateVideo } from '@/ai/flows/generate-video';
import Image from 'next/image';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import VideoGeneratorSidebar from '@/components/video-generator/video-generator-sidebar';
import ControlPanel from '@/components/video-generator/control-panel';
import OutputPanel from '@/components/video-generator/output-panel';

export type GenerationMode = 'text-to-video' | 'image-to-video' | 'elements-to-video' | 'audio-to-video';

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [mode, setMode] = useState<GenerationMode>('text-to-video');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  
  const { toast } = useToast();

  const handleGenerateVideo = async () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt is required',
        description: 'Please enter a prompt to generate a video.',
      });
      return;
    }

    if (mode === 'image-to-video' && !imageDataUri) {
        toast({
            variant: 'destructive',
            title: 'Image is required',
            description: 'Please upload an image for image-to-video generation.',
        });
        return;
    }

    setIsLoading(true);
    setVideoUrl('');

    try {
      const result = await generateVideo({
        prompt,
        imageDataUri: mode === 'image-to-video' ? imageDataUri! : undefined,
        aspectRatio,
      });
      if (result.videoUrl) {
        setVideoUrl(result.videoUrl);
        toast({
          title: 'Video generated successfully!',
          description: 'Your video is ready to be viewed.',
        });
      } else {
        throw new Error('Video generation failed to produce a URL.');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Video Generation Failed',
        description: `There was an error generating your video. ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.14))] bg-background">
      <VideoGeneratorSidebar />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-10 gap-4 p-4">
        <div className="lg:col-span-7 xl:col-span-6">
            <ControlPanel 
                mode={mode}
                setMode={setMode}
                prompt={prompt}
                setPrompt={setPrompt}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                isLoading={isLoading}
                handleGenerateVideo={handleGenerateVideo}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                setImageDataUri={setImageDataUri}
            />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
            <OutputPanel
                isLoading={isLoading}
                videoUrl={videoUrl}
            />
        </div>
      </div>
    </div>
  );
}
