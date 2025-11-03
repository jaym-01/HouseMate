/**
 * Firebase Initialization Hook
 *
 * This hook ensures Firebase is initialized before the app renders.
 * It should be called at the root level of the app.
 */

import { initializeFirebase } from '@/config/firebase.config';
import { useEffect, useState } from 'react';

export function useFirebaseInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      initializeFirebase();
      setIsInitialized(true);
      console.log('✅ Firebase initialized successfully');
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Unknown error initializing Firebase');
      setError(error);
      console.error('❌ Failed to initialize Firebase:', error);
    }
  }, []);

  return { isInitialized, error };
}
