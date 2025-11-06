import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Collaborator {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  addedDate: string;
}

interface CollaboratorFormData {
  email: string;
}

interface Invitation {
  id: string;
  fromEmail: string;
  fromName?: string;
  sentDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

const mockCollaborators: Collaborator[] = [
  { id: '1', email: 'john.doe@example.com', status: 'accepted', addedDate: '2024-01-10' },
  { id: '2', email: 'jane.smith@example.com', status: 'pending', addedDate: '2024-01-15' },
  { id: '3', email: 'mike.johnson@example.com', status: 'accepted', addedDate: '2024-01-05' },
];

const mockInvitations: Invitation[] = [
  { id: '1', fromEmail: 'alice.brown@example.com', fromName: 'Alice Brown', sentDate: '2024-01-20', status: 'pending' },
  { id: '2', fromEmail: 'bob.wilson@example.com', fromName: 'Bob Wilson', sentDate: '2024-01-18', status: 'pending' },
  { id: '3', fromEmail: 'charlie.davis@example.com', sentDate: '2024-01-15', status: 'pending' },
];

export default function Collaborate() {
  const { isDark, colors } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInvitationsDialogOpen, setIsInvitationsDialogOpen] = useState(false);
  const [collaboratorToDelete, setCollaboratorToDelete] = useState<Collaborator | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(mockCollaborators);
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  
  // Form state
  const [formData, setFormData] = useState<CollaboratorFormData>({
    email: '',
  });
  const [emailFocused, setEmailFocused] = useState(false);
  const emailAnim = useRef(new Animated.Value(0)).current;
  
  // User search state
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isLargeScreen = dimensions.width >= 1024;
  
  // Dynamic styles for email input (matching sign-in page exactly)
  const emailInputStyles = makeEmailInputStyles(isDark, colors);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

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

  // Mock function to fetch users from database
  const searchUsers = async (email: string): Promise<User[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock user database
    const mockUsers: User[] = [
      { id: '1', email: 'alice.brown@example.com', name: 'Alice Brown' },
      { id: '2', email: 'bob.wilson@example.com', name: 'Bob Wilson' },
      { id: '3', email: 'charlie.davis@example.com', name: 'Charlie Davis' },
      { id: '4', email: 'diana.prince@example.com', name: 'Diana Prince' },
      { id: '5', email: 'emma.watson@example.com', name: 'Emma Watson' },
    ];
    
    if (!email || email.length < 3) {
      return [];
    }
    
    // Filter users by email (case-insensitive)
    const filtered = mockUsers.filter(user => 
      user.email.toLowerCase().includes(email.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(email.toLowerCase()))
    );
    
    return filtered;
  };

  const handleEmailChange = (text: string) => {
    setFormData({ ...formData, email: text });
    setSearchQuery(text);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Reset search if empty
    if (!text.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    // Debounce search
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchUsers(text);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectUser = (user: User) => {
    setFormData({ ...formData, email: user.email });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleOpenDialog = () => {
    setFormData({
      email: '',
    });
    setEmailFocused(false);
    emailAnim.setValue(0);
    setSearchResults([]);
    setSearchQuery('');
    setIsSearching(false);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      email: '',
    });
    setSearchResults([]);
    setSearchQuery('');
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddCollaborator = () => {
    // Validate email
    if (!formData.email.trim()) {
      return;
    }

    if (!validateEmail(formData.email.trim())) {
      // You could show an error message here
      return;
    }

    // Check if email already exists
    const existingCollaborator = collaborators.find(
      c => c.email.toLowerCase() === formData.email.trim().toLowerCase()
    );

    if (existingCollaborator) {
      // You could show an error message here
      return;
    }

    // Create new collaborator
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      email: formData.email.trim(),
      status: 'pending',
      addedDate: new Date().toISOString().split('T')[0],
    };

    setCollaborators([newCollaborator, ...collaborators]);
    handleCloseDialog();
  };

  const handleDeleteClick = (collaborator: Collaborator) => {
    setCollaboratorToDelete(collaborator);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (collaboratorToDelete) {
      setCollaborators(collaborators.filter(c => c.id !== collaboratorToDelete.id));
      setCollaboratorToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setCollaboratorToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleOpenInvitationsDialog = () => {
    setIsInvitationsDialogOpen(true);
  };

  const handleCloseInvitationsDialog = () => {
    setIsInvitationsDialogOpen(false);
  };

  const handleAcceptInvitation = (invitation: Invitation) => {
    // Update invitation status
    setInvitations(prev =>
      prev.map(inv =>
        inv.id === invitation.id ? { ...inv, status: 'accepted' } : inv
      )
    );

    // Add to collaborators list
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      email: invitation.fromEmail,
      status: 'accepted',
      addedDate: new Date().toISOString().split('T')[0],
    };

    setCollaborators([newCollaborator, ...collaborators]);
    
    // Remove invitation after a delay (or immediately)
    setTimeout(() => {
      setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
    }, 1000);
  };

  const handleRejectInvitation = (invitation: Invitation) => {
    // Update invitation status
    setInvitations(prev =>
      prev.map(inv =>
        inv.id === invitation.id ? { ...inv, status: 'rejected' } : inv
      )
    );

    // Remove invitation after a delay
    setTimeout(() => {
      setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, isLargeScreen && styles.headerContentLarge]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Collaborate</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Invite family members to collaborate on your finances
            </Text>
          </View>
          <View style={[styles.addButtonContainer, isLargeScreen && styles.addButtonContainerLarge]}>
            <Pressable
              style={[styles.viewInvitationsButton, { borderColor: colors.border }]}
              onPress={handleOpenInvitationsDialog}
            >
              <Ionicons name="mail-outline" size={20} color={colors.text} />
              <Text style={[styles.viewInvitationsButtonText, { color: colors.text }]}>View Invitations</Text>
            </Pressable>
            <Pressable
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={handleOpenDialog}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Collaborator</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Collaborators List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge
        ]}
      >
        {collaborators.map((collaborator) => (
          <View
            key={collaborator.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name="person" size={24} color={colors.primary} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{collaborator.email}</Text>
                  <View style={styles.cardMeta}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(collaborator.status) + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(collaborator.status) }
                      ]}>
                        {getStatusLabel(collaborator.status)}
                      </Text>
                    </View>
                    <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                      Added: {collaborator.addedDate}
                    </Text>
                  </View>
                </View>
              </View>
              <Pressable
                style={[styles.deleteButton, { backgroundColor: '#EF444420' }]}
                onPress={() => handleDeleteClick(collaborator)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Collaborator Dialog */}
      <Modal
        visible={isDialogOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseDialog}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={handleCloseDialog}
        >
          <Pressable 
            style={[styles.dialogContainer, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.dialogHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.dialogTitle, { color: colors.text }]}>Add Collaborator</Text>
              <Pressable onPress={handleCloseDialog}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.dialogContent}>
              {/* Email */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Email Address *</Text>
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
                    style={emailInputStyles.input}
                    value={formData.email}
                    onChangeText={handleEmailChange}
                    placeholder="Enter email address"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    selectionColor={colors.primary}
                    cursorColor={colors.primary}
                  />
                </Animated.View>
                
                {/* Search Results */}
                {searchQuery.trim().length > 0 && (
                  <View style={[styles.searchResultsContainer, { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border 
                  }]}>
                    {isSearching ? (
                      <View style={styles.searchLoading}>
                        <Text style={[styles.searchLoadingText, { color: colors.textSecondary }]}>
                          Searching...
                        </Text>
                      </View>
                    ) : searchResults.length > 0 ? (
                      <>
                        {searchResults.map((user) => (
                          <Pressable
                            key={user.id}
                            style={({ pressed }) => [
                              styles.searchResultItem,
                              {
                                backgroundColor: pressed ? colors.primary + '10' : 'transparent',
                                borderBottomColor: colors.border,
                              }
                            ]}
                            onPress={() => handleSelectUser(user)}
                          >
                            <View style={[styles.searchResultAvatar, { backgroundColor: colors.primary }]}>
                              <Text style={styles.searchResultAvatarText}>
                                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                              </Text>
                            </View>
                            <View style={styles.searchResultInfo}>
                              {user.name && (
                                <Text style={[styles.searchResultName, { color: colors.text }]}>
                                  {user.name}
                                </Text>
                              )}
                              <Text style={[styles.searchResultEmail, { color: colors.textSecondary }]}>
                                {user.email}
                              </Text>
                            </View>
                          </Pressable>
                        ))}
                      </>
                    ) : (
                      <View style={styles.searchNoResults}>
                        <Text style={[styles.searchNoResultsText, { color: colors.textSecondary }]}>
                          No user found with the mail id {searchQuery}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                
                <Text style={[styles.formHint, { color: colors.textSecondary }]}>
                  An invitation will be sent to this email address
                </Text>
              </View>
            </View>

            {/* Dialog Actions */}
            <View style={[styles.dialogActions, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={handleCloseDialog}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleAddCollaborator}
              >
                <Text style={styles.saveButtonText}>Send Invitation</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal
        visible={isDeleteDialogOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDeleteCancel}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={handleDeleteCancel}
        >
          <Pressable 
            style={[styles.deleteDialogContainer, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.deleteDialogHeader}>
              <View style={[styles.deleteIconContainer, { backgroundColor: '#EF444420' }]}>
                <Ionicons name="alert-circle" size={32} color="#EF4444" />
              </View>
              <Text style={[styles.deleteDialogTitle, { color: colors.text }]}>Remove Collaborator</Text>
              <Text style={[styles.deleteDialogMessage, { color: colors.textSecondary }]}>
                Are you sure you want to remove "{collaboratorToDelete?.email}"? This action cannot be undone.
              </Text>
            </View>

            <View style={[styles.deleteDialogActions, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={handleDeleteCancel}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.deleteConfirmButton, { backgroundColor: '#EF4444' }]}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.deleteConfirmButtonText}>Remove</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* View Invitations Dialog */}
      <Modal
        visible={isInvitationsDialogOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseInvitationsDialog}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={handleCloseInvitationsDialog}
        >
          <Pressable 
            style={[styles.dialogContainer, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.dialogHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.dialogTitle, { color: colors.text }]}>Invitations</Text>
              <Pressable onPress={handleCloseInvitationsDialog}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView 
              style={styles.dialogContent}
              showsVerticalScrollIndicator={false}
            >
              {invitations.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="mail-outline" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    No pending invitations
                  </Text>
                </View>
              ) : (
                invitations.map((invitation) => (
                  <View
                    key={invitation.id}
                    style={[
                      styles.invitationItem,
                      { 
                        borderBottomColor: colors.border,
                        backgroundColor: invitation.status === 'accepted' 
                          ? '#10B98120' 
                          : invitation.status === 'rejected'
                          ? '#EF444420'
                          : 'transparent'
                      }
                    ]}
                  >
                    <View style={styles.invitationLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <Ionicons name="person" size={24} color={colors.primary} />
                      </View>
                      <View style={styles.invitationInfo}>
                        <Text style={[styles.invitationFromEmail, { color: colors.text }]}>
                          {invitation.fromName || invitation.fromEmail}
                        </Text>
                        {invitation.fromName && (
                          <Text style={[styles.invitationEmail, { color: colors.textSecondary }]}>
                            {invitation.fromEmail}
                          </Text>
                        )}
                        <View style={styles.invitationDateRow}>
                          <Text style={[styles.invitationDate, { color: colors.textSecondary }]}>
                            Sent: {invitation.sentDate}
                          </Text>
                          {invitation.status === 'pending' && (
                            <View style={styles.invitationActions}>
                              <Pressable
                                style={[styles.rejectButton, { backgroundColor: '#EF444420' }]}
                                onPress={() => handleRejectInvitation(invitation)}
                              >
                                <Ionicons name="close" size={18} color="#EF4444" />
                                <Text style={styles.rejectButtonText}>Reject</Text>
                              </Pressable>
                              <Pressable
                                style={[styles.acceptButton, { backgroundColor: '#10B982' }]}
                                onPress={() => handleAcceptInvitation(invitation)}
                              >
                                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                                <Text style={styles.acceptButtonText}>Accept</Text>
                              </Pressable>
                            </View>
                          )}
                        </View>
                        {invitation.status === 'accepted' && (
                          <Text style={[styles.invitationStatus, { color: '#10B981' }]}>
                            ✓ Accepted
                          </Text>
                        )}
                        {invitation.status === 'rejected' && (
                          <Text style={[styles.invitationStatus, { color: '#EF4444' }]}>
                            ✗ Rejected
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Dialog Actions */}
            <View style={[styles.dialogActions, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={handleCloseInvitationsDialog}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Close</Text>
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
    gap: spacing.md,
  },
  headerContentLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  headerLeft: {
    flex: 1,
  },
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addButtonContainerLarge: {
    justifyContent: 'flex-start',
  },
  viewInvitationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  viewInvitationsButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  scrollContentLarge: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: spacing.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  cardDate: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 500,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  dialogTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  dialogContent: {
    padding: spacing.md,
  },
  formField: {
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
    marginBottom: spacing.xs,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_400Regular',
    minHeight: 44,
  },
  formHint: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
    marginTop: spacing.xs,
  },
  dialogActions: {
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
  deleteDialogContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  deleteDialogHeader: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  deleteIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  deleteDialogTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  deleteDialogMessage: {
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  deleteDialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    padding: spacing.md,
    borderTopWidth: 1,
  },
  deleteConfirmButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  deleteConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_400Regular',
  },
  invitationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  invitationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    flex: 1,
  },
  invitationInfo: {
    flex: 1,
  },
  invitationFromEmail: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: spacing.xs,
  },
  invitationEmail: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing.xs,
  },
  invitationDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  invitationDate: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  invitationStatus: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    marginTop: spacing.xs,
  },
  invitationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  rejectButtonText: {
    color: '#EF4444',
    fontSize: typography.fontSize.sm,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  searchResultsContainer: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    maxHeight: 200,
    overflow: 'hidden',
  },
  searchLoading: {
    padding: spacing.md,
    alignItems: 'center',
  },
  searchLoadingText: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  searchResultAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultAvatarText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: spacing.xs,
  },
  searchResultEmail: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  searchNoResults: {
    padding: spacing.md,
    alignItems: 'center',
  },
  searchNoResultsText: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});

// Dynamic styles for email input (matching sign-in page)
const makeEmailInputStyles = (isDark: boolean, colors: any) =>
  StyleSheet.create({
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
  });
