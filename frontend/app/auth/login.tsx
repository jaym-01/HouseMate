/**
 * User Login Screen
 *
 * Allows existing users to sign in with email and password.
 * Features:
 * - Email and password authentication
 * - "Remember me" functionality (auto-handled by Firebase)
 * - Password visibility toggle
 * - Forgot password link
 * - Error handling with user-friendly messages
 * - Loading states during login
 */

import { loginWithEmail, sendPasswordReset } from '@/services/auth.service';
import { router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  /**
   * Handle login submission
   */
  const handleLogin = async () => {
    // Clear previous errors
    setError('');

    // Basic validation
    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginWithEmail({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        // Login successful - navigation will be handled by auth state change
        router.replace('/(tabs)/home');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle forgot password
   */
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await sendPasswordReset(email.trim());

      if (result.error) {
        setError(result.error.message);
      } else {
        setResetEmailSent(true);
        setTimeout(() => setResetEmailSent(false), 5000);
      }
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20 pb-8">
        {/* Header */}
        <View className="mb-10">
          <Text className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </Text>
          <Text className="text-gray-600 text-base">
            Sign in to your HouseMate account
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex-row items-start">
            <XCircle size={20} color="#dc2626" className="mt-0.5 mr-2" />
            <Text className="text-red-700 flex-1">{error}</Text>
          </View>
        )}

        {/* Success Message for Password Reset */}
        {resetEmailSent && (
          <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <Text className="text-green-700">
              Password reset email sent! Check your inbox.
            </Text>
          </View>
        )}

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
            <Mail size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Password
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
            <Lock size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              editable={!isLoading}
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="ml-2"
            >
              {showPassword ? (
                <EyeOff size={20} color="#9ca3af" />
              ) : (
                <Eye size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          disabled={isLoading}
          className="self-end mb-6"
        >
          <Text className="text-indigo-600 text-sm font-medium">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`rounded-lg py-4 mb-6 ${
            isLoading ? 'bg-indigo-400' : 'bg-indigo-600'
          }`}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="#ffffff" size="small" />
              <Text className="text-white font-semibold ml-2">
                Signing In...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row items-center justify-center">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              // @ts-expect-error - Dynamic route not in typed routes yet
              router.push('/auth/register');
            }}
            disabled={isLoading}
          >
            <Text className="text-indigo-600 font-semibold">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
