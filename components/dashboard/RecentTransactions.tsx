import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

const mockTransactions: Transaction[] = [
  { id: '1', title: 'Grocery Shopping', amount: 156.50, category: 'Food', date: 'Today', type: 'expense' },
  { id: '2', title: 'Salary', amount: 3000, category: 'Income', date: 'Yesterday', type: 'income' },
  { id: '3', title: 'Gas Bill', amount: 75.25, category: 'Utilities', date: '2 days ago', type: 'expense' },
  { id: '4', title: 'Freelance Work', amount: 500, category: 'Income', date: '3 days ago', type: 'income' },
  { id: '5', title: 'Restaurant', amount: 89.90, category: 'Food', date: '4 days ago', type: 'expense' },
  { id: '6', title: 'Coffee', amount: 12.50, category: 'Food', date: '5 days ago', type: 'expense' },
];

export function RecentTransactions() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Recent Transactions</Text>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mockTransactions.map((transaction) => (
          <View
            key={transaction.id}
            style={[
              styles.transactionItem,
              { borderBottomColor: colors.border },
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: transaction.type === 'income' ? '#10B98120' : '#EF444420' }]}>
              <Ionicons
                name={transaction.type === 'income' ? 'arrow-up' : 'arrow-down'}
                size={20}
                color={transaction.type === 'income' ? '#10B981' : '#EF4444'}
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={[styles.transactionTitle, { color: colors.text }]}>
                {transaction.title}
              </Text>
              <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>
                {transaction.category} • {transaction.date}
              </Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: transaction.type === 'income' ? '#10B981' : '#EF4444' },
              ]}
            >
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    marginBottom: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  transactionAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
});

