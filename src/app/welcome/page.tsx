
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function WelcomePage() {
  const welcomeImage = PlaceHolderImages.find(p => p.id === 'welcome-girls');
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-white">
      {welcomeImage && (
        <Image
          src={welcomeImage.imageUrl}
          alt={welcomeImage.description}
          fill
          className="object-cover"
          data-ai-hint={welcomeImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <PartyPopper className="mx-auto h-16 w-16 text-white mb-4" />
        <h1 className="text-4xl md:text-6xl font-headline font-bold">Welcome to HerGuide AI!</h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
          We're so glad you're here. You've successfully joined a community dedicated to empowering your future.
        </p>
        <Button asChild className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-full">
          <Link href="/">Explore Your Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
