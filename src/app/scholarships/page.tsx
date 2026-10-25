
'use client';

import { useActionState, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { GraduationCap, Loader2, Search } from 'lucide-react';
import { handleScholarshipSearch, type ScholarshipSearchState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { searchScholarships } from '@/ai/flows/scholarship-search';

function SearchButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending ? <Loader2 className="animate-spin" /> : <><Search className="md:hidden" /><span className="hidden md:inline">Find Scholarships</span></>}
        </Button>
    );
}

export default function ScholarshipsPage() {
    const { toast } = useToast();
    const [initialState, setInitialState] = useState<ScholarshipSearchState>({});
    const [state, formAction] = useActionState(handleScholarshipSearch, initialState);
    const { pending } = useFormStatus();
    const [isLoading, setIsLoading] = useState(true);
    const scholarshipCardImage = PlaceHolderImages.find(p => p.id === 'scholarship-card');

    useEffect(() => {
        async function fetchInitialScholarships() {
            try {
                const initialScholarships = await searchScholarships({ query: 'undergraduate', field: 'STEM' });
                setInitialState({ data: initialScholarships });
            } catch (error) {
                console.error("Failed to fetch initial scholarships", error);
                setInitialState({ message: "Could not load initial scholarship listings." });
            } finally {
                setIsLoading(false);
            }
        }
        fetchInitialScholarships();
    }, []);


    useEffect(() => {
        if (state?.message && !state.data) {
            toast({
                title: 'Scholarship Search',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);
    
    const scholarshipsToShow = state?.data?.scholarships || initialState?.data?.scholarships;

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
                <GraduationCap className="w-16 h-16 mb-4 text-primary" />
                <h1 className="text-4xl font-headline font-bold">AI Scholarship Finder</h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                    Find financial aid opportunities from across the web to support your educational journey.
                </p>
            </div>

            <Card className="mb-8 shadow-md">
                <form action={formAction}>
                    <CardContent className="p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-2 space-y-2">
                                <label htmlFor="search" className="text-sm font-medium">Scholarship Name or Keyword</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        name="query"
                                        placeholder="e.g., 'STEM scholarship for women'"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="field" className="text-sm font-medium">Field of Study</label>
                                <Select name="field" defaultValue="all">
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Fields" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Fields</SelectItem>
                                        <SelectItem value="STEM">STEM</SelectItem>
                                        <SelectItem value="Leadership">Leadership</SelectItem>
                                        <SelectItem value="Arts">Arts</SelectItem>
                                        <SelectItem value="Education">Education</SelectItem>
                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
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
                    <ScholarshipSkeletonGrid />
                ) : scholarshipsToShow && scholarshipsToShow.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scholarshipsToShow.map((scholarship, index) => {
                            const image = scholarshipCardImage;
                            return (
                                <Card key={index} className="overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
                                    {image && (
                                        <div className="relative h-40 w-full">
                                            <Image
                                                src={image.imageUrl}
                                                alt={image.description}
                                                fill
                                                className="object-cover"
                                                data-ai-hint={image.imageHint}
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle>{scholarship.title}</CardTitle>
                                        <CardDescription>{scholarship.provider}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-lg font-bold text-primary mb-2">{scholarship.amount}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-3">{scholarship.description}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center bg-muted/50 p-4 mt-auto">
                                        <span className="text-sm font-semibold text-muted-foreground">{scholarship.field}</span>
                                        <Button asChild>
                                            <Link href={scholarship.applyLink} target="_blank" rel="noopener noreferrer">View Details</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : state?.message ? (
                     <div className="text-center text-muted-foreground py-16">
                        <GraduationCap className="mx-auto h-24 w-24 opacity-10" />
                        <p className="mt-4">{state.message}</p>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-16">
                        <GraduationCap className="mx-auto h-24 w-24 opacity-10" />
                        <p className="mt-4">Search for scholarships to see results.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


function ScholarshipSkeletonGrid() {
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
                    <CardFooter className="p-4 mt-auto flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-10 w-28" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
