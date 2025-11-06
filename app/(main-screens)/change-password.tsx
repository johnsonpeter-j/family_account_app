import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ChangePassword() {
  const { isDark, colors } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Focus states for animations
  const [currentPasswordFocused, setCurrentPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  
  // Animated values
  const currentPasswordAnim = useRef(new Animated.Value(0)).current;
  const newPasswordAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordAnim = useRef(new Animated.Value(0)).current;

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dynamic styles for input fields
  const inputStyles = makeInputStyles(isDark, colors);
  
  const isLargeScreen = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleCurrentPasswordFocus = () => {
    setCurrentPasswordFocused(true);
    Animated.spring(currentPasswordAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleCurrentPasswordBlur = () => {
    setCurrentPasswordFocused(false);
    Animated.spring(currentPasswordAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleNewPasswordFocus = () => {
    setNewPasswordFocused(true);
    Animated.spring(newPasswordAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleNewPasswordBlur = () => {
    setNewPasswordFocused(false);
    Animated.spring(newPasswordAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleConfirmPasswordFocus = () => {
    setConfirmPasswordFocused(true);
    Animated.spring(confirmPasswordAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordFocused(false);
    Animated.spring(confirmPasswordAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const borderColorCurrentPassword = currentPasswordAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  const borderColorNewPassword = newPasswordAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  const borderColorConfirmPassword = confirmPasswordAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderFocus],
  });

  const handleSave = () => {
    // Validate passwords
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      // TODO: Show error message
      console.log('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      // TODO: Show error message
      console.log('New password and confirm password do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      // TODO: Show error message
      console.log('New password must be at least 8 characters');
      return;
    }

    // TODO: Save password change
    console.log('Password changed successfully');
    
    // Reset form
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, isLargeScreen && styles.headerContentLarge]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Update your password to keep your account secure
            </Text>
          </View>
        </View>
      </View>

      {/* Form Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge,
          styles.scrollContentCentered
        ]}
      >
        {/* Password Change Form */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.form}>
            {/* Current Password Field */}
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Current Password</Text>
              <Animated.View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderWidth: currentPasswordFocused ? 2 : 1,
                    borderRadius: borderRadius.md,
                    borderColor: borderColorCurrentPassword,
                  },
                ]}>
                <TextInput
                  style={inputStyles.input}
                  value={formData.currentPassword}
                  onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showCurrentPassword}
                  onFocus={handleCurrentPasswordFocus}
                  onBlur={handleCurrentPasswordBlur}
                  selectionColor={colors.primary}
                  cursorColor={colors.primary}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </Animated.View>
            </View>

            {/* New Password Field */}
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>New Password</Text>
              <Animated.View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderWidth: newPasswordFocused ? 2 : 1,
                    borderRadius: borderRadius.md,
                    borderColor: borderColorNewPassword,
                  },
                ]}>
                <TextInput
                  style={inputStyles.input}
                  value={formData.newPassword}
                  onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showNewPassword}
                  onFocus={handleNewPasswordFocus}
                  onBlur={handleNewPasswordBlur}
                  selectionColor={colors.primary}
                  cursorColor={colors.primary}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </Animated.View>
              <Text style={[styles.formHint, { color: colors.textSecondary }]}>
                Password must be at least 8 characters long
              </Text>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Confirm New Password</Text>
              <Animated.View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderWidth: confirmPasswordFocused ? 2 : 1,
                    borderRadius: borderRadius.md,
                    borderColor: borderColorConfirmPassword,
                  },
                ]}>
                <TextInput
                  style={inputStyles.input}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  onFocus={handleConfirmPasswordFocus}
                  onBlur={handleConfirmPasswordBlur}
                  selectionColor={colors.primary}
                  cursorColor={colors.primary}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </Animated.View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={[styles.actionButtons, { borderTopColor: colors.border }]}>
            <Pressable
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Change Password</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    padding: spacing.md,
  },
  headerContent: {
    flexDirection: 'column',
  },
  headerContentLarge: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_400Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
    justifyContent: 'center',
  },
  scrollContentLarge: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContentCentered: {
    minHeight: '100%',
  },
  section: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  form: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  formField: {
    gap: spacing.xs,
  },
  formLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  formHint: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
    marginTop: spacing.xs,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    padding: spacing.md,
    borderTopWidth: 1,
  },
  saveButton: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
});

// Dynamic styles for input fields (matching sign-in page approach)
const makeInputStyles = (isDark: boolean, colors: any) =>
  StyleSheet.create({
    input: {
      flex: 1,
      height: 56,
      paddingHorizontal: spacing.md,
      paddingRight: 48, // Space for eye icon
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
  });

