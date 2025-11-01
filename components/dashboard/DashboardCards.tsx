import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface CardData {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const cardData: CardData[] = [
  { title: 'Total Income', value: '$12,450', icon: 'arrow-up-circle', color: '#10B981' },
  { title: 'Total Expense', value: '$8,230', icon: 'arrow-down-circle', color: '#EF4444' },
  { title: 'Budget Left', value: '$4,220', icon: 'wallet', color: '#3B82F6' },
  { title: 'Transactions', value: '156', icon: 'swap-horizontal', color: '#8B5CF6' },
];

export function DashboardCards() {
  const { colors } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isLargeScreen = dimensions.width >= 1024;
  const isMediumScreen = dimensions.width >= 768;
  const cols = isLargeScreen ? 4 : isMediumScreen ? 2 : 1;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {cardData.map((card, index) => (
          <View
            key={card.title}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                width: isLargeScreen ? `${100 / cols - 2}%` : isMediumScreen ? '48%' : '100%',
                marginRight: index < cardData.length - 1 && cols > 1 ? spacing.md : 0,
                marginBottom: spacing.md,
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: card.color + '20' }]}>
                <Ionicons name={card.icon} size={24} color={card.color} />
              </View>
            </View>
            <Text style={[styles.cardValue, { color: colors.text }]}>{card.value}</Text>
            <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{card.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter_500Medium',
  },
});

