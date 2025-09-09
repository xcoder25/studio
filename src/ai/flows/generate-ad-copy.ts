
'use server';

/**
 * @fileOverview An AI agent that generates ad copy for various platforms.
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
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const AdCopySchema = z.object({
    headline: z.string().describe("A compelling headline for the ad."),
    body: z.string().describe("The main body text for the ad."),
    hashtags: z.array(z.string()).optional().describe("A list of relevant hashtags, especially for social platforms."),
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
  prompt: `You are an expert advertising copywriter. Your task is to generate 2-3 compelling ad copy variations for a specific platform based on the provided product information.

  **Platform:** {{{platform}}}
  **Product Name:** {{{productName}}}
  **Product Description:** {{{productDescription}}}
  **Target Audience:** {{{targetAudience}}}

  Instructions:
  - Tailor the tone and style to the specified platform. For example, Instagram should be more visual and use hashtags, while Google Ads should be concise and keyword-focused.
  - Create a strong hook in the headline to grab attention.
  - Clearly communicate the value proposition in the ad body.
  - Include a clear call-to-action (e.g., "Learn More," "Shop Now," "Sign Up").
  - For social platforms like Facebook and Instagram, suggest relevant hashtags.
  - Provide 2 to 3 distinct variations to give the user options.`,
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
