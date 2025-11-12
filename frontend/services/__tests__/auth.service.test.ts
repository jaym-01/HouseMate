/**
 * Authentication Service Unit Tests
 *
 * Tests all authentication operations including:
 * - Email/password validation
 * - User registration
 * - User login
 * - Password reset
 * - Email verification
 * - Profile updates
 * - Reauthentication
 */

import {
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import {
  loginWithEmail,
  logout,
  registerWithEmail,
  sendPasswordReset,
  updateUserProfile,
} from '../auth.service';

// Mock Firebase Auth
jest.mock('firebase/auth');
jest.mock('@/config/firebase.config', () => ({
  getFirebaseAuth: jest.fn(() => ({
    currentUser: null,
  })),
}));

const mockCreateUser = createUserWithEmailAndPassword as jest.MockedFunction<
  typeof createUserWithEmailAndPassword
>;
const mockSignIn = signInWithEmailAndPassword as jest.MockedFunction<
  typeof signInWithEmailAndPassword
>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockSendPasswordReset = sendPasswordResetEmail as jest.MockedFunction<
  typeof sendPasswordResetEmail
>;
const mockSendEmailVerification = sendEmailVerification as jest.MockedFunction<
  typeof sendEmailVerification
>;
const mockUpdateProfile = updateProfile as jest.MockedFunction<
  typeof updateProfile
>;
const mockUpdateEmail = updateEmail as jest.MockedFunction<typeof updateEmail>;
const mockUpdatePassword = updatePassword as jest.MockedFunction<
  typeof updatePassword
>;
const mockReauthenticate = reauthenticateWithCredential as jest.MockedFunction<
  typeof reauthenticateWithCredential
>;

describe('Auth Service - Input Validation', () => {
  describe('Email Validation', () => {
    it('should accept valid email addresses', async () => {
      const result = await registerWithEmail({
        email: 'test@example.com',
        password: 'Test1234',
        displayName: 'Test User',
      });

      // Should not fail validation (will fail at Firebase level which is expected)
      expect(result.error?.code).not.toBe('invalid-email');
    });

    it('should reject invalid email format', async () => {
      const result = await registerWithEmail({
        email: 'invalid-email',
        password: 'Test1234',
        displayName: 'Test User',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('valid email');
      expect(result.user).toBeNull();
    });

    it('should reject empty email', async () => {
      const result = await registerWithEmail({
        email: '',
        password: 'Test1234',
        displayName: 'Test User',
      });

      expect(result.error).toBeDefined();
      expect(result.user).toBeNull();
    });
  });

  describe('Password Validation', () => {
    it('should reject passwords shorter than 8 characters', async () => {
      const result = await registerWithEmail({
        email: 'test@example.com',
        password: 'Test12',
        displayName: 'Test User',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('8 characters');
      expect(result.user).toBeNull();
    });

    it('should reject passwords without uppercase letters', async () => {
      const result = await registerWithEmail({
        email: 'test@example.com',
        password: 'test1234',
        displayName: 'Test User',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('uppercase');
      expect(result.user).toBeNull();
    });

    it('should reject passwords without lowercase letters', async () => {
      const result = await registerWithEmail({
        email: 'test@example.com',
        password: 'TEST1234',
        displayName: 'Test User',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('lowercase');
      expect(result.user).toBeNull();
    });

    it('should reject passwords without numbers', async () => {
      const result = await registerWithEmail({
        email: 'test@example.com',
        password: 'TestTest',
        displayName: 'Test User',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('number');
      expect(result.user).toBeNull();
    });

    it('should accept valid passwords', async () => {
      mockCreateUser.mockResolvedValueOnce({
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: null,
          emailVerified: false,
          photoURL: null,
          reload: jest.fn(),
        } as any,
      } as any);

      mockUpdateProfile.mockResolvedValueOnce(undefined);
      mockSendEmailVerification.mockResolvedValueOnce(undefined);

      const result = await registerWithEmail({
        email: 'test@example.com',
        password: 'Test1234',
        displayName: 'Test User',
      });

      expect(result.error).toBeNull();
      expect(result.user).toBeDefined();
    });
  });

  describe('Display Name Validation', () => {
    it('should reject empty display names', async () => {
      const result = await registerWithEmail({
        email: 'test@example.com',
        password: 'Test1234',
        displayName: '',
      });

      expect(result.error).toBeDefined();
      expect(result.user).toBeNull();
    });

    it('should reject display names shorter than 2 characters', async () => {
      const result = await registerWithEmail({
        email: 'test@example.com',
        password: 'Test1234',
        displayName: 'A',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('2 characters');
      expect(result.user).toBeNull();
    });

    it('should accept valid display names', async () => {
      mockCreateUser.mockResolvedValueOnce({
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: null,
          emailVerified: false,
          photoURL: null,
          reload: jest.fn(),
        } as any,
      } as any);

      mockUpdateProfile.mockResolvedValueOnce(undefined);
      mockSendEmailVerification.mockResolvedValueOnce(undefined);

      const result = await registerWithEmail({
        email: 'test@example.com',
        password: 'Test1234',
        displayName: 'Test User',
      });

      expect(result.error).toBeNull();
      expect(result.user).toBeDefined();
    });
  });
});

describe('Auth Service - Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: false,
      photoURL: null,
      reload: jest.fn(),
    };

    mockCreateUser.mockResolvedValueOnce({
      user: mockUser as any,
    } as any);

    mockUpdateProfile.mockResolvedValueOnce(undefined);
    mockSendEmailVerification.mockResolvedValueOnce(undefined);

    const result = await registerWithEmail({
      email: 'test@example.com',
      password: 'Test1234',
      displayName: 'Test User',
    });

    expect(result.error).toBeNull();
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe('test@example.com');
    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'Test1234'
    );
    expect(mockUpdateProfile).toHaveBeenCalled();
    expect(mockSendEmailVerification).toHaveBeenCalled();
  });

  it('should handle email already in use error', async () => {
    mockCreateUser.mockRejectedValueOnce({
      code: 'auth/email-already-in-use',
      message: 'Email already in use',
    });

    const result = await registerWithEmail({
      email: 'existing@example.com',
      password: 'Test1234',
      displayName: 'Test User',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('already registered');
    expect(result.user).toBeNull();
  });

  it('should trim whitespace from inputs', async () => {
    mockCreateUser.mockResolvedValueOnce({
      user: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        emailVerified: false,
        photoURL: null,
        reload: jest.fn(),
      } as any,
    } as any);

    mockUpdateProfile.mockResolvedValueOnce(undefined);
    mockSendEmailVerification.mockResolvedValueOnce(undefined);

    await registerWithEmail({
      email: '  test@example.com  ',
      password: 'Test1234',
      displayName: '  Test User  ',
    });

    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'Test1234'
    );
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        displayName: 'Test User',
      })
    );
  });
});

describe('Auth Service - Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully log in a user', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      photoURL: null,
      reload: jest.fn(),
    };

    mockSignIn.mockResolvedValueOnce({
      user: mockUser as any,
    } as any);

    const result = await loginWithEmail({
      email: 'test@example.com',
      password: 'Test1234',
    });

    expect(result.error).toBeNull();
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe('test@example.com');
    expect(mockSignIn).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'Test1234'
    );
  });

  it('should handle wrong password error', async () => {
    mockSignIn.mockRejectedValueOnce({
      code: 'auth/wrong-password',
      message: 'Wrong password',
    });

    const result = await loginWithEmail({
      email: 'test@example.com',
      password: 'WrongPassword',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('Incorrect password');
    expect(result.user).toBeNull();
  });

  it('should handle user not found error', async () => {
    mockSignIn.mockRejectedValueOnce({
      code: 'auth/user-not-found',
      message: 'User not found',
    });

    const result = await loginWithEmail({
      email: 'nonexistent@example.com',
      password: 'Test1234',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('No account found');
    expect(result.user).toBeNull();
  });

  it('should validate email format on login', async () => {
    const result = await loginWithEmail({
      email: 'invalid-email',
      password: 'Test1234',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('valid email');
    expect(result.user).toBeNull();
  });

  it('should require both email and password', async () => {
    const result1 = await loginWithEmail({
      email: '',
      password: 'Test1234',
    });

    expect(result1.error).toBeDefined();
    expect(result1.user).toBeNull();

    const result2 = await loginWithEmail({
      email: 'test@example.com',
      password: '',
    });

    expect(result2.error).toBeDefined();
    expect(result2.user).toBeNull();
  });
});

describe('Auth Service - Logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully sign out user', async () => {
    mockSignOut.mockResolvedValueOnce(undefined);

    const result = await logout();

    expect(result.error).toBeNull();
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should handle sign out errors', async () => {
    mockSignOut.mockRejectedValueOnce({
      code: 'auth/network-request-failed',
      message: 'Network error',
    });

    const result = await logout();

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('Network error');
  });
});

describe('Auth Service - Password Reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send password reset email', async () => {
    mockSendPasswordReset.mockResolvedValueOnce(undefined);

    const result = await sendPasswordReset('test@example.com');

    expect(result.error).toBeNull();
    expect(mockSendPasswordReset).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com'
    );
  });

  it('should validate email before sending reset', async () => {
    const result = await sendPasswordReset('invalid-email');

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('valid email');
    expect(mockSendPasswordReset).not.toHaveBeenCalled();
  });

  it('should require email address', async () => {
    const result = await sendPasswordReset('');

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('required');
    expect(mockSendPasswordReset).not.toHaveBeenCalled();
  });
});

describe('Auth Service - Profile Updates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update user profile', async () => {
    const mockAuth = require('@/config/firebase.config').getFirebaseAuth;
    mockAuth.mockReturnValueOnce({
      currentUser: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Old Name',
        emailVerified: true,
        photoURL: null,
        reload: jest.fn(),
      },
    });

    mockUpdateProfile.mockResolvedValueOnce(undefined);

    const result = await updateUserProfile({
      displayName: 'New Name',
    });

    expect(result.error).toBeNull();
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        displayName: 'New Name',
      })
    );
  });

  it('should validate display name length', async () => {
    const mockAuth = require('@/config/firebase.config').getFirebaseAuth;
    mockAuth.mockReturnValueOnce({
      currentUser: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test',
        emailVerified: true,
        photoURL: null,
        reload: jest.fn(),
      },
    });

    const result = await updateUserProfile({
      displayName: 'A',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('2 characters');
  });
});

describe('Auth Service - Error Handling', () => {
  it('should handle network errors', async () => {
    mockSignIn.mockRejectedValueOnce({
      code: 'auth/network-request-failed',
      message: 'Network error',
    });

    const result = await loginWithEmail({
      email: 'test@example.com',
      password: 'Test1234',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('Network error');
  });

  it('should handle too many requests error', async () => {
    mockSignIn.mockRejectedValueOnce({
      code: 'auth/too-many-requests',
      message: 'Too many requests',
    });

    const result = await loginWithEmail({
      email: 'test@example.com',
      password: 'Test1234',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('Too many failed attempts');
  });

  it('should provide generic message for unknown errors', async () => {
    mockSignIn.mockRejectedValueOnce({
      code: 'unknown-error',
      message: 'Some unknown error',
    });

    const result = await loginWithEmail({
      email: 'test@example.com',
      password: 'Test1234',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBeDefined();
  });
});
