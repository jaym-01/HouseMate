import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useFirebaseInit } from '@/hooks/useFirebaseInit';
import { ActivityIndicator, Text, View } from 'react-native';
import '../global.css';

// Prevent auto-hiding splash screen until Firebase is initialized
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isInitialized, error } = useFirebaseInit();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (isInitialized && fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isInitialized, fontsLoaded]);

  // Show error screen if Firebase failed to initialize
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-xl font-bold text-red-600 mb-4">
          Initialization Error
        </Text>
        <Text className="text-center text-gray-700">{error.message}</Text>
      </View>
    );
  }

  // Show loading screen while initializing
  if (!isInitialized || !fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-4 text-gray-600">Loading HouseMate...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" />
      </View>
    </ThemeProvider>
  );
}
