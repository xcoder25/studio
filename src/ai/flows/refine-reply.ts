
'use server';

/**
 * @fileOverview An AI agent that refines a suggested reply based on an instruction.
 *
 * - refineReply - A function that refines a given reply.
 * - RefineReplyInput - The input type for the refineReply function.
 * - RefineReplyOutput - The return type for the refineReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { rewriteCaption } from './rewrite-caption';

const RefineReplyInputSchema = z.object({
  originalMessage: z.string().describe('The original message that is being replied to.'),
  suggestedReply: z.string().describe('The AI-generated reply to be refined.'),
  refinementInstruction: z.string().describe('The instruction for how to refine the reply (e.g., "Make it shorter", "Make it funnier").'),
  tone: z.string().describe('The desired tone for the refinement (e.g., "Short", "Funny", "Professional").'),
});
export type RefineReplyInput = z.infer<typeof RefineReplyInputSchema>;

const RefineReplyOutputSchema = z.object({
  refinedReply: z.string().describe('The refined reply.'),
});
export type RefineReplyOutput = z.infer<typeof RefineReplyOutputSchema>;

export async function refineReply(
  input: RefineReplyInput
): Promise<RefineReplyOutput> {
  return refineReplyFlow(input);
}

const refineReplyFlow = ai.defineFlow(
  {
    name: 'refineReplyFlow',
    inputSchema: RefineReplyInputSchema,
    outputSchema: RefineReplyOutputSchema,
  },
  async ({ originalMessage, suggestedReply, refinementInstruction, tone }) => {
    const rewrittenResult = await rewriteCaption({
        caption: suggestedReply,
        tone: tone,
    });
    
    return {
        refinedReply: rewrittenResult.rewrittenCaption,
    }
  }
);
