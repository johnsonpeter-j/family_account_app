import { AppBar } from '@/components/dashboard/AppBar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function Transactions() {
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
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Transactions</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Transaction management coming soon...
          </Text>
        </View>
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
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});

