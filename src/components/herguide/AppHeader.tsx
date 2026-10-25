
'use client';

import Link from 'next/link';
import {
  Bell,
  BrainCircuit,
  Briefcase,
  GraduationCap,
  LayoutGrid,
  Menu,
  Shield,
  Users,
  Heart,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { handleLogout } from '@/app/actions';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/career-advisor', label: 'Career Advisor', icon: BrainCircuit },
  { href: '/job-finder', label: 'Job Finder', icon: Briefcase },
  { href: '/scholarships', label: 'Scholarships', icon: GraduationCap },
  { href: '/safety', label: 'Safety', icon: Shield },
  { href: '/community', label: 'Community', icon: Users },
];

export function AppHeader() {
  const user = useUser();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await handleLogout();
      router.push('/');
      router.refresh(); // Refresh the page to update the user state
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <LayoutGrid className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold text-xl">HerGuide AI</span>
        </Link>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <LayoutGrid className="h-6 w-6 text-primary" />
              <span className="font-headline font-bold text-xl">HerGuide AI</span>
            </Link>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {user ? (
          <>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar className='h-8 w-8'>
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className='mr-2 h-4 w-4'/>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
