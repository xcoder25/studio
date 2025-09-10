
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Cpu, Loader2 } from 'lucide-react';
import { useLoading } from '@/context/loading-context';
import { createAiModel } from '@/ai/flows/create-ai-model';

const modelBuilderSchema = z.object({
  flowName: z.string().min(3, 'Flow name must be at least 3 characters.'),
  inputSchema: z.string().min(10, 'Input schema is required.'),
  outputSchema: z.string().min(10, 'Output schema is required.'),
  prompt: z.string().min(20, 'Prompt is required.'),
});

type ModelBuilderFormValues = z.infer<typeof modelBuilderSchema>;

const-placeholderInputSchema = `const MyInputSchema = z.object({
  topic: z.string().describe('The topic to generate content about.'),
});`;

const placeholderOutputSchema = `const MyOutputSchema = z.object({
  content: z.string().describe('The generated content.'),
});`;

const placeholderPrompt = `You are an expert content creator.
Generate a short piece of content about the following topic: {{{topic}}}`;


export default function ModelBuilderPage() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ModelBuilderFormValues>({
    resolver: zodResolver(modelBuilderSchema),
    defaultValues: {
      flowName: '',
      inputSchema: placeholderInputSchema,
      outputSchema: placeholderOutputSchema,
      prompt: placeholderPrompt,
    },
  });

  const onSubmit = async (data: ModelBuilderFormValues) => {
    setIsLoading(true);
    showLoading();
    try {
      await createAiModel(data);
      toast({
        title: 'AI Model Created!',
        description: `The flow file for "${data.flowName}" has been generated.`,
      });
      form.reset({
        flowName: '',
        inputSchema: placeholderInputSchema,
        outputSchema: placeholderOutputSchema,
        prompt: placeholderPrompt,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: 'Could not create the AI model file.',
      });
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Builder</CardTitle>
              <CardDescription>
                Define and create new Genkit flows using this form. A new flow
                file will be generated in your project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="flowName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flow Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., generate-podcast-script"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inputSchema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Schema (Zod)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={placeholderInputSchema}
                        className="min-h-[150px] font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outputSchema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output Schema (Zod)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={placeholderOutputSchema}
                        className="min-h-[150px] font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={placeholderPrompt}
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Cpu />
                )}
                Create AI Model
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

    