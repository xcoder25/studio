
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateAdCopy, type GenerateAdCopyOutput, type AdCopy } from '@/ai/flows/generate-ad-copy';
import { generateVideo } from '@/ai/flows/generate-video';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, Copy, Video, DollarSign, BarChart } from 'lucide-react';
import { useLoading } from '@/context/loading-context';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageUploadArea } from '@/components/video-generator/image-upload-area';
import { Label } from '@/components/ui/label';

const adSchema = z.object({
  productName: z.string().min(3, 'Product name is required.'),
  productDescription: z.string().min(10, 'Product description is required.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  platform: z.enum(['Facebook', 'Instagram', 'Google']),
});

type AdFormValues = z.infer<typeof adSchema>;
type AdResultWithVideo = (AdCopy & { videoUrl?: string; isGeneratingVideo?: boolean });
type FullAdOutput = GenerateAdCopyOutput & { adCopy: AdResultWithVideo[] };

export default function AdCampaignsPage() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [adResults, setAdResults] = useState<FullAdOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      productName: '',
      productDescription: '',
      targetAudience: '',
      platform: 'Facebook',
    },
  });

  const onSubmit = async (data: AdFormValues) => {
    setIsLoading(true);
    setAdResults(null);
    showLoading();
    try {
      const result = await generateAdCopy({...data, imageDataUri: imageDataUri || undefined});
      setAdResults(result as FullAdOutput);
      toast({ title: 'Ad Strategy Generated!' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate ad strategy.' });
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };
  
  const handleGenerateVideo = async (index: number) => {
    if (!adResults || !adResults.adCopy[index]) return;

    setAdResults(currentResults => {
        if (!currentResults) return null;
        const newResults = {...currentResults};
        newResults.adCopy[index].isGeneratingVideo = true;
        return newResults;
    });

    try {
        const ad = adResults.adCopy[index];
        const result = await generateVideo({ prompt: ad.videoIdea, imageDataUri: imageDataUri || undefined });
        
        setAdResults(currentResults => {
            if (!currentResults) return null;
            const newResults = {...currentResults};
            newResults.adCopy[index].videoUrl = result.videoUrl;
            return newResults;
        });

        toast({ title: 'Video generated successfully!' });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Video generation failed' });
    } finally {
        setAdResults(currentResults => {
            if (!currentResults) return null;
            const newResults = {...currentResults};
            newResults.adCopy[index].isGeneratingVideo = false;
            return newResults;
        });
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  const AdCopyCard = ({ ad, index, platform }: { ad: AdResultWithVideo; index: number; platform: string }) => (
    <Card className="bg-card/50 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{platform} Ad Variation {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
         {ad.videoUrl ? (
            <video src={ad.videoUrl} controls className="w-full rounded-md" />
        ) : ad.isGeneratingVideo ? (
            <div className="aspect-video bg-background/50 rounded-md flex flex-col items-center justify-center text-center p-4">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-sm mt-2 text-muted-foreground">Generating video...</p>
            </div>
        ) : (
            <div className="aspect-video bg-background/50 rounded-md flex flex-col items-center justify-center text-center p-4">
                <p className="text-sm text-muted-foreground"><b>Video Idea:</b> {ad.videoIdea}</p>
                <Button size="sm" className="mt-4" onClick={() => handleGenerateVideo(index)} disabled={!imageDataUri}>
                    <Video className="mr-2"/> Generate Video
                </Button>
                {!imageDataUri && <p className="text-xs text-muted-foreground mt-2">(Upload an image to enable)</p>}
            </div>
        )}
        
        <Separator />
        
        <div>
          <Label className="text-xs text-muted-foreground">Headline</Label>
          <div className="flex items-center gap-2">
            <p className="flex-grow">{ad.headline}</p>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(ad.headline)}><Copy className="size-3.5" /></Button>
          </div>
        </div>
        <Separator />
        <div>
          <Label className="text-xs text-muted-foreground">Body</Label>
          <div className="flex items-start gap-2">
            <p className="flex-grow text-sm">{ad.body}</p>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(ad.body)}><Copy className="size-3.5" /></Button>
          </div>
        </div>
        {ad.hashtags && ad.hashtags.length > 0 && (
          <>
            <Separator />
            <div>
              <Label className="text-xs text-muted-foreground">Hashtags</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {ad.hashtags.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Ad Campaign Assistant</CardTitle>
            <CardDescription>Generate a full ad campaign strategy with AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="platform" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Platform</FormLabel>
                        <FormControl>
                            <Tabs defaultValue={field.value} onValueChange={field.onChange} className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="Facebook">Facebook</TabsTrigger>
                                    <TabsTrigger value="Instagram">Instagram</TabsTrigger>
                                    <TabsTrigger value="Google">Google</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="productName" render={({ field }) => (
                  <FormItem><FormLabel>Product/Service Name</FormLabel><FormControl><Input placeholder="e.g., Trendix AI" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="productDescription" render={({ field }) => (
                  <FormItem><FormLabel>Product/Service Description</FormLabel><FormControl><Textarea placeholder="Describe what you're selling..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="targetAudience" render={({ field }) => (
                  <FormItem><FormLabel>Target Audience</FormLabel><FormControl><Input placeholder="e.g., Social media managers at startups" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormItem>
                    <FormLabel>Product Image (Optional)</FormLabel>
                    <ImageUploadArea imagePreview={imagePreview} setImagePreview={setImagePreview} setImageDataUri={setImageDataUri} isLoading={isLoading}/>
                 </FormItem>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  Generate Strategy
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8">
        {isLoading && (
            <div className="flex flex-col h-full justify-center items-center py-20 rounded-lg border border-dashed">
                <div className="text-center">
                    <Loader2 className="animate-spin size-12 text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">Generating your campaign strategy...</p>
                </div>
            </div>
        )}
        {adResults ? (
            <div className="space-y-6">
                 <h2 className="text-2xl font-bold">Generated Strategy for {form.getValues('platform')}</h2>
                 
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex-row items-center gap-2">
                           <DollarSign className="size-6 text-primary" />
                           <CardTitle>Budget Recommendation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-2xl font-bold">{adResults.budgetRecommendation.suggestedBudget}</p>
                            <p className="text-sm text-muted-foreground">{adResults.budgetRecommendation.reasoning}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center gap-2">
                           <BarChart className="size-6 text-primary" />
                           <CardTitle>ROI Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-2xl font-bold">{adResults.roiAnalysis.projectedRoi} Projected ROI</p>
                            <p className="text-sm text-muted-foreground">{adResults.roiAnalysis.keyAssumptions}</p>
                        </CardContent>
                    </Card>
                 </div>

                 <div className="grid md:grid-cols-2 gap-4">
                    {adResults.adCopy.map((ad, i) => (
                        <AdCopyCard key={i} index={i} ad={ad} platform={form.getValues('platform')} />
                    ))}
                 </div>
            </div>
        ) : !isLoading && (
             <div className="flex flex-col h-full justify-center items-center py-20 rounded-lg border border-dashed">
                <div className="text-center">
                    <Wand2 className="size-12 text-muted-foreground mx-auto" />
                    <p className="mt-4 text-muted-foreground">Your generated ad strategy will appear here.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
