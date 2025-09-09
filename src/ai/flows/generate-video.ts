'use server';

/**
 * @fileOverview A flow for generating video from a text prompt.
 *
 * - generateVideo - A function that generates a video based on a text prompt.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import { MediaPart } from 'genkit';

const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function generateVideo(prompt: string): Promise<GenerateVideoOutput> {
  return generateVideoFlow(prompt);
}

const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: z.string(),
    outputSchema: GenerateVideoOutputSchema,
  },
  async (prompt) => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-3.0-generate-preview'),
      prompt: prompt,
      config: {
        // Veo 3 default duration is 8 seconds. durationSeconds is not supported.
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait for the operation to complete.
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5s
      try {
        operation = await ai.checkOperation(operation);
      } catch (e) {
        // Log error and continue polling
        console.error('Error checking operation status:', e);
      }
    }

    if (operation.error) {
      console.error('Video generation failed:', operation.error);
      throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find(
      (p): p is MediaPart => 'media' in p && !!p.media
    );

    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to find the generated video in the operation result');
    }

    return {
      videoUrl: videoPart.media.url,
    };
  }
);
