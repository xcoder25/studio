'use server';

/**
 * @fileOverview An AI agent that generates all the dynamic data for the main dashboard.
 *
 * - generateDashboardData - A function that returns a comprehensive object of dashboard data.
 * - GenerateDashboardDataInput - The input type for the generateDashboardData function.
 * - GenerateDashboardDataOutput - The return type for the generateDashboardData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateDashboardDataInputSchema = z.object({
  userContext: z.string().describe("A brief description of the user and their business (e.g., Jane Doe, social media manager for tech startup Trendix)."),
});
export type GenerateDashboardDataInput = z.infer<typeof GenerateDashboardDataInputSchema>;

// Output Sub-Schemas
const SocialStatSchema = z.object({
    platform: z.enum(['Twitter', 'Facebook', 'Instagram', 'TikTok']),
    followers: z.string().describe("Total number of followers, formatted (e.g., '12.5K')."),
    change: z.string().describe("Percentage change since last month (e.g., '+12.2%')."),
    changeType: z.enum(['positive', 'negative']).describe("Whether the change is positive or negative."),
});

const EngagementStatSchema = z.object({
    metric: z.enum(['Likes', 'Comments', 'Shares', 'Reach']),
    value: z.string().describe("Total value for the metric, formatted (e.g., '42.8K')."),
    change: z.string().describe("Percentage change since last month (e.g., '+21%')."),
    changeType: z.enum(['positive', 'negative']).describe("Whether the change is positive or negative."),
});

const EngagementChartDataSchema = z.object({
    month: z.string().describe("The month abbreviation (e.g., 'Jan', 'Feb')."),
    engagement: z.number().describe("The total engagement number for that month."),
});
export type EngagementChartData = z.infer<typeof EngagementChartDataSchema>;

const PostsOverviewDataSchema = z.object({
    content: z.string().describe("The text content of the post, truncated if necessary."),
    platform: z.enum(['Twitter', 'Facebook', 'Instagram']),
    status: z.enum(['Published', 'Scheduled', 'Draft']),
    date: z.string().describe("Relative date of the post (e.g., '2 days ago', 'in 3 days')."),
    engagement: z.string().describe("A key engagement metric for the post (e.g., '1.2K Likes', '-')."),
});
export type PostsOverviewData = z.infer<typeof PostsOverviewDataSchema>;

const RecentVideoDataSchema = z.object({
    title: z.string().describe("The title of the video."),
    duration: z.string().describe("The duration of the video (e.g., '1:23')."),
    image: z.string().url().describe("A placeholder image URL for the video thumbnail (using picsum.photos)."),
    aiHint: z.string().describe("A 1-2 word hint for the image content (e.g., 'abstract technology')."),
});
export type RecentVideoData = z.infer<typeof RecentVideoDataSchema>;


// Main Output Schema
const GenerateDashboardDataOutputSchema = z.object({
  socialStats: z.array(SocialStatSchema).describe("An array of 4 social media platform stats."),
  engagementStats: z.array(EngagementStatSchema).describe("An array of 4 key engagement metrics."),
  engagementChartData: z.array(EngagementChartDataSchema).describe("An array of 7 data points for the monthly engagement chart."),
  postsOverview: z.array(PostsOverviewDataSchema).describe("An array of 4 recent/upcoming posts."),
  recentVideos: z.array(RecentVideoDataSchema).describe("An array of 4 recently generated videos."),
});
export type GenerateDashboardDataOutput = z.infer<typeof GenerateDashboardDataOutputSchema>;


export async function generateDashboardData(
  input: GenerateDashboardDataInput
): Promise<GenerateDashboardDataOutput> {
  return generateDashboardDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDashboardDataPrompt',
  input: {schema: GenerateDashboardDataInputSchema},
  output: {schema: GenerateDashboardDataOutputSchema},
  prompt: `You are an AI that generates realistic, hypothetical data for a social media dashboard. The user is {{{userContext}}}.

  Based on this context, generate a complete set of data for their dashboard. The data should be consistent and tell a plausible story of a growing tech startup's social media presence.

  - **Social Stats**: Generate stats for Twitter, Facebook, Instagram, and TikTok. Show strong growth on TikTok and Instagram, moderate growth on Twitter, and slower growth on Facebook.
  - **Engagement Stats**: Generate plausible numbers for Likes, Comments, Shares, and Reach. Ensure the change percentages reflect a positive trend overall, with maybe one metric slightly down to seem realistic.
  - **Engagement Chart Data**: Create data for the last 7 months, showing a clear upward trend in engagement over time.
  - **Posts Overview**: Create a mix of 4 posts with 'Published', 'Scheduled', and 'Draft' statuses. The content should be relevant to a tech/AI startup.
  - **Recent Videos**: Generate 4 recent video concepts with titles, durations, and placeholder image URLs from picsum.photos. The titles should be engaging and relevant to the tech industry.
  
  Ensure all formatted strings (like '12.5K' or '+15%') are correctly generated.`,
});

// Fallback data for when AI fails
// Fresh data for new users just getting started
const fallbackDashboardData: GenerateDashboardDataOutput = {
  socialStats: [
    { platform: 'Twitter', followers: '0', change: '+0%', changeType: 'positive' },
    { platform: 'Facebook', followers: '0', change: '+0%', changeType: 'positive' },
    { platform: 'Instagram', followers: '0', change: '+0%', changeType: 'positive' },
    { platform: 'TikTok', followers: '0', change: '+0%', changeType: 'positive' },
  ],
  engagementStats: [
    { metric: 'Likes', value: '0', change: '+0%', changeType: 'positive' },
    { metric: 'Comments', value: '0', change: '+0%', changeType: 'positive' },
    { metric: 'Shares', value: '0', change: '+0%', changeType: 'positive' },
    { metric: 'Reach', value: '0', change: '+0%', changeType: 'positive' },
  ],
  engagementChartData: [
    { month: 'Jul', engagement: 0 },
    { month: 'Aug', engagement: 0 },
    { month: 'Sep', engagement: 0 },
    { month: 'Oct', engagement: 0 },
    { month: 'Nov', engagement: 0 },
    { month: 'Dec', engagement: 0 },
    { month: 'Jan', engagement: 0 },
  ],
  postsOverview: [
    { content: 'Welcome to Trendix! 🎉 Ready to create amazing content? Let\'s get started!', platform: 'Twitter', status: 'Draft', date: 'Draft', engagement: '-' },
    { content: 'Your first post will appear here. Click "Create Post" to get started! 💫', platform: 'Instagram', status: 'Draft', date: 'Draft', engagement: '-' },
    { content: 'Start building your social media presence with AI-powered tools 🚀', platform: 'Facebook', status: 'Draft', date: 'Draft', engagement: '-' },
    { content: 'Connect your social accounts in Settings to see your real stats here 📊', platform: 'Twitter', status: 'Draft', date: 'Draft', engagement: '-' },
  ],
  recentVideos: [
    { title: 'Getting Started with Trendix', duration: '2:30', image: 'https://picsum.photos/300/200?random=101', aiHint: 'welcome tutorial' },
    { title: 'Create Your First Video', duration: '1:45', image: 'https://picsum.photos/300/200?random=102', aiHint: 'video creation guide' },
    { title: 'Connect Social Media Accounts', duration: '2:00', image: 'https://picsum.photos/300/200?random=103', aiHint: 'social media setup' },
    { title: 'AI Content Generation Tutorial', duration: '3:15', image: 'https://picsum.photos/300/200?random=104', aiHint: 'ai tools guide' },
  ],
};

const generateDashboardDataFlow = ai.defineFlow(
  {
    name: 'generateDashboardDataFlow',
    inputSchema: GenerateDashboardDataInputSchema,
    outputSchema: GenerateDashboardDataOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error generating dashboard data:', error);
      // Return fallback data when AI fails
      return fallbackDashboardData;
    }
  }
);
