/**
 * Authentication Service Types
 *
 * Type definitions for the authentication service
 */

import { User } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: AuthError | null;
}

/**
 * Convert Firebase User to AuthUser
 */
export function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL,
  };
}
