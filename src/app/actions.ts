'use server';

import { z } from 'zod';
import {
  getCareerSuggestions,
  type CareerSuggestionsInput,
  type CareerSuggestionsOutput,
} from '@/ai/flows/ai-career-suggestions';
import {
  moderateContent,
} from '@/ai/flows/community-content-moderation';
import {
  getMotivationAndSupport,
  type MotivationAndSupportOutput,
} from '@/ai/flows/mental-wellbeing-support';
import {
    getSafeRoute,
    type GetSafeRouteInput,
    type GetSafeRouteOutput,
} from '@/ai/flows/safe-route';
import {
  searchJobs,
  type JobSearchInput,
  type JobSearchOutput,
} from '@/ai/flows/job-search';
import {
  searchScholarships,
  type ScholarshipSearchInput,
  type ScholarshipSearchOutput,
} from '@/ai/flows/scholarship-search';
import { auth } from '@/firebase/server';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { cookies } from 'next/headers';

// Authentication
const emailSchema = z.string().email({ message: 'Please enter a valid email address.' });
const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters long.' });

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your name.'}),
  email: emailSchema,
  password: passwordSchema,
});


export interface AuthState {
  message?: string;
  success?: boolean;
}

export async function handleLogin(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validation = loginSchema.safeParse(rawFormData);
  if (!validation.success) {
    return {
      message: validation.error.flatten().fieldErrors.email?.[0] || validation.error.flatten().fieldErrors.password?.[0],
    };
  }
  try {
    const { email, password } = validation.data;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const cookieStore = await cookies();
    cookieStore.set('idToken', idToken, { secure: true, httpOnly: true });
    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    return { message: error.message || 'Login failed. Please try again.' };
  }
}

export async function handleSignup(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validation = signupSchema.safeParse(rawFormData);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      message: fieldErrors.name?.[0] || fieldErrors.email?.[0] || fieldErrors.password?.[0]
    };
  }
  try {
    const { email, password, name } = validation.data;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    const idToken = await userCredential.user.getIdToken();
    const cookieStore = await cookies();
    cookieStore.set('idToken', idToken, { secure: true, httpOnly: true });
    return { success: true };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { message: error.message || 'Signup failed. Please try again.' };
  }
}

export async function handleLogout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('idToken');
  } catch (error: any) {
    console.error('Logout error:', error);
  }
}


// Career Advisor
const careerSchema = z.object({
  background: z.string().min(10, 'Please describe your background in at least 10 characters.'),
  interests: z.string().min(10, 'Please describe your interests in at least 10 characters.'),
  goals: z.string().min(10, 'Please describe your goals in at least 10 characters.'),
});

export interface CareerAdvisorState {
  message?: string;
  data?: CareerSuggestionsOutput;
}

export async function handleCareerSuggestions(
  prevState: CareerAdvisorState | null,
  formData: FormData
): Promise<CareerAdvisorState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validation = careerSchema.safeParse(rawFormData);

  if (!validation.success) {
    const error = validation.error.flatten().fieldErrors;
    return {
      message: `${error.background || ''} ${error.interests || ''} ${error.goals || ''}`.trim(),
    };
  }

  try {
    const output = await getCareerSuggestions(validation.data as CareerSuggestionsInput);
    return { data: output };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to get career suggestions. Please try again later.' };
  }
}

// Personal Safety
const safeRouteSchema = z.object({
    currentLocation: z.string().min(3, "Please provide a valid starting location."),
    destination: z.string().min(3, "Please provide a valid destination."),
})

export interface SafeRouteState {
    message?: string;
    data?: GetSafeRouteOutput;
}

export async function handleSafeRoute(
    prevState: SafeRouteState | null,
    formData: FormData
): Promise<SafeRouteState> {
    const rawFormData = Object.fromEntries(formData.entries());
    const validation = safeRouteSchema.safeParse(rawFormData);
    if (!validation.success) {
        const error = validation.error.flatten().fieldErrors;
        return { message: `${error.currentLocation || ''} ${error.destination || ''}`.trim() };
    }

    try {
        const output = await getSafeRoute(validation.data as GetSafeRouteInput);
        return { data: output };
    } catch (error) {
        console.error(error);
        return { message: "Failed to get a safe route. Please try again."};
    }
}

// Job Finder
const jobSearchSchema = z.object({
  query: z.string().min(2, 'Please enter a search term.'),
  location: z.string(),
});

export interface JobSearchState {
  message?: string;
  data?: JobSearchOutput;
}

export async function handleJobSearch(
  prevState: JobSearchState,
  formData: FormData
): Promise<JobSearchState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validation = jobSearchSchema.safeParse(rawFormData);

  if (!validation.success) {
    return { message: validation.error.flatten().fieldErrors.query?.join(', ') };
  }

  try {
    const output = await searchJobs(validation.data as JobSearchInput);
    if (!output.jobs || output.jobs.length === 0) {
      return { message: 'No jobs found matching your criteria.' };
    }
    return { data: output };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to search for jobs. Please try again later.' };
  }
}


// Scholarship Finder
const scholarshipSearchSchema = z.object({
  query: z.string(),
  field: z.string(),
});

export interface ScholarshipSearchState {
  message?: string;
  data?: ScholarshipSearchOutput;
}

export async function handleScholarshipSearch(
  prevState: ScholarshipSearchState,
  formData: FormData
): Promise<ScholarshipSearchState> {
  const rawFormData = {
    query: formData.get('query') || '',
    field: formData.get('field') || 'all',
  }
  const validation = scholarshipSearchSchema.safeParse(rawFormData);
  
  if (!validation.success) {
    return { message: "Invalid search query." };
  }

  if(!validation.data.query && validation.data.field === 'all') {
    return { message: 'Please enter a search term or select a field of study.' };
  }

  try {
    const output = await searchScholarships(validation.data as ScholarshipSearchInput);
    if (!output.scholarships || output.scholarships.length === 0) {
      return { message: 'No scholarships found matching your criteria.' };
    }
    return { data: output };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to search for scholarships. Please try again later.' };
  }
}


// Community Hub
const postSchema = z.object({
  content: z.string().min(10, "Post must be at least 10 characters long.").max(500, "Post cannot exceed 500 characters."),
});

export interface PostState {
  message?: string;
  post?: { author: string; avatar: string; content: string };
  timestamp: number;
}

export async function moderateAndPost(prevState: PostState, formData: FormData): Promise<PostState> {
  const content = formData.get('content') as string;
  const validation = postSchema.safeParse({ content });
  if (!validation.success) {
    return { 
        message: 'Validation failed: ' + validation.error.flatten().fieldErrors.content?.join(', '),
        timestamp: Date.now(),
     };
  }
  try {
    const moderationResult = await moderateContent(content);
    if (moderationResult.isHarmful) {
      return { 
        message: 'This content was flagged as inappropriate and cannot be posted.',
        timestamp: Date.now(),
      };
    }

    // In a real app, this would be saved to a database.
    return {
      post: {
        author: 'AnonymousUser', // User is anonymous
        avatar: `https://picsum.photos/seed/${Math.random()}/40/40`,
        content,
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(error);
    return { 
        message: 'An error occurred during moderation.',
        timestamp: Date.now(),
    };
  }
}

const moodSchema = z.object({
  message: z.string().min(3, "Message must be at least 3 characters long.").max(500, "Message cannot exceed 500 characters."),
});

export interface MotivationState {
  message?: string;
  data?: MotivationAndSupportOutput;
}

export async function getMotivation(
  prevState: MotivationState | null,
  formData: FormData
): Promise<MotivationState> {
  const message = formData.get('message') as string;
  const validation = moodSchema.safeParse({ message });
  if (!validation.success) {
    return {
      message: 'Validation failed: ' + validation.error.flatten().fieldErrors.message?.join(', '),
    };
  }
  try {
    const output = await getMotivationAndSupport({ userMessage: message });
    return { data: output };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to get a motivational message.' };
  }
}
