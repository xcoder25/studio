'use server';

/**
 * @fileOverview An AI agent that finds trending topics, hashtags, and challenges.
 *
 * - findTrends - A function that returns current trends.
 * - FindTrendsInput - The input type for the findTrends function.
 * - FindTrendsOutput - The return type for the findTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindTrendsInputSchema = z.object({
  industry: z.string().describe('The user\'s industry or niche (e.g., tech, marketing, gaming).'),
});
export type FindTrendsInput = z.infer<typeof FindTrendsInputSchema>;

const TrendSchema = z.object({
    title: z.string().describe('The title of the trend (e.g., a hashtag or challenge name).'),
    type: z.enum(['hashtag', 'sound', 'challenge']).describe('The type of trend.'),
    description: z.string().describe('A brief description of the trend and why it\'s popular.'),
});

const FindTrendsOutputSchema = z.object({
  trends: z.array(TrendSchema).describe('A list of current trending topics, sounds, and challenges.'),
});
export type FindTrendsOutput = z.infer<typeof FindTrendsOutputSchema>;

export async function findTrends(
  input: FindTrendsInput
): Promise<FindTrendsOutput> {
  return findTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findTrendsPrompt',
  input: {schema: FindTrendsInputSchema},
  output: {schema: FindTrendsOutputSchema},
  prompt: `You are a trend-spotting AI expert for social media creators. 
  
  Your task is to identify the top 3-5 trending hashtags, sounds, and challenges relevant to the user's specified industry. 
  
  For each trend, provide a title, the type of trend, and a short description of what it is and why it's gaining traction.

  User's Industry: {{{industry}}}
  
  Focus on current, actionable trends that a creator could use for a new post today.`,
});

// Fallback trends data for when AI fails
const fallbackTrends = [
  {
    title: '#AITechTrends',
    type: 'hashtag' as const,
    description: 'Latest developments in artificial intelligence and technology innovation.'
  },
  {
    title: '#SocialMediaStrategy',
    type: 'hashtag' as const,
    description: 'Tips and insights for effective social media marketing and content creation.'
  },
  {
    title: '#ContentCreator',
    type: 'hashtag' as const,
    description: 'Community for content creators sharing their creative process and tips.'
  },
  {
    title: 'Tech Innovation Sound',
    type: 'sound' as const,
    description: 'Popular audio track for tech-related content and product launches.'
  },
  {
    title: 'AI Challenge',
    type: 'challenge' as const,
    description: 'Show how AI is changing your industry with creative video content.'
  }
];

const findTrendsFlow = ai.defineFlow(
  {
    name: 'findTrendsFlow',
    inputSchema: FindTrendsInputSchema,
    outputSchema: FindTrendsOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        return output!;
    } catch (error) {
        console.error('Error finding trends:', error);
        // Return fallback trends when AI fails
        return { trends: fallbackTrends };
    }
  }
);
