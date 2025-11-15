import tokenStorage from '@/api/tokenStorage';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface AppBarProps {
  onMenuPress: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'warn' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Transaction Added',
    message: 'Your transaction has been successfully added to your account.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'warn',
    title: 'Budget Warning',
    message: 'You have used 90% of your monthly food budget.',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    type: 'info',
    title: 'New Feature Available',
    message: 'Check out the new budget tracking feature in the settings.',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    type: 'error',
    title: 'Payment Failed',
    message: 'Your last payment attempt failed. Please update your payment method.',
    timestamp: '2 days ago',
  },
  {
    id: '5',
    type: 'success',
    title: 'Collaborator Added',
    message: 'Alice Brown has been successfully added to your family account.',
    timestamp: '3 days ago',
  },
];

export function AppBar({ onMenuPress }: AppBarProps) {
  const { isDark, colors, toggleTheme } = useTheme();
  const router = useRouter();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(false);
  const [isAvatarPopoverOpen, setIsAvatarPopoverOpen] = useState(false);
  const [notifications] = useState<Notification[]>(mockNotifications);
  const isSmallScreen = dimensions.width < 768;
  const isLargeScreen = dimensions.width >= 1024;
  const { user, clearUser } = useUser();

  // Mock user data
  const [avatarFailed, setAvatarFailed] = useState(false);
  const apiBaseUrl = useMemo(
    () => (process.env.EXPO_PUBLIC_SERVER_URL ?? 'http://localhost:5000').replace(/\/+$/, ''),
    [],
  );

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.profilePhotoUrl]);

  const userData = useMemo(() => {
    const fallbackName = 'John Doe';
    const fallbackEmail = 'john.doe@example.com';
    const name = user?.name ?? fallbackName;
    const email = user?.email ?? fallbackEmail;
    const avatarInitial =
      name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U';

    let avatarUri = '';
    const rawUri = user?.profilePhotoUrl;
    if (rawUri && !avatarFailed) {
      if (/^https?:\/\//i.test(rawUri)) {
        avatarUri = rawUri;
      } else {
        avatarUri = `${apiBaseUrl}${rawUri.startsWith('/') ? rawUri : `/${rawUri}`}`;
      }
    }

    return {
      name,
      email,
      avatarInitial,
      avatarUri,
    };
  }, [user, apiBaseUrl]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleNotificationPress = () => {
    setIsNotificationPopoverOpen(!isNotificationPopoverOpen);
  };

  const handleClosePopover = () => {
    setIsNotificationPopoverOpen(false);
  };

  const handleAvatarPress = () => {
    setIsAvatarPopoverOpen(!isAvatarPopoverOpen);
  };

  const handleCloseAvatarPopover = () => {
    setIsAvatarPopoverOpen(false);
  };

  const handleProfilePress = () => {
    router.push('/(main-screens)/profile');
    setIsAvatarPopoverOpen(false);
  };

  const handleChangePasswordPress = () => {
    router.push('/(main-screens)/change-password');
    setIsAvatarPopoverOpen(false);
  };

  const handleLogoutPress = async () => {
    try {
      await tokenStorage.clear();
      clearUser();
      router.replace('/signin');
      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: 'You have been signed out successfully.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout failed',
        text2: 'Unable to clear session. Please try again.',
      });
    } finally {
    setIsAvatarPopoverOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warn':
        return 'warning';
      case 'info':
        return 'information-circle';
      case 'error':
        return 'close-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'warn':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      case 'error':
        return '#EF4444';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.leftSection}>
        {!isLargeScreen && (
          <Pressable onPress={onMenuPress} style={styles.iconButton}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </Pressable>
        )}
        <Text style={[styles.title, { color: colors.text }, !isLargeScreen && { marginLeft: spacing.md }]}>
          Family Project
        </Text>
      </View>
      
      <View style={styles.rightSection}>
        <Pressable 
          onPress={handleNotificationPress} 
          style={styles.iconButton}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {notifications.length > 0 && (
            <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.badgeText}>
                {notifications.length > 9 ? '9+' : notifications.length}
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color={colors.text} 
          />
        </Pressable>
        <Pressable style={styles.avatarButton} onPress={handleAvatarPress}>
          <View style={[styles.avatar, { backgroundColor: userData.avatarUri ? 'transparent' : colors.primary }]}>
            {userData.avatarUri ? (
              <Image
                source={{ uri: userData.avatarUri }}
                style={styles.avatarImage}
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <Text style={styles.avatarText}>{userData.avatarInitial}</Text>
            )}
          </View>
        </Pressable>
      </View>

      {/* Notification Popover */}
      <Modal
        visible={isNotificationPopoverOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClosePopover}
      >
        <Pressable 
          style={styles.popoverOverlay}
          onPress={handleClosePopover}
        >
          <Pressable 
            style={[styles.popover, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.popoverHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.popoverTitle, { color: colors.text }]}>Notifications</Text>
              <Pressable onPress={handleClosePopover}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView 
              style={styles.popoverContent}
              showsVerticalScrollIndicator={false}
            >
              {notifications.length === 0 ? (
                <View style={styles.emptyNotifications}>
                  <Ionicons name="notifications-off-outline" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No notifications
                  </Text>
                </View>
              ) : (
                notifications.map((notification) => {
                  const iconColor = getNotificationColor(notification.type);
                  return (
                    <View
                      key={notification.id}
                      style={[
                        styles.notificationItem,
                        { 
                          borderBottomColor: colors.border,
                          backgroundColor: notification.type === 'success'
                            ? '#10B98110'
                            : notification.type === 'warn'
                            ? '#F59E0B10'
                            : notification.type === 'info'
                            ? '#3B82F610'
                            : '#EF444410'
                        }
                      ]}
                    >
                      <View style={[styles.notificationIconContainer, { backgroundColor: iconColor + '20' }]}>
                        <Ionicons 
                          name={getNotificationIcon(notification.type) as any} 
                          size={24} 
                          color={iconColor} 
                        />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={[styles.notificationTitle, { color: colors.text }]}>
                          {notification.title}
                        </Text>
                        <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
                          {notification.message}
                        </Text>
                        <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
                          {notification.timestamp}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Avatar Popover */}
      <Modal
        visible={isAvatarPopoverOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCloseAvatarPopover}
      >
        <Pressable 
          style={styles.popoverOverlay}
          onPress={handleCloseAvatarPopover}
        >
          <Pressable 
            style={[styles.popover, styles.avatarPopover, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Profile Header */}
            <View style={[styles.avatarPopoverHeader, { borderBottomColor: colors.border }]}>
              <View style={[styles.avatarPopoverAvatar, { backgroundColor: userData.avatarUri ? 'transparent' : colors.primary }]}>
                {userData.avatarUri ? (
                  <Image
                    source={{ uri: userData.avatarUri }}
                    style={styles.popoverAvatarImage}
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <Text style={styles.avatarPopoverAvatarText}>{userData.avatarInitial}</Text>
                )}
              </View>
              <View style={styles.avatarPopoverUserInfo}>
                <Text style={[styles.avatarPopoverName, { color: colors.text }]}>{userData.name}</Text>
                <Text style={[styles.avatarPopoverEmail, { color: colors.textSecondary }]}>{userData.email}</Text>
              </View>
            </View>

            {/* Menu Options */}
            <View style={styles.avatarPopoverMenu}>
              <Pressable
                style={({ pressed }) => [
                  styles.avatarPopoverMenuItem,
                  {
                    backgroundColor: pressed ? colors.primary + '10' : 'transparent',
                    borderBottomColor: colors.border,
                  }
                ]}
                onPress={handleProfilePress}
              >
                <View style={styles.avatarPopoverMenuLeft}>
                  <View style={[styles.avatarPopoverMenuIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="person-outline" size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.avatarPopoverMenuText, { color: colors.text }]}>Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.avatarPopoverMenuItem,
                  {
                    backgroundColor: pressed ? colors.primary + '10' : 'transparent',
                    borderBottomColor: colors.border,
                  }
                ]}
                onPress={handleChangePasswordPress}
              >
                <View style={styles.avatarPopoverMenuLeft}>
                  <View style={[styles.avatarPopoverMenuIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.avatarPopoverMenuText, { color: colors.text }]}>Change Password</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.avatarPopoverMenuItem,
                  {
                    backgroundColor: pressed ? '#EF444410' : 'transparent',
                  }
                ]}
                onPress={handleLogoutPress}
              >
                <View style={styles.avatarPopoverMenuLeft}>
                  <View style={[styles.avatarPopoverMenuIcon, { backgroundColor: '#EF444420' }]}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  </View>
                  <Text style={[styles.avatarPopoverMenuText, { color: '#EF4444' }]}>Logout</Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
  },
  popoverOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: spacing.md,
  },
  popover: {
    width: 360,
    maxWidth: '90%',
    maxHeight: '70%',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  popoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  popoverTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  popoverContent: {
    maxHeight: 500,
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_400Regular',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  avatarPopover: {
    width: 280,
    maxWidth: '90%',
  },
  avatarPopoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
  },
  avatarPopoverAvatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  popoverAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPopoverAvatarText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.xl,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  avatarPopoverUserInfo: {
    flex: 1,
  },
  avatarPopoverName: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: spacing.xs,
  },
  avatarPopoverEmail: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  avatarPopoverMenu: {
    paddingVertical: spacing.xs,
  },
  avatarPopoverMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  avatarPopoverMenuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  avatarPopoverMenuIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPopoverMenuText: {
    fontSize: typography.fontSize.md,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
  },
});

