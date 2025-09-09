
'use server';

/**
 * @fileOverview An AI agent for social listening and sentiment analysis.
 *
 * - socialListening - A function that monitors brand mentions and analyzes sentiment.
 * - SocialListeningInput - The input type for the socialListening function.
 * - SocialListeningOutput - The return type for the socialListening function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SocialListeningInputSchema = z.object({
  brandName: z.string().describe('The name of the brand to monitor.'),
  keywords: z.array(z.string()).describe('A list of keywords to track in mentions.'),
});
export type SocialListeningInput = z.infer<typeof SocialListeningInputSchema>;

const MentionSchema = z.object({
    id: z.string().describe("A unique identifier for the mention."),
    platform: z.enum(['Twitter', 'Facebook', 'Instagram', 'Blogs', 'Forums']).describe('The platform where the mention occurred.'),
    author: z.string().describe("The author of the mention."),
    content: z.string().describe("The content of the mention."),
    sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe("The sentiment of the mention."),
    url: z.string().url().describe("A direct link to the mention."),
});

const SentimentAnalysisSchema = z.object({
    overallSentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe('The overall sentiment across all mentions.'),
    positiveMentions: z.number().describe('The number of positive mentions.'),
    negativeMentions: z.number().describe('The number of negative mentions.'),
    neutralMentions: z.number().describe('The number of neutral mentions.'),
    keyTopics: z.array(z.string()).describe("Key topics or themes emerging from the mentions."),
});


const SocialListeningOutputSchema = z.object({
    summary: z.string().describe('A high-level summary of the social listening results.'),
    sentimentAnalysis: SentimentAnalysisSchema,
    recentMentions: z.array(MentionSchema).describe('A list of the most recent and relevant mentions.'),
});
export type SocialListeningOutput = z.infer<typeof SocialListeningOutputSchema>;

export async function socialListening(
  input: SocialListeningInput
): Promise<SocialListeningOutput> {
  return socialListeningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'socialListeningPrompt',
  input: { schema: SocialListeningInputSchema },
  output: { schema: SocialListeningOutputSchema },
  prompt: `You are a social media monitoring AI. Your task is to find and analyze recent public mentions for a given brand and keywords.

  Brand to monitor: {{{brandName}}}
  Keywords to track: {{#each keywords}}"{{this}}" {{/each}}

  Please provide:
  1.  A high-level summary of the recent online conversation.
  2.  A detailed sentiment analysis, including the overall sentiment, counts for positive/negative/neutral mentions, and key conversation topics.
  3.  A list of 5-7 recent, representative mentions from a variety of platforms (Twitter, Blogs, Forums, etc.).

  Generate realistic but hypothetical data for this analysis. Ensure the mentions you create are varied and reflect different sentiments.`,
});

const socialListeningFlow = ai.defineFlow(
  {
    name: 'socialListeningFlow',
    inputSchema: SocialListeningInputSchema,
    outputSchema: SocialListeningOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
