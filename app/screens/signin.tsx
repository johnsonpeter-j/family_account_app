import { createCommonStyles } from '@/constants/commonStyles';
import { borderRadius, spacing, theme, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SignInScreen() {
  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();
  const styles = createCommonStyles({ ...theme, spacing, borderRadius, typography }, isDark);
  const dynamicStyles = makeStyles(isDark, colors);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;

  const handleEmailFocus = () => {
    setEmailFocused(true);
    Animated.spring(emailAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    Animated.spring(emailAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    Animated.spring(passwordAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    Animated.spring(passwordAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const borderColorEmail = emailAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  const borderColorPassword = passwordAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  return (
    <Animated.View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={[styles.container, dynamicStyles.container]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        contentContainerStyle={[
          dynamicStyles.scrollContent,
          isTablet && dynamicStyles.tabletContent,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        {/* Theme Toggle */}
        <Pressable
          style={dynamicStyles.themeToggle}
          onPress={toggleTheme}
          accessibilityLabel="Toggle theme">
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={24}
            color={colors.text}
          />
        </Pressable>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={[styles.logo, dynamicStyles.logo]}>
            <Text style={dynamicStyles.logoText}>F</Text>
          </View>
        </View>

        {/* App Name */}
        <Text style={dynamicStyles.appName}>Family Account</Text>

        {/* Title */}
        <Text style={styles.titleText}>Welcome Back</Text>
        <Text style={styles.subtitleText}>Sign in to continue</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Animated.View
            style={[
              {
                backgroundColor: colors.inputBackground,
                borderWidth: emailFocused ? 2 : 1,
                borderRadius: borderRadius.md,
                borderColor: borderColorEmail,
              },
            ]}>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessibilityLabel="Email input"
            />
          </Animated.View>
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Animated.View
            style={[
              {
                backgroundColor: colors.inputBackground,
                borderWidth: passwordFocused ? 2 : 1,
                borderRadius: borderRadius.md,
                borderColor: borderColorPassword,
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
              },
            ]}>
            <TextInput
              style={[dynamicStyles.input, { flex: 1, paddingRight: 48 }]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              accessibilityLabel="Password input"
            />
            <TouchableOpacity
              style={dynamicStyles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={dynamicStyles.forgotPassword}
          onPress={() => router.push('/forgot-password')}
          accessibilityLabel="Forgot password">
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.button, dynamicStyles.button]}
          onPress={() => router.push('/dashboard')}
          accessibilityLabel="Sign in"
          accessibilityRole="button">
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      

        {/* Footer */}
        <View style={dynamicStyles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text
              style={[styles.footerLink, styles.linkText]}
              onPress={() => router.push('/signup')}>
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </Animated.View>
  );
}

const makeStyles = (isDark: boolean, colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      maxWidth: 480,
      width: '100%',
      alignSelf: 'center',
    },
    tabletContent: {
      maxWidth: 600,
      paddingHorizontal: spacing.xl,
    },
    themeToggle: {
      position: 'absolute',
      top: spacing.lg,
      right: spacing.md,
      zIndex: 10,
      padding: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.surface,
    },
    logo: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    logoText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#FFFFFF',
      fontFamily: 'Inter_700Bold',
    },
    appName: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: '700' as const,
      color: colors.text,
      fontFamily: 'Inter_700Bold',
      textAlign: 'center',
      marginBottom: spacing.md,
      marginTop: -spacing.md,
    },
    input: {
      height: 56,
      paddingHorizontal: spacing.md,
      fontSize: typography.fontSize.md,
      color: colors.text,
      fontFamily: 'Inter_400Regular',
      ...Platform.select({
        ios: {
          paddingVertical: spacing.md,
        },
        android: {
          textAlignVertical: 'center',
        },
      }),
    },
    eyeIcon: {
      position: 'absolute',
      right: spacing.md,
      padding: spacing.xs,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: spacing.lg,
      marginTop: -spacing.sm,
    },
    button: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    socialIcon: {
      marginRight: spacing.sm,
    },
    footer: {
      marginTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
  });

