/**
 * useAuth Hook Unit Tests
 *
 * Tests the authentication state management hook
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../useAuth';

// Mock Firebase Auth
jest.mock('firebase/auth');
jest.mock('@/config/firebase.config', () => ({
  getFirebaseAuth: jest.fn(() => ({
    currentUser: null,
  })),
}));

const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<
  typeof onAuthStateChanged
>;

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    mockOnAuthStateChanged.mockImplementation(() => jest.fn());

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set user when authenticated', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      photoURL: null,
    };

    mockOnAuthStateChanged.mockImplementation((auth, callback: any) => {
      // Simulate auth state change
      setTimeout(() => {
        callback(mockUser);
      }, 0);
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.user?.email).toBe('test@example.com');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isEmailVerified).toBe(true);
  });

  it('should set user to null when not authenticated', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback: any) => {
      setTimeout(() => {
        callback(null);
      }, 0);
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isEmailVerified).toBe(false);
  });

  it('should handle auth state errors', async () => {
    const mockError = new Error('Auth state error');

    mockOnAuthStateChanged.mockImplementation(
      (auth, successCallback: any, errorCallback: any) => {
        setTimeout(() => {
          errorCallback(mockError);
        }, 0);
        return jest.fn();
      }
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('Auth state error');
  });

  it('should unsubscribe on unmount', () => {
    const mockUnsubscribe = jest.fn();
    mockOnAuthStateChanged.mockReturnValue(mockUnsubscribe);

    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should update isEmailVerified based on user verification status', async () => {
    const mockUnverifiedUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: false,
      photoURL: null,
    };

    mockOnAuthStateChanged.mockImplementation((auth, callback: any) => {
      setTimeout(() => {
        callback(mockUnverifiedUser);
      }, 0);
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isEmailVerified).toBe(false);
  });

  it('should handle initialization errors gracefully', async () => {
    const mockGetFirebaseAuth =
      require('@/config/firebase.config').getFirebaseAuth;
    mockGetFirebaseAuth.mockImplementationOnce(() => {
      throw new Error('Firebase init error');
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain(
      'Failed to initialize auth listener'
    );
  });
});
