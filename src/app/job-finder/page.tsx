
'use client';

import { useActionState, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { Briefcase, Loader2, MapPin, Search } from 'lucide-react';
import { handleJobSearch, type JobSearchState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { searchJobs } from '@/ai/flows/job-search';

function SearchButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="animate-spin" /> : <><Search className="md:hidden" /><span className="hidden md:inline">Find Jobs</span></>}
    </Button>
  );
}

export default function JobFinderPage() {
  const { toast } = useToast();
  const [initialState, setInitialState] = useState<JobSearchState>({});
  const [state, formAction] = useActionState(handleJobSearch, initialState);
  const { pending } = useFormStatus();
  const [isLoading, setIsLoading] = useState(true);
  const jobCardImage = PlaceHolderImages.find(p => p.id === 'job-card');

   useEffect(() => {
    async function fetchInitialJobs() {
      try {
        const initialJobs = await searchJobs({ query: 'entry level', location: 'remote' });
        setInitialState({ data: initialJobs });
      } catch (error) {
        console.error("Failed to fetch initial jobs", error);
        setInitialState({ message: "Could not load initial job listings." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialJobs();
  }, []);

  useEffect(() => {
    if (state?.message && !state.data) {
      toast({
        title: 'Job Search',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const jobsToShow = state?.data?.jobs || initialState?.data?.jobs;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <Briefcase className="w-16 h-16 mb-4 text-primary" />
        <h1 className="text-4xl font-headline font-bold">Smart Job Finder</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Discover job opportunities tailored to your skills and preferences.
        </p>
      </div>

      <Card className="mb-8 shadow-md">
        <form action={formAction}>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="search" className="text-sm font-medium">Job Title or Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="search"
                    name="query"
                    placeholder="e.g., 'Software Engineer'"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Select name="location" defaultValue="anywhere">
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anywhere">Anywhere</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                    <SelectItem value="Sweden">Sweden</SelectItem>
                    <SelectItem value="Switzerland">Switzerland</SelectItem>
                    <SelectItem value="Ireland">Ireland</SelectItem>
                    <SelectItem value="New Zealand">New Zealand</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <SearchButton />
            </div>
             {state?.message && !state.data && (
                <p className="text-sm text-destructive mt-2">{state.message}</p>
            )}
          </CardContent>
        </form>
      </Card>
      
      <div>
        {pending || isLoading ? (
          <JobSkeletonGrid />
        ) : jobsToShow && jobsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsToShow.map((job, index) => (
              <Card key={index} className="overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
                <div className="relative h-40 w-full">
                  {jobCardImage && (
                    <Image
                      src={jobCardImage.imageUrl}
                      alt={jobCardImage.description}
                      fill
                      className="object-cover"
                      data-ai-hint={jobCardImage.imageHint}
                    />
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/50 p-4 mt-auto">
                  <Button asChild>
                    <Link href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : state?.message ? (
          <div className="text-center text-muted-foreground py-16">
            <Briefcase className="mx-auto h-24 w-24 opacity-10" />
            <p className="mt-4">{state.message}</p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-16">
            <Briefcase className="mx-auto h-24 w-24 opacity-10" />
            <p className="mt-4">Search for jobs to see results.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function JobSkeletonGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="flex flex-col">
                    <Skeleton className="h-40 w-full" />
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="p-4 mt-auto">
                        <Skeleton className="h-10 w-28" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
