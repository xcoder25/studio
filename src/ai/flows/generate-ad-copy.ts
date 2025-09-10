
'use server';

/**
 * @fileOverview An AI agent that generates ad copy and video concepts for various platforms.
 *
 * - generateAdCopy - A function that generates ad headlines and body text.
 * - GenerateAdCopyInput - The input type for the generateAdCopy function.
 * - GenerateAdCopyOutput - The return type for the generateAdCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdCopyInputSchema = z.object({
  productName: z.string().describe('The name of the product or service being advertised.'),
  productDescription: z.string().describe('A detailed description of the product or service.'),
  targetAudience: z.string().describe('A description of the target audience.'),
  platform: z.enum(['Facebook', 'Instagram', 'Google']).describe('The advertising platform.'),
  imageDataUri: z.string().optional().describe('An optional image of the product to use for inspiration, as a data URI.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const AdCopySchema = z.object({
    headline: z.string().describe("A compelling headline for the ad."),
    body: z.string().describe("The main body text for the ad."),
    hashtags: z.array(z.string()).optional().describe("A list of relevant hashtags, especially for social platforms."),
    videoIdea: z.string().describe("A short, punchy, one-sentence concept for a 5-10 second video ad based on the product and image."),
});
export type AdCopy = z.infer<typeof AdCopySchema>;

const BudgetRecommendationSchema = z.object({
    suggestedBudget: z.string().describe("Suggested daily or campaign budget (e.g., '$50/day')."),
    reasoning: z.string().describe("A brief justification for the suggested budget."),
});

const RoiAnalysisSchema = z.object({
    projectedRoi: z.string().describe("The projected Return on Investment (e.g., '3.5x')."),
    keyAssumptions: z.string().describe("The key assumptions made for the ROI projection (e.g., 'Assumes a 2% conversion rate and $50 average order value.')."),
});

const GenerateAdCopyOutputSchema = z.object({
  adCopy: z.array(AdCopySchema).describe('A list of 2-3 generated ad copy variations.'),
  budgetRecommendation: BudgetRecommendationSchema.describe('A recommendation for the ad campaign budget.'),
  roiAnalysis: RoiAnalysisSchema.describe('A high-level analysis of the potential ROI.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;

export async function generateAdCopy(
  input: GenerateAdCopyInput
): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdCopyPrompt',
  input: {schema: GenerateAdCopyInputSchema},
  output: {schema: GenerateAdCopyOutputSchema},
  prompt: `You are an expert advertising copywriter and financial strategist. Your task is to generate compelling ad copy, a video concept, budget recommendations, and a projected ROI.

  **Platform:** {{{platform}}}
  **Product Name:** {{{productName}}}
  **Product Description:** {{{productDescription}}}
  **Target Audience:** {{{targetAudience}}}
  {{#if imageDataUri}}
  **Product Image:** {{media url=imageDataUri}}
  {{/if}}

  Instructions:
  1.  **Ad Copy**:
      - Generate 2-3 compelling ad copy variations tailored to the platform.
      - For each, create a strong headline, clear body text with a call-to-action, and relevant hashtags (for social platforms).
      - For each ad copy, generate a **short, punchy, one-sentence concept** for a 5-10 second video.
  2.  **Budget Recommendation**:
      - Suggest a realistic daily or total campaign budget.
      - Provide a brief reasoning based on the platform and target audience (e.g., "A $50/day budget is recommended for reaching a targeted niche on Instagram...").
  3.  **ROI Analysis**:
      - Provide a projected, hypothetical ROI (e.g., '3x - 4x').
      - State the key assumptions used for this projection, such as estimated conversion rate and average order value. This data should be realistic but hypothetical.
  
  Provide a complete response with all requested fields.`,
});

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
