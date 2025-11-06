import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface NotificationOption {
  id: string;
  label: string;
  enabled: boolean;
}

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
];

export default function Settings() {
  const { isDark, colors, themeMode, setThemeMode } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [currency, setCurrency] = useState('USD');
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [isCurrencyDialogOpen, setIsCurrencyDialogOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);
  const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>([
    { id: 'budget-50', label: 'Used 50% of budget', enabled: true },
    { id: 'budget-90', label: 'Used 90% of budget', enabled: true },
    { id: 'budget-100', label: 'Used 100% of budget', enabled: false },
    { id: 'weekly-report', label: 'Weekly report', enabled: true },
    { id: 'fortnight-report', label: 'Fortnight report', enabled: false },
    { id: 'monthly-report', label: 'Monthly report', enabled: true },
    { id: 'quarterly-report', label: 'Quarterly report', enabled: false },
    { id: 'half-yearly-report', label: 'Half-yearly report', enabled: false },
  ]);
  
  const isLargeScreen = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout');
  };

  const handleOpenNotificationDialog = () => {
    setIsNotificationDialogOpen(true);
  };

  const handleCloseNotificationDialog = () => {
    setIsNotificationDialogOpen(false);
  };

  const handleToggleNotificationOption = (id: string) => {
    setNotificationOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  const handleSaveNotificationSettings = () => {
    // Handle save notification settings logic
    console.log('Notification settings saved:', notificationOptions);
    setIsNotificationDialogOpen(false);
  };

  const handleOpenCurrencyDialog = () => {
    setSelectedCurrency(currency);
    setIsCurrencyDialogOpen(true);
  };

  const handleCloseCurrencyDialog = () => {
    setIsCurrencyDialogOpen(false);
  };

  const handleSaveCurrency = () => {
    setCurrency(selectedCurrency);
    console.log('Currency changed to:', selectedCurrency);
    setIsCurrencyDialogOpen(false);
  };

  const handleOpenDeleteAccountDialog = () => {
    setIsDeleteAccountDialogOpen(true);
  };

  const handleCloseDeleteAccountDialog = () => {
    setIsDeleteAccountDialogOpen(false);
  };

  const handleDeleteAccountConfirm = () => {
    // Handle account deletion logic
    console.log('Account deletion confirmed');
    // TODO: Implement actual account deletion
    setIsDeleteAccountDialogOpen(false);
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ 
    icon, 
    label, 
    value, 
    onPress, 
    rightComponent,
    showChevron = true 
  }: { 
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showChevron?: boolean;
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.settingsItem,
        { 
          backgroundColor: pressed ? colors.primary + '10' : 'transparent',
          borderBottomColor: colors.border,
        }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingsItemInfo}>
          <Text style={[styles.settingsItemLabel, { color: colors.text }]}>{label}</Text>
          {value && (
            <Text style={[styles.settingsItemValue, { color: colors.textSecondary }]}>{value}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightComponent}
        {showChevron && onPress && (
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        )}
      </View>
    </Pressable>
  );

  const ThemeOption = ({ mode, label }: { mode: 'light' | 'dark' | 'system'; label: string }) => {
    const isSelected = themeMode === mode;
    return (
      <Pressable
        style={[
          styles.themeOption,
          {
            backgroundColor: isSelected ? colors.primary + '20' : 'transparent',
            borderColor: isSelected ? colors.primary : colors.border,
          }
        ]}
        onPress={() => setThemeMode(mode)}
      >
        <View style={styles.themeOptionLeft}>
          <View style={[
            styles.radioButton,
            {
              borderColor: isSelected ? colors.primary : colors.border,
              backgroundColor: isSelected ? colors.primary : 'transparent',
            }
          ]}>
            {isSelected && (
              <View style={[styles.radioButtonInner, { backgroundColor: '#FFFFFF' }]} />
            )}
          </View>
          <Text style={[styles.themeOptionLabel, { color: colors.text }]}>{label}</Text>
        </View>
        {mode === 'system' && (
          <Text style={[styles.themeOptionDescription, { color: colors.textSecondary }]}>
            {isDark ? 'Dark' : 'Light'}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, isLargeScreen && styles.headerContentLarge]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Manage your app preferences and account
            </Text>
          </View>
        </View>
      </View>

      {/* Settings Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge
        ]}
      >
        {/* Profile Section */}
        <SettingsSection title="Profile">
          <SettingsItem
            icon="person"
            label="Name"
            value="John Doe"
            onPress={() => {}}
          />
          <SettingsItem
            icon="mail"
            label="Email"
            value="john.doe@example.com"
            onPress={() => {}}
          />
          <SettingsItem
            icon="phone-portrait"
            label="Phone"
            value="+1 234 567 8900"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          <ThemeOption mode="light" label="Light" />
          <ThemeOption mode="dark" label="Dark" />
          <ThemeOption mode="system" label="System Default" />
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon="notifications"
            label="Notifications"
            value="Receive push notifications"
            onPress={handleOpenNotificationDialog}
          />
        </SettingsSection>

        {/* Currency Section */}
        <SettingsSection title="Currency">
          <SettingsItem
            icon="cash"
            label="Default Currency"
            value={CURRENCIES.find(c => c.code === currency)?.name || currency}
            onPress={handleOpenCurrencyDialog}
          />
        </SettingsSection>

        {/* Data & Privacy Section */}
        <SettingsSection title="Data & Privacy">
          <SettingsItem
            icon="shield-checkmark"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <SettingsItem
            icon="document-text"
            label="Terms of Service"
            onPress={() => {}}
          />
          <SettingsItem
            icon="trash"
            label="Delete Account"
            onPress={handleOpenDeleteAccountDialog}
            showChevron={false}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsItem
            icon="information-circle"
            label="App Version"
            value="1.0.0"
            showChevron={false}
          />
          <SettingsItem
            icon="help-circle"
            label="Help & Support"
            onPress={() => {}}
          />
          <SettingsItem
            icon="star"
            label="Rate App"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <Pressable
            style={[styles.logoutButton, { backgroundColor: '#EF444420' }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={[styles.logoutButtonText, { color: '#EF4444' }]}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Notification Settings Dialog */}
      <Modal
        visible={isNotificationDialogOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCloseNotificationDialog}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={handleCloseNotificationDialog}
        >
          <Pressable
            style={[styles.dialog, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <View style={[styles.dialogHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.dialogTitle, { color: colors.text }]}>Notification Settings</Text>
              <Pressable
                onPress={handleCloseNotificationDialog}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Dialog Content */}
            <ScrollView style={styles.dialogContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.dialogDescription, { color: colors.textSecondary }]}>
                Select which notifications you want to receive
              </Text>
              
              <View style={styles.checkboxList}>
                {notificationOptions.map((option) => (
                  <Pressable
                    key={option.id}
                    style={({ pressed }) => [
                      styles.checkboxItem,
                      {
                        backgroundColor: pressed ? colors.primary + '10' : 'transparent',
                        borderBottomColor: colors.border,
                      }
                    ]}
                    onPress={() => handleToggleNotificationOption(option.id)}
                  >
                    <View style={styles.checkboxLeft}>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: option.enabled ? colors.primary : colors.border,
                            backgroundColor: option.enabled ? colors.primary : 'transparent',
                          }
                        ]}
                      >
                        {option.enabled && (
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        )}
                      </View>
                      <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Dialog Actions */}
            <View style={[styles.dialogActions, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveNotificationSettings}
              >
                <Text style={[styles.saveButtonText, { color: '#FFFFFF' }]}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Currency Selection Dialog */}
      <Modal
        visible={isCurrencyDialogOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCurrencyDialog}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={handleCloseCurrencyDialog}
        >
          <Pressable
            style={[styles.dialog, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <View style={[styles.dialogHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.dialogTitle, { color: colors.text }]}>Select Currency</Text>
              <Pressable
                onPress={handleCloseCurrencyDialog}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Dialog Content */}
            <ScrollView style={styles.dialogContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.dialogDescription, { color: colors.textSecondary }]}>
                Choose your default currency
              </Text>
              
              <View style={styles.currencyList}>
                {CURRENCIES.map((currencyOption) => {
                  const isSelected = selectedCurrency === currencyOption.code;
                  return (
                    <Pressable
                      key={currencyOption.code}
                      style={({ pressed }) => [
                        styles.currencyItem,
                        {
                          backgroundColor: pressed ? colors.primary + '10' : 'transparent',
                          borderBottomColor: colors.border,
                        }
                      ]}
                      onPress={() => setSelectedCurrency(currencyOption.code)}
                    >
                      <View style={styles.currencyLeft}>
                        <View style={styles.currencyInfo}>
                          <Text style={[styles.currencyCode, { color: colors.text }]}>
                            {currencyOption.code}
                          </Text>
                          <Text style={[styles.currencyName, { color: colors.textSecondary }]}>
                            {currencyOption.name}
                          </Text>
                        </View>
                        <View style={styles.currencySymbol}>
                          <Text style={[styles.currencySymbolText, { color: colors.text }]}>
                            {currencyOption.symbol}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.radioButton,
                          {
                            borderColor: isSelected ? colors.primary : colors.border,
                            backgroundColor: isSelected ? colors.primary : 'transparent',
                          }
                        ]}
                      >
                        {isSelected && (
                          <View style={[styles.radioButtonInner, { backgroundColor: '#FFFFFF' }]} />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Dialog Actions */}
            <View style={[styles.dialogActions, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveCurrency}
              >
                <Text style={[styles.saveButtonText, { color: '#FFFFFF' }]}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Delete Account Confirmation Dialog */}
      <Modal
        visible={isDeleteAccountDialogOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseDeleteAccountDialog}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={handleCloseDeleteAccountDialog}
        >
          <Pressable 
            style={[styles.deleteDialogContainer, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.deleteDialogHeader}>
              <View style={[styles.deleteIconContainer, { backgroundColor: '#EF444420' }]}>
                <Ionicons name="alert-circle" size={32} color="#EF4444" />
              </View>
              <Text style={[styles.deleteDialogTitle, { color: colors.text }]}>Delete Account</Text>
              <Text style={[styles.deleteDialogMessage, { color: colors.textSecondary }]}>
                Are you sure you want to delete your account? All your data and other data related to you will be permanently deleted and cannot be recovered. This action cannot be undone.
              </Text>
            </View>

            <View style={[styles.deleteDialogActions, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={handleCloseDeleteAccountDialog}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.deleteConfirmButton, { backgroundColor: '#EF4444' }]}
                onPress={handleDeleteAccountConfirm}
              >
                <Text style={styles.deleteConfirmButtonText}>Delete Account</Text>
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
  },
  scrollContentLarge: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsItemInfo: {
    flex: 1,
  },
  settingsItemLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  settingsItemValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
    borderWidth: 1,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  themeOptionLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
  },
  themeOptionDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  logoutSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.sm,
  },
  logoutButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  dialog: {
    width: '100%',
    maxWidth: 500,
    borderRadius: borderRadius.lg,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  dialogTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  dialogContent: {
    padding: spacing.lg,
    maxHeight: 400,
  },
  dialogDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing.lg,
  },
  checkboxList: {
    gap: spacing.xs,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
  },
  checkboxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    justifyContent: 'flex-end',
  },
  saveButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  saveButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  currencyList: {
    gap: spacing.xs,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  currencySymbol: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: 'transparent',
  },
  currencySymbolText: {
    fontSize: typography.fontSize.md,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
  },
  deleteDialogContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  deleteDialogHeader: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  deleteIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteDialogTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  deleteDialogMessage: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  deleteDialogActions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  deleteConfirmButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
});
