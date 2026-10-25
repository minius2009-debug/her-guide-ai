'use server';
/**
 * @fileOverview A community content moderation AI agent.
 *
 * - moderateContent - A function that handles the content moderation process.
 * - ModerateContentInput - The input type for the moderateContent function.
 * - ModerateContentOutput - The return type for the moderateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateContentInputSchema = z.string().describe('The content to be moderated.');
export type ModerateContentInput = z.infer<typeof ModerateContentInputSchema>;

const ModerateContentOutputSchema = z.object({
  isHarmful: z.boolean().describe('Whether the content is harmful or not.'),
  reason: z.string().describe('The reason why the content is considered harmful.'),
});
export type ModerateContentOutput = z.infer<typeof ModerateContentOutputSchema>;

export async function moderateContent(content: ModerateContentInput): Promise<ModerateContentOutput> {
  return moderateContentFlow(content);
}

const moderateContentPrompt = ai.definePrompt({
  name: 'moderateContentPrompt',
  input: {schema: ModerateContentInputSchema},
  output: {schema: ModerateContentOutputSchema},
  prompt: `You are an AI moderator responsible for filtering harmful or negative comments in an anonymous discussion forum.

  Analyze the following content and determine if it is harmful or negative. If it is, explain why.

  Content: {{{input}}}

  Respond with a JSON object that has two fields:
  - isHarmful: true if the content is harmful or negative, false otherwise.
  - reason: A brief explanation of why the content is considered harmful, or "" if it is not harmful.`,
});

const moderateContentFlow = ai.defineFlow(
  {
    name: 'moderateContentFlow',
    inputSchema: ModerateContentInputSchema,
    outputSchema: ModerateContentOutputSchema,
  },
  async content => {
    try {
      const {output} = await moderateContentPrompt(content);
      return output!;
    } catch (error) {
      console.error('Error in moderateContentFlow:', error);
      throw error;
    }
  }
);
