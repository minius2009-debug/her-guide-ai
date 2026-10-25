'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleSafeRoute, type SafeRouteState } from '@/app/actions';
import { AlertTriangle, Lightbulb, Loader2, Map, Shield } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


const safetyTips = [
    "Share your travel plans with a trusted friend or family member.",
    "Be aware of your surroundings and avoid distractions like using your phone while walking alone.",
    "Stick to well-lit, populated areas, especially at night.",
    "Trust your instincts. If a situation feels unsafe, leave immediately.",
    "Learn basic self-defense techniques.",
    "Keep emergency contacts easily accessible on your phone.",
];

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : <>Find Safe Route</>}
        </Button>
    );
}


export default function SafetyPage() {
    const { toast } = useToast();
    const initialState: SafeRouteState = {};
    const [state, dispatch] = useActionState(handleSafeRoute, initialState);

    const handleSos = () => {
        toast({
            title: "SOS Activated",
            description: "Your live location and an emergency message have been sent to your trusted contacts.",
            variant: "destructive",
        })
    }

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
                <Shield className="w-16 h-16 mb-4 text-primary" />
                <h1 className="text-4xl font-headline font-bold">Personal Safety Hub</h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                    Your safety is our priority. Use these tools to stay secure.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Map /> Safe Route Finder</CardTitle>
                            <CardDescription>Get a secure travel path from our AI assistant.</CardDescription>
                        </CardHeader>
                        <form action={dispatch}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentLocation">Starting Location</Label>
                                        <Input id="currentLocation" name="currentLocation" placeholder="e.g., '123 Main St, Cityville'" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="destination">Destination</Label>
                                        <Input id="destination" name="destination" placeholder="e.g., 'City Library'" />
                                    </div>
                                </div>
                                {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

                            </CardContent>
                             <CardFooter className="flex flex-col items-start gap-4">
                                <SubmitButton />
                                {state?.data && (
                                     <div className="mt-4 w-full">
                                        <h4 className="font-semibold">Your Safe Route:</h4>
                                        <p className="text-sm text-muted-foreground bg-muted p-4 rounded-md mt-2">{state.data.safeRoute}</p>
                                     </div>
                                 )}
                             </CardFooter>
                        </form>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lightbulb /> AI Safety Tips</CardTitle>
                            <CardDescription>Stay informed with these AI-powered safety recommendations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {safetyTips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Shield className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                     <Card className="sticky top-24 bg-red-50 border-red-200 shadow-lg">
                        <CardHeader className="items-center text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                            <CardTitle className="text-2xl text-red-700">Emergency SOS</CardTitle>
                            <CardDescription className="text-red-600">
                                Instantly alert your trusted contacts and share your live location.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    className="h-24 w-24 rounded-full text-2xl font-bold shadow-2xl animate-pulse"
                                >
                                    SOS
                                </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm SOS Activation?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will immediately send an emergency alert with your location to your pre-defined trusted contacts. Use only in a genuine emergency.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSos} className="bg-red-600 hover:bg-red-700">
                                        Yes, Activate SOS
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                         <CardFooter className="text-center text-xs text-red-500 pt-4">
                             <p>You can also use the voice command "Help Me HerGuide" to trigger an alert.</p>
                         </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
