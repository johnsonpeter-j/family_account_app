import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface QuickAction {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  path: string;
}

const quickActions: QuickAction[] = [
  { label: 'Add Transaction', icon: 'add-circle', color: '#3B82F6', path: '/transactions/entry' },
  { label: 'Add Lend & Borrow', icon: 'cash', color: '#8B5CF6', path: '/lend-borrow/entry' },
];

export function QuickActions() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action) => (
          <Pressable
            key={action.label}
            onPress={() => router.push(action.path as any)}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.background },
              pressed && styles.actionButtonPressed,
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: spacing.sm,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
  },
});

