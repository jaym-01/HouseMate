/**
 * Firebase Configuration Types
 *
 * This file contains type definitions for Firebase configuration
 * to ensure type safety when working with environment variables.
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface EmulatorConfig {
  useEmulator: boolean;
  authEmulatorHost: string;
  firestoreEmulatorHost: string;
}
