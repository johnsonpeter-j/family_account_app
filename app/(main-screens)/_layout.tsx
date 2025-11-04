import { AppBar } from '@/components/dashboard/AppBar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';

export default function MainScreensLayout() {
  const router = useRouter();
  const { colors } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isLargeScreen = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {isLargeScreen && (
          <Sidebar
            isOpen={true}
            onClose={() => setSidebarOpen(false)}
            onNavigate={handleNavigate}
          />
        )}
        {!isLargeScreen && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onNavigate={handleNavigate}
          />
        )}
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

