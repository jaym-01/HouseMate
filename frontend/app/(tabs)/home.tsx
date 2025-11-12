/**
 * Home Screen
 *
 * Main dashboard for authenticated users.
 * Currently shows a welcome message with user info.
 * Will be expanded to show household overview, bills, shopping list, etc.
 */

import { useAuth } from '@/hooks/useAuth';
import {
  Home as HomeIcon,
  Receipt,
  ShoppingCart,
  Users,
} from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        {/* Welcome Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
          </Text>
          <Text className="text-gray-600">Ready to manage your household?</Text>
        </View>

        {/* Quick Stats Cards (Placeholder) */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Overview
          </Text>

          <View className="bg-white rounded-lg p-6 mb-4 border border-gray-200">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mr-4">
                <HomeIcon size={24} color="#6366f1" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Household</Text>
                <Text className="text-gray-900 font-semibold text-lg">
                  No household yet
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 text-sm">
              Create or join a household to get started
            </Text>
          </View>

          <View className="bg-white rounded-lg p-6 mb-4 border border-gray-200">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                <Receipt size={24} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Bills This Month</Text>
                <Text className="text-gray-900 font-semibold text-lg">
                  £0.00
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 text-sm">No bills added yet</Text>
          </View>

          <View className="bg-white rounded-lg p-6 mb-4 border border-gray-200">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                <ShoppingCart size={24} color="#9333ea" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Shopping List</Text>
                <Text className="text-gray-900 font-semibold text-lg">
                  0 items
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 text-sm">
              Your shopping list is empty
            </Text>
          </View>

          <View className="bg-white rounded-lg p-6 border border-gray-200">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-4">
                <Users size={24} color="#ea580c" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Housemates</Text>
                <Text className="text-gray-900 font-semibold text-lg">
                  0 members
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 text-sm">
              Invite people to your household
            </Text>
          </View>
        </View>

        {/* Coming Soon */}
        <View className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <Text className="text-indigo-900 font-semibold mb-2">
            🚧 More Features Coming Soon!
          </Text>
          <Text className="text-indigo-700 text-sm">
            Household management, bill splitting, shopping lists, and more will
            be available soon.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
