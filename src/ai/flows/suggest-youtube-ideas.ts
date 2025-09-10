
'use server';

/**
 * @fileOverview An AI agent that suggests YouTube video ideas.
 *
 * - suggestYoutubeIdeas - A function that returns video ideas.
 * - SuggestYoutubeIdeasInput - The input type for the suggestYoutubeIdeas function.
 * - SuggestYoutubeIdeasOutput - The return type for the suggestYoutubeIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestYoutubeIdeasInputSchema = z.object({
  channelTopic: z.string().describe('The main topic or niche of the YouTube channel.'),
  targetAudience: z.string().describe('The target audience of the channel.'),
});
export type SuggestYoutubeIdeasInput = z.infer<typeof SuggestYoutubeIdeasInputSchema>;

const VideoIdeaSchema = z.object({
    title: z.string().describe('A catchy title for the video.'),
    description: z.string().describe('A brief description of the video concept and why it would be engaging.'),
    thumbnailConcept: z.string().describe('A concept for the video thumbnail to attract clicks.'),
});

const SuggestYoutubeIdeasOutputSchema = z.object({
  ideas: z.array(VideoIdeaSchema).describe('A list of 3-5 YouTube video ideas.'),
});
export type SuggestYoutubeIdeasOutput = z.infer<typeof SuggestYoutubeIdeasOutputSchema>;

export async function suggestYoutubeIdeas(
  input: SuggestYoutubeIdeasInput
): Promise<SuggestYoutubeIdeasOutput> {
  return suggestYoutubeIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestYoutubeIdeasPrompt',
  input: {schema: SuggestYoutubeIdeasInputSchema},
  output: {schema: SuggestYoutubeIdeasOutputSchema},
  prompt: `You are an expert YouTube content strategist. 
  
  Your task is to generate 3-5 creative and engaging video ideas for a channel based on its topic and target audience.
  
  For each idea, provide a catchy title, a short description of the concept, and a compelling thumbnail idea.

  Channel Topic: {{{channelTopic}}}
  Target Audience: {{{targetAudience}}}
  
  Focus on ideas that have a high potential for engagement and are relevant to the current trends on YouTube.`,
});

const suggestYoutubeIdeasFlow = ai.defineFlow(
  {
    name: 'suggestYoutubeIdeasFlow',
    inputSchema: SuggestYoutubeIdeasInputSchema,
    outputSchema: SuggestYoutubeIdeasOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        return output!;
    } catch (error) {
        console.error('Error suggesting YouTube ideas:', error);
        return { ideas: [] };
    }
  }
);
