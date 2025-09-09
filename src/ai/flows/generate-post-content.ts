'use server';

/**
 * @fileOverview Generates social media post content based on trending topics, user history, and preferred tone.
 *
 * - generatePostContent - A function that generates post content suggestions.
 * - GeneratePostContentInput - The input type for the generatePostContent function.
 * - GeneratePostContentOutput - The return type for the generatePostContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostContentInputSchema = z.object({
  trendingTopic: z.string().describe('The current trending topic to generate a post about.'),
  userHistory: z
    .string()
    .describe('A summary of the user history and past successful posts.'),
  tone: z.string().describe('The desired tone or style of the post (e.g., funny, serious, informative).'),
});
export type GeneratePostContentInput = z.infer<typeof GeneratePostContentInputSchema>;

const GeneratePostContentOutputSchema = z.object({
  postContent: z.string().describe('The suggested post content.'),
  reasoning: z.string().describe('The AI reasoning for the post content suggestion.'),
  suggestedHashtags: z.array(z.string()).describe('An array of suggested hashtags for the post.'),
});
export type GeneratePostContentOutput = z.infer<typeof GeneratePostContentOutputSchema>;

export async function generatePostContent(
  input: GeneratePostContentInput
): Promise<GeneratePostContentOutput> {
  return generatePostContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostContentPrompt',
  input: {schema: GeneratePostContentInputSchema},
  output: {schema: GeneratePostContentOutputSchema},
  prompt: `You are an AI social media expert. Generate social media post content based on the following information:

  Trending Topic: {{{trendingTopic}}}
  User History: {{{userHistory}}}
  Tone: {{{tone}}}

  Provide the post content, the reasoning behind the suggestion, and a list of suggested hashtags.

  Make sure to include relevant emojis to make the post engaging!
  Reasoning should include why you think this post will resonate with the users audience.
  Hashtags should be diverse and trending.`,
});

const generatePostContentFlow = ai.defineFlow(
  {
    name: 'generatePostContentFlow',
    inputSchema: GeneratePostContentInputSchema,
    outputSchema: GeneratePostContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
