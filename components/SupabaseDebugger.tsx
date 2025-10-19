
// components/SupabaseDebugger.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { supabase } from '@/integrations/supabase/client';
import { colors } from '@/styles/commonStyles';

export function SupabaseDebugger() {
  const [status, setStatus] = useState<{
    connected: boolean;
    authenticated: boolean;
    userEmail: string | null;
    error: string | null;
  }>({
    connected: false,
    authenticated: false,
    userEmail: null,
    error: null,
  });

  const checkStatus = async () => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        setStatus({
          connected: false,
          authenticated: false,
          userEmail: null,
          error: 'Supabase credentials not configured',
        });
        return;
      }

      // Check authentication
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        setStatus({
          connected: true,
          authenticated: false,
          userEmail: null,
          error: error.message,
        });
        return;
      }

      setStatus({
        connected: true,
        authenticated: !!session,
        userEmail: session?.user?.email || null,
        error: null,
      });
    } catch (err: any) {
      setStatus({
        connected: false,
        authenticated: false,
        userEmail: null,
        error: err.message || 'Unknown error',
      });
    }
  };

  const signInTestUser = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123',
      });

      if (error) {
        console.error('Sign in error:', error);
        alert(`Sign in failed: ${error.message}`);
      } else {
        console.log('Signed in successfully:', data.user?.email);
        alert('Signed in successfully!');
        checkStatus();
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      alert(`Sign in failed: ${err.message}`);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      alert('Signed out successfully!');
      checkStatus();
    } catch (err: any) {
      console.error('Sign out error:', err);
      alert(`Sign out failed: ${err.message}`);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Status</Text>
      
      <View style={styles.statusContainer}>
        <StatusItem 
          label="Connected" 
          value={status.connected} 
          error={!status.connected ? status.error : null}
        />
        <StatusItem 
          label="Authenticated" 
          value={status.authenticated}
        />
        {status.userEmail && (
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>User:</Text>
            <Text style={styles.statusValue}>{status.userEmail}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.button} 
          onPress={checkStatus}
        >
          <Text style={styles.buttonText}>Refresh Status</Text>
        </Pressable>

        {!status.authenticated && (
          <Pressable 
            style={[styles.button, styles.primaryButton]} 
            onPress={signInTestUser}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Sign In Test User
            </Text>
          </Pressable>
        )}

        {status.authenticated && (
          <Pressable 
            style={[styles.button, styles.dangerButton]} 
            onPress={signOut}
          >
            <Text style={[styles.buttonText, styles.dangerButtonText]}>
              Sign Out
            </Text>
          </Pressable>
        )}
      </View>

      {status.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{status.error}</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Setup Instructions:</Text>
        <Text style={styles.infoText}>
          1. Create a Supabase project{'\n'}
          2. Add credentials to .env file{'\n'}
          3. Create test user in Supabase dashboard{'\n'}
          4. Deploy edge function{'\n'}
          5. Set GEMINI_API_KEY in Supabase
        </Text>
      </View>
    </View>
  );
}

function StatusItem({ 
  label, 
  value, 
  error 
}: { 
  label: string; 
  value: boolean; 
  error?: string | null;
}) {
  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusLabel}>{label}:</Text>
      <View style={[
        styles.statusIndicator,
        value ? styles.statusSuccess : styles.statusError
      ]}>
        <Text style={styles.statusIndicatorText}>
          {value ? '✓' : '✗'}
        </Text>
      </View>
      {error && <Text style={styles.errorTextSmall}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  statusValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: '#34C759',
  },
  statusError: {
    backgroundColor: '#FF3B30',
  },
  statusIndicatorText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  primaryButtonText: {
    color: 'white',
  },
  dangerButtonText: {
    color: 'white',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  errorTextSmall: {
    color: '#FF3B30',
    fontSize: 12,
  },
  infoContainer: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
