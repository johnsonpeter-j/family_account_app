import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

interface AppBarProps {
  onMenuPress: () => void;
}

export function AppBar({ onMenuPress }: AppBarProps) {
  const { isDark, colors, toggleTheme } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isSmallScreen = dimensions.width < 768;
  const isLargeScreen = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.leftSection}>
        {!isLargeScreen && (
          <Pressable onPress={onMenuPress} style={styles.iconButton}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </Pressable>
        )}
        {!isSmallScreen && (
          <Text style={[styles.title, { color: colors.text }, !isLargeScreen && { marginLeft: spacing.md }]}>
            Family Project
          </Text>
        )}
      </View>
      
      <View style={styles.rightSection}>
        <Pressable onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color={colors.text} 
          />
        </Pressable>
        <Pressable style={styles.avatarButton}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>U</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
  },
  avatarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
  },
});

