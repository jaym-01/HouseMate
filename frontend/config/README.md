# Firebase Setup Documentation

## Overview

This document explains the Firebase configuration and initialization setup for HouseMate.

## Configuration Files

### 1. Environment Variables (`.env`)

The `.env` file contains Firebase configuration values and emulator settings:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=demo-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=demo-project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true
EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
EXPO_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:9100
```

**Important**:

- The `.env` file is gitignored to prevent committing sensitive data
- Use `.env.example` as a template for new developers
- For production, set `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=false` and provide real Firebase credentials

### 2. Firebase Configuration (`config/firebase.config.ts`)

This module handles:

- Firebase app initialization
- Auth and Firestore service setup
- Automatic emulator connection in development mode
- Singleton pattern to prevent multiple initializations

Key functions:

- `initializeFirebase()`: Main initialization function
- `getFirebaseAuth()`: Get Auth instance
- `getFirebaseFirestore()`: Get Firestore instance
- `getFirebaseApp()`: Get Firebase app instance

### 3. Firebase Initialization Hook (`hooks/useFirebaseInit.ts`)

A React hook that:

- Initializes Firebase when the app starts
- Provides initialization state (`isInitialized`, `error`)
- Used in the root layout to ensure Firebase is ready before rendering

## Usage

### In the Root Layout

The root layout (`app/_layout.tsx`) uses the `useFirebaseInit` hook to initialize Firebase:

```tsx
const { isInitialized, error } = useFirebaseInit();
```

The app shows a loading screen until Firebase is initialized.

### In Other Components

Use the getter functions to access Firebase services:

```tsx
import {
  getFirebaseAuth,
  getFirebaseFirestore,
} from '@/config/firebase.config';

// In your component or service
const auth = getFirebaseAuth();
const firestore = getFirebaseFirestore();
```

## Local Development with Emulators

1. **Start Firebase Emulators**:

   ```bash
   cd backend
   firebase emulators:start
   ```

2. **Verify Emulator Connection**:
   - Auth Emulator: http://localhost:9099
   - Firestore Emulator: http://localhost:9100
   - Emulator UI: http://localhost:9101

3. **The app will automatically connect** to emulators when `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true`

## Production Setup

For production deployment:

1. Create a Firebase project at https://console.firebase.google.com
2. Get your Firebase config from Project Settings > General > Your apps
3. Update `.env` with real values:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your-real-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   # ... other values
   EXPO_PUBLIC_USE_FIREBASE_EMULATOR=false
   ```
4. Deploy Firestore rules and indexes from `backend/` directory

## Security Considerations

✅ **Implemented**:

- Environment variables properly scoped with `EXPO_PUBLIC_` prefix
- Firebase config validation on initialization
- Emulator mode controlled via environment variable
- `.env` file gitignored to prevent credential leaks
- Proper error handling for missing configuration

⚠️ **TODO** (Phase 8):

- Implement Firestore security rules
- Add Firebase App Check for production
- Set up monitoring and error tracking
- Implement rate limiting for auth operations

## Troubleshooting

### "Missing Firebase configuration" error

- Check that all environment variables are set in `.env`
- Restart the Expo dev server after changing `.env`
- Verify `app.config.ts` is reading variables correctly

### Cannot connect to emulators

- Ensure Firebase emulators are running (`firebase emulators:start`)
- Check emulator ports are not in use
- Verify emulator host addresses in `.env`

### Changes to .env not reflecting

- Stop the Expo dev server
- Clear Metro cache: `npx expo start -c`
- Restart the dev server

## Next Steps

With Firebase initialized, we can now:

1. ✅ Implement Firebase Auth integration (Task 1.2)
2. Create authentication services (login, register, password reset)
3. Build user registration and login flows
4. Implement auth state management
