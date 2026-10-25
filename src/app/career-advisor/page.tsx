'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleCareerSuggestions, type CareerAdvisorState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Briefcase, GraduationCap, Link as LinkIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90">
      {pending ? <Loader2 className="animate-spin" /> : <>Get Suggestions</>}
    </Button>
  );
}

export default function CareerAdvisorPage() {
  const initialState: CareerAdvisorState = {};
  const [state, dispatch] = useActionState(handleCareerSuggestions, initialState);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <BrainCircuit className="w-16 h-16 mb-4 text-primary" />
        <h1 className="text-4xl font-headline font-bold">AI Career & Education Advisor</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Tell us about yourself, and our AI will provide personalized guidance for your future career and educational path.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Fill out your details to get started.</CardDescription>
            </CardHeader>
            <form action={dispatch}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="background">Background</Label>
                  <Textarea id="background" name="background" placeholder="e.g., High school graduate, B.A. in History, 2 years of retail experience..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests & Hobbies</Label>
                  <Textarea id="interests" name="interests" placeholder="e.g., Digital art, creative writing, programming, volunteering..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goals">Career & Education Goals</Label>
                  <Textarea id="goals" name="goals" placeholder="e.g., Find a remote job, get a Master's degree, switch to a tech career..." rows={4} />
                </div>
                {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="min-h-[600px] bg-card">
            <CardHeader>
              <CardTitle>Your AI-Powered Suggestions</CardTitle>
              <CardDescription>
                {state?.data ? 'Here are some recommendations based on your profile.' : 'Your results will appear here.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state?.data ? (
                <div className="space-y-8">
                  <p className="text-muted-foreground italic border-l-4 border-primary pl-4 py-2">{state.data.summary}</p>
                  <div>
                    <h3 className="text-2xl font-headline font-semibold flex items-center gap-2 mb-4"><Briefcase className="text-primary"/> Career Paths</h3>
                    <div className="grid gap-4">
                      {state.data.suggestions.filter(s => s.type === 'career').map((item, i) => (
                        <SuggestionCard key={i} {...item} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-semibold flex items-center gap-2 mb-4"><GraduationCap className="text-primary"/> Education Opportunities</h3>
                    <div className="grid gap-4">
                      {state.data.suggestions.filter(s => s.type === 'education').map((item, i) => (
                        <SuggestionCard key={i} {...item} />
                      ))}
                    </div>
                  </div>
                   <div>
                    <h3 className="text-2xl font-headline font-semibold flex items-center gap-2 mb-4"><GraduationCap className="text-primary"/> Scholarships</h3>
                    <div className="grid gap-4">
                      {state.data.suggestions.filter(s => s.type === 'scholarship').map((item, i) => (
                        <SuggestionCard key={i} {...item} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                  <BrainCircuit className="w-24 h-24 mb-4 opacity-10" />
                  <p>Your personalized recommendations are just a click away.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({ title, description, link }: { title: string; description: string; link?: string }) {
  return (
    <Card className="bg-background hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {link && (
          <Button asChild variant="link" size="sm" className="p-0 mt-2">
            <Link href={link} target="_blank" rel="noopener noreferrer">
              Learn More <LinkIcon className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
