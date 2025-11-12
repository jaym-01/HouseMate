/**
 * Auth Types Unit Tests
 *
 * Tests type conversion and validation utilities
 */

import { toAuthUser } from '../auth.types';

describe('Auth Types - toAuthUser', () => {
  it('should convert Firebase User to AuthUser', () => {
    const firebaseUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      photoURL: 'https://example.com/photo.jpg',
      // Other Firebase User properties (ignored in conversion)
      metadata: {},
      providerData: [],
      refreshToken: 'token',
      tenantId: null,
      delete: jest.fn(),
      getIdToken: jest.fn(),
      getIdTokenResult: jest.fn(),
      reload: jest.fn(),
      toJSON: jest.fn(),
      isAnonymous: false,
      phoneNumber: null,
      providerId: 'firebase',
    } as any;

    const authUser = toAuthUser(firebaseUser);

    expect(authUser).toEqual({
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      photoURL: 'https://example.com/photo.jpg',
    });
  });

  it('should handle null Firebase User', () => {
    const authUser = toAuthUser(null);

    expect(authUser).toBeNull();
  });

  it('should handle user with null email', () => {
    const firebaseUser = {
      uid: 'test-uid',
      email: null,
      displayName: 'Test User',
      emailVerified: false,
      photoURL: null,
      reload: jest.fn(),
    } as any;

    const authUser = toAuthUser(firebaseUser);

    expect(authUser).toEqual({
      uid: 'test-uid',
      email: null,
      displayName: 'Test User',
      emailVerified: false,
      photoURL: null,
    });
  });

  it('should handle user with null display name', () => {
    const firebaseUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: null,
      emailVerified: true,
      photoURL: null,
      reload: jest.fn(),
    } as any;

    const authUser = toAuthUser(firebaseUser);

    expect(authUser).toEqual({
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: null,
      emailVerified: true,
      photoURL: null,
    });
  });

  it('should only include AuthUser properties', () => {
    const firebaseUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      photoURL: null,
      // Extra properties that should not be included
      refreshToken: 'secret-token',
      accessToken: 'access-token',
      metadata: { creationTime: '2024-01-01' },
      reload: jest.fn(),
    } as any;

    const authUser = toAuthUser(firebaseUser);

    expect(authUser).toEqual({
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      photoURL: null,
    });

    // Ensure no extra properties
    expect(Object.keys(authUser!)).toHaveLength(5);
  });
});
