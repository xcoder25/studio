'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePostContent } from '@/ai/flows/generate-post-content';
import { suggestHashtags } from '@/ai/flows/suggest-hashtags';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  Hash,
  Twitter,
  Facebook,
  Instagram,
  Calendar as CalendarIcon,
  Clock,
  Loader2,
  Copy,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLoading } from '@/context/loading-context';

const composerSchema = z.object({
  postContent: z.string().min(1, 'Post content cannot be empty.'),
  topic: z.string(),
  tone: z.string(),
  scheduleDate: z.date().optional(),
  scheduleTime: z.string().optional(),
});

type ComposerFormValues = z.infer<typeof composerSchema>;

export default function PostComposer() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<{ content: string; reasoning: string } | null>(null);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const { showLoading } = useLoading();
  
  const form = useForm<ComposerFormValues>({
    resolver: zodResolver(composerSchema),
    defaultValues: {
      postContent: '',
      topic: '',
      tone: 'Informative',
      scheduleTime: '10:00',
    },
  });

  const postContentValue = useWatch({ control: form.control, name: 'postContent' });

  const handleGeneratePost = async () => {
    const { topic, tone } = form.getValues();
    if (!topic) {
      form.setError('topic', { message: 'Please enter a topic.' });
      return;
    }
    showLoading(3000);
    setIsGenerating(true);
    setGeneratedPost(null);
    try {
      const result = await generatePostContent({
        trendingTopic: topic,
        tone,
        userHistory: 'The user is a tech startup focused on AI solutions. Past successful posts include new feature announcements and industry insights.',
      });
      setGeneratedPost({ content: result.postContent, reasoning: result.reasoning });
      setSuggestedHashtags(result.suggestedHashtags);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate post content.' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSuggestHashtags = async () => {
    const content = form.getValues('postContent');
    if (!content) {
      form.setError('postContent', { message: 'Please enter some content to suggest hashtags.' });
      return;
    }
    showLoading(3000);
    setIsSuggesting(true);
    try {
      const result = await suggestHashtags({ postContent: content });
      setSuggestedHashtags(result.hashtags);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to suggest hashtags.' });
    } finally {
      setIsSuggesting(false);
    }
  };

  const useGeneratedContent = () => {
    if (generatedPost) {
      form.setValue('postContent', generatedPost.content);
      setGeneratedPost(null);
    }
  };

  const addHashtag = (tag: string) => {
    form.setValue('postContent', `${form.getValues('postContent')} ${tag}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  const onSubmit = (data: ComposerFormValues) => {
    console.log(data);
    toast({ title: 'Post Scheduled!', description: `Your post has been scheduled for ${format(data.scheduleDate!, 'PPP')} at ${data.scheduleTime}.` });
    form.reset();
    setGeneratedPost(null);
    setSuggestedHashtags([]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Post Generator</CardTitle>
              <CardDescription>Generate engaging post ideas based on a topic and tone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 'Future of AI in marketing'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Informative">Informative</SelectItem>
                            <SelectItem value="Funny">Funny</SelectItem>
                            <SelectItem value="Serious">Serious</SelectItem>
                            <SelectItem value="Inspirational">Inspirational</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="button" onClick={handleGeneratePost} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Generate Content
              </Button>
              {generatedPost && (
                <div className="border-l-4 border-primary p-4 bg-primary/10 rounded-r-lg space-y-4">
                  <p className="font-semibold">AI Suggestion:</p>
                  <p className="text-sm">{generatedPost.content}</p>
                  <Card className="bg-background/70">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">Why this works</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 text-xs">
                      {generatedPost.reasoning}
                    </CardContent>
                  </Card>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={useGeneratedContent}>Use this content</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => copyToClipboard(generatedPost.content)}><Copy className="mr-2" /> Copy</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compose Your Post</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="postContent"
                render={({ field }) => (
                  <FormItem>
                    <Textarea placeholder="What's on your mind?" className="min-h-[150px]" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Hashtag Suggestions</CardTitle>
              <CardDescription>Generate or get suggestions for hashtags to boost your reach.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" onClick={handleSuggestHashtags} disabled={isSuggesting}>
                {isSuggesting ? <Loader2 className="animate-spin" /> : <Hash />}
                Suggest Hashtags
              </Button>
              {suggestedHashtags.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Click to add:</Label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedHashtags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => addHashtag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platforms</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" size="icon" className="border-primary text-primary"><Twitter /></Button>
              <Button variant="outline" size="icon"><Facebook /></Button>
              <Button variant="outline" size="icon"><Instagram /></Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="scheduleDate"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="scheduleTime"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="time" className="pl-9" {...field} />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Schedule Post</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="avatar" alt="User Avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Jane Doe</p>
                    <p className="text-xs text-muted-foreground">Posting to Twitter</p>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{postContentValue || "Your post content will appear here..."}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
