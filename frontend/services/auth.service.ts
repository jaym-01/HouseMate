/**
 * Authentication Service
 *
 * This service encapsulates all Firebase Authentication operations.
 * It provides a clean API for user authentication, registration, and management.
 *
 * Security considerations:
 * - All operations validate inputs before calling Firebase
 * - Errors are properly handled and sanitized
 * - Password requirements enforced (min 8 chars, complexity)
 * - Email verification required for sensitive operations
 */

import { getFirebaseAuth } from '@/config/firebase.config';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import type {
  AuthError,
  AuthResult,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from './auth.types';
import { toAuthUser } from './auth.types';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements: minimum 8 characters, at least one uppercase, one lowercase, one number
 */
function isValidPassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
    };
  }

  return { valid: true };
}

/**
 * Convert Firebase Auth error to user-friendly message
 */
function getAuthErrorMessage(error: unknown): AuthError {
  const err = error as { code?: string; message?: string };
  const code = err.code || 'unknown';
  let message = 'An unexpected error occurred';

  switch (code) {
    case 'auth/email-already-in-use':
      message = 'This email is already registered';
      break;
    case 'auth/invalid-email':
      message = 'Invalid email address';
      break;
    case 'auth/operation-not-allowed':
      message = 'Email/password accounts are not enabled';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak';
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password';
      break;
    case 'auth/too-many-requests':
      message = 'Too many failed attempts. Please try again later';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your connection';
      break;
    case 'auth/requires-recent-login':
      message = 'Please log in again to complete this action';
      break;
    default:
      message = err.message || message;
  }

  return { code, message };
}

/**
 * Register a new user with email and password
 *
 * @param credentials - User registration information
 * @returns Promise with user data or error
 */
export async function registerWithEmail(
  credentials: RegisterCredentials
): Promise<AuthResult> {
  try {
    // Validate inputs
    if (
      !credentials.email ||
      !credentials.password ||
      !credentials.displayName
    ) {
      return {
        user: null,
        error: { code: 'invalid-input', message: 'All fields are required' },
      };
    }

    if (!isValidEmail(credentials.email)) {
      return {
        user: null,
        error: {
          code: 'invalid-email',
          message: 'Please enter a valid email address',
        },
      };
    }

    const passwordValidation = isValidPassword(credentials.password);
    if (!passwordValidation.valid) {
      return {
        user: null,
        error: {
          code: 'invalid-password',
          message: passwordValidation.message || 'Invalid password',
        },
      };
    }

    if (credentials.displayName.trim().length < 2) {
      return {
        user: null,
        error: {
          code: 'invalid-name',
          message: 'Name must be at least 2 characters',
        },
      };
    }

    // Create user account
    const auth = getFirebaseAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // Update display name
    await updateProfile(userCredential.user, {
      displayName: credentials.displayName.trim(),
    });

    // Send email verification
    await sendEmailVerification(userCredential.user);

    return {
      user: toAuthUser(userCredential.user),
      error: null,
    };
  } catch (error: unknown) {
    return {
      user: null,
      error: getAuthErrorMessage(error),
    };
  }
}

/**
 * Sign in with email and password
 *
 * @param credentials - Login credentials
 * @returns Promise with user data or error
 */
export async function loginWithEmail(
  credentials: LoginCredentials
): Promise<AuthResult> {
  try {
    // Validate inputs
    if (!credentials.email || !credentials.password) {
      return {
        user: null,
        error: {
          code: 'invalid-input',
          message: 'Email and password are required',
        },
      };
    }

    if (!isValidEmail(credentials.email)) {
      return {
        user: null,
        error: {
          code: 'invalid-email',
          message: 'Please enter a valid email address',
        },
      };
    }

    const auth = getFirebaseAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    return {
      user: toAuthUser(userCredential.user),
      error: null,
    };
  } catch (error: unknown) {
    return {
      user: null,
      error: getAuthErrorMessage(error),
    };
  }
}

/**
 * Sign out current user
 *
 * @returns Promise that resolves when sign out is complete
 */
export async function logout(): Promise<{ error: AuthError | null }> {
  try {
    const auth = getFirebaseAuth();
    await signOut(auth);
    return { error: null };
  } catch (error: unknown) {
    return { error: getAuthErrorMessage(error) };
  }
}

/**
 * Send password reset email
 *
 * @param email - User's email address
 * @returns Promise that resolves when email is sent
 */
export async function sendPasswordReset(
  email: string
): Promise<{ error: AuthError | null }> {
  try {
    if (!email) {
      return {
        error: { code: 'invalid-input', message: 'Email is required' },
      };
    }

    if (!isValidEmail(email)) {
      return {
        error: {
          code: 'invalid-email',
          message: 'Please enter a valid email address',
        },
      };
    }

    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: unknown) {
    return { error: getAuthErrorMessage(error) };
  }
}

/**
 * Resend email verification to current user
 *
 * @returns Promise that resolves when email is sent
 */
export async function resendEmailVerification(): Promise<{
  error: AuthError | null;
}> {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      return {
        error: { code: 'no-user', message: 'No user is currently signed in' },
      };
    }

    if (user.emailVerified) {
      return {
        error: {
          code: 'already-verified',
          message: 'Email is already verified',
        },
      };
    }

    await sendEmailVerification(user);
    return { error: null };
  } catch (error: unknown) {
    return { error: getAuthErrorMessage(error) };
  }
}

/**
 * Update user profile (display name and photo URL)
 *
 * @param updates - Profile updates
 * @returns Promise with updated user or error
 */
export async function updateUserProfile(updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      return {
        user: null,
        error: { code: 'no-user', message: 'No user is currently signed in' },
      };
    }

    if (updates.displayName && updates.displayName.trim().length < 2) {
      return {
        user: null,
        error: {
          code: 'invalid-name',
          message: 'Name must be at least 2 characters',
        },
      };
    }

    await updateProfile(user, {
      displayName: updates.displayName?.trim(),
      photoURL: updates.photoURL,
    });

    return {
      user: toAuthUser(user),
      error: null,
    };
  } catch (error: unknown) {
    return {
      user: null,
      error: getAuthErrorMessage(error),
    };
  }
}

/**
 * Update user email address
 * Requires recent authentication
 *
 * @param newEmail - New email address
 * @returns Promise with updated user or error
 */
export async function updateUserEmail(newEmail: string): Promise<AuthResult> {
  try {
    if (!isValidEmail(newEmail)) {
      return {
        user: null,
        error: {
          code: 'invalid-email',
          message: 'Please enter a valid email address',
        },
      };
    }

    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      return {
        user: null,
        error: { code: 'no-user', message: 'No user is currently signed in' },
      };
    }

    await updateEmail(user, newEmail);

    // Send verification email to new address
    await sendEmailVerification(user);

    return {
      user: toAuthUser(user),
      error: null,
    };
  } catch (error: unknown) {
    return {
      user: null,
      error: getAuthErrorMessage(error),
    };
  }
}

/**
 * Update user password
 * Requires recent authentication
 *
 * @param newPassword - New password
 * @returns Promise that resolves when password is updated
 */
export async function updateUserPassword(
  newPassword: string
): Promise<{ error: AuthError | null }> {
  try {
    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      return {
        error: {
          code: 'invalid-password',
          message: passwordValidation.message || 'Invalid password',
        },
      };
    }

    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      return {
        error: { code: 'no-user', message: 'No user is currently signed in' },
      };
    }

    await updatePassword(user, newPassword);
    return { error: null };
  } catch (error: unknown) {
    return { error: getAuthErrorMessage(error) };
  }
}

/**
 * Reauthenticate user with current password
 * Required before sensitive operations like email/password change
 *
 * @param currentPassword - User's current password
 * @returns Promise that resolves when reauthentication is complete
 */
export async function reauthenticateUser(
  currentPassword: string
): Promise<{ error: AuthError | null }> {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      return {
        error: { code: 'no-user', message: 'No user is currently signed in' },
      };
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    return { error: null };
  } catch (error: unknown) {
    return { error: getAuthErrorMessage(error) };
  }
}

/**
 * Get current authenticated user
 *
 * @returns Current user or null
 */
export function getCurrentUser(): AuthUser | null {
  const auth = getFirebaseAuth();
  return toAuthUser(auth.currentUser);
}

/**
 * Check if user is authenticated
 *
 * @returns True if user is signed in
 */
export function isAuthenticated(): boolean {
  const auth = getFirebaseAuth();
  return auth.currentUser !== null;
}

/**
 * Reload current user data from server
 * Useful for checking email verification status
 *
 * @returns Promise with updated user or error
 */
export async function reloadUser(): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      return {
        user: null,
        error: { code: 'no-user', message: 'No user is currently signed in' },
      };
    }

    await user.reload();

    return {
      user: toAuthUser(auth.currentUser),
      error: null,
    };
  } catch (error: unknown) {
    return {
      user: null,
      error: getAuthErrorMessage(error),
    };
  }
}
