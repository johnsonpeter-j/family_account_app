import { Dropdown } from '@/components/ui/dropdown';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface LendBorrow {
  id: string;
  personName: string;
  amount: number;
  type: 'lend' | 'borrow';
  status: 'pending' | 'paid' | 'received';
  date: string;
  description?: string;
}

interface LendBorrowFormData {
  personName: string;
  amount: string;
  type: 'lend' | 'borrow';
  status: 'pending' | 'paid' | 'received';
  date: string;
  description: string;
}

const mockLendBorrow: LendBorrow[] = [
  { id: '1', personName: 'John Doe', amount: 500, type: 'lend', status: 'pending', date: '2024-01-15', description: 'Loan for emergency' },
  { id: '2', personName: 'Jane Smith', amount: 300, type: 'borrow', status: 'paid', date: '2024-01-10', description: 'Borrowed for shopping' },
  { id: '3', personName: 'Mike Johnson', amount: 1000, type: 'lend', status: 'received', date: '2024-01-05', description: 'Business loan' },
  { id: '4', personName: 'Sarah Williams', amount: 250, type: 'borrow', status: 'pending', date: '2024-01-20', description: 'Personal loan' },
  { id: '5', personName: 'David Brown', amount: 750, type: 'lend', status: 'pending', date: '2024-01-18', description: 'Friend loan' },
];

export default function LendBorrowEntry() {
  const { colors } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [filter, setFilter] = useState<'all' | 'lend' | 'borrow'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'received'>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entries, setEntries] = useState<LendBorrow[]>(mockLendBorrow);
  const [editingEntry, setEditingEntry] = useState<LendBorrow | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<LendBorrowFormData>({
    personName: '',
    amount: '',
    type: 'lend',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  
  const [formDropdownOpen, setFormDropdownOpen] = useState<string | null>(null);
  const isLargeScreen = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Form type options
  const formTypeOptions = [
    { label: 'Lend', value: 'lend' },
    { label: 'Borrow', value: 'borrow' },
  ];

  // Form status options based on type
  const getStatusOptions = (type: 'lend' | 'borrow') => {
    if (type === 'lend') {
      return [
        { label: 'Pending', value: 'pending' },
        { label: 'Received', value: 'received' },
      ];
    } else {
      return [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
      ];
    }
  };

  // Filter options
  const typeOptions = [
    { label: 'All', value: 'all' },
    { label: 'Lend', value: 'lend' },
    { label: 'Borrow', value: 'borrow' },
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
    { label: 'Received', value: 'received' },
  ];

  // Filter entries based on selected filters
  const filteredEntries = entries.filter(entry => {
    // Type filter
    if (filter !== 'all' && entry.type !== filter) return false;
    
    // Status filter
    if (statusFilter !== 'all' && entry.status !== statusFilter) return false;
    
    return true;
  });

  const handleOpenDialog = (entry?: LendBorrow) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        personName: entry.personName,
        amount: entry.amount.toString(),
        type: entry.type,
        status: entry.status,
        date: entry.date,
        description: entry.description || '',
      });
    } else {
      setEditingEntry(null);
      setFormData({
        personName: '',
        amount: '',
        type: 'lend',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
    setFormData({
      personName: '',
      amount: '',
      type: 'lend',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
  };

  const handleSaveEntry = () => {
    // Validate form
    if (!formData.personName.trim() || !formData.amount.trim() || !formData.date) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    // Ensure status is valid for the selected type
    let status = formData.status;
    if (formData.type === 'lend' && status === 'paid') {
      status = 'pending';
    }
    if (formData.type === 'borrow' && status === 'received') {
      status = 'pending';
    }

    if (editingEntry) {
      // Update existing entry
      setEntries(entries.map(entry => 
        entry.id === editingEntry.id
          ? {
              ...entry,
              personName: formData.personName.trim(),
              amount: amount,
              type: formData.type,
              status: status,
              date: formData.date,
              description: formData.description.trim() || undefined,
            }
          : entry
      ));
    } else {
      // Create new entry
      const newEntry: LendBorrow = {
        id: Date.now().toString(),
        personName: formData.personName.trim(),
        amount: amount,
        type: formData.type,
        status: status,
        date: formData.date,
        description: formData.description.trim() || undefined,
      };
      setEntries([newEntry, ...entries]);
    }

    handleCloseDialog();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'received':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'received':
        return 'Received';
      case 'pending':
        return 'Pending';
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
            <Text style={[styles.title, { color: colors.text }]}>Lend & Borrow Entry</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Manage your lending and borrowing records
            </Text>
          </View>
          <View style={[styles.addButtonContainer, isLargeScreen && styles.addButtonContainerLarge]}>
            <Pressable
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => handleOpenDialog()}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Entry</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Filter Section */}
      <View style={[styles.filters, { borderBottomColor: colors.border }]}>
        <View style={[styles.filterRow, isLargeScreen && styles.filterRowLarge]}>
          {/* Type Filter */}
          <View style={[styles.filterDropdownContainer, isLargeScreen && styles.filterDropdownContainerLarge]}>
            <Dropdown
              id="type-filter"
              title="Type"
              options={typeOptions}
              selectedValue={filter}
              onValueChange={(value) => setFilter(value as 'all' | 'lend' | 'borrow')}
              placeholder="Select type"
              openDropdownId={openDropdownId}
              onOpenChange={setOpenDropdownId}
            />
          </View>

          {/* Status Filter */}
          <View style={[styles.filterDropdownContainer, isLargeScreen && styles.filterDropdownContainerLarge]}>
            <Dropdown
              id="status-filter"
              title="Status"
              options={statusOptions}
              selectedValue={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'all' | 'pending' | 'paid' | 'received')}
              placeholder="Select status"
              openDropdownId={openDropdownId}
              onOpenChange={setOpenDropdownId}
            />
          </View>
        </View>
      </View>

      {/* Entries List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge
        ]}
      >
        {filteredEntries.map((entry) => (
          <View
            key={entry.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: entry.type === 'lend' ? '#3B82F620' : '#8B5CF620' }
                ]}>
                  <Ionicons
                    name={entry.type === 'lend' ? 'arrow-up' : 'arrow-down'}
                    size={24}
                    color={entry.type === 'lend' ? '#3B82F6' : '#8B5CF6'}
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{entry.personName}</Text>
                  <View style={styles.cardMeta}>
                    <View style={[
                      styles.typeBadge,
                      { 
                        backgroundColor: entry.type === 'lend' ? '#3B82F620' : '#8B5CF620' 
                      }
                    ]}>
                      <Text style={[
                        styles.typeText,
                        { 
                          color: entry.type === 'lend' ? '#3B82F6' : '#8B5CF6' 
                        }
                      ]}>
                        {entry.type === 'lend' ? 'Lend' : 'Borrow'}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(entry.status) + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(entry.status) }
                      ]}>
                        {getStatusLabel(entry.status)}
                      </Text>
                    </View>
                  </View>
                  {entry.description && (
                    <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                      {entry.description}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.cardRight}>
                <Text
                  style={[
                    styles.cardAmount,
                    { color: entry.type === 'lend' ? '#3B82F6' : '#8B5CF6' }
                  ]}
                >
                  ${entry.amount.toFixed(2)}
                </Text>
                <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                  {entry.date}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add/Edit Entry Dialog */}
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
            <View style={styles.dialogHeader}>
              <Text style={[styles.dialogTitle, { color: colors.text }]}>
                {editingEntry ? 'Edit Entry' : 'Add Entry'}
              </Text>
              <Pressable onPress={handleCloseDialog}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView style={styles.dialogContent} showsVerticalScrollIndicator={false}>
              {/* Person Name */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Person Name *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.inputBackground || colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.personName}
                  onChangeText={(text) => setFormData({ ...formData, personName: text })}
                  placeholder="Enter person name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* Amount */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Amount *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.inputBackground || colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                  placeholder="Enter amount"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Type */}
              <View style={styles.formField}>
                <Dropdown
                  id="form-type"
                  title="Type *"
                  options={formTypeOptions}
                  selectedValue={formData.type}
                  onValueChange={(value) => {
                    const newType = value as 'lend' | 'borrow';
                    // Reset status when type changes
                    setFormData({ 
                      ...formData, 
                      type: newType,
                      status: 'pending'
                    });
                  }}
                  placeholder="Select type"
                  openDropdownId={formDropdownOpen}
                  onOpenChange={setFormDropdownOpen}
                />
              </View>

              {/* Status */}
              <View style={styles.formField}>
                <Dropdown
                  id="form-status"
                  title="Status *"
                  options={getStatusOptions(formData.type)}
                  selectedValue={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as 'pending' | 'paid' | 'received' })}
                  placeholder="Select status"
                  openDropdownId={formDropdownOpen}
                  onOpenChange={setFormDropdownOpen}
                />
              </View>

              {/* Date */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Date *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.inputBackground || colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* Description */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Description</Text>
                <TextInput
                  style={[
                    styles.formTextArea,
                    {
                      backgroundColor: colors.inputBackground || colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Enter description (optional)"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

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
                onPress={handleSaveEntry}
              >
                <Text style={styles.saveButtonText}>Save</Text>
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
  },
  addButtonContainerLarge: {
    justifyContent: 'flex-start',
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
  filters: {
    borderBottomWidth: 1,
    padding: spacing.md,
    zIndex: 9999,
    elevation: 9999,
    overflow: 'visible',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    overflow: 'visible',
  },
  filterRowLarge: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  filterDropdownContainer: {
    width: '100%',
    minWidth: 120,
  },
  filterDropdownContainerLarge: {
    width: 250,
    minWidth: 250,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
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
    zIndex: 1,
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
  cardRight: {
    alignItems: 'flex-end',
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
    marginBottom: spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
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
  cardDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    marginTop: spacing.xs,
  },
  cardAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    marginBottom: spacing.xs,
  },
  cardDate: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
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
    maxHeight: '90%',
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
    maxHeight: 500,
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
  formTextArea: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    fontFamily: 'Inter_400Regular',
    minHeight: 100,
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
});
