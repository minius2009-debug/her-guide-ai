import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config';

let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig, 'auth-service');
} catch (error) {
  console.error('Firebase server app initialization error:', error);
  throw error;
}

export const auth = getAuth(app);
