'use server';

/**
 * @fileOverview A flow for generating a lip-synced video from an image and audio.
 *
 * - lipSync - A function that generates a lip-synced video.
 * - LipSyncInput - The input type for the lipSync function.
 * - LipSyncOutput - The return type for the lipSync function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import { MediaPart } from 'genkit';

const LipSyncInputSchema = z.object({
    imageDataUri: z.string().describe('The image to use for the lip-sync video, as a data URI.'),
    audioDataUri: z.string().describe('The audio to use for the lip-sync video, as a data URI.'),
});
export type LipSyncInput = z.infer<typeof LipSyncInputSchema>;

const LipSyncOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated lip-synced video.'),
});
export type LipSyncOutput = z.infer<typeof LipSyncOutputSchema>;

export async function lipSync(input: LipSyncInput): Promise<LipSyncOutput> {
  return lipSyncFlow(input);
}

async function fetchVideoAsDataURI(url: string): Promise<string> {
    const response = await fetch(`${url}&key=${process.env.GEMINI_API_KEY}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const contentType = response.headers.get('content-type') || 'video/mp4';
    return `data:${contentType};base64,${base64}`;
}

const lipSyncFlow = ai.defineFlow(
  {
    name: 'lipSyncFlow',
    inputSchema: LipSyncInputSchema,
    outputSchema: LipSyncOutputSchema,
  },
  async ({ imageDataUri, audioDataUri }) => {
    let { operation } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-lip-sync-preview'),
      prompt: [
        { media: { url: imageDataUri } },
        { media: { url: audioDataUri } },
      ],
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
        console.error('Error checking operation status:', e);
      }
    }

    if (operation.error) {
      console.error('Lip-sync generation failed:', operation.error);
      throw new Error(`Lip-sync generation failed: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find(
      (p): p is MediaPart => 'media' in p && !!p.media
    );

    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to find the generated video in the operation result');
    }

    const videoDataUri = await fetchVideoAsDataURI(videoPart.media.url);

    return {
      videoUrl: videoDataUri,
    };
  }
);
