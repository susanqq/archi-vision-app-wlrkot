
# Authentication Setup Guide

The Interior Design AI feature requires user authentication to work. Here's how to set it up.

## Quick Setup (Development)

For development and testing, you can use Supabase's built-in authentication without any UI.

### Option 1: Test User (Recommended for Development)

1. **Create a Test User in Supabase Dashboard**
   - Go to Authentication > Users
   - Click "Add user"
   - Enter email: `test@example.com`
   - Enter password: `testpassword123`
   - Click "Create user"

2. **Sign In Programmatically**
   Add this to your app for testing:
   ```typescript
   import { supabase } from '@/integrations/supabase/client';

   // Add this to your app initialization or a test button
   const signInTestUser = async () => {
     const { data, error } = await supabase.auth.signInWithPassword({
       email: 'test@example.com',
       password: 'testpassword123',
     });

     if (error) {
       console.error('Sign in error:', error);
     } else {
       console.log('Signed in successfully:', data.user?.email);
     }
   };
   ```

### Option 2: Anonymous Authentication

For quick testing without user accounts:

1. **Enable Anonymous Sign-ins in Supabase**
   - Go to Authentication > Settings
   - Enable "Anonymous sign-ins"

2. **Sign In Anonymously**
   ```typescript
   const signInAnonymously = async () => {
     const { data, error } = await supabase.auth.signInAnonymously();
     if (error) {
       console.error('Anonymous sign in error:', error);
     } else {
       console.log('Signed in anonymously');
     }
   };
   ```

## Production Setup

For production, implement a proper authentication flow:

### 1. Create Authentication Screens

Create sign-up and sign-in screens in your app:

```typescript
// app/auth/sign-in.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)/(home)');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Signing in...' : 'Sign In'}
        onPress={handleSignIn}
        disabled={loading}
      />
    </View>
  );
}
```

### 2. Add Authentication Context

Create a context to manage auth state:

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 3. Protect Routes

Add authentication checks to your screens:

```typescript
// app/interior-design.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function InteriorDesignScreen() {
  const { session, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href="/auth/sign-in" />;
  }

  // Rest of your component...
}
```

### 4. Update App Layout

Wrap your app with the AuthProvider:

```typescript
// app/_layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Your existing layout */}
    </AuthProvider>
  );
}
```

## Authentication Methods

Supabase supports multiple authentication methods:

### Email/Password (Default)
Already configured in the examples above.

### Magic Link (Passwordless)
```typescript
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
});
```

### Social OAuth (Google, Apple, etc.)
```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
});
```

### Phone/SMS
```typescript
const { error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890',
});
```

## Testing Authentication

1. **Check Current Session**
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Current session:', session);
   ```

2. **Get Current User**
   ```typescript
   const { data: { user } } = await supabase.auth.getUser();
   console.log('Current user:', user);
   ```

3. **Sign Out**
   ```typescript
   await supabase.auth.signOut();
   ```

## Troubleshooting

### "Unauthorized" Error
- Check if user is signed in: `supabase.auth.getSession()`
- Verify Supabase credentials in `.env`
- Check if email confirmation is required (disable for testing)

### Session Not Persisting
- Ensure `@react-native-async-storage/async-storage` is installed
- Check that AsyncStorage is configured in the Supabase client

### Email Confirmation Required
For development, disable email confirmation:
- Go to Authentication > Settings
- Disable "Enable email confirmations"

## Security Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Secure Storage**: Use secure storage for tokens
3. **Token Refresh**: Supabase handles token refresh automatically
4. **Row Level Security**: Enable RLS on database tables
5. **Rate Limiting**: Implement rate limiting for auth endpoints
6. **Password Policy**: Enforce strong passwords
7. **MFA**: Consider enabling multi-factor authentication

## Next Steps

- Implement password reset functionality
- Add email verification
- Set up social authentication
- Implement user profile management
- Add role-based access control

---

For more information, see:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Setup Instructions](SETUP_INSTRUCTIONS.md)
- [API Reference](API_REFERENCE.md)
