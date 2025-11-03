import 'dotenv/config';
import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: 'HouseMate',
    slug: 'HouseMate',
    version: '0.0.1',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'housemate',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    extra: {
      // Firebase configuration from .env file
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      // Emulator configuration
      useFirebaseEmulator: process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR,
      firebaseAuthEmulatorHost:
        process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST,
      firebaseFirestoreEmulatorHost:
        process.env.EXPO_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST,
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.jellyware.HouseMate',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: 'com.jellyware.HouseMate',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};
