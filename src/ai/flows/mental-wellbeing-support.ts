'use server';
/**
 * @fileOverview An AI agent that provides motivation, quotes, and counselor connections to users feeling down.
 *
 * - getMotivationAndSupport - A function that handles the process of providing motivational content and support.
 * - MotivationAndSupportInput - The input type for the getMotivationAndSupport function.
 * - MotivationAndSupportOutput - The return type for the getMotivationAndSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationAndSupportInputSchema = z.object({
  userMessage: z
    .string()
    .describe('The message from the user expressing their feelings or situation.'),
});
export type MotivationAndSupportInput = z.infer<typeof MotivationAndSupportInputSchema>;

const MotivationAndSupportOutputSchema = z.object({
  motivationalMessage: z.string().describe('A motivational message or quote.'),
  suggestedAction: z.string().describe('A suggested action for the user to take.'),
  counselorConnectionMessage: z
    .string()
    .describe('A message offering connection to a counselor or support resource.'),
});
export type MotivationAndSupportOutput = z.infer<typeof MotivationAndSupportOutputSchema>;

export async function getMotivationAndSupport(
  input: MotivationAndSupportInput
): Promise<MotivationAndSupportOutput> {
  return motivationAndSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationAndSupportPrompt',
  input: {schema: MotivationAndSupportInputSchema},
  output: {schema: MotivationAndSupportOutputSchema},
  prompt: `You are a supportive AI assistant designed to help users who are feeling down.

  The user will provide a message describing their feelings or situation. Your goal is to offer:

  1.  A motivational message or quote.
  2.  A suggested action the user can take to improve their mood or situation.
  3.  A message offering a connection to a counselor or support resource.

  User Message: {{{userMessage}}}
  `,
});

const motivationAndSupportFlow = ai.defineFlow(
  {
    name: 'motivationAndSupportFlow',
    inputSchema: MotivationAndSupportInputSchema,
    outputSchema: MotivationAndSupportOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error in motivationAndSupportFlow:', error);
      throw error;
    }
  }
);
