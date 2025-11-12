/**
 * Firebase Configuration Unit Tests
 *
 * Tests Firebase initialization and configuration
 */

import Constants from 'expo-constants';
import { getApp, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import {
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseFirestore,
  initializeFirebase,
} from '../firebase.config';

// Mock Firebase modules
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('expo-constants');

const mockInitializeApp = initializeApp as jest.MockedFunction<
  typeof initializeApp
>;
const mockGetApp = getApp as jest.MockedFunction<typeof getApp>;
const mockGetAuth = getAuth as jest.MockedFunction<typeof getAuth>;
const mockGetFirestore = getFirestore as jest.MockedFunction<
  typeof getFirestore
>;
const mockConnectAuthEmulator = connectAuthEmulator as jest.MockedFunction<
  typeof connectAuthEmulator
>;
const mockConnectFirestoreEmulator =
  connectFirestoreEmulator as jest.MockedFunction<
    typeof connectFirestoreEmulator
  >;

describe('Firebase Configuration', () => {
  const mockFirebaseConfig = {
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
    projectId: 'test-project',
    storageBucket: 'test.appspot.com',
    messagingSenderId: '123456',
    appId: '1:123456:web:abc',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Constants
    (Constants as any).expoConfig = {
      extra: {
        firebaseApiKey: mockFirebaseConfig.apiKey,
        firebaseAuthDomain: mockFirebaseConfig.authDomain,
        firebaseProjectId: mockFirebaseConfig.projectId,
        firebaseStorageBucket: mockFirebaseConfig.storageBucket,
        firebaseMessagingSenderId: mockFirebaseConfig.messagingSenderId,
        firebaseAppId: mockFirebaseConfig.appId,
        useFirebaseEmulator: 'false',
        firebaseAuthEmulatorHost: 'localhost:9099',
        firebaseFirestoreEmulatorHost: 'localhost:9100',
      },
    };

    // Mock Firebase app instance
    const mockApp = { name: '[DEFAULT]' } as any;
    mockInitializeApp.mockReturnValue(mockApp);
    mockGetApp.mockReturnValue(mockApp);

    // Mock Auth instance
    const mockAuth = {
      currentUser: null,
      _canUseEmulator: false,
    } as any;
    mockGetAuth.mockReturnValue(mockAuth);

    // Mock Firestore instance
    const mockFirestore = {
      _settingsFrozen: false,
    } as any;
    mockGetFirestore.mockReturnValue(mockFirestore);
  });

  describe('Configuration Validation', () => {
    it('should throw error if Firebase config is missing', () => {
      (Constants as any).expoConfig = {
        extra: {},
      };

      expect(() => initializeFirebase()).toThrow(
        'Missing Firebase configuration'
      );
    });

    it('should throw error if API key is missing', () => {
      (Constants as any).expoConfig = {
        extra: {
          ...mockFirebaseConfig,
          firebaseApiKey: undefined,
        },
      };

      expect(() => initializeFirebase()).toThrow(
        'Missing Firebase configuration'
      );
    });

    it('should throw error if project ID is missing', () => {
      (Constants as any).expoConfig = {
        extra: {
          ...mockFirebaseConfig,
          firebaseProjectId: undefined,
        },
      };

      expect(() => initializeFirebase()).toThrow(
        'Missing Firebase configuration'
      );
    });
  });

  describe('Firebase Initialization', () => {
    it('should initialize Firebase with correct config', () => {
      const result = initializeFirebase();

      expect(mockInitializeApp).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: mockFirebaseConfig.apiKey,
          authDomain: mockFirebaseConfig.authDomain,
          projectId: mockFirebaseConfig.projectId,
        })
      );
      expect(result.app).toBeDefined();
      expect(result.auth).toBeDefined();
      expect(result.firestore).toBeDefined();
    });

    it('should reuse existing Firebase app', () => {
      // First initialization
      initializeFirebase();

      // Clear the mock to see if it's called again
      mockInitializeApp.mockClear();

      // Second initialization
      initializeFirebase();

      expect(mockInitializeApp).not.toHaveBeenCalled();
      expect(mockGetApp).toHaveBeenCalled();
    });

    it('should initialize Auth service', () => {
      initializeFirebase();

      expect(mockGetAuth).toHaveBeenCalled();
    });

    it('should initialize Firestore service', () => {
      initializeFirebase();

      expect(mockGetFirestore).toHaveBeenCalled();
    });
  });

  describe('Emulator Connection', () => {
    it('should connect to emulators when enabled', () => {
      (Constants as any).expoConfig.extra.useFirebaseEmulator = 'true';

      const mockAuth = {
        currentUser: null,
        _canUseEmulator: true,
      } as any;
      mockGetAuth.mockReturnValue(mockAuth);

      const mockFirestore = {
        _settingsFrozen: false,
      } as any;
      mockGetFirestore.mockReturnValue(mockFirestore);

      initializeFirebase();

      expect(mockConnectAuthEmulator).toHaveBeenCalledWith(
        expect.anything(),
        'http://localhost:9099',
        expect.objectContaining({ disableWarnings: true })
      );
      expect(mockConnectFirestoreEmulator).toHaveBeenCalledWith(
        expect.anything(),
        'localhost',
        9100
      );
    });

    it('should not connect to emulators when disabled', () => {
      (Constants as any).expoConfig.extra.useFirebaseEmulator = 'false';

      initializeFirebase();

      expect(mockConnectAuthEmulator).not.toHaveBeenCalled();
      expect(mockConnectFirestoreEmulator).not.toHaveBeenCalled();
    });

    it('should handle emulator connection errors gracefully', () => {
      (Constants as any).expoConfig.extra.useFirebaseEmulator = 'true';

      const mockAuth = {
        currentUser: null,
        _canUseEmulator: true,
      } as any;
      mockGetAuth.mockReturnValue(mockAuth);

      mockConnectAuthEmulator.mockImplementationOnce(() => {
        throw new Error('Emulator connection failed');
      });

      // Should not throw error
      expect(() => initializeFirebase()).not.toThrow();
    });
  });

  describe('Getter Functions', () => {
    it('should get Firebase Auth instance', () => {
      const auth = getFirebaseAuth();

      expect(auth).toBeDefined();
      expect(mockGetAuth).toHaveBeenCalled();
    });

    it('should get Firestore instance', () => {
      const firestore = getFirebaseFirestore();

      expect(firestore).toBeDefined();
      expect(mockGetFirestore).toHaveBeenCalled();
    });

    it('should get Firebase App instance', () => {
      const app = getFirebaseApp();

      expect(app).toBeDefined();
    });

    it('should initialize Firebase if not already initialized when getting Auth', () => {
      mockGetApp.mockImplementationOnce(() => {
        throw new Error('No app');
      });

      getFirebaseAuth();

      expect(mockInitializeApp).toHaveBeenCalled();
    });

    it('should initialize Firebase if not already initialized when getting Firestore', () => {
      mockGetApp.mockImplementationOnce(() => {
        throw new Error('No app');
      });

      getFirebaseFirestore();

      expect(mockInitializeApp).toHaveBeenCalled();
    });
  });

  describe('Multiple Initializations', () => {
    it('should handle multiple initialization calls safely', () => {
      initializeFirebase();
      initializeFirebase();
      initializeFirebase();

      // Should only initialize once
      expect(mockInitializeApp).toHaveBeenCalledTimes(1);
    });

    it('should return same instances on multiple calls', () => {
      const result1 = initializeFirebase();
      const result2 = initializeFirebase();

      expect(result1.app).toBe(result2.app);
      expect(result1.auth).toBe(result2.auth);
      expect(result1.firestore).toBe(result2.firestore);
    });
  });
});
