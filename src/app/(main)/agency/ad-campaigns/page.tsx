
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateAdCopy, type GenerateAdCopyOutput, type AdCopy } from '@/ai/flows/generate-ad-copy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, Copy } from 'lucide-react';
import { useLoading } from '@/context/loading-context';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


const adSchema = z.object({
  productName: z.string().min(3, 'Product name is required.'),
  productDescription: z.string().min(10, 'Product description is required.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  platform: z.enum(['Facebook', 'Instagram', 'Google']),
});

type AdFormValues = z.infer<typeof adSchema>;

export default function AdCampaignsPage() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [adResult, setAdResult] = useState<GenerateAdCopyOutput | null>(null);

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
    setAdResult(null);
    showLoading();
    try {
      const result = await generateAdCopy(data);
      setAdResult(result);
      toast({ title: 'Ad Copy Generated!' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate ad copy.' });
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  const AdCopyCard = ({ ad, platform }: { ad: AdCopy; platform: string }) => (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg">{platform} Ad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <CardDescription>Generate compelling ad copy with AI. Fill in the details below to get started.</CardDescription>
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
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  Generate Ad Copy
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
                    <p className="mt-4 text-muted-foreground">Generating ad copy variants...</p>
                </div>
            </div>
        )}
        {adResult ? (
            <div className="space-y-6">
                 <h2 className="text-2xl font-bold">Generated Ad Copy for {form.getValues('platform')}</h2>
                 <div className="grid md:grid-cols-2 gap-4">
                    {adResult.adCopy.map((ad, i) => (
                        <AdCopyCard key={i} ad={ad} platform={form.getValues('platform')} />
                    ))}
                 </div>
            </div>
        ) : !isLoading && (
             <div className="flex flex-col h-full justify-center items-center py-20 rounded-lg border border-dashed">
                <div className="text-center">
                    <Wand2 className="size-12 text-muted-foreground mx-auto" />
                    <p className="mt-4 text-muted-foreground">Your generated ad copy will appear here.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
