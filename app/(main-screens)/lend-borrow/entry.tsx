import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

export default function LendBorrowEntry() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Lend & Borrow Entry</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Add new lend/borrow entry coming soon...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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



