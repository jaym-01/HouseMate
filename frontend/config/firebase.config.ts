/**
 * Firebase Configuration and Initialization
 *
 * This module handles Firebase app initialization and configuration
 * for both production and local emulator environments.
 *
 * Security considerations:
 * - Environment variables are validated before use
 * - Emulator mode is controlled via environment variable
 * - Proper error handling for missing configuration
 */

import Constants from 'expo-constants';
import { FirebaseApp, getApp, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import type { EmulatorConfig, FirebaseConfig } from './firebase.types';

/**
 * Get Firebase configuration from environment variables
 * Throws error if required variables are missing
 */
function getFirebaseConfig(): FirebaseConfig {
  const config = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
    projectId: Constants.expoConfig?.extra?.firebaseProjectId,
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
    appId: Constants.expoConfig?.extra?.firebaseAppId,
  };

  // Validate all required fields are present
  const missingFields = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    throw new Error(
      `Missing Firebase configuration: ${missingFields.join(', ')}. ` +
        'Please check your .env file and app.config.ts'
    );
  }

  return config as FirebaseConfig;
}

/**
 * Get emulator configuration from environment variables
 */
function getEmulatorConfig(): EmulatorConfig {
  return {
    useEmulator: Constants.expoConfig?.extra?.useFirebaseEmulator === 'true',
    authEmulatorHost:
      Constants.expoConfig?.extra?.firebaseAuthEmulatorHost || 'localhost:9099',
    firestoreEmulatorHost:
      Constants.expoConfig?.extra?.firebaseFirestoreEmulatorHost ||
      'localhost:9100',
  };
}

// Firebase instances
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Initialize Firebase app and services
 * Only initializes once, subsequent calls return existing instances
 */
export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  try {
    // Try to get existing app
    firebaseApp = getApp();
  } catch {
    // App doesn't exist, initialize it
    const config = getFirebaseConfig();
    firebaseApp = initializeApp(config);

    console.log('✅ Firebase app initialized');
  }

  // Initialize Auth if not already initialized
  if (!auth) {
    auth = getAuth(firebaseApp);
  }

  // Initialize Firestore if not already initialized
  if (!firestore) {
    firestore = getFirestore(firebaseApp);
  }

  // Connect to emulators if enabled
  const emulatorConfig = getEmulatorConfig();
  if (emulatorConfig.useEmulator) {
    connectToEmulators(auth, firestore, emulatorConfig);
  }

  return { app: firebaseApp, auth, firestore };
}

/**
 * Connect to Firebase emulators for local development
 * Only connects once per instance
 */
function connectToEmulators(
  authInstance: Auth,
  firestoreInstance: Firestore,
  config: EmulatorConfig
): void {
  try {
    // Connect to Auth emulator
    // @ts-ignore - _canUseEmulator is internal but reliable way to check
    if (authInstance._canUseEmulator) {
      const [authHost, authPort] = config.authEmulatorHost.split(':');
      connectAuthEmulator(authInstance, `http://${authHost}:${authPort}`, {
        disableWarnings: true,
      });
      console.log(
        `🔧 Connected to Auth emulator at ${config.authEmulatorHost}`
      );
    }

    // Connect to Firestore emulator
    // @ts-ignore - _settingsFrozen is internal but reliable way to check
    if (!firestoreInstance._settingsFrozen) {
      const [firestoreHost, firestorePort] =
        config.firestoreEmulatorHost.split(':');
      connectFirestoreEmulator(
        firestoreInstance,
        firestoreHost,
        parseInt(firestorePort, 10)
      );
      console.log(
        `🔧 Connected to Firestore emulator at ${config.firestoreEmulatorHost}`
      );
    }
  } catch (error) {
    console.warn('⚠️ Could not connect to emulators:', error);
    // Don't throw - emulators might already be connected
  }
}

/**
 * Get initialized Firebase Auth instance
 * Initializes Firebase if not already initialized
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

/**
 * Get initialized Firestore instance
 * Initializes Firebase if not already initialized
 */
export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    initializeFirebase();
  }
  return firestore;
}

/**
 * Get initialized Firebase app instance
 * Initializes Firebase if not already initialized
 */
export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return firebaseApp;
}
