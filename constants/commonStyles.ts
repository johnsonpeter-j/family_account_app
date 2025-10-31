import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { BorderRadius, Spacing, Theme } from './theme';

/**
 * Common reusable styles for consistent design across the app
 */

type ThemeWithSpacingAndRadius = Theme & {
  spacing: Spacing;
  borderRadius: BorderRadius;
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
    };
    fontWeight: {
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
};

export type CommonStyles = {
  container: ViewStyle;
  centeredContainer: ViewStyle;
  inputField: TextStyle;
  inputFieldFocused: ViewStyle;
  inputContainer: ViewStyle;
  inputWithIcon: TextStyle;
  inputIcon: ViewStyle;
  button: ViewStyle;
  buttonPressed: ViewStyle;
  buttonText: TextStyle;
  buttonSecondary: ViewStyle;
  buttonSecondaryText: TextStyle;
  linkText: TextStyle;
  titleText: TextStyle;
  subtitleText: TextStyle;
  divider: ViewStyle;
  dividerLine: ViewStyle;
  dividerText: TextStyle;
  logoContainer: ViewStyle;
  logo: ViewStyle;
  footerText: TextStyle;
  footerLink: TextStyle;
};

export const createCommonStyles = (
  theme: ThemeWithSpacingAndRadius,
  isDark: boolean
): CommonStyles => {
  const colors = isDark ? theme.dark : theme.light;

  return StyleSheet.create<CommonStyles>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    centeredContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    inputField: {
      width: '100%',
      height: 56,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: colors.text,
      fontFamily: 'Inter_400Regular',
      ...Platform.select({
        ios: {
          paddingVertical: theme.spacing.md,
        },
        android: {
          textAlignVertical: 'center',
        },
      }),
    },
    inputFieldFocused: {
      borderColor: colors.borderFocus,
      borderWidth: 2,
    },
    inputContainer: {
      width: '100%',
      marginBottom: theme.spacing.md,
      position: 'relative',
    },
    inputWithIcon: {
      paddingRight: 48,
    },
    inputIcon: {
      position: 'absolute',
      right: theme.spacing.md,
      top: '50%',
      transform: [{ translateY: -12 }],
      zIndex: 1,
    },
    button: {
      width: '100%',
      height: 56,
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      marginVertical: theme.spacing.sm,
    },
    buttonPressed: {
      backgroundColor: colors.primaryDark,
    },
    buttonText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      color: colors.buttonText,
      fontFamily: 'Inter_600SemiBold',
    },
    buttonSecondary: {
      width: '100%',
      height: 56,
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonSecondaryText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      color: colors.text,
      fontFamily: 'Inter_600SemiBold',
    },
    linkText: {
      fontSize: theme.typography.fontSize.sm,
      color: colors.primary,
      fontFamily: 'Inter_500Medium',
      textDecorationLine: 'none',
    },
    titleText: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: colors.text,
      fontFamily: 'Inter_700Bold',
      marginBottom: theme.spacing.xs,
    },
    subtitleText: {
      fontSize: theme.typography.fontSize.md,
      color: colors.textSecondary,
      fontFamily: 'Inter_400Regular',
      marginBottom: theme.spacing.xl,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.lg,
      width: '100%',
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.divider,
    },
    dividerText: {
      marginHorizontal: theme.spacing.md,
      fontSize: theme.typography.fontSize.sm,
      color: colors.textSecondary,
      fontFamily: 'Inter_400Regular',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xxl,
      marginTop: theme.spacing.lg,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    footerText: {
      fontSize: theme.typography.fontSize.md,
      color: colors.textSecondary,
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      marginTop: theme.spacing.xl,
    },
    footerLink: {
      color: colors.primary,
      fontFamily: 'Inter_500Medium',
    },
  });
};

