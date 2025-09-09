'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Video, Image as ImageIcon, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateVideo } from '@/ai/flows/generate-video';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

type GenerationMode = 'text-to-video' | 'image-to-video';

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [mode, setMode] = useState<GenerationMode>('text-to-video');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

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

  const ImageUploadArea = useCallback(() => {
    return (
      <div className="space-y-2">
        <Label htmlFor="image-upload">Image</Label>
        <label
          htmlFor="image-upload"
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
        >
          {imagePreview ? (
            <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-lg" />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
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
    <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Video Generation</CardTitle>
                <CardDescription>
                    Create stunning videos from text prompts or images using AI.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={mode} onValueChange={(value) => setMode(value as GenerationMode)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="text-to-video"><Video className="mr-2" /> Text to Video</TabsTrigger>
                            <TabsTrigger value="image-to-video"><ImageIcon className="mr-2" /> Image to Video</TabsTrigger>
                        </TabsList>
                        <TabsContent value="text-to-video" className="pt-4">
                            {/* Content is shared, but this structure allows for future differences */}
                        </TabsContent>
                        <TabsContent value="image-to-video" className="pt-4">
                            <ImageUploadArea />
                        </TabsContent>
                    </Tabs>

                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="prompt">Prompt</Label>
                            <Textarea
                                id="prompt"
                                placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={isLoading}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Settings</Label>
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
                         <Button onClick={handleGenerateVideo} disabled={isLoading} className="w-full">
                            {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                            ) : (
                            'Create'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
      </div>

      <div className="lg:sticky top-6">
        <Card>
          <CardHeader>
            <CardTitle>Generated Video</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p>Generating video... This may take a minute or two.</p>
              </div>
            ) : videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full aspect-video rounded-md bg-muted"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
                 <div className="text-center text-muted-foreground">
                    <Video className="mx-auto h-12 w-12" />
                    <p>Your generated video will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
