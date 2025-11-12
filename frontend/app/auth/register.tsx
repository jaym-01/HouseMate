/**
 * User Registration Screen
 *
 * Allows new users to create an account with email and password.
 * Features:
 * - Input validation (email format, password strength, name length)
 * - Real-time password strength feedback
 * - Error handling with user-friendly messages
 * - Loading states during registration
 * - Email verification notification
 */

import { registerWithEmail } from '@/services/auth.service';
import { router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, User, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  /**
   * Validate password strength in real-time
   */
  const getPasswordStrength = (
    pwd: string
  ): {
    score: number;
    feedback: string;
    color: string;
  } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score, feedback: 'Weak', color: '#ef4444' };
    if (score === 2) return { score, feedback: 'Fair', color: '#f59e0b' };
    if (score === 3) return { score, feedback: 'Good', color: '#eab308' };
    if (score === 4) return { score, feedback: 'Strong', color: '#22c55e' };
    return { score, feedback: 'Very Strong', color: '#16a34a' };
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Display name validation
    if (!displayName.trim()) {
      newErrors.displayName = 'Name is required';
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain an uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain a lowercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain a number';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle registration submission
   */
  const handleRegister = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerWithEmail({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
      });

      if (result.error) {
        // Show error message
        setErrors({ general: result.error.message });
      } else {
        // Registration successful
        Alert.alert(
          'Registration Successful!',
          'A verification email has been sent to your email address. Please verify your email to continue.',
          [
            {
              text: 'OK',
              onPress: () => {
                // @ts-expect-error - Dynamic route not in typed routes yet
                router.replace('/auth/login');
              },
            },
          ]
        );
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-16 pb-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </Text>
          <Text className="text-gray-600">
            Join HouseMate and start managing your household
          </Text>
        </View>

        {/* General Error */}
        {errors.general && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex-row items-start">
            <XCircle size={20} color="#dc2626" className="mt-0.5 mr-2" />
            <Text className="text-red-700 flex-1">{errors.general}</Text>
          </View>
        )}

        {/* Display Name Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Full Name
          </Text>
          <View
            className={`flex-row items-center border rounded-lg px-4 py-3 ${
              errors.displayName ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <User size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="John Doe"
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                if (errors.displayName) {
                  setErrors((prev) => ({ ...prev, displayName: '' }));
                }
              }}
              autoCapitalize="words"
              autoComplete="name"
              editable={!isLoading}
            />
          </View>
          {errors.displayName && (
            <Text className="text-red-600 text-xs mt-1">
              {errors.displayName}
            </Text>
          )}
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <View
            className={`flex-row items-center border rounded-lg px-4 py-3 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <Mail size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
          </View>
          {errors.email && (
            <Text className="text-red-600 text-xs mt-1">{errors.email}</Text>
          )}
        </View>

        {/* Password Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Password
          </Text>
          <View
            className={`flex-row items-center border rounded-lg px-4 py-3 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <Lock size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: '' }));
                }
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!isLoading}
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
          {errors.password && (
            <Text className="text-red-600 text-xs mt-1">{errors.password}</Text>
          )}

          {/* Password Strength Indicator */}
          {password && passwordStrength && (
            <View className="mt-2">
              <View className="flex-row items-center mb-1">
                <Text className="text-xs text-gray-600 mr-2">Strength:</Text>
                <Text
                  className="text-xs font-medium"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.feedback}
                </Text>
              </View>
              <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: passwordStrength.color,
                  }}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Use 8+ characters with uppercase, lowercase, and numbers
              </Text>
            </View>
          )}
        </View>

        {/* Confirm Password Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </Text>
          <View
            className={`flex-row items-center border rounded-lg px-4 py-3 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <Lock size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="ml-2"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color="#9ca3af" />
              ) : (
                <Eye size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text className="text-red-600 text-xs mt-1">
              {errors.confirmPassword}
            </Text>
          )}
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={isLoading}
          className={`rounded-lg py-4 mb-4 ${
            isLoading ? 'bg-indigo-400' : 'bg-indigo-600'
          }`}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="#ffffff" size="small" />
              <Text className="text-white font-semibold ml-2">
                Creating Account...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row items-center justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              // @ts-expect-error - Dynamic route not in typed routes yet
              router.push('/auth/login');
            }}
            disabled={isLoading}
          >
            <Text className="text-indigo-600 font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
