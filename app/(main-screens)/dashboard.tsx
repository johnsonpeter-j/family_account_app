import { BudgetBreakdown } from '@/components/dashboard/BudgetBreakdown';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { IncomeExpenseBreakdown } from '@/components/dashboard/IncomeExpenseBreakdown';
import { LendBorrowBreakdown } from '@/components/dashboard/LendBorrowBreakdown';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Dashboard() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
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
  );
}

const styles = StyleSheet.create({
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



