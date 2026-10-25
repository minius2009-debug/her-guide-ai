
import Image from 'next/image';
import Link from 'next/link';
import {
  BrainCircuit,
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Career Advisor',
    description: 'Get personalized career and education guidance.',
    link: '/career-advisor',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
  },
  {
    icon: Briefcase,
    title: 'Smart Job Finder',
    description: 'Find job opportunities that match your skills.',
    link: '/job-finder',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
  },
  {
    icon: GraduationCap,
    title: 'Scholarships',
    description: 'Discover scholarships and financial aid.',
    link: '/scholarships',
    color: 'text-rose-500',
    bgColor: 'bg-rose-100',
  },
  {
    icon: Shield,
    title: 'Personal Safety',
    description: 'Tools and tips to help you stay safe.',
    link: '/safety',
    color: 'text-teal-500',
    bgColor: 'bg-teal-100',
  },
  {
    icon: Users,
    title: 'Community Hub',
    description: 'Connect with others and find support.',
    link: '/community',
    color: 'text-lime-500',
    bgColor: 'bg-lime-100',
  },
  {
    icon: Heart,
    title: 'Well-being',
    description: 'Access mental health and well-being resources.',
    link: '/community',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
];

export default function Home() {
  const dashboardHeroImage = PlaceHolderImages.find(p => p.id === 'dashboard-hero');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[400px] bg-primary/10">
        {dashboardHeroImage && (
             <Image
             src={dashboardHeroImage.imageUrl}
             alt={dashboardHeroImage.description}
             fill
             className="object-cover"
             data-ai-hint={dashboardHeroImage.imageHint}
             priority
           />
        )}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-primary-foreground p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white shadow-lg">
            Welcome to HerGuide AI
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
            Your personal AI-powered assistant for career, education, and safety.
          </p>
          <Button asChild className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 rounded-full">
            <Link href="#features">Explore Features</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline">
            Empower Your Future
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-center mt-4">
            Everything you need to succeed, all in one place.
          </p>
          <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-l-4"
                style={{ borderLeftColor: `hsl(var(--primary))` }}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`p-3 rounded-full ${feature.bgColor}`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Button asChild variant="link" className="p-0 mt-4 text-primary">
                    <Link href={feature.link}>
                      Learn More <span className="ml-1">→</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
