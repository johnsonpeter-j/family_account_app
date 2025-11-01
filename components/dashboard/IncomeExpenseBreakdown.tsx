import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const incomeData: CategoryData[] = [
  { category: 'Salary', amount: 8000, percentage: 64, color: '#10B981', icon: 'briefcase' },
  { category: 'Freelance', amount: 3000, percentage: 24, color: '#3B82F6', icon: 'laptop' },
  { category: 'Investment', amount: 1450, percentage: 12, color: '#8B5CF6', icon: 'trending-up' },
];

const expenseData: CategoryData[] = [
  { category: 'Food', amount: 2500, percentage: 30, color: '#EF4444', icon: 'restaurant' },
  { category: 'Transport', amount: 1500, percentage: 18, color: '#F59E0B', icon: 'car' },
  { category: 'Utilities', amount: 800, percentage: 10, color: '#06B6D4', icon: 'flash' },
  { category: 'Shopping', amount: 3430, percentage: 42, color: '#EC4899', icon: 'bag' },
];

export function IncomeExpenseBreakdown() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Income Breakdown */}
        <View style={[styles.breakdownCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="arrow-up-circle" size={24} color="#10B981" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Income Breakdown</Text>
          </View>
          <View style={styles.list}>
            {incomeData.map((item, index) => (
              <View key={item.category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
                      <Ionicons name={item.icon} size={18} color={item.color} />
                    </View>
                    <View>
                      <Text style={[styles.categoryName, { color: colors.text }]}>{item.category}</Text>
                      <Text style={[styles.categoryPercent, { color: colors.textSecondary }]}>
                        {item.percentage}%
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.categoryAmount, { color: colors.text }]}>
                    ${item.amount.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${item.percentage}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Expense Breakdown */}
        <View style={[styles.breakdownCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: '#EF444420' }]}>
              <Ionicons name="arrow-down-circle" size={24} color="#EF4444" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Expense Breakdown</Text>
          </View>
          <View style={styles.list}>
            {expenseData.map((item, index) => (
              <View key={item.category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
                      <Ionicons name={item.icon} size={18} color={item.color} />
                    </View>
                    <View>
                      <Text style={[styles.categoryName, { color: colors.text }]}>{item.category}</Text>
                      <Text style={[styles.categoryPercent, { color: colors.textSecondary }]}>
                        {item.percentage}%
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.categoryAmount, { color: colors.text }]}>
                    ${item.amount.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${item.percentage}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  breakdownCard: {
    flex: 1,
    minWidth: 300,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
  },
  list: {
    gap: spacing.md,
  },
  categoryItem: {
    gap: spacing.xs,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter_500Medium',
  },
  categoryPercent: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  categoryAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter_600SemiBold',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});

