import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-hashtags.ts';
import '@/ai/flows/generate-post-content.ts';
import '@/ai/flows/generate-video.ts';
import '@/ai/flows/generate-audio-from-text.ts';
import '@/ai/flows/lip-sync.ts';
