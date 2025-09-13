'use server';

/**
 * @fileOverview An AI agent that analyzes a competitor's social media presence.
 *
 * - analyzeCompetitor - A function that returns an analysis of a competitor.
 * - AnalyzeCompetitorInput - The input type for the analyzeCompetitor function.
 * - AnalyzeCompetitorOutput - The return type for the analyzeCompetitor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCompetitorInputSchema = z.object({
  competitor: z.string().describe("The competitor's name or social media handle."),
});
export type AnalyzeCompetitorInput = z.infer<typeof AnalyzeCompetitorInputSchema>;

const ContentAnalysisSchema = z.object({
    keyThemes: z.array(z.string()).describe("The main themes or topics in the competitor's content."),
    postFrequency: z.string().describe("How often the competitor posts."),
    toneOfVoice: z.string().describe("The typical tone of voice used in their content."),
});

const EngagementAnalysisSchema = z.object({
    averageLikes: z.string().describe("Average likes per post."),
    averageComments: z.string().describe("Average comments per post."),
    audienceSentiment: z.string().describe("The general sentiment of their audience (e.g., Positive, Neutral, Negative)."),
});

const SwotAnalysisSchema = z.object({
    strengths: z.array(z.string()).describe("The competitor's key strengths."),
    weaknesses: z.array(z.string()).describe("The competitor's key weaknesses."),
    opportunities: z.array(z.string()).describe("Opportunities for your brand to capitalize on."),
    threats: z.array(z.string()).describe("Threats the competitor poses to your brand."),
})

const AnalyzeCompetitorOutputSchema = z.object({
  overview: z.string().describe("A high-level summary of the competitor's social media strategy."),
  contentAnalysis: ContentAnalysisSchema,
  engagementAnalysis: EngagementAnalysisSchema,
  swotAnalysis: SwotAnalysisSchema,
});
export type AnalyzeCompetitorOutput = z.infer<typeof AnalyzeCompetitorOutputSchema>;

export async function analyzeCompetitor(
  input: AnalyzeCompetitorInput
): Promise<AnalyzeCompetitorOutput> {
  return analyzeCompetitorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCompetitorPrompt',
  input: {schema: AnalyzeCompetitorInputSchema},
  output: {schema: AnalyzeCompetitorOutputSchema},
  prompt: `You are a social media strategy expert. Analyze the social media presence of the following competitor: {{{competitor}}}.

  Provide a detailed analysis covering:
  1.  **Overview**: A summary of their overall strategy.
  2.  **Content Analysis**: Key themes, post frequency, and tone of voice.
  3.  **Engagement Analysis**: Estimated average likes/comments and audience sentiment.
  4.  **SWOT Analysis**: Strengths, Weaknesses, Opportunities (for my brand), and Threats.
  
  Use your knowledge to provide a realistic analysis based on public social media data.`,
});

const analyzeCompetitorFlow = ai.defineFlow(
  {
    name: 'analyzeCompetitorFlow',
    inputSchema: AnalyzeCompetitorInputSchema,
    outputSchema: AnalyzeCompetitorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
