'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateVideo } from '@/ai/flows/generate-video';

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
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

    setIsLoading(true);
    setVideoUrl('');

    try {
      const result = await generateVideo(prompt);
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
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Video Generation</CardTitle>
          <CardDescription>
            Create stunning videos from text prompts using AI. Describe the scene you want to see, and watch it come to life.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Your Prompt</Label>
            <div className="flex gap-2">
              <Input
                id="prompt"
                placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={handleGenerateVideo} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {(isLoading || videoUrl) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Video</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p>Generating video... This may take a minute or two.</p>
              </div>
            ) : (
              videoUrl && (
                <video
                  src={videoUrl}
                  controls
                  className="w-full aspect-video rounded-md bg-muted"
                >
                  Your browser does not support the video tag.
                </video>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
