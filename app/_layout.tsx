import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <UserProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth-screens)" options={{ headerShown: false }} />
          <Stack.Screen name="(main-screens)" options={{ headerShown: false }} />
        </Stack>
        <Toast
          position="top"
          topOffset={60}
          config={{
            success: (props) => (
              <BaseToast
                {...props}
                style={{
                  alignSelf: 'flex-end',
                  marginRight: 16,
                  borderLeftColor: '#22c55e',
                }}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                text1Style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: '#111827',
                }}
                text2Style={{
                  fontSize: 15,
                  color: '#374151',
                }}
              />
            ),
            error: (props) => (
              <ErrorToast
                {...props}
                style={{
                  alignSelf: 'flex-end',
                  marginRight: 16,
                  borderLeftColor: '#ef4444',
                }}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                text1Style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: '#111827',
                }}
                text2Style={{
                  fontSize: 15,
                  color: '#4b5563',
                }}
              />
            ),
          }}
        />
      </UserProvider>
    </ThemeProvider>
  );
}
