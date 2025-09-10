
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { socialListening, type SocialListeningOutput } from '@/ai/flows/social-listening';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MicVocal, PlusCircle, Smile, Frown, Meh, Twitter, Rss, MessageSquare, ExternalLink, Activity, Siren, ShieldCheck, Zap } from 'lucide-react';
import { useLoading } from '@/context/loading-context';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const listeningSchema = z.object({
  brandName: z.string().min(2, 'Please enter a brand name to monitor.'),
  keywords: z.string().min(2, 'Please enter at least one keyword.'),
});

type ListeningFormValues = z.infer<typeof listeningSchema>;

const sentimentConfig = {
    Positive: { color: 'hsl(var(--chart-2))', icon: <Smile className="size-4 text-green-500" /> },
    Negative: { color: 'hsl(var(--destructive))', icon: <Frown className="size-4 text-red-500" /> },
    Neutral: { color: 'hsl(var(--muted-foreground))', icon: <Meh className="size-4 text-gray-500" /> },
};

const platformConfig = {
    Twitter: { icon: <Twitter className="size-4 text-sky-500" />, color: 'text-sky-500' },
    Blogs: { icon: <Rss className="size-4 text-orange-500" />, color: 'text-orange-500' },
    Forums: { icon: <MessageSquare className="size-4 text-blue-500" />, color: 'text-blue-500' },
    Instagram: { icon: <Activity className="size-4 text-fuchsia-500" />, color: 'text-fuchsia-500' },
    Facebook: { icon: <Activity className="size-4 text-blue-600" />, color: 'text-blue-600' },
};


export default function SocialListeningPage() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SocialListeningOutput | null>(null);

  const form = useForm<ListeningFormValues>({
    resolver: zodResolver(listeningSchema),
    defaultValues: { brandName: '', keywords: '' },
  });

  const onSubmit = async (data: ListeningFormValues) => {
    setIsLoading(true);
    setAnalysisResult(null);
    showLoading();
    try {
      const keywordsArray = data.keywords.split(',').map(k => k.trim());
      const result = await socialListening({ brandName: data.brandName, keywords: keywordsArray });
      setAnalysisResult(result);
      toast({ title: 'Monitoring Complete!' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Monitoring Failed', description: 'Could not fetch social listening data.' });
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };
  
  const pieData = analysisResult ? [
        { name: 'Positive', value: analysisResult.sentimentAnalysis.positiveMentions },
        { name: 'Negative', value: analysisResult.sentimentAnalysis.negativeMentions },
        { name: 'Neutral', value: analysisResult.sentimentAnalysis.neutralMentions },
    ] : [];

    const handleContentSuspension = () => {
        showLoading();
        setTimeout(() => {
            hideLoading();
            toast({
                title: "Content Suspended",
                description: "All scheduled posts have been paused to prevent insensitive content from going live during this event."
            })
        }, 1500)
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Listening</CardTitle>
          <CardDescription>Monitor brand mentions, analyze sentiment, and detect potential crises across the web.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-4">
              <FormField control={form.control} name="brandName" render={({ field }) => (
                <FormItem><FormLabel>Brand Name</FormLabel><FormControl><Input placeholder="e.g., Trendix" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="keywords" render={({ field }) => (
                <FormItem><FormLabel>Keywords (comma-separated)</FormLabel><FormControl><Input placeholder="e.g., customer service, billing" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="md:pt-8">
                 <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="animate-spin" /> : <MicVocal />}
                    Start Listening
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
            <div className="text-center">
                <Loader2 className="animate-spin size-12 text-primary mx-auto" />
                <p className="mt-4 text-muted-foreground">Scanning for mentions... this might take a moment.</p>
            </div>
        </div>
      )}

      {analysisResult && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-bold">Listening Report for: {form.getValues('brandName')}</h2>
                    <p className="text-muted-foreground">{analysisResult.summary}</p>
                </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader><CardTitle>Recent Mentions</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analysisResult.recentMentions.map(mention => (
                                    <div key={mention.id} className="p-3 rounded-lg border bg-card/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {platformConfig[mention.platform].icon}
                                                <span className="font-semibold text-sm">{mention.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                {sentimentConfig[mention.sentiment].icon}
                                                <span className='hidden sm:inline'>{mention.sentiment}</span>
                                                <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                                                    <a href={mention.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" /></a>
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{mention.content}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Sentiment Analysis</CardTitle></CardHeader>
                        <CardContent>
                            <div className="h-60">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={sentimentConfig[entry.name as keyof typeof sentimentConfig].color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Key Topics</CardTitle></CardHeader>
                        <CardContent>
                           <div className="flex flex-wrap gap-2">
                                {analysisResult.sentimentAnalysis.keyTopics.map(topic => (
                                    <Badge key={topic} variant="secondary">{topic}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Siren className="text-primary"/>
                        Crisis Monitoring
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     {analysisResult.crisisMonitoring.isCrisisDetected && (
                        <Alert variant="destructive">
                            <Siren className="h-4 w-4" />
                            <AlertTitle>Potential Crisis Detected!</AlertTitle>
                            <AlertDescription>
                                Our AI has detected a significant increase in negative sentiment that may require your immediate attention.
                                 <Button size="sm" className="mt-4 w-full sm:w-auto" onClick={handleContentSuspension}>
                                    <Zap className="mr-2" />
                                    Activate Content Suspension
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2"><Siren/> Active Alerts</h4>
                            <div className="mt-2 space-y-2">
                                {analysisResult.crisisMonitoring.activeAlerts.map((alert, i) => (
                                    <p key={i} className="text-sm p-2 bg-card/50 border rounded-lg">{alert}</p>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold flex items-center gap-2"><ShieldCheck /> Proactive Issues</h4>
                            <div className="mt-2 space-y-2">
                                {analysisResult.crisisMonitoring.proactiveIssues.map((issue, i) => (
                                    <p key={i} className="text-sm p-2 bg-card/50 border rounded-lg">{issue}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
