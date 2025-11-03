# Authentication Service Documentation

## Overview

The authentication service provides a complete, secure implementation of Firebase Authentication for HouseMate. It handles user registration, login, password management, and profile updates with comprehensive validation and error handling.

## Files

### 1. `services/auth.types.ts`

Type definitions for authentication:

- `AuthUser`: Sanitized user object (doesn't expose sensitive Firebase internals)
- `RegisterCredentials`: Required data for registration
- `LoginCredentials`: Required data for login
- `AuthError`: Standardized error format
- `AuthResult`: Result type for operations returning user data

### 2. `services/auth.service.ts`

Core authentication operations service. All functions are async and return consistent result types.

#### Registration

```typescript
registerWithEmail(credentials: RegisterCredentials): Promise<AuthResult>
```

- Creates new user account with email/password
- Validates email format, password strength, and display name
- Automatically sends email verification
- **Password requirements**: Min 8 chars, 1 uppercase, 1 lowercase, 1 number

**Example**:

```typescript
const result = await registerWithEmail({
  email: 'user@example.com',
  password: 'SecurePass123',
  displayName: 'John Doe',
});

if (result.error) {
  // Handle error
  console.error(result.error.message);
} else {
  // Success! User is created and verification email sent
  console.log('Registered:', result.user);
}
```

#### Login

```typescript
loginWithEmail(credentials: LoginCredentials): Promise<AuthResult>
```

- Authenticates user with email/password
- Validates input format
- Returns user data on success

**Example**:

```typescript
const result = await loginWithEmail({
  email: 'user@example.com',
  password: 'SecurePass123',
});

if (result.error) {
  // Handle error (wrong password, user not found, etc.)
  alert(result.error.message);
} else {
  // User is logged in
  console.log('Logged in:', result.user);
}
```

#### Logout

```typescript
logout(): Promise<{ error: AuthError | null }>
```

- Signs out current user
- Clears authentication state

**Example**:

```typescript
const { error } = await logout();
if (error) {
  console.error('Logout failed:', error.message);
}
```

#### Password Reset

```typescript
sendPasswordReset(email: string): Promise<{ error: AuthError | null }>
```

- Sends password reset email to specified address
- Validates email format

**Example**:

```typescript
const { error } = await sendPasswordReset('user@example.com');
if (!error) {
  alert('Password reset email sent! Check your inbox.');
}
```

#### Email Verification

```typescript
resendEmailVerification(): Promise<{ error: AuthError | null }>
```

- Resends verification email to current user
- Only works if user is not already verified

**Example**:

```typescript
const { error } = await resendEmailVerification();
if (!error) {
  alert('Verification email sent!');
}
```

#### Profile Management

```typescript
updateUserProfile(updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<AuthResult>
```

- Updates user display name and/or photo URL
- Validates display name length (min 2 chars)

**Example**:

```typescript
const result = await updateUserProfile({
  displayName: 'Jane Doe',
  photoURL: 'https://example.com/photo.jpg',
});

if (!result.error) {
  console.log('Profile updated:', result.user);
}
```

#### Email Update

```typescript
updateUserEmail(newEmail: string): Promise<AuthResult>
```

- Changes user's email address
- **Requires recent authentication** (may need to reauthenticate first)
- Sends verification email to new address

**Example**:

```typescript
const result = await updateUserEmail('newemail@example.com');
if (result.error?.code === 'auth/requires-recent-login') {
  // User needs to log in again
  // Prompt for password and call reauthenticateUser()
}
```

#### Password Update

```typescript
updateUserPassword(newPassword: string): Promise<{ error: AuthError | null }>
```

- Changes user's password
- **Requires recent authentication**
- Validates new password strength

**Example**:

```typescript
// First reauthenticate
await reauthenticateUser(currentPassword);

// Then update password
const { error } = await updateUserPassword('NewSecurePass456');
```

#### Reauthentication

```typescript
reauthenticateUser(currentPassword: string): Promise<{ error: AuthError | null }>
```

- Confirms user identity with current password
- Required before sensitive operations (email/password change)

**Example**:

```typescript
const { error } = await reauthenticateUser('CurrentPass123');
if (error) {
  alert('Incorrect password');
} else {
  // Can now update email or password
}
```

#### Utility Functions

```typescript
getCurrentUser(): AuthUser | null
isAuthenticated(): boolean
reloadUser(): Promise<AuthResult>
```

- `getCurrentUser()`: Get current user without triggering state updates
- `isAuthenticated()`: Quick check if user is logged in
- `reloadUser()`: Refresh user data from server (useful for checking email verification status)

### 3. `hooks/useAuth.ts`

React hook for authentication state management.

**Returns**:

```typescript
{
  user: AuthUser | null; // Current user data
  loading: boolean; // Loading state during initialization
  error: Error | null; // Error if auth listener failed
  isAuthenticated: boolean; // Convenience: user !== null
  isEmailVerified: boolean; // Convenience: user?.emailVerified
}
```

**Example**:

```typescript
function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Text>Loading...</Text>;

  if (!isAuthenticated) {
    return <Text>Please log in</Text>;
  }

  return <Text>Welcome, {user?.displayName}!</Text>;
}
```

## Security Features

### Input Validation

✅ **Implemented**:

- Email format validation (regex)
- Password strength requirements enforced
- Display name length validation
- All inputs sanitized before Firebase operations

### Error Handling

✅ **Implemented**:

- All Firebase errors caught and converted to user-friendly messages
- No sensitive information leaked in error messages
- Consistent error format across all operations

### Password Requirements

✅ **Enforced**:

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### Email Verification

✅ **Implemented**:

- Automatic verification email on registration
- Resend verification option
- Email verification check available via `user.emailVerified`

### Reauthentication

✅ **Implemented**:

- Required for sensitive operations (email/password change)
- Prevents unauthorized account modifications

## Common Patterns

### Protected Operations Pattern

For operations requiring recent login:

```typescript
async function changeEmail(newEmail: string, currentPassword: string) {
  // Step 1: Reauthenticate
  const reauth = await reauthenticateUser(currentPassword);
  if (reauth.error) {
    return { error: reauth.error };
  }

  // Step 2: Perform sensitive operation
  const result = await updateUserEmail(newEmail);
  return result;
}
```

### Email Verification Check Pattern

```typescript
function RequireVerifiedEmail({ children }) {
  const { user } = useAuth();

  if (!user?.emailVerified) {
    return (
      <View>
        <Text>Please verify your email</Text>
        <Button onPress={async () => {
          const { error } = await resendEmailVerification();
          if (!error) alert('Verification email sent!');
        }}>
          Resend Verification Email
        </Button>
      </View>
    );
  }

  return children;
}
```

### Loading State Pattern

```typescript
function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await loginWithEmail({ email, password });
    setIsLoading(false);

    if (result.error) {
      alert(result.error.message);
    }
    // On success, useAuth() will automatically update and navigate
  };

  return (
    <Button disabled={isLoading} onPress={handleLogin}>
      {isLoading ? 'Logging in...' : 'Login'}
    </Button>
  );
}
```

## Error Codes

Common Firebase Auth error codes handled:

| Code                          | User-Friendly Message                            |
| ----------------------------- | ------------------------------------------------ |
| `auth/email-already-in-use`   | This email is already registered                 |
| `auth/invalid-email`          | Invalid email address                            |
| `auth/weak-password`          | Password is too weak                             |
| `auth/user-not-found`         | No account found with this email                 |
| `auth/wrong-password`         | Incorrect password                               |
| `auth/too-many-requests`      | Too many failed attempts. Please try again later |
| `auth/network-request-failed` | Network error. Please check your connection      |
| `auth/requires-recent-login`  | Please log in again to complete this action      |

## Testing with Emulators

The auth service automatically connects to Firebase Auth Emulator when `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true`.

**To test**:

1. Start emulators: `cd backend && firebase emulators:start`
2. Access Auth Emulator UI: http://localhost:9101
3. Register test users in the app
4. View users in emulator UI
5. Test auth flows (login, logout, password reset, etc.)

**Note**: Emulator does not actually send emails. Email verification and password reset links are shown in the emulator UI console.

## Next Steps

With auth service complete, we can now:

1. ✅ Build user registration UI (Task 1.3)
2. ✅ Build login UI (Task 1.4)
3. Implement protected routes
4. Create user profile management screens
5. Set up Firestore user documents on registration

## TODOs (Future Enhancements)

- [ ] Add biometric authentication (fingerprint/face ID)
- [ ] Implement social auth (Google, Apple)
- [ ] Add 2FA support
- [ ] Rate limiting for auth attempts (Phase 8)
- [ ] Comprehensive testing suite (Phase 8)
