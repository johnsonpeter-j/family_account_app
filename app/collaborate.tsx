import { AppBar } from '@/components/dashboard/AppBar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Collaborate() {
  const { colors } = useTheme();
  const router = useRouter();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppBar onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
      <View style={styles.contentContainer}>
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
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>Collaborate</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Collaborate with family members coming soon...
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});

