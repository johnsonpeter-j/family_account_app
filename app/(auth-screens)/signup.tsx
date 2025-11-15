import { authApi } from '@/api/auth';
import { createCommonStyles } from '@/constants/commonStyles';
import { borderRadius, spacing, theme, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
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
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SignUpScreen() {
  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();
  const { syncUser } = useUser();
  const styles = createCommonStyles({ ...theme, spacing, borderRadius, typography }, isDark);
  const dynamicStyles = makeStyles(isDark, colors);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const fullNameAnim = useRef(new Animated.Value(0)).current;
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (
    anim: Animated.Value,
    setFocused: (value: boolean) => void
  ) => {
    setFocused(true);
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleBlur = (
    anim: Animated.Value,
    setFocused: (value: boolean) => void
  ) => {
    setFocused(false);
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const borderColorFullName = fullNameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  const borderColorEmail = emailAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  const borderColorPassword = passwordAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  const borderColorConfirmPassword = confirmPasswordAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.signUp({
        name: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
      syncUser(response.user);
      Toast.show({
        type: 'success',
        text1: 'Account created',
        text2: response.message ?? 'Please sign in with your new account.',
      });
      router.push('/signin');
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        apiError.response?.data?.message ?? apiError.message ?? 'Unable to sign up. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Sign up failed',
        text2: message,
      });
    } finally {
      setLoading(false);
    }
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

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={[styles.logo, dynamicStyles.logo]}>
              <Text style={dynamicStyles.logoText}>F</Text>
            </View>
          </View>

          {/* App Name */}
          <Text style={dynamicStyles.appName}>Family Account</Text>

          {/* Title */}
          <Text style={styles.titleText}>Create Account</Text>
          <Text style={styles.subtitleText}>
            Join Family Project to manage your finances together.
          </Text>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Animated.View
              style={[
                {
                  backgroundColor: colors.inputBackground,
                  borderWidth: fullNameFocused ? 2 : 1,
                  borderRadius: borderRadius.md,
                  borderColor: borderColorFullName,
                },
              ]}>
              <TextInput
                style={dynamicStyles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                onFocus={() => handleFocus(fullNameAnim, setFullNameFocused)}
                onBlur={() => handleBlur(fullNameAnim, setFullNameFocused)}
                autoCapitalize="words"
                accessibilityLabel="Full name input"
              />
            </Animated.View>
            {errors.fullName && (
              <Text style={dynamicStyles.errorText}>{errors.fullName}</Text>
            )}
          </View>

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
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                onFocus={() => handleFocus(emailAnim, setEmailFocused)}
                onBlur={() => handleBlur(emailAnim, setEmailFocused)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                accessibilityLabel="Email input"
              />
            </Animated.View>
            {errors.email && (
              <Text style={dynamicStyles.errorText}>{errors.email}</Text>
            )}
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
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                onFocus={() => handleFocus(passwordAnim, setPasswordFocused)}
                onBlur={() => handleBlur(passwordAnim, setPasswordFocused)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
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
            {errors.password && (
              <Text style={dynamicStyles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Animated.View
              style={[
                {
                  backgroundColor: colors.inputBackground,
                  borderWidth: confirmPasswordFocused ? 2 : 1,
                  borderRadius: borderRadius.md,
                  borderColor: borderColorConfirmPassword,
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'relative',
                },
              ]}>
              <TextInput
                style={[dynamicStyles.input, { flex: 1, paddingRight: 48 }]}
                placeholder="Confirm Password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                onFocus={() => handleFocus(confirmPasswordAnim, setConfirmPasswordFocused)}
                onBlur={() => handleBlur(confirmPasswordAnim, setConfirmPasswordFocused)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                accessibilityLabel="Confirm password input"
              />
              <TouchableOpacity
                style={dynamicStyles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </Animated.View>
            {errors.confirmPassword && (
              <Text style={dynamicStyles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.button, dynamicStyles.button, loading && dynamicStyles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
            accessibilityLabel="Sign up"
            accessibilityRole="button">
            {loading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={dynamicStyles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={[styles.footerLink, styles.linkText]}
                onPress={() => router.push('/signin')}>
                Sign In
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
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    socialIcon: {
      marginRight: spacing.sm,
    },
    errorText: {
      fontSize: typography.fontSize.sm,
      color: colors.error,
      fontFamily: 'Inter_400Regular',
      marginTop: spacing.xs,
      marginLeft: spacing.xs,
    },
    footer: {
      marginTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
  });


