import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface LendBorrowData {
  person: string;
  amount: number;
  type: 'lent' | 'borrowed';
  status: 'pending' | 'returned' | 'received';
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const lendBorrowData: LendBorrowData[] = [
  { person: 'John Doe', amount: 500, type: 'lent', status: 'pending', date: '2 weeks ago', icon: 'person' },
  { person: 'Jane Smith', amount: 300, type: 'borrowed', status: 'pending', date: '1 week ago', icon: 'person' },
  { person: 'Mike Johnson', amount: 750, type: 'lent', status: 'returned', date: '3 days ago', icon: 'person' },
  { person: 'Sarah Williams', amount: 200, type: 'borrowed', status: 'received', date: 'Yesterday', icon: 'person' },
];

export function LendBorrowBreakdown() {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'returned':
      case 'received':
        return '#10B981';
      default:
        return colors.textSecondary;
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'lent' ? '#8B5CF6' : '#3B82F6';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#F59E0B20' }]}>
          <Ionicons name="cash" size={24} color="#F59E0B" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Lend & Borrow Summary</Text>
      </View>
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Lent</Text>
          <Text style={[styles.summaryAmount, { color: '#8B5CF6' }]}>$1,250</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Borrowed</Text>
          <Text style={[styles.summaryAmount, { color: '#3B82F6' }]}>$500</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Net</Text>
          <Text style={[styles.summaryAmount, { color: '#EF4444' }]}>-$750</Text>
        </View>
      </View>
      <View style={styles.list}>
        {lendBorrowData.map((item) => (
          <View
            key={`${item.person}-${item.amount}`}
            style={[styles.item, { borderBottomColor: colors.border }]}
          >
            <View style={[styles.iconCircle, { backgroundColor: getTypeColor(item.type) + '20' }]}>
              <Ionicons name={item.icon} size={20} color={getTypeColor(item.type)} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.person}</Text>
              <Text style={[styles.itemDetails, { color: colors.textSecondary }]}>
                {item.type === 'lent' ? 'You lent' : 'You borrowed'} • {item.date}
              </Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={[styles.itemAmount, { color: colors.text }]}>
                {item.type === 'lent' ? '-' : '+'}${item.amount}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>
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
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: borderRadius.md,
  },
  summaryItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  summaryAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
  },
  list: {
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  itemAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter_500Medium',
    textTransform: 'capitalize',
  },
});

