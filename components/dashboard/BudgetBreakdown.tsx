import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface BudgetData {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const budgetData: BudgetData[] = [
  { category: 'Food', budget: 3000, spent: 2500, remaining: 500, percentage: 83, icon: 'restaurant', color: '#EF4444' },
  { category: 'Transport', budget: 2000, spent: 1500, remaining: 500, percentage: 75, icon: 'car', color: '#F59E0B' },
  { category: 'Utilities', budget: 1000, spent: 800, remaining: 200, percentage: 80, icon: 'flash', color: '#06B6D4' },
  { category: 'Entertainment', budget: 1500, spent: 1200, remaining: 300, percentage: 80, icon: 'film', color: '#8B5CF6' },
];

export function BudgetBreakdown() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#3B82F620' }]}>
          <Ionicons name="wallet" size={24} color="#3B82F6" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Budget Breakdown</Text>
      </View>
      <View style={styles.list}>
        {budgetData.map((item) => (
          <View key={item.category} style={styles.budgetItem}>
            <View style={styles.budgetHeader}>
              <View style={styles.budgetInfo}>
                <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <View>
                  <Text style={[styles.categoryName, { color: colors.text }]}>{item.category}</Text>
                  <Text style={[styles.budgetStatus, { color: colors.textSecondary }]}>
                    ${item.spent.toLocaleString()} / ${item.budget.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.remainingContainer}>
                <Text style={[styles.remainingAmount, { color: item.remaining > 0 ? '#10B981' : '#EF4444' }]}>
                  ${item.remaining.toLocaleString()}
                </Text>
                <Text style={[styles.remainingLabel, { color: colors.textSecondary }]}>left</Text>
              </View>
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${item.percentage}%`, backgroundColor: item.percentage > 90 ? '#EF4444' : item.color },
                ]}
              />
            </View>
            <Text style={[styles.percentageText, { color: colors.textSecondary }]}>
              {item.percentage}% used
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.xl,
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
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
  },
  list: {
    gap: spacing.md,
  },
  budgetItem: {
    gap: spacing.xs,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetInfo: {
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
  budgetStatus: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  remainingContainer: {
    alignItems: 'flex-end',
  },
  remainingAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
  },
  remainingLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  percentageText: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
    marginTop: spacing.xs,
  },
});

