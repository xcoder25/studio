'use server';

/**
 * @fileOverview A flow for generating audio from text using a specified voice.
 *
 * - generateAudioFromText - A function that generates audio from a text prompt.
 * - GenerateAudioFromTextInput - The input type for the generateAudioFromText function.
 * - GenerateAudioFromTextOutput - The return type for the generateAudioFromText function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

const GenerateAudioFromTextInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voice: z.string().describe('The prebuilt voice to use for speech generation.'),
});
export type GenerateAudioFromTextInput = z.infer<typeof GenerateAudioFromTextInputSchema>;

const GenerateAudioFromTextOutputSchema = z.object({
  audioUrl: z.string().describe('The data URI of the generated audio file.'),
});
export type GenerateAudioFromTextOutput = z.infer<typeof GenerateAudioFromTextOutputSchema>;

export async function generateAudioFromText(
  input: GenerateAudioFromTextInput
): Promise<GenerateAudioFromTextOutput> {
  return generateAudioFromTextFlow(input);
}

async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      const bufs: Buffer[] = [];
      writer.on('error', reject);
      writer.on('data', (d) => {
        bufs.push(d);
      });
      writer.on('end', () => {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
  }

const generateAudioFromTextFlow = ai.defineFlow(
  {
    name: 'generateAudioFromTextFlow',
    inputSchema: GenerateAudioFromTextInputSchema,
    outputSchema: GenerateAudioFromTextOutputSchema,
  },
  async ({ text, voice }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('No media returned from the text-to-speech model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioUrl: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
