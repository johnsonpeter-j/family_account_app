import { userApi } from '@/api/user.api';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const fallbackProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phoneNo: '+1 234 567 8900',
  profilePhotoUrl: '',
};

const getInitials = (name: string) =>
  name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'JD';

const buildProfileState = (data: {
  name?: string;
  email?: string;
  phoneNo?: string;
  phone?: string;
  profilePhotoUrl?: string;
  avatarUri?: string;
}) => {
  const name = data.name ?? fallbackProfile.name;
  const email = data.email ?? fallbackProfile.email;
  const phone = data.phoneNo ?? data.phone ?? fallbackProfile.phoneNo;
  const avatarUri = data.avatarUri ?? data.profilePhotoUrl ?? '';

  return {
    name,
    email,
    phone,
    avatar: getInitials(name),
    avatarUri,
  };
};

export default function Profile() {
  const { isDark, colors } = useTheme();
  const { user, syncUser } = useUser();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Dynamic styles for input fields (matching sign-in page approach)
  const inputStyles = makeInputStyles(isDark, colors);
  
  const defaultProfileState = buildProfileState(fallbackProfile);
  const apiBaseUrl = useMemo(
    () => (process.env.EXPO_PUBLIC_SERVER_URL ?? 'http://localhost:5000').replace(/\/+$/, ''),
    [],
  );

  const [userData, setUserData] = useState(defaultProfileState);
  const [formData, setFormData] = useState(defaultProfileState);
  const [avatarFailed, setAvatarFailed] = useState(false);
  
  const isLargeScreen = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (user) {
      const next = buildProfileState({
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        profilePhotoUrl: user.profilePhotoUrl,
      });
      setUserData(next);
      if (!isEditing) {
        setFormData(next);
      }
    }
  }, [user, isEditing]);

  const resolvedAvatarUri = useMemo(() => {
    const uri = formData.avatarUri;
    if (!uri || avatarFailed) return '';
    if (/^https?:\/\//i.test(uri)) {
      return uri;
    }
    const normalizedPath = uri.startsWith('/') ? uri : `/${uri}`;
    return `${apiBaseUrl}${normalizedPath}`;
  }, [formData.avatarUri, apiBaseUrl, avatarFailed]);

  useEffect(() => {
    setAvatarFailed(false);
  }, [formData.avatarUri]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(userData);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing info',
        text2: 'Name and phone number are required.',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await userApi.updateProfile({
        name: formData.name.trim(),
        phoneNo: formData.phone.trim(),
      });

      syncUser(response.user);
      const next = buildProfileState({
        name: response.user.name,
        email: response.user.email,
        phoneNo: response.user.phoneNo,
        profilePhotoUrl: response.user.profilePhotoUrl,
        avatarUri: formData.avatarUri,
      });
      setUserData(next);
      setFormData(next);
    setIsEditing(false);

      Toast.show({
        type: 'success',
        text1: 'Profile updated',
        text2: response.message ?? 'Your profile details were saved.',
      });
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        apiError.response?.data?.message ?? apiError.message ?? 'Unable to update profile. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission denied',
        text2: 'Media library access is required to change the photo.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const previousAvatar = formData.avatarUri;
      setFormData((prev) => ({ ...prev, avatarUri: uri }));
      setUserData((prev) => ({ ...prev, avatarUri: uri }));

      try {
        setSaving(true);
        const formDataUpload = new FormData();
        const fileResponse = await fetch(uri);
        const fileBlob = await fileResponse.blob();
        const filename = uri.split('/').pop() ?? 'photo.jpg';

        formDataUpload.append('photo', fileBlob as any, filename);

        const response = await userApi.uploadProfilePhoto(formDataUpload);
        const photoUrl = response.user.profilePhotoUrl ?? uri;

        syncUser(response.user);
        setUserData((prev) => ({
          ...prev,
          avatarUri: photoUrl,
        }));
        setFormData((prev) => ({
          ...prev,
          avatarUri: photoUrl,
        }));

        Toast.show({
          type: 'success',
          text1: 'Photo updated',
          text2: response.message ?? 'Profile photo uploaded successfully.',
        });
      } catch (error) {
        setUserData((prev) => ({ ...prev, avatarUri: previousAvatar }));
        setFormData((prev) => ({ ...prev, avatarUri: previousAvatar }));
        const apiError = error as { response?: { data?: { message?: string } }; message?: string };
        const message =
          apiError.response?.data?.message ?? apiError.message ?? 'Unable to upload photo. Please try again.';
        Toast.show({
          type: 'error',
          text1: 'Upload failed',
          text2: message,
        });
      } finally {
        setSaving(false);
      }
    }
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
          <View style={[styles.avatarContainer, { backgroundColor: resolvedAvatarUri ? 'transparent' : colors.primary }]}>
            {resolvedAvatarUri ? (
              <Image
                source={{ uri: resolvedAvatarUri }}
                style={styles.avatarImage}
                onError={() => setAvatarFailed(true)}
              />
            ) : (
            <Text style={styles.avatarText}>{userData.avatar}</Text>
            )}
          </View>
            <Pressable
              style={[styles.editAvatarButton, { borderColor: colors.border }]}
            onPress={handleChangePhoto}
            disabled={saving}
            >
              <Ionicons name="camera" size={20} color={colors.text} />
              <Text style={[styles.editAvatarButtonText, { color: colors.text }]}>
                Change Photo
              </Text>
            </Pressable>
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
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: saving ? 0.7 : 1,
                  },
                ]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                <Text style={styles.saveButtonText}>Save</Text>
                )}
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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

