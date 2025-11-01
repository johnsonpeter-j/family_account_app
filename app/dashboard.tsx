import { AppBar } from '@/components/dashboard/AppBar';
import { BudgetBreakdown } from '@/components/dashboard/BudgetBreakdown';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { IncomeExpenseBreakdown } from '@/components/dashboard/IncomeExpenseBreakdown';
import { LendBorrowBreakdown } from '@/components/dashboard/LendBorrowBreakdown';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function Dashboard() {
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
        <ScrollView
          style={[
            styles.scrollView,
            { backgroundColor: colors.background },
            isLargeScreen && { marginLeft: 0 },
          ]}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <DashboardCards />
            <IncomeExpenseBreakdown />
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <BudgetBreakdown />
              </View>
              <View style={styles.halfWidth}>
                <LendBorrowBreakdown />
              </View>
            </View>
            <RecentTransactions />
            <QuickActions />
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
  scrollContent: {
    padding: spacing.md,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  halfWidth: {
    flex: 1,
    minWidth: 300,
  },
});

