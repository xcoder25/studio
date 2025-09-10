'use server';

/**
 * @fileOverview An AI agent that rewrites a caption with a specified tone.
 *
 * - rewriteCaption - A function that rewrites a given caption.
 * - RewriteCaptionInput - The input type for the rewriteCaption function.
 * - RewriteCaptionOutput - The return type for the rewriteCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteCaptionInputSchema = z.object({
  caption: z.string().describe('The original caption text to be rewritten.'),
  tone: z.string().describe('The desired tone or instruction for the rewritten caption (e.g., "Make it funnier", "Add more emojis", "Make it more professional", "Shorten it").'),
  platform: z.string().optional().describe('The target social media platform (e.g., Twitter, Instagram).'),
});
export type RewriteCaptionInput = z.infer<typeof RewriteCaptionInputSchema>;

const RewriteCaptionOutputSchema = z.object({
  rewrittenCaption: z.string().describe('The rewritten caption.'),
});
export type RewriteCaptionOutput = z.infer<typeof RewriteCaptionOutputSchema>;

export async function rewriteCaption(
  input: RewriteCaptionInput
): Promise<RewriteCaptionOutput> {
  return rewriteCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteCaptionPrompt',
  input: {schema: RewriteCaptionInputSchema},
  output: {schema: RewriteCaptionOutputSchema},
  prompt: `You are an AI copywriter specializing in social media captions. 
  
  Your task is to rewrite the following caption. Apply the following instruction to the rewrite: "{{{tone}}}"
  {{#if platform}}
  Optimize the rewritten caption for the following platform: {{{platform}}}.
  {{/if}}

  Original Caption:
  "{{{caption}}}"

  Your response should only be the rewritten caption.
  - If the instruction is "Funny", add humor or wit.
  - If the instruction is "Professional", make it more formal and polished.
  - If the instruction is "Short", make it more concise and impactful.
  - If the platform is Twitter, keep it under 280 characters and use relevant hashtags.
  - If the platform is Instagram, use engaging language, ask questions, and include emojis.`,
});

const rewriteCaptionFlow = ai.defineFlow(
  {
    name: 'rewriteCaptionFlow',
    inputSchema: RewriteCaptionInputSchema,
    outputSchema: RewriteCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
