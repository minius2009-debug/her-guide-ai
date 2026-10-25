'use client';

import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '.';

// Keep this initialized instance in module scope so it is not re-initialized on each render.
const { app, auth, firestore } = initializeFirebase();

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
