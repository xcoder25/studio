'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePostContent } from '@/ai/flows/generate-post-content';
import { suggestHashtags } from '@/ai/flows/suggest-hashtags';
import { rewriteCaption } from '@/ai/flows/rewrite-caption';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  Wand2,
  ThumbsUp,
  MessageSquare,
  Share2,
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
  const [isRewriting, setIsRewriting] = useState(false);
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
    setIsGenerating(true);
    showLoading(2000);
    setGeneratedPost(null);
    try {
      const result = await generatePostContent({
        trendingTopic: topic,
        tone,
        userHistory: 'The user is a tech startup focused on AI solutions. Past successful posts include new feature announcements and industry insights.',
      });
      form.setValue('postContent', result.postContent);
      setSuggestedHashtags(result.suggestedHashtags);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate post content.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewriteCaption = async () => {
    const { postContent, tone } = form.getValues();
    if (!postContent) {
      form.setError('postContent', { message: 'Please enter some content to rewrite.' });
      return;
    }
    setIsRewriting(true);
    showLoading(2000);
    try {
      const result = await rewriteCaption({
        caption: postContent,
        tone,
      });
      form.setValue('postContent', result.rewrittenCaption);
      toast({ title: 'Caption rewritten successfully!' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to rewrite caption.' });
    } finally {
      setIsRewriting(false);
    }
  };
  
  const handleSuggestHashtags = async () => {
    const content = form.getValues('postContent');
    if (!content) {
      form.setError('postContent', { message: 'Please enter some content to suggest hashtags.' });
      return;
    }
    setIsSuggesting(true);
    showLoading(2000);
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

  const isAiBusy = isGenerating || isRewriting || isSuggesting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compose Your Post</CardTitle>
              <CardDescription>Craft your message and use AI tools to enhance it.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="postContent"
                render={({ field }) => (
                  <FormItem>
                    <Textarea 
                      placeholder="What's on your mind? Type here or generate content below." 
                      className="min-h-[200px]" 
                      {...field}
                      disabled={isAiBusy}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Generate, rewrite, or get hashtag ideas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg bg-background/50">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic for Generation</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 'Future of AI in marketing'" {...field} disabled={isAiBusy}/>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isAiBusy}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Informative">Informative</SelectItem>
                            <SelectItem value="Funny">Funny</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Inspirational">Inspirational</SelectItem>
                            <SelectItem value="Short">Short</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
               <div className="flex gap-2 flex-wrap">
                <Button type="button" onClick={handleGeneratePost} disabled={isGenerating || isAiBusy}>
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  Generate Post
                </Button>
                 <Button type="button" variant="outline" onClick={handleRewriteCaption} disabled={isRewriting || isAiBusy || !postContentValue}>
                  {isRewriting ? <Loader2 className="animate-spin" /> : <Wand2 />}
                  Rewrite Caption
                </Button>
                <Button type="button" variant="outline" onClick={handleSuggestHashtags} disabled={isSuggesting || isAiBusy || !postContentValue}>
                  {isSuggesting ? <Loader2 className="animate-spin" /> : <Hash />}
                  Suggest Hashtags
                </Button>
              </div>

              {suggestedHashtags.length > 0 && (
                <div className="space-y-2">
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
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Schedule Post</Button>
            </CardFooter>
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
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="text-muted-foreground"><ThumbsUp className="size-4" />&nbsp; Like</Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground"><MessageSquare className="size-4" />&nbsp; Comment</Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground"><Share2 className="size-4" />&nbsp; Share</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
