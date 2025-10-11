'use server';

/**
 * @fileOverview A flow for generating video from a text prompt or an image.
 *
 * - generateVideo - A function that generates a video based on a text prompt and an optional image.
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import { MediaPart, Part } from 'genkit';

const GenerateVideoInputSchema = z.object({
    prompt: z.string().describe('The text prompt for the video.'),
    imageDataUri: z.string().optional().describe('An optional image to use as a reference for the video, as a data URI.'),
    aspectRatio: z.string().optional().describe('The aspect ratio of the video.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  return generateVideoFlow(input);
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


const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async ({ prompt, imageDataUri, aspectRatio }) => {
    
    const promptParts: Part[] = [{ text: prompt }];
    if (imageDataUri) {
        promptParts.push({ media: { url: imageDataUri }});
    }

    let { operation } = await ai.generate({
      model: googleAI.model('veo-3.0-generate-preview'),
      prompt: promptParts,
      config: {
        aspectRatio: (aspectRatio === '9:16' || aspectRatio === '16:9') ? aspectRatio : '16:9',
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

    const videoDataUri = await fetchVideoAsDataURI(videoPart.media.url);

    return {
      videoUrl: videoDataUri,
    };
  }
);
