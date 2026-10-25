'use client';

import {
  type FirebaseApp,
} from 'firebase/app';
import {
  type Auth,
} from 'firebase/auth';
import {
  type Firestore,
} from 'firebase/firestore';
import { createContext, useContext } from 'react';

// Define the context shape
interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextType | null>(null);

// Create the provider component
export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Create a hook to use the context
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  const context = useFirebase();
  return context?.app;
}

export function useAuth() {
  const context = useFirebase();
  return context?.auth;
}

export function useFirestore() {
  const context = useFirebase();
  return context?.firestore;
}
