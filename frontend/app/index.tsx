/**
 * App Entry Point
 *
 * Redirects to appropriate screen based on authentication state:
 * - If authenticated: redirect to home
 * - If not authenticated: redirect to login
 */

import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Redirect based on auth state
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  // @ts-expect-error - Dynamic route not in typed routes yet
  return <Redirect href="/auth/login" />;
}
