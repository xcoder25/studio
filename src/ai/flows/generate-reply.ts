
'use server';

/**
 * @fileOverview An AI agent that generates replies to social media messages.
 *
 * - generateReply - A function that generates a reply suggestion.
 * - GenerateReplyInput - The input type for the generateReply function.
 * - GenerateReplyOutput - The return type for the generateReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReplyInputSchema = z.object({
  conversationContext: z.string().describe('The last message in the conversation that needs a reply.'),
  tone: z.string().describe('The desired tone for the reply (e.g., Friendly, Professional, Witty).'),
  brandVoice: z.string().describe('A brief description of the brand voice to maintain consistency.'),
});
export type GenerateReplyInput = z.infer<typeof GenerateReplyInputSchema>;

const GenerateReplyOutputSchema = z.object({
  suggestedReply: z.string().describe('The AI-generated reply.'),
});
export type GenerateReplyOutput = z.infer<typeof GenerateReplyOutputSchema>;

export async function generateReply(
  input: GenerateReplyInput
): Promise<GenerateReplyOutput> {
  return generateReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReplyPrompt',
  input: {schema: GenerateReplyInputSchema},
  output: {schema: GenerateReplyOutputSchema},
  prompt: `You are Serai, an AI assistant for social media managers. Your task is to draft a reply to a social media message.

  **Brand Voice Guidelines:**
  {{{brandVoice}}}
  
  **Desired Tone for this Reply:**
  {{{tone}}}
  
  **Message to Reply To:**
  "{{{conversationContext}}}"
  
  Based on the context and instructions, generate a concise and appropriate reply.`,
});

const generateReplyFlow = ai.defineFlow(
  {
    name: 'generateReplyFlow',
    inputSchema: GenerateReplyInputSchema,
    outputSchema: GenerateReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    