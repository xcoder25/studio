'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeCompetitor, type AnalyzeCompetitorOutput } from '@/ai/flows/analyze-competitor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Lightbulb, TrendingUp, BarChart2, ShieldCheck, ShieldAlert, Target, ThumbsUp } from 'lucide-react';
import { useLoading } from '@/context/loading-context';

const analysisSchema = z.object({
  competitor: z.string().min(2, 'Please enter a competitor name or handle.'),
});

type AnalysisFormValues = z.infer<typeof analysisSchema>;

function AnalysisCard({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) {
    return (
        <Card className="bg-card/50">
            <CardHeader className="flex flex-row items-center gap-2">
                <Icon className="size-5 text-primary" />
                <h3 className="font-semibold">{title}</h3>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}

export default function CompetitorAnalysisPage() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCompetitorOutput | null>(null);

  const form = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      competitor: '',
    },
  });

  const onSubmit = async (data: AnalysisFormValues) => {
    setIsLoading(true);
    setAnalysisResult(null);
    showLoading();
    try {
      const result = await analyzeCompetitor({ competitor: data.competitor });
      setAnalysisResult(result);
      toast({ title: 'Analysis Complete!' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not fetch competitor analysis.' });
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Competitor Analysis</CardTitle>
          <CardDescription>Enter a competitor's name or social media handle to get an AI-powered analysis of their strategy.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="competitor"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="@competitor or Competitor Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                Analyze
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
            <div className="text-center">
                <Loader2 className="animate-spin size-12 text-primary mx-auto" />
                <p className="mt-4 text-muted-foreground">Analyzing competitor data... this might take a moment.</p>
            </div>
        </div>
      )}

      {analysisResult && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-bold">Analysis for: {form.getValues('competitor')}</h2>
                    <p className="text-muted-foreground">{analysisResult.overview}</p>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <AnalysisCard title="Content Analysis" icon={Lightbulb}>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-medium text-sm mb-1">Key Themes</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.contentAnalysis.keyThemes.map(theme => <Badge key={theme} variant="secondary">{theme}</Badge>)}
                            </div>
                        </div>
                        <Separator/>
                        <p className="text-sm"><strong className="font-medium">Post Frequency:</strong> {analysisResult.contentAnalysis.postFrequency}</p>
                        <p className="text-sm"><strong className="font-medium">Tone of Voice:</strong> {analysisResult.contentAnalysis.toneOfVoice}</p>
                    </div>
                </AnalysisCard>

                <AnalysisCard title="Engagement Metrics" icon={BarChart2}>
                    <div className="space-y-3">
                        <p className="text-sm"><strong className="font-medium">Average Likes:</strong> {analysisResult.engagementAnalysis.averageLikes}</p>
                         <p className="text-sm"><strong className="font-medium">Average Comments:</strong> {analysisResult.engagementAnalysis.averageComments}</p>
                        <p className="text-sm"><strong className="font-medium">Audience Sentiment:</strong> {analysisResult.engagementAnalysis.audienceSentiment}</p>
                    </div>
                </AnalysisCard>
            </div>
            
             <AnalysisCard title="SWOT Analysis" icon={Target}>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><ThumbsUp className="text-green-500" /> Strengths</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {analysisResult.swotAnalysis.strengths.map(item => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><TrendingUp className="text-red-500" /> Weaknesses</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {analysisResult.swotAnalysis.weaknesses.map(item => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><ShieldCheck className="text-blue-500" /> Opportunities</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {analysisResult.swotAnalysis.opportunities.map(item => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><ShieldAlert className="text-yellow-500" /> Threats</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {analysisResult.swotAnalysis.threats.map(item => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </AnalysisCard>
        </div>
      )}
    </div>
  );
}
