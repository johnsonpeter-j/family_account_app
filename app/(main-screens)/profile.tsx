import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Profile() {
  const { isDark, colors } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isEditing, setIsEditing] = useState(false);
  
  // Dynamic styles for input fields (matching sign-in page approach)
  const inputStyles = makeInputStyles(isDark, colors);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    avatar: 'JD',
  });

  const [formData, setFormData] = useState(userData);
  
  const isLargeScreen = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(userData);
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
    // TODO: Save to backend
    console.log('Profile updated:', formData);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, isLargeScreen && styles.headerContentLarge]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Manage your profile information
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge,
          styles.scrollContentCentered
        ]}
      >
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{userData.avatar}</Text>
          </View>
          {!isEditing && (
            <Pressable
              style={[styles.editAvatarButton, { borderColor: colors.border }]}
              onPress={() => {}}
            >
              <Ionicons name="camera" size={20} color={colors.text} />
              <Text style={[styles.editAvatarButtonText, { color: colors.text }]}>
                Change Photo
              </Text>
            </Pressable>
          )}
        </View>

        {/* Profile Information Section */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
            {!isEditing && (
              <Pressable
                style={styles.editButton}
                onPress={handleEdit}
              >
                <Ionicons name="create-outline" size={20} color={colors.primary} />
                <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.form}>
            {/* Name Field */}
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Name</Text>
              {isEditing ? (
                <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                  <TextInput
                    style={inputStyles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textSecondary}
                    selectionColor={colors.primary}
                    cursorColor={colors.primary}
                  />
                </View>
              ) : (
                <Text style={[styles.formValue, { color: colors.text }]}>{userData.name}</Text>
              )}
            </View>

            {/* Email Field */}
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Email</Text>
              {isEditing ? (
                <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                  <TextInput
                    style={inputStyles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    selectionColor={colors.primary}
                    cursorColor={colors.primary}
                  />
                </View>
              ) : (
                <Text style={[styles.formValue, { color: colors.text }]}>{userData.email}</Text>
              )}
            </View>

            {/* Phone Field */}
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Phone</Text>
              {isEditing ? (
                <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                  <TextInput
                    style={inputStyles.input}
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    placeholder="Enter your phone number"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="phone-pad"
                    selectionColor={colors.primary}
                    cursorColor={colors.primary}
                  />
                </View>
              ) : (
                <Text style={[styles.formValue, { color: colors.text }]}>{userData.phone}</Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          {isEditing && (
            <View style={[styles.actionButtons, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={handleCancel}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          )}
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
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize['3xl'],
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  editAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  editAvatarButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
  },
  section: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  editButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
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
  inputContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    backgroundColor: 'transparent',
  },
  formValue: {
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_400Regular',
    paddingVertical: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    padding: spacing.md,
    borderTopWidth: 1,
  },
  cancelButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  saveButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
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
      height: 56,
      paddingHorizontal: spacing.md,
      fontSize: typography.fontSize.md,
      color: colors.text,
      fontFamily: 'Inter_400Regular',
      backgroundColor: colors.inputBackground,
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

