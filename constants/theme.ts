/**
 * Theme configuration for light and dark modes
 */

export type ColorScheme = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryDark: string;
  border: string;
  borderFocus: string;
  error: string;
  divider: string;
  inputBackground: string;
  buttonText: string;
};

export type Theme = {
  light: ColorScheme;
  dark: ColorScheme;
};

export type Spacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

export type BorderRadius = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
};

export type Typography = {
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

export const theme: Theme = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    border: '#E5E7EB',
    borderFocus: '#3B82F6',
    error: '#EF4444',
    divider: '#E5E7EB',
    inputBackground: '#FFFFFF',
    buttonText: '#FFFFFF',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    border: '#334155',
    borderFocus: '#60A5FA',
    error: '#F87171',
    divider: '#334155',
    inputBackground: '#1E293B',
    buttonText: '#FFFFFF',
  },
};

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius: BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography: Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

/**
 * Legacy Colors export for backward compatibility with existing components
 * Maps to the old theme structure
 */
export const Colors = {
  light: {
    text: theme.light.text,
    background: theme.light.background,
    tint: theme.light.primary,
    icon: theme.light.textSecondary,
    tabIconDefault: theme.light.textSecondary,
    tabIconSelected: theme.light.primary,
  },
  dark: {
    text: theme.dark.text,
    background: theme.dark.background,
    tint: theme.dark.primary,
    icon: theme.dark.textSecondary,
    tabIconDefault: theme.dark.textSecondary,
    tabIconSelected: theme.dark.primary,
  },
};
