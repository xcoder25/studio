'use server';
/**
 * @fileOverview An autonomous AI agent for running social media campaigns.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';

// Schemas
const RunCampaignInputSchema = z.object({
  campaignGoal: z.string().describe('The high-level goal of the campaign.'),
  budget: z.number().describe('The total budget for the campaign in USD.'),
});
export type RunCampaignInput = z.infer<typeof RunCampaignInputSchema>;

const CampaignBriefSchema = z.object({
  campaignName: z.string().describe('A catchy name for the campaign.'),
  targetAudience: z.string().describe('The target audience for the campaign.'),
  keyMessage: z.string().describe('The core message of the campaign.'),
  durationDays: z.number().describe('The duration of the campaign in days.'),
});
export type CampaignBrief = z.infer<typeof CampaignBriefSchema>;

const ScheduledPostSchema = z.object({
  id: z.string(),
  day: z.number().describe('The day of the campaign to post (e.g., 1, 2, 3).'),
  time: z.string().describe('The time to post (e.g., "10:00 AM").'),
  platform: z.enum(['Twitter', 'Instagram', 'Facebook']),
  content: z.string().describe('The text content of the post.'),
  imageUrl: z.string().url().optional().describe('URL of the image for the post.'),
  videoId: z.string().optional().describe('ID of the video for the post.'),
});
export type ScheduledPost = z.infer<typeof ScheduledPostSchema>;

const RunCampaignOutputSchema = z.object({
  campaignBrief: CampaignBriefSchema,
  scheduledPosts: z.array(ScheduledPostSchema),
});
export type RunCampaignOutput = z.infer<typeof RunCampaignOutputSchema>;

// Mock Tools
const generatePostTool = ai.defineTool(
  {
    name: 'generatePost',
    description: 'Generates post content for a specific day and theme.',
    inputSchema: z.object({
      day: z.number(),
      theme: z.string(),
      platform: z.enum(['Twitter', 'Instagram', 'Facebook']),
    }),
    outputSchema: z.object({
      content: z.string(),
    }),
  },
  async ({ theme }) => ({
    content: `Here's an amazing post about ${theme}! #ad`,
  })
);

const generateImageTool = ai.defineTool(
  {
    name: 'generateImage',
    description: 'Generates an image for a post based on a prompt.',
    inputSchema: z.object({
      prompt: z.string(),
    }),
    outputSchema: z.object({
      imageUrl: z.string().url(),
    }),
  },
  async ({ prompt }) => ({
    imageUrl: `https://picsum.photos/seed/${uuidv4()}/1080/1080`,
  })
);

const schedulePostTool = ai.defineTool(
  {
    name: 'schedulePost',
    description: 'Schedules a post to be published on a specific day and time.',
    inputSchema: ScheduledPostSchema.omit({ id: true }),
    outputSchema: ScheduledPostSchema,
  },
  async (post) => ({
    id: uuidv4(),
    ...post,
  })
);

// Main Agent Flow
export async function runCampaign(
  input: RunCampaignInput
): Promise<RunCampaignOutput> {
  return runCampaignFlow(input);
}

const runCampaignFlow = ai.defineFlow(
  {
    name: 'runCampaignFlow',
    inputSchema: RunCampaignInputSchema,
    outputSchema: RunCampaignOutputSchema,
  },
  async ({ campaignGoal, budget }) => {
    // Generate campaign brief
    const briefResponse = await ai.generate({
        prompt: `Create a campaign brief for a social media campaign with the goal: "${campaignGoal}" and budget: $${budget}. 
        Return a JSON object with: campaignName, targetAudience, keyMessage, durationDays (number between 7-30).`,
    });
    
    const campaignBrief = JSON.parse(briefResponse.text);
    
    // Generate scheduled posts
    const postsResponse = await ai.generate({
        prompt: `Create ${campaignBrief.durationDays} scheduled posts for the campaign: "${campaignBrief.campaignName}".
        Return a JSON array of posts with: day, time, platform, content, imageUrl (optional), videoId (optional).`,
    });
    
    const scheduledPosts = JSON.parse(postsResponse.text);

    return {
        campaignBrief,
        scheduledPosts,
    };
  }
);
