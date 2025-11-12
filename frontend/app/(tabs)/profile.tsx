/**
 * User Profile Screen
 *
 * Displays and allows editing of user profile information.
 * Features:
 * - View current profile (name, email, email verification status)
 * - Edit display name
 * - Change email (requires reauthentication)
 * - Change password (requires reauthentication)
 * - Resend email verification
 * - Sign out
 */

import { useAuth } from '@/hooks/useAuth';
import {
  logout,
  reauthenticateUser,
  reloadUser,
  resendEmailVerification,
  updateUserEmail,
  updateUserPassword,
  updateUserProfile,
} from '@/services/auth.service';
import { router } from 'expo-router';
import {
  AlertCircle,
  Check,
  CheckCircle,
  Edit2,
  Lock,
  LogOut,
  Mail,
  User,
  X,
} from 'lucide-react-native';
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

export default function ProfileScreen() {
  const { user, isEmailVerified } = useAuth();

  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');

  // Change email states
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  // Change password states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  /**
   * Handle display name update
   */
  const handleUpdateName = async () => {
    if (!newDisplayName.trim() || newDisplayName === user?.displayName) {
      setIsEditingName(false);
      setNewDisplayName(user?.displayName || '');
      return;
    }

    setIsLoading(true);

    const result = await updateUserProfile({
      displayName: newDisplayName.trim(),
    });

    setIsLoading(false);

    if (result.error) {
      Alert.alert('Error', result.error.message);
    } else {
      setIsEditingName(false);
      Alert.alert('Success', 'Display name updated successfully');
    }
  };

  /**
   * Handle email update
   */
  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || !emailPassword) {
      Alert.alert('Error', 'Please enter new email and your current password');
      return;
    }

    setIsLoading(true);

    // First, reauthenticate
    const reauth = await reauthenticateUser(emailPassword);
    if (reauth.error) {
      setIsLoading(false);
      Alert.alert('Error', reauth.error.message);
      return;
    }

    // Then update email
    const result = await updateUserEmail(newEmail.trim());
    setIsLoading(false);

    if (result.error) {
      Alert.alert('Error', result.error.message);
    } else {
      setIsChangingEmail(false);
      setNewEmail('');
      setEmailPassword('');
      Alert.alert(
        'Email Updated',
        'Your email has been updated. A verification email has been sent to your new address.'
      );
    }
  };

  /**
   * Handle password update
   */
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setIsLoading(true);

    // First, reauthenticate
    const reauth = await reauthenticateUser(currentPassword);
    if (reauth.error) {
      setIsLoading(false);
      Alert.alert('Error', reauth.error.message);
      return;
    }

    // Then update password
    const result = await updateUserPassword(newPassword);
    setIsLoading(false);

    if (result.error) {
      Alert.alert('Error', result.error.message);
    } else {
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      Alert.alert('Success', 'Password updated successfully');
    }
  };

  /**
   * Handle email verification resend
   */
  const handleResendVerification = async () => {
    setIsLoading(true);
    const result = await resendEmailVerification();
    setIsLoading(false);

    if (result.error) {
      Alert.alert('Error', result.error.message);
    } else {
      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 5000);
    }
  };

  /**
   * Refresh user data to check email verification
   */
  const handleCheckVerification = async () => {
    setIsLoading(true);
    await reloadUser();
    setIsLoading(false);
  };

  /**
   * Handle sign out
   */
  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          const result = await logout();
          if (result.error) {
            Alert.alert('Error', result.error.message);
          } else {
            // @ts-expect-error - Dynamic route not in typed routes yet
            router.replace('/auth/login');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Profile</Text>
          <Text className="text-gray-600">Manage your account settings</Text>
        </View>

        {/* Email Verification Status */}
        {!isEmailVerified && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <View className="flex-row items-start">
              <AlertCircle size={20} color="#d97706" className="mt-0.5 mr-3" />
              <View className="flex-1">
                <Text className="text-yellow-800 font-semibold mb-1">
                  Email Not Verified
                </Text>
                <Text className="text-yellow-700 text-sm mb-3">
                  Please verify your email address to access all features.
                </Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={handleResendVerification}
                    disabled={isLoading || verificationSent}
                    className={`px-4 py-2 rounded-lg ${
                      verificationSent ? 'bg-green-600' : 'bg-yellow-600'
                    }`}
                  >
                    <Text className="text-white font-medium text-sm">
                      {verificationSent ? 'Email Sent!' : 'Resend Email'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCheckVerification}
                    disabled={isLoading}
                    className="px-4 py-2 bg-white border border-yellow-600 rounded-lg"
                  >
                    <Text className="text-yellow-800 font-medium text-sm">
                      I Verified It
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {verificationSent && (
          <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <View className="flex-row items-center">
              <CheckCircle size={20} color="#16a34a" className="mr-2" />
              <Text className="text-green-700">Verification email sent!</Text>
            </View>
          </View>
        )}

        {/* Profile Section */}
        <View className="bg-white rounded-lg p-6 mb-4">
          {/* Display Name */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-gray-700">
                Display Name
              </Text>
              {!isEditingName && (
                <TouchableOpacity onPress={() => setIsEditingName(true)}>
                  <Edit2 size={18} color="#6366f1" />
                </TouchableOpacity>
              )}
            </View>

            {isEditingName ? (
              <View>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 mb-2">
                  <User size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    value={newDisplayName}
                    onChangeText={setNewDisplayName}
                    placeholder="Enter display name"
                    editable={!isLoading}
                  />
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={handleUpdateName}
                    disabled={isLoading}
                    className="flex-1 bg-indigo-600 rounded-lg py-2 flex-row items-center justify-center"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Check size={16} color="#fff" />
                        <Text className="text-white font-medium ml-1">
                          Save
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditingName(false);
                      setNewDisplayName(user?.displayName || '');
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-gray-200 rounded-lg py-2 flex-row items-center justify-center"
                  >
                    <X size={16} color="#4b5563" />
                    <Text className="text-gray-700 font-medium ml-1">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                <User size={20} color="#9ca3af" />
                <Text className="ml-3 text-gray-900">{user?.displayName}</Text>
              </View>
            )}
          </View>

          {/* Email */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-gray-700">Email</Text>
              {!isChangingEmail && (
                <TouchableOpacity onPress={() => setIsChangingEmail(true)}>
                  <Edit2 size={18} color="#6366f1" />
                </TouchableOpacity>
              )}
            </View>

            {isChangingEmail ? (
              <View>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-900"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="New email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-900"
                  value={emailPassword}
                  onChangeText={setEmailPassword}
                  placeholder="Current password"
                  secureTextEntry
                  editable={!isLoading}
                />
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={handleUpdateEmail}
                    disabled={isLoading}
                    className="flex-1 bg-indigo-600 rounded-lg py-2 flex-row items-center justify-center"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Check size={16} color="#fff" />
                        <Text className="text-white font-medium ml-1">
                          Update
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsChangingEmail(false);
                      setNewEmail('');
                      setEmailPassword('');
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-gray-200 rounded-lg py-2 flex-row items-center justify-center"
                  >
                    <X size={16} color="#4b5563" />
                    <Text className="text-gray-700 font-medium ml-1">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                <Mail size={20} color="#9ca3af" />
                <Text className="ml-3 text-gray-900 flex-1">{user?.email}</Text>
                {isEmailVerified && <CheckCircle size={18} color="#16a34a" />}
              </View>
            )}
          </View>

          {/* Change Password */}
          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-gray-700">
                Password
              </Text>
              {!isChangingPassword && (
                <TouchableOpacity onPress={() => setIsChangingPassword(true)}>
                  <Edit2 size={18} color="#6366f1" />
                </TouchableOpacity>
              )}
            </View>

            {isChangingPassword ? (
              <View>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-900"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Current password"
                  secureTextEntry
                  editable={!isLoading}
                />
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-900"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password"
                  secureTextEntry
                  editable={!isLoading}
                />
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-900"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                  editable={!isLoading}
                />
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={handleUpdatePassword}
                    disabled={isLoading}
                    className="flex-1 bg-indigo-600 rounded-lg py-2 flex-row items-center justify-center"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Check size={16} color="#fff" />
                        <Text className="text-white font-medium ml-1">
                          Update
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-gray-200 rounded-lg py-2 flex-row items-center justify-center"
                  >
                    <X size={16} color="#4b5563" />
                    <Text className="text-gray-700 font-medium ml-1">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                <Lock size={20} color="#9ca3af" />
                <Text className="ml-3 text-gray-900">••••••••</Text>
              </View>
            )}
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-600 rounded-lg py-4 flex-row items-center justify-center"
        >
          <LogOut size={20} color="#fff" />
          <Text className="text-white font-semibold text-base ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
