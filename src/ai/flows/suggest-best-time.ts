'use server';

/**
 * @fileOverview An AI agent that suggests the best time to post on social media.
 *
 * - suggestBestTime - A function that returns an optimal posting time.
 * - SuggestBestTimeInput - The input type for the suggestBestTime function.
 * - SuggestBestTimeOutput - The return type for the suggestBestTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBestTimeInputSchema = z.object({
  platform: z.string().describe('The social media platform (e.g., Twitter, Instagram).'),
  audienceDescription: z.string().describe('A brief description of the target audience.'),
});
export type SuggestBestTimeInput = z.infer<typeof SuggestBestTimeInputSchema>;


const SuggestBestTimeOutputSchema = z.object({
  day: z.string().describe("The suggested day of the week (e.g., 'Wednesday')."),
  time: z.string().describe("The suggested time in HH:MM format (e.g., '10:00')."),
  reasoning: z.string().describe("A brief explanation for why this is the optimal time."),
});
export type SuggestBestTimeOutput = z.infer<typeof SuggestBestTimeOutputSchema>;


export async function suggestBestTime(
  input: SuggestBestTimeInput
): Promise<SuggestBestTimeOutput> {
  return suggestBestTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBestTimePrompt',
  input: {schema: SuggestBestTimeInputSchema},
  output: {schema: SuggestBestTimeOutputSchema},
  prompt: `You are a social media analytics expert. Based on historical (but hypothetical) engagement data, suggest the single best day and time to post for maximum reach.

  Platform: {{{platform}}}
  Audience: {{{audienceDescription}}}

  Provide a specific day and a specific time in HH:MM format. Also, provide a short reasoning based on typical user behavior for that platform and audience.
  For example, for a tech audience on Twitter, mid-week mornings might be best for visibility during work hours.`,
});

const suggestBestTimeFlow = ai.defineFlow(
  {
    name: 'suggestBestTimeFlow',
    inputSchema: SuggestBestTimeInputSchema,
    outputSchema: SuggestBestTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
