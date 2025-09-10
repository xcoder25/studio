
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/context/loading-context';
import { runCampaign, type RunCampaignOutput } from '@/ai/flows/run-campaign';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Loader2, PlayCircle, Rocket, Calendar, Twitter, Instagram, Facebook, Image as ImageIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

const campaignSchema = z.object({
  campaignGoal: z.string().min(10, { message: 'Please describe your campaign goal in more detail.' }),
  budget: z.coerce.number().min(1, { message: 'Budget must be at least $1.' }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const platformIcons = {
  Twitter: <Twitter className="size-4 text-sky-500" />,
  Facebook: <Facebook className="size-4 text-blue-600" />,
  Instagram: <Instagram className="size-4 text-fuchsia-600" />,
}

export default function CampaignsPage() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [campaignResult, setCampaignResult] = useState<RunCampaignOutput | null>(null);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      campaignGoal: '',
      budget: 100,
    },
  });

  const onSubmit = async (data: CampaignFormValues) => {
    setCampaignResult(null);
    showLoading();
    try {
      const result = await runCampaign(data);
      setCampaignResult(result);
      toast({ title: 'Campaign Agent Finished!', description: 'Your new campaign has been generated and scheduled.' });
    } catch (error) {
      console.error('Campaign generation failed:', error);
      toast({ variant: 'destructive', title: 'Agent Error', description: 'The AI agent failed to generate the campaign.' });
    } finally {
      hideLoading();
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Autonomous Campaign Agent</CardTitle>
            <CardDescription>Define a goal and let the AI build and schedule your entire campaign.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="campaignGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Goal</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Launch our new sneaker line to a young, urban audience." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Rocket />}
                  Launch Agent
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {campaignResult && (
            <Card>
                <CardHeader>
                    <CardTitle>Campaign Brief</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                     <div>
                        <p className="font-semibold">Campaign Name</p>
                        <p className="text-muted-foreground">{campaignResult.campaignBrief.campaignName}</p>
                     </div>
                      <div>
                        <p className="font-semibold">Target Audience</p>
                        <p className="text-muted-foreground">{campaignResult.campaignBrief.targetAudience}</p>
                     </div>
                      <div>
                        <p className="font-semibold">Key Message</p>
                        <p className="text-muted-foreground">{campaignResult.campaignBrief.keyMessage}</p>
                     </div>
                      <div>
                        <p className="font-semibold">Duration</p>
                        <p className="text-muted-foreground">{campaignResult.campaignBrief.durationDays} days</p>
                     </div>
                </CardContent>
            </Card>
        )}
      </div>

      <div className="lg:col-span-8">
        {isSubmitting ? (
          <Card className="h-full">
            <CardContent className="flex flex-col h-full justify-center items-center py-20">
              <Bot className="size-16 text-primary animate-bounce-subtle" />
              <h3 className="text-xl font-semibold mt-4">AI Agent at Work...</h3>
              <p className="text-muted-foreground mt-2 text-center">Planning strategy, generating content, and scheduling posts.</p>
              <Loader2 className="animate-spin size-8 text-primary mt-8" />
            </CardContent>
          </Card>
        ) : campaignResult ? (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar /> Campaign Schedule</CardTitle>
                    <CardDescription>The AI agent has generated and scheduled the following posts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {campaignResult.scheduledPosts.map(post => (
                        <Card key={post.id} className="p-4 bg-card/50">
                            <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src="https://picsum.photos/seed/trendix/100/100" data-ai-hint="logo company"/>
                                    <AvatarFallback>T</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 font-semibold">
                                            {platformIcons[post.platform as keyof typeof platformIcons]}
                                            <span>Trendix on {post.platform}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Day {post.day} at {post.time}</p>
                                    </div>
                                    <p className="text-sm my-2">{post.content}</p>
                                    {post.imageUrl && (
                                        <Image src={post.imageUrl} alt="Post image" width={400} height={400} className="rounded-lg border aspect-square object-cover" data-ai-hint="social media post"/>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="flex flex-col h-full justify-center items-center py-20 text-center">
              <Bot className="size-16 text-muted-foreground" />
              <h3 className="text-xl font-semibold mt-4">Ready for Liftoff</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">Your autonomous campaign results will appear here. Just define a goal, set a budget, and let your AI agent handle the rest.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
