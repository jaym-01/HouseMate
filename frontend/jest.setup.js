/**
 * Jest Setup File
 *
 * Global test configuration and mocks
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      firebaseApiKey: 'test-api-key',
      firebaseAuthDomain: 'test.firebaseapp.com',
      firebaseProjectId: 'test-project',
      firebaseStorageBucket: 'test.appspot.com',
      firebaseMessagingSenderId: '123456',
      firebaseAppId: '1:123456:web:abc',
      useFirebaseEmulator: 'false',
      firebaseAuthEmulatorHost: 'localhost:9099',
      firebaseFirestoreEmulatorHost: 'localhost:9100',
    },
  },
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Redirect: jest.fn(({ href }) => null),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Firebase Auth entirely for tests
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendEmailVerification: jest.fn(),
  updateProfile: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
  onAuthStateChanged: jest.fn(),
  connectAuthEmulator: jest.fn(),
  EmailAuthProvider: {
    credential: jest.fn(),
  },
}));

// Mock Firebase App
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ name: '[DEFAULT]' })),
  getApp: jest.fn(() => ({ name: '[DEFAULT]' })),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  connectFirestoreEmulator: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

// Set test timeout
jest.setTimeout(10000);
