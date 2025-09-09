'use server';

/**
 * @fileOverview An AI agent that suggests relevant hashtags for a social media post.
 *
 * - suggestHashtags - A function that suggests hashtags for a given post content.
 * - SuggestHashtagsInput - The input type for the suggestHashtags function.
 * - SuggestHashtagsOutput - The return type for the suggestHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHashtagsInputSchema = z.object({
  postContent: z
    .string()
    .describe('The content of the social media post.'),
  trendingTags: z.array(z.string()).optional().describe('A list of trending hashtags.'),
  historicalPostPerformance: z
    .string()
    .optional()
    .describe('Data about the historical performance of the user\'s posts.'),
});
export type SuggestHashtagsInput = z.infer<typeof SuggestHashtagsInputSchema>;

const SuggestHashtagsOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe('A list of suggested hashtags for the post.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested hashtags.'),
});
export type SuggestHashtagsOutput = z.infer<typeof SuggestHashtagsOutputSchema>;

export async function suggestHashtags(
  input: SuggestHashtagsInput
): Promise<SuggestHashtagsOutput> {
  return suggestHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHashtagsPrompt',
  input: {schema: SuggestHashtagsInputSchema},
  output: {schema: SuggestHashtagsOutputSchema},
  prompt: `You are an AI expert in social media hashtag generation.

  Given the content of a social media post, suggest relevant hashtags to increase its visibility.
  Consider trending tags and historical post performance to optimize the suggestions.

  Post Content: {{{postContent}}}

  {{~#if trendingTags}}
  Trending Tags: {{#each trendingTags}}{{{this}}} {{/each}}
  {{~/if}}

  {{~#if historicalPostPerformance}}
  Historical Post Performance: {{{historicalPostPerformance}}}
  {{~/if}}

  Provide a list of hashtags and reasoning for each suggestion.
  Format the output as a JSON object with 'hashtags' (array of strings) and 'reasoning' (string) fields.
`,
});

const suggestHashtagsFlow = ai.defineFlow(
  {
    name: 'suggestHashtagsFlow',
    inputSchema: SuggestHashtagsInputSchema,
    outputSchema: SuggestHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
