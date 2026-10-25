import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '@/components/herguide/AppHeader';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'HerGuide AI',
  description: 'An AI-Powered Empowerment Platform for Girls',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex flex-1 flex-col bg-background">
              {children}
            </main>
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
