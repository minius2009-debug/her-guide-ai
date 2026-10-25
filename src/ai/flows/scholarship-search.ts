'use server';
/**
 * @fileOverview An AI agent that searches for scholarships online.
 *
 * - searchScholarships - A function that handles the scholarship search process.
 * - ScholarshipSearchInput - The input type for the searchScholarships function.
 * - ScholarshipSearchOutput - The return type for the searchScholarships function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ScholarshipSearchInputSchema = z.object({
  query: z.string().describe('The scholarship name, keyword, or provider to search for.'),
  field: z.string().describe('The field of study to filter scholarships by. Can be "all".'),
});
export type ScholarshipSearchInput = z.infer<typeof ScholarshipSearchInputSchema>;

const ScholarshipSearchOutputSchema = z.object({
  scholarships: z.array(
    z.object({
      title: z.string(),
      provider: z.string(),
      amount: z.string(),
      description: z.string(),
      applyLink: z.string().url().describe("A real, direct URL to the scholarship application or details page."),
      field: z.string(),
    })
  ).describe('A list of scholarship opportunities found on the internet.'),
});
export type ScholarshipSearchOutput = z.infer<typeof ScholarshipSearchOutputSchema>;

export async function searchScholarships(input: ScholarshipSearchInput): Promise<ScholarshipSearchOutput> {
  return scholarshipSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scholarshipSearchPrompt',
  input: { schema: ScholarshipSearchInputSchema },
  output: { schema: ScholarshipSearchOutputSchema },
  prompt: `You are a powerful AI scholarship search assistant. Your task is to act as an aggregator and find relevant scholarship listings based on the user's query and field of study.

  Search for scholarships matching the following criteria:
  - Query: {{{query}}}
  - Field of Study: {{{field}}}

  Return a list of up to 9 scholarship opportunities. For each scholarship, provide the title, provider, amount, a brief description, the field of study, and a real, direct link to the scholarship page.
  
  CRITICAL: For the 'applyLink' field, you MUST provide a valid, direct URL to a real scholarship page. Do not invent links.
  For example, a valid link would be "https://www.coca-colascholarsfoundation.org/apply/" or "https://jackierobinson.org/apply/".
  `,
});

const scholarshipSearchFlow = ai.defineFlow(
  {
    name: 'scholarshipSearchFlow',
    inputSchema: ScholarshipSearchInputSchema,
    outputSchema: ScholarshipSearchOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error in scholarshipSearchFlow:', error);
      throw error;
    }
  }
);
