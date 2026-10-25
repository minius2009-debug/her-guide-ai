'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuth } from '@/firebase/provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
      },
      (error) => {
        console.error('Firebase onAuthStateChanged error:', error);
      }
    );
    return () => unsubscribe();
  }, [auth]);

  return user;
}
