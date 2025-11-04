import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Dimensions, LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View } from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid', path: '/(main-screens)/dashboard' },
  { 
    id: 'transaction', 
    label: 'Transaction', 
    icon: 'swap-horizontal',
    children: [
      { id: 'transaction-entry', label: 'Entry', icon: 'add-circle', path: '/(main-screens)/transactions/entry' },
      { id: 'transaction-category', label: 'Category', icon: 'folder', path: '/(main-screens)/transactions/category' },
      { id: 'transaction-report', label: 'Report', icon: 'document-text', path: '/(main-screens)/transactions/report' },
    ]
  },
  { 
    id: 'lend-borrow', 
    label: 'Lend & Borrow', 
    icon: 'cash',
    children: [
      { id: 'lend-entry', label: 'Entry', icon: 'add-circle', path: '/(main-screens)/lend-borrow/entry' },
      { id: 'lend-report', label: 'Report', icon: 'document-text', path: '/(main-screens)/lend-borrow/report' },
    ]
  },
  { id: 'budget', label: 'Budget', icon: 'wallet', path: '/(main-screens)/budget' },
  { id: 'collaborate', label: 'Collaborate', icon: 'people', path: '/(main-screens)/collaborate' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/(main-screens)/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export function Sidebar({ isOpen, onClose, onNavigate }: SidebarProps) {
  const { isDark, colors } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isLargeScreen = dimensions.width >= 1024;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [slideAnim] = useState(new Animated.Value(isLargeScreen ? 1 : 0));
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (!isLargeScreen) {
      setIsCollapsed(!isOpen);
    }
  }, [isLargeScreen, isOpen]);

  useEffect(() => {
    if (!isLargeScreen) {
      Animated.timing(slideAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, isLargeScreen]);

  const toggleExpand = (itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isExpanded = (itemId: string) => expandedItems.has(itemId);

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const expanded = isExpanded(item.id);
    const indent = level * spacing.md;

    return (
      <View key={item.id}>
        <Pressable
          onPress={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else if (item.path) {
              onNavigate?.(item.path);
              if (!isLargeScreen) {
                onClose();
              }
            }
          }}
          style={({ pressed }) => [
            styles.menuItem,
            {
              backgroundColor: pressed ? colors.primary + '20' : 'transparent',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              paddingLeft: isCollapsed ? 0 : spacing.md + indent,
              marginHorizontal: isCollapsed ? spacing.xs : spacing.sm,
            }
          ]}
        >
          <Ionicons name={item.icon} size={24} color={colors.textSecondary} />
          {!isCollapsed && (
            <>
              <Text style={[styles.menuItemText, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
              {hasChildren && (
                <Ionicons 
                  name={expanded ? 'chevron-down' : 'chevron-forward'} 
                  size={20} 
                  color={colors.textSecondary}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </>
          )}
        </Pressable>
        {hasChildren && !isCollapsed && expanded && (
          <View>
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </View>
        )}
      </View>
    );
  };

  const renderMobileMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const expanded = isExpanded(item.id);
    const indent = level * spacing.md;

    return (
      <View key={item.id}>
        <Pressable
          onPress={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else if (item.path) {
              onNavigate?.(item.path);
              onClose();
            }
          }}
          style={({ pressed }) => [
            styles.menuItem,
            styles.mobileMenuItem,
            {
              backgroundColor: pressed ? colors.primary + '20' : 'transparent',
              paddingLeft: spacing.md + indent,
            }
          ]}
        >
          <Ionicons name={item.icon} size={24} color={colors.textSecondary} />
          <Text style={[styles.menuItemText, { color: colors.textSecondary }]}>
            {item.label}
          </Text>
          {hasChildren && (
            <Ionicons 
              name={expanded ? 'chevron-down' : 'chevron-forward'} 
              size={20} 
              color={colors.textSecondary}
              style={{ marginLeft: 'auto' }}
            />
          )}
        </Pressable>
        {hasChildren && expanded && (
          <View>
            {item.children!.map(child => renderMobileMenuItem(child, level + 1))}
          </View>
        )}
      </View>
    );
  };

  if (isLargeScreen) {
    return (
      <View 
        style={[
          styles.desktopSidebar,
          {
            backgroundColor: colors.surface,
            borderRightColor: colors.border,
            width: isCollapsed ? 80 : 280,
          }
        ]}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.header, isCollapsed && styles.headerCollapsed]}>
            {!isCollapsed && (
              <Text style={[styles.title, { color: colors.text }]}>Menu</Text>
            )}
            <Pressable 
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setIsCollapsed(!isCollapsed);
              }}
              style={styles.collapseButton}
            >
              <Ionicons 
                name={isCollapsed ? 'chevron-forward' : 'chevron-back'} 
                size={20} 
                color={colors.text} 
              />
            </Pressable>
          </View>
          
          {menuItems.map((item) => renderMenuItem(item))}
        </ScrollView>
      </View>
    );
  }

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-280, 0],
  });

  return (
    <>
      {isOpen && (
        <Pressable style={styles.overlay} onPress={onClose}>
          <Animated.View 
            style={[
              styles.mobileSidebar,
              {
                backgroundColor: colors.surface,
                transform: [{ translateX }],
              }
            ]}
          >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Menu</Text>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </Pressable>
              </View>
              
              {menuItems.map((item) => renderMobileMenuItem(item))}
            </ScrollView>
          </Animated.View>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  desktopSidebar: {
    width: 280,
    borderRightWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mobileSidebar: {
    width: 280,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    minHeight: 64,
  },
  headerCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Inter_700Bold',
  },
  collapseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderRadius: borderRadius.sm,
    marginVertical: 2,
  },
  mobileMenuItem: {
    justifyContent: 'flex-start',
  },
  menuItemText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
});
