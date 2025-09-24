
'use server';
/**
 * @fileOverview An autonomous AI agent for running a social media engagement booster campaign.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Schemas
const RunEngagementBoosterInputSchema = z.object({
  planName: z.string().describe('The name of the booster plan (e.g., Starter Growth, Rapid Growth).'),
  brandName: z.string().describe('The name of the brand to run the booster for.'),
  targetAudience: z.string().describe('A description of the target audience to engage with.'),
});
export type RunEngagementBoosterInput = z.infer<typeof RunEngagementBoosterInputSchema>;

const EngagementSummarySchema = z.object({
    accountsFound: z.number().describe('The number of relevant accounts found.'),
    accountsEngaged: z.number().describe('The number of accounts engaged with (followed/liked).'),
    summary: z.string().describe('A brief summary of the actions taken.'),
});
export type EngagementSummary = z.infer<typeof EngagementSummarySchema>;

const RunEngagementBoosterOutputSchema = z.object({
  engagementSummary: EngagementSummarySchema,
});
export type RunEngagementBoosterOutput = z.infer<typeof RunEngagementBoosterOutputSchema>;

// Mock Tools
const findAccountsToEngageWithTool = ai.defineTool(
  {
    name: 'findAccountsToEngageWith',
    description: 'Finds a list of social media accounts to engage with based on keywords and target audience.',
    inputSchema: z.object({
      targetAudience: z.string(),
      count: z.number(),
    }),
    outputSchema: z.object({
      accounts: z.array(z.object({ id: z.string(), handle: z.string() })),
    }),
  },
  async ({ count, targetAudience }) => {
    const handles = ['@SocialSavvy', '@MarketingMinds', '@TechTrends', '@CreatorCollective', '@DigitalNomad', '@StartupLife', '@AIInnovators', '@FutureOfWork'];
    return {
      accounts: Array.from({ length: count }, (_, i) => ({
        id: uuidv4(),
        handle: handles[i % handles.length] + i,
      })),
    };
  }
);

const engageWithAccountTool = ai.defineTool(
  {
    name: 'engageWithAccount',
    description: 'Engages with a social media account by following them and liking their recent post.',
    inputSchema: z.object({
        accountId: z.string(),
        accountHandle: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
  },
  async ({ accountHandle }) => {
    console.log(`Engaging with ${accountHandle}...`);
    return { success: true };
  }
);

// Main Agent Flow
export async function runEngagementBooster(
  input: RunEngagementBoosterInput
): Promise<RunEngagementBoosterOutput> {
  return runEngagementBoosterFlow(input);
}

const runEngagementBoosterFlow = ai.defineFlow(
  {
    name: 'runEngagementBoosterFlow',
    inputSchema: RunEngagementBoosterInputSchema,
    outputSchema: RunEngagementBoosterOutputSchema,
  },
  async ({ planName, brandName, targetAudience }) => {
    
    const agent = await ai.configureAgent({
        name: 'engagementBoosterAgent',
        tools: [findAccountsToEngageWithTool, engageWithAccountTool],
        prompt: `You are an autonomous social media growth expert for the brand "${brandName}".
        Your goal is to increase brand visibility by engaging with a target audience of "${targetAudience}".

        You have been activated on the "${planName}" plan.
        - If the plan is 'Starter Growth', find and engage with 10 accounts.
        - If the plan is 'Rapid Growth', find and engage with 25 accounts.
        - If the plan is 'Hyper Growth', find and engage with 50 accounts.

        1. First, use the 'findAccountsToEngageWith' tool to get a list of accounts.
        2. Then, for each account in the list, use the 'engageWithAccount' tool.
        3. Finally, respond with a summary of your actions, including the number of accounts found and engaged with.
        
        Execute the plan now.`,
    });

    const { output } = await agent({
        prompt: `Start the engagement booster process.`,
    });

    // We expect the agent's final output to match the EngagementSummarySchema, but it's just text.
    // So we'll parse it to fit the schema.
    const finalResponse = await ai.generate({
        prompt: `Based on the following summary, extract the data to fit the required JSON format.
        
        Summary from agent:
        "${output}"`,
        output: { schema: EngagementSummarySchema },
    });

    return {
      engagementSummary: finalResponse.output!,
    };
  }
);

