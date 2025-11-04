import { createCommonStyles } from '@/constants/commonStyles';
import { borderRadius, spacing, theme, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();
  const styles = createCommonStyles({ ...theme, spacing, borderRadius, typography }, isDark);
  const dynamicStyles = makeStyles(isDark, colors);

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailAnim = useRef(new Animated.Value(0)).current;

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

  const borderColorEmail = emailAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError(null);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

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

          {/* Logo/Lock Icon */}
          <View style={styles.logoContainer}>
            <View style={[styles.logo, dynamicStyles.logo, dynamicStyles.lockIconContainer]}>
              <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
            </View>
          </View>

          {/* App Name */}
          <Text style={dynamicStyles.appName}>Family Account</Text>

          {/* Title */}
          <Text style={styles.titleText}>Forgot Password?</Text>
          <Text style={styles.subtitleText}>
            Enter your email to reset your password.
          </Text>

          {!submitted ? (
            <>
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
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError(null);
                    }}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    accessibilityLabel="Email input"
                    editable={!loading}
                  />
                </Animated.View>
                {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
              </View>

              {/* Send Reset Link Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  dynamicStyles.button,
                  loading && dynamicStyles.buttonDisabled,
                ]}
                onPress={handleSendResetLink}
                disabled={loading}
                accessibilityLabel="Send reset link"
                accessibilityRole="button">
                {loading ? (
                  <ActivityIndicator color={colors.buttonText} />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Success Message */}
              <View style={dynamicStyles.successContainer}>
                <View style={dynamicStyles.successIconContainer}>
                  <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
                </View>
                <Text style={dynamicStyles.successTitle}>Check your inbox</Text>
                <Text style={dynamicStyles.successText}>
                  We've sent password reset instructions to {email}
                </Text>
              </View>
            </>
          )}

          {/* Footer */}
          <View style={dynamicStyles.footer}>
            <TouchableOpacity onPress={() => router.push('/signin')}>
              <Text style={[styles.linkText, dynamicStyles.backLink]}>
                Back to Sign In
              </Text>
            </TouchableOpacity>
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
    lockIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
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
    button: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    errorText: {
      fontSize: typography.fontSize.sm,
      color: colors.error,
      fontFamily: 'Inter_400Regular',
      marginTop: spacing.xs,
      marginLeft: spacing.xs,
    },
    successContainer: {
      alignItems: 'center',
      marginVertical: spacing.xl,
      padding: spacing.lg,
    },
    successIconContainer: {
      marginBottom: spacing.lg,
    },
    successTitle: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: '700' as const,
      color: colors.text,
      fontFamily: 'Inter_700Bold',
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    successText: {
      fontSize: typography.fontSize.md,
      color: colors.textSecondary,
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      lineHeight: 24,
    },
    backLink: {
      textAlign: 'center',
      marginTop: spacing.lg,
    },
    footer: {
      marginTop: spacing.xl,
      paddingBottom: spacing.xl,
      alignItems: 'center',
    },
  });

