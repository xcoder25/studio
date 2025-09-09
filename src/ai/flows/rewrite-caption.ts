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
  tone: z.string().describe('The desired tone for the rewritten caption (e.g., Funny, Professional, Short).'),
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
  
  Rewrite the following caption to have a "{{{tone}}}" tone.
  
  Original Caption:
  "{{{caption}}}"

  Your response should only be the rewritten caption. If the tone is "Short", make the caption more concise and impactful.`,
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
