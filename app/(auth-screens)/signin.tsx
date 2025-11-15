import { authApi } from '@/api/auth';
import tokenStorage, { TOKEN_KEY } from '@/api/tokenStorage';
import { createCommonStyles } from '@/constants/commonStyles';
import { borderRadius, spacing, theme, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SignInScreen() {
  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();
  const { syncUser } = useUser();
  const styles = createCommonStyles({ ...theme, spacing, borderRadius, typography }, isDark);
  const dynamicStyles = makeStyles(isDark, colors);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    const checkExistingSession = async () => {
      const token = await tokenStorage.getItem(TOKEN_KEY);
      if (!token) {
        setCheckingSession(false);
        return;
      }
      try {
        const response = await authApi.verify();
        if (!isMounted) return;
        syncUser(response.user);
        router.replace('/(main-screens)/dashboard');
      } catch {
        await tokenStorage.clear();
        if (!isMounted) {
          return;
        }
        setCheckingSession(false);
      }
    };

    checkExistingSession();
    return () => {
      isMounted = false;
    };
  }, [router, syncUser]);

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

  const validateForm = () => {
    const nextErrors: typeof errors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required';
    }
    if (!password) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await authApi.signIn({
        email: email.trim(),
        password,
      });
      syncUser(response.user);
      Toast.show({
        type: 'success',
        text1: 'Signed in successfully',
        text2: response.message ?? 'Welcome back!',
      });
      router.push('/(main-screens)/dashboard');
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        apiError.response?.data?.message ?? apiError.message ?? 'Unable to sign in. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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

          <View
            style={[
              dynamicStyles.formWrapper,
              isTablet && dynamicStyles.tabletFormWrapper,
            ]}>
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
                    borderColor: errors.email ? colors.error : borderColorEmail,
              },
            ]}>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessibilityLabel="Email input"
            />
          </Animated.View>
        </View>
            <View style={dynamicStyles.errorWrapper}>
              <Text style={dynamicStyles.errorText}>{errors.email ?? ' '}</Text>
            </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Animated.View
            style={[
              {
                backgroundColor: colors.inputBackground,
                borderWidth: passwordFocused ? 2 : 1,
                borderRadius: borderRadius.md,
                    borderColor: errors.password ? colors.error : borderColorPassword,
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
                  onChangeText={(value) => {
                    setPassword(value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
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
            <View style={dynamicStyles.errorWrapper}>
              <Text style={dynamicStyles.errorText}>{errors.password ?? ' '}</Text>
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
              style={[
                styles.button,
                dynamicStyles.button,
                loading && dynamicStyles.buttonDisabled,
              ]}
              onPress={handleSignIn}
          accessibilityLabel="Sign in"
              accessibilityRole="button"
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
          <Text style={styles.buttonText}>Sign In</Text>
              )}
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
      flexGrow: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xl,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabletContent: {
      paddingHorizontal: spacing.xl,
    },
    formWrapper: {
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
    },
    tabletFormWrapper: {
      maxWidth: 600,
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
      marginBottom: spacing.md,
      marginTop: -spacing.sm,
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
    errorWrapper: {
      minHeight: spacing.md,
      justifyContent: 'flex-start',
      marginTop: -spacing.sm,
      paddingTop: spacing.xs,
      paddingBottom: spacing.xs,
    },
    errorText: {
      fontSize: typography.fontSize.sm,
      color: colors.error,
      fontFamily: 'Inter_400Regular',
      marginLeft: spacing.xs,
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



