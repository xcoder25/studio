'use server';

/**
 * @fileOverview An AI agent that generates platform-optimized captions for an image.
 *
 * - generateOptimizedCaptions - A function that generates captions for Twitter, Facebook, and Instagram.
 * - GenerateOptimizedCaptionsInput - The input type for the generateOptimizedCaptions function.
 * - GenerateOptimizedCaptionsOutput - The return type for the generateOptimizedCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOptimizedCaptionsInputSchema = z.object({
  productDescription: z.string().describe('A description of the product or service being promoted.'),
  imageDataUri: z.string().describe('An image of the product, as a data URI.'),
});
export type GenerateOptimizedCaptionsInput = z.infer<typeof GenerateOptimizedCaptionsInputSchema>;

const GenerateOptimizedCaptionsOutputSchema = z.object({
  twitter: z.string().describe('A concise, impactful caption for Twitter, under 280 characters, with relevant hashtags.'),
  facebook: z.string().describe('A slightly longer, more descriptive caption for Facebook that encourages discussion.'),
  instagram: z.string().describe('An engaging, emoji-rich caption for Instagram that tells a story and includes a strong call-to-action and popular hashtags.'),
});
export type GenerateOptimizedCaptionsOutput = z.infer<typeof GenerateOptimizedCaptionsOutputSchema>;

export async function generateOptimizedCaptions(
  input: GenerateOptimizedCaptionsInput
): Promise<GenerateOptimizedCaptionsOutput> {
  return generateOptimizedCaptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOptimizedCaptionsPrompt',
  input: {schema: GenerateOptimizedCaptionsInputSchema},
  output: {schema: GenerateOptimizedCaptionsOutputSchema},
  prompt: `You are an expert social media copywriter. Your task is to generate three distinct, platform-optimized captions for the same product promotion.

  **Product Description:** {{{productDescription}}}
  **Product Image:** {{media url=imageDataUri}}

  Instructions:
  1.  **Twitter Caption**:
      - Keep it short, punchy, and under 280 characters.
      - Include 2-3 highly relevant hashtags.
      - Focus on a key benefit or announcement.

  2.  **Facebook Caption**:
      - Write a slightly more detailed caption (1-3 sentences).
      - Encourage engagement by asking a question.
      - Sound informative and approachable.

  3.  **Instagram Caption**:
      - Craft a visually descriptive and story-driven caption.
      - Use relevant emojis to enhance readability and emotion.
      - Include a strong call-to-action (e.g., "Tap the link in bio!").
      - Use a mix of 5-7 popular and niche hashtags.

  Provide a complete response with all three requested caption fields.`,
});

const generateOptimizedCaptionsFlow = ai.defineFlow(
  {
    name: 'generateOptimizedCaptionsFlow',
    inputSchema: GenerateOptimizedCaptionsInputSchema,
    outputSchema: GenerateOptimizedCaptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
