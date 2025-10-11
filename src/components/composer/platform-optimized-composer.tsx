'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImageUploadArea } from '@/components/video-generator/image-upload-area';
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/context/loading-context';
import { generateOptimizedCaptions } from '@/ai/flows/generate-optimized-captions';
import { rewriteCaption } from '@/ai/flows/rewrite-caption';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, Wand2, Loader2, Twitter, Facebook, Instagram, ThumbsUp, MessageSquare, Share2, BarChart2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';

const platformSchema = z.object({
  id: z.string(),
  name: z.enum(['Twitter', 'Facebook', 'Instagram']),
  caption: z.string(),
  isEnabled: z.boolean(),
});

const composerSchema = z.object({
  productDescription: z.string().min(10, 'Please provide a more detailed description.'),
  platforms: z.array(platformSchema),
});

type ComposerFormValues = z.infer<typeof composerSchema>;
type PlatformName = 'Twitter' | 'Facebook' | 'Instagram';

const platformConfig = {
  Twitter: { icon: Twitter, color: 'text-sky-500' },
  Facebook: { icon: Facebook, color: 'text-blue-600' },
  Instagram: { icon: Instagram, color: 'text-fuchsia-500' },
};

export default function PlatformOptimizedComposer() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null);

  const form = useForm<ComposerFormValues>({
    resolver: zodResolver(composerSchema),
    defaultValues: {
      productDescription: '',
      platforms: [
        { id: 'p1', name: 'Twitter', caption: '', isEnabled: true },
        { id: 'p2', name: 'Facebook', caption: '', isEnabled: true },
        { id: 'p3', name: 'Instagram', caption: '', isEnabled: true },
      ],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'platforms',
  });

  const platforms = useWatch({ control: form.control, name: 'platforms' });
  const enabledPlatforms = platforms.filter(p => p.isEnabled);

  const handleGenerateAll = async () => {
    const productDescription = form.getValues('productDescription');
    if (!productDescription) {
      form.setError('productDescription', { message: 'Product description is required to generate captions.' });
      return;
    }
    if (!imageDataUri) {
        toast({ variant: 'destructive', title: 'Image is required' });
        return;
    }

    setIsGeneratingAll(true);
    showLoading();
    try {
      const result = await generateOptimizedCaptions({
        productDescription,
        imageDataUri,
      });

      form.setValue('platforms.0.caption', result.twitter);
      form.setValue('platforms.1.caption', result.facebook);
      form.setValue('platforms.2.caption', result.instagram);
      toast({ title: 'Captions generated successfully!' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Generation Failed' });
    } finally {
      setIsGeneratingAll(false);
      hideLoading();
    }
  };

  const handleRewrite = async (index: number) => {
    const platform = form.getValues(`platforms.${index}`);
    if (!platform.caption) {
        toast({ variant: 'destructive', title: 'No caption to rewrite' });
        return;
    }
    setRewritingIndex(index);
    showLoading();
    try {
        const result = await rewriteCaption({
            caption: platform.caption,
            tone: 'Make this more engaging',
            platform: platform.name,
        });
        form.setValue(`platforms.${index}.caption`, result.rewrittenCaption);
        toast({ title: `${platform.name} caption rewritten!` });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Rewrite Failed' });
    } finally {
        setRewritingIndex(null);
        hideLoading();
    }
  }

  const onSubmit = (data: ComposerFormValues) => {
    console.log('Publishing:', data);
    toast({ title: 'Posts Published!', description: `Your content has been published to ${enabledPlatforms.length} platforms.` });
  };

  const isAiBusy = isGeneratingAll || rewritingIndex !== null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-12 gap-6">
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Input</CardTitle>
              <CardDescription>Provide the core media and description.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="productDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product/Service Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe the product, its features, and benefits..." {...field} className="min-h-[100px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormItem>
                <FormLabel>Media</FormLabel>
                <ImageUploadArea imagePreview={imagePreview} setImagePreview={setImagePreview} setImageDataUri={setImageDataUri} isLoading={isAiBusy}/>
              </FormItem>
            </CardContent>
            <CardFooter>
                 <Button type="button" onClick={handleGenerateAll} disabled={isAiBusy || !imagePreview} className="w-full">
                    {isGeneratingAll ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    Generate All Captions
                </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Select Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {fields.map((field, index) => {
                    const platformName = form.getValues(`platforms.${index}.name`);
                    const Icon = platformConfig[platformName].icon;
                    return (
                        <FormField
                            key={field.id}
                            control={form.control}
                            name={`platforms.${index}.isEnabled`}
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 has-[:checked]:bg-muted">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="flex items-center gap-2 font-medium !m-0">
                                        <Icon className={cn("size-5", platformConfig[platformName].color)} />
                                        {platformName}
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    )
                })}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Previews */}
        <div className="lg:col-span-8">
            <Card>
                <CardHeader>
                    <CardTitle>Platform Previews</CardTitle>
                    <CardDescription>Review and optimize your post for each platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="Twitter" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            {enabledPlatforms.map(p => (
                                <TabsTrigger key={p.id} value={p.name} disabled={!p.isEnabled}>
                                     {React.createElement(platformConfig[p.name].icon, { className: 'mr-2' })}
                                    {p.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        
                        {fields.map((field, index) => {
                            const platform = form.getValues(`platforms.${index}`);
                            return (
                                <TabsContent key={field.id} value={platform.name}>
                                    <div className="mt-4 p-4 border rounded-lg bg-background/30">
                                        {imagePreview && <Image src={imagePreview} alt="Preview" width={800} height={800} className="rounded-md border aspect-square object-cover" />}
                                        <FormField control={form.control} name={`platforms.${index}.caption`} render={({ field }) => (
                                            <FormItem className="mt-4">
                                                <Textarea {...field} className="min-h-[120px] bg-background" />
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="flex gap-2 mt-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => handleRewrite(index)} disabled={isAiBusy || !platform.caption}>
                                                {rewritingIndex === index ? <Loader2 className="animate-spin" /> : <Wand2 />} Rewrite
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            )
                        })}
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <Button type="submit" size="lg" disabled={isAiBusy} className="w-full">Publish to {enabledPlatforms.length} Platforms</Button>
                </CardFooter>
            </Card>
        </div>
      </form>
    </Form>
  );
}
