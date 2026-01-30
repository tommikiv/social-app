import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../src/config/firebaseConfig'; // Ensure this path is correct

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (initializing) return;

    // Check if current screen is in the auth group
    const inAuthGroup = segments[0] === 'login';

    // Redirect logic
    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect to feed if authenticated but trying to access login
      router.replace('/');
    }
  }, [user, segments, initializing]);

  // Show loading indicator while checking auth state
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Render the stack based on auth state
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Feed' }} />
      <Stack.Screen name="login" options={{ title: 'Sign In', headerShown: false }} />
      <Stack.Screen name="create" options={{ title: 'New Post', presentation: 'modal' }} />
    </Stack>
  );
}