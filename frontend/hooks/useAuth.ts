/**
 * Authentication State Hook
 *
 * This hook provides access to the current authentication state
 * and listens for auth state changes in real-time.
 *
 * Usage:
 * ```tsx
 * const { user, loading, error } = useAuth();
 * ```
 */

import { getFirebaseAuth } from '@/config/firebase.config';
import type { AuthUser } from '@/services/auth.types';
import { toAuthUser } from '@/services/auth.types';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();

      // Subscribe to auth state changes
      const unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(toAuthUser(firebaseUser));
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
      };
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to initialize auth listener')
      );
      setLoading(false);
      return undefined;
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: user !== null,
    isEmailVerified: user?.emailVerified || false,
  };
}
