// src/ai/flows/safe-route.ts
'use server';
/**
 * @fileOverview A flow that gets a safe route to a destination.
 *
 * - getSafeRoute - A function that handles the safe route process.
 * - GetSafeRouteInput - The input type for the getSafeRoute function.
 * - GetSafeRouteOutput - The return type for the getSafeRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetSafeRouteInputSchema = z.object({
  destination: z.string().describe('The destination to get a safe route to.'),
  currentLocation: z.string().describe('The current location of the user.'),
});
export type GetSafeRouteInput = z.infer<typeof GetSafeRouteInputSchema>;

const GetSafeRouteOutputSchema = z.object({
  safeRoute: z.string().describe('The safe route to the destination.'),
});
export type GetSafeRouteOutput = z.infer<typeof GetSafeRouteOutputSchema>;

export async function getSafeRoute(input: GetSafeRouteInput): Promise<GetSafeRouteOutput> {
  return getSafeRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSafeRoutePrompt',
  input: {schema: GetSafeRouteInputSchema},
  output: {schema: GetSafeRouteOutputSchema},
  prompt: `You are an AI assistant that provides safe routes to destinations.

  The user is currently at: {{{currentLocation}}}.
  The user wants to go to: {{{destination}}}.

  Provide a safe route to the destination, taking into account potential dangers and suggesting well-lit and populated areas. Be concise.
  `,
});

const getSafeRouteFlow = ai.defineFlow(
  {
    name: 'getSafeRouteFlow',
    inputSchema: GetSafeRouteInputSchema,
    outputSchema: GetSafeRouteOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error in getSafeRouteFlow:', error);
      throw error;
    }
  }
);
