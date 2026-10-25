'use server';
/**
 * @fileOverview An AI agent that searches for job listings online.
 *
 * - searchJobs - A function that handles the job search process.
 * - JobSearchInput - The input type for the searchJobs function.
 * - JobSearchOutput - The return type for the searchJobs function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const JobSearchInputSchema = z.object({
  query: z.string().describe('The job title, keyword, or company to search for.'),
  location: z.string().describe('The location to search for jobs in. Can be "remote".'),
});
export type JobSearchInput = z.infer<typeof JobSearchInputSchema>;

const JobSearchOutputSchema = z.object({
  jobs: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      location: z.string(),
      description: z.string(),
      applyLink: z.string().url().describe("A search URL for the job on a platform like Upwork or Freelancer. e.g., https://www.upwork.com/nx/jobs/search/?q=software%20engineer"),
      imageHint: z.string().describe('Two keywords that describe an image relevant to the job title.'),
    })
  ).describe('A list of job opportunities found on the internet.'),
});
export type JobSearchOutput = z.infer<typeof JobSearchOutputSchema>;

export async function searchJobs(input: JobSearchInput): Promise<JobSearchOutput> {
  return jobSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobSearchPrompt',
  input: { schema: JobSearchInputSchema },
  output: { schema: JobSearchOutputSchema },
  prompt: `You are a powerful AI job search assistant. Your task is to act as a job aggregator and find relevant job listings based on the user's query and location.

  Search for jobs matching the following criteria:
  - Query: {{{query}}}
  - Location: {{{location}}}

  Return a list of up to 9 job opportunities. For each job, provide the title, company, location, and a brief description.
  Also provide a two-word 'imageHint' that can be used to find a relevant stock photo (e.g., 'software code', 'graphic design').
  
  CRITICAL: For the 'applyLink' field, you MUST generate a valid search URL on a variety of major job platforms like Upwork.com, Freelancer.com, LinkedIn Jobs, Indeed.com, Glassdoor.com, or Monster.com. The URL should be a direct search for the job title. Do not invent direct application links.
  For example, for a "Software Engineer" query, the link could be "https://www.upwork.com/nx/jobs/search/?q=software%20engineer" or "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer".
  `,
});

const jobSearchFlow = ai.defineFlow(
  {
    name: 'jobSearchFlow',
    inputSchema: JobSearchInputSchema,
    outputSchema: JobSearchOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error in jobSearchFlow:', error);
      throw error;
    }
  }
);
