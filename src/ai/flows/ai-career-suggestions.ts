'use server';

/**
 * @fileOverview AI Career and Education Advisor.
 *
 * - getCareerSuggestions - A function that provides career and education suggestions.
 * - CareerSuggestionsInput - The input type for the getCareerSuggestions function.
 * - CareerSuggestionsOutput - The return type for the getCareerSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CareerSuggestionsInputSchema = z.object({
  background: z.string().describe('User background, including education and experience.'),
  interests: z.string().describe('User interests and hobbies.'),
  goals: z.string().describe('User career and education goals.'),
});

export type CareerSuggestionsInput = z.infer<typeof CareerSuggestionsInputSchema>;

const CareerSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      type: z.enum(['career', 'education', 'scholarship']),
      title: z.string(),
      description: z.string(),
      link: z.string().url().optional(),
    })
  ).describe('List of career and education suggestions.'),
  summary: z.string().describe('A summary of the AI career and education suggestions.'),
});

export type CareerSuggestionsOutput = z.infer<typeof CareerSuggestionsOutputSchema>;

export async function getCareerSuggestions(input: CareerSuggestionsInput): Promise<CareerSuggestionsOutput> {
  return careerSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerSuggestionsPrompt',
  input: {schema: CareerSuggestionsInputSchema},
  output: {schema: CareerSuggestionsOutputSchema},
  prompt: `You are an AI career and education advisor. Your goal is to provide users with personalized suggestions based on their background, interests, and goals.

  Background: {{{background}}}
  Interests: {{{interests}}}
  Goals: {{{goals}}}

  Based on this information, please provide a list of career, education and scholarship suggestions. Include a brief description and a link if available.
  Format the output as a JSON object that matches the CareerSuggestionsOutputSchema schema.
  {
    "suggestions": [
      {
        "type": "career",
        "title": "Software Engineer",
        "description": "Develop software applications and systems.",
        "link": "https://www.example.com/software-engineer"
      },
      {
        "type": "education",
        "title": "Computer Science Degree",
        "description": "Study the fundamentals of computer science.",
        "link": "https://www.example.com/computer-science"
      },
            {
        "type": "scholarship",
        "title": "Gates Millenium Scholarship",
        "description": "Scholarship for minority students",
        "link": "https://www.example.com/gates-milenium"
      }
    ],
    "summary": "Based on your background and interests, we suggest you consider a career in software engineering and pursue a computer science degree.  We also recommend applying for the Gates Millenium Scholarship."
  }
  `,
});

const careerSuggestionsFlow = ai.defineFlow(
  {
    name: 'careerSuggestionsFlow',
    inputSchema: CareerSuggestionsInputSchema,
    outputSchema: CareerSuggestionsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error in careerSuggestionsFlow:', error);
      throw error;
    }
  }
);
