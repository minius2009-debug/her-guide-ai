'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { handleLogin, type AuthState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LayoutGrid, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : 'Sign in'}
    </Button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const initialState: AuthState = { message: undefined, success: false };
  const [state, dispatch] = useActionState(handleLogin, initialState);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Login Successful',
        description: "Welcome back!",
      });
      router.push('/');
    } else if (state?.message) {
      toast({
        title: 'Login Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <LayoutGrid className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="text-2xl mt-4">Login to HerGuide AI</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <form action={dispatch}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.message && !state.success && (
              <p className="text-sm text-destructive text-center">{state.message}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
