
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

const CrisisMonitoringSchema = z.object({
    isCrisisDetected: z.boolean().describe("Whether a potential PR crisis is detected based on a high volume of negative mentions or sensitive topics."),
    activeAlerts: z.array(z.string()).describe("A list of real-time alerts for sudden spikes in negative sentiment or sensitive keyword mentions."),
    proactiveIssues: z.array(z.string()).describe("A list of potential issues identified by the AI before they escalate."),
});


const SocialListeningOutputSchema = z.object({
    summary: z.string().describe('A high-level summary of the social listening results.'),
    sentimentAnalysis: SentimentAnalysisSchema,
    recentMentions: z.array(MentionSchema).describe('A list of the most recent and relevant mentions.'),
    crisisMonitoring: CrisisMonitoringSchema,
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
  prompt: `You are a social media monitoring and crisis detection AI. Your task is to find and analyze recent public mentions for a given brand and keywords.

  Brand to monitor: {{{brandName}}}
  Keywords to track: {{#each keywords}}"{{this}}" {{/each}}

  Please provide:
  1.  **Summary**: A high-level summary of the recent online conversation.
  2.  **Sentiment Analysis**: A detailed sentiment analysis, including overall sentiment, counts, and key topics.
  3.  **Recent Mentions**: A list of 5-7 recent, representative mentions from various platforms.
  4.  **Crisis Monitoring**: 
      - Analyze the mentions for signs of a PR crisis (e.g., a sudden spike in negative sentiment, mentions of sensitive keywords like 'outage', 'scandal', 'fail').
      - If a crisis is detected, set 'isCrisisDetected' to true.
      - Generate 1-2 'activeAlerts' if there are sudden negative spikes.
      - Generate 1-2 'proactiveIssues' by identifying subtle negative themes that could escalate.

  Provide a realistic analysis based on your access to public web data.`,
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
