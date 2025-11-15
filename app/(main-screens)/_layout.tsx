import { AppBar } from '@/components/dashboard/AppBar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { authApi } from '@/api/auth';
import tokenStorage from '@/api/tokenStorage';
import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function MainScreensLayout() {
  const router = useRouter();
  const { colors } = useTheme();
  const { syncUser, clearUser } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [checkingAuth, setCheckingAuth] = useState(true);
  const isLargeScreen = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const verifyToken = async () => {
      try {
        const response = await authApi.verify();
        if (!isMounted) return;
        syncUser(response.user);
      } catch (error) {
        await tokenStorage.clear();
        clearUser();
        if (!isMounted) return;
        Toast.show({
          type: 'error',
          text1: 'Session expired',
          text2: 'Please sign in again.',
        });
        router.replace('/signin');
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    };

    verifyToken();
    return () => {
      isMounted = false;
    };
  }, [router, syncUser, clearUser]);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (checkingAuth) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <AppBar onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {isLargeScreen && (
          <Sidebar
            isOpen={true}
            onClose={() => setSidebarOpen(false)}
            onNavigate={handleNavigate}
          />
        )}
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </View>
      {!isLargeScreen && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNavigate={handleNavigate}
        />
      )}
    </SafeAreaView>
  );
}

