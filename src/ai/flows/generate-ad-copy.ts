
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

const GenerateAdCopyOutputSchema = z.object({
  adCopy: z.array(AdCopySchema).describe('A list of 2-3 generated ad copy variations.'),
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
  prompt: `You are an expert advertising copywriter and video strategist. Your task is to generate 2-3 compelling ad copy variations and a corresponding video concept for each.

  **Platform:** {{{platform}}}
  **Product Name:** {{{productName}}}
  **Product Description:** {{{productDescription}}}
  **Target Audience:** {{{targetAudience}}}
  {{#if imageDataUri}}
  **Product Image:** {{media url=imageDataUri}}
  {{/if}}

  Instructions:
  - Tailor the tone and style to the specified platform. Instagram should be more visual, while Google Ads should be concise.
  - Create a strong hook in the headline.
  - Clearly communicate the value proposition in the body.
  - Include a clear call-to-action.
  - For each ad copy, generate a **short, punchy, one-sentence concept** for a 5-10 second video that could accompany the ad. This should be a visual instruction.
  - For social platforms, suggest relevant hashtags.
  - Provide 2 to 3 distinct variations.`,
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
