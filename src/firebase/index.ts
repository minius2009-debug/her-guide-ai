import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    return { app, auth, firestore };
  } catch (error) {
    console.error('Firebase client initialization error:', error);
    throw error;
  }
}

export { FirebaseClientProvider } from './client-provider';
export {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
} from './provider';

export { useUser } from './auth/use-user';
