import { Dropdown } from '@/components/ui/dropdown';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
}

interface TransactionFormData {
  title: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', title: 'Grocery Shopping', amount: 156.50, type: 'expense', category: 'Food', date: '2024-01-15', description: 'Weekly groceries from supermarket' },
  { id: '2', title: 'Salary', amount: 3000, type: 'income', category: 'Salary', date: '2024-01-01', description: 'Monthly salary payment' },
  { id: '3', title: 'Gas Bill', amount: 75.25, type: 'expense', category: 'Utilities', date: '2024-01-12', description: 'Electricity bill' },
  { id: '4', title: 'Freelance Work', amount: 500, type: 'income', category: 'Freelance', date: '2024-01-10', description: 'Web development project' },
  { id: '5', title: 'Restaurant', amount: 89.90, type: 'expense', category: 'Food', date: '2024-01-08', description: 'Dinner with family' },
  { id: '6', title: 'Coffee', amount: 12.50, type: 'expense', category: 'Food', date: '2024-01-07', description: 'Morning coffee' },
];

export default function TransactionEntry() {
  const { colors } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string[]>(['all']);
  const [timeFilter, setTimeFilter] = useState<'1D' | '1W' | '1F' | '1M' | '1Y' | 'ALL'>('ALL');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  
  // Form state
  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
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

  // Get unique categories
  const categories = Array.from(new Set(transactions.map(t => t.category)));
  
  // Form category options (without 'all')
  const formCategoryOptions = categories.map(cat => ({ label: cat, value: cat }));
  
  // Form type options
  const formTypeOptions = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  // Prepare dropdown options
  const typeOptions = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...categories.map(cat => ({ label: cat, value: cat })),
  ];

  const timeOptions = [
    { label: '1 Day', value: '1D' },
    { label: '1 Week', value: '1W' },
    { label: '1 Fortnight', value: '1F' },
    { label: '1 Month', value: '1M' },
    { label: '1 Year', value: '1Y' },
    { label: 'All', value: 'ALL' },
  ];

  // Calculate date range based on time filter
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    today.setHours(0, 0, 0, 0);
    
    switch (timeFilter) {
      case '1D':
        return new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
      case '1W':
        return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '1F':
        return new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
      case '1M':
        return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '1Y':
        return new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
      case 'ALL':
        return null;
      default:
        return null;
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
  };

  const handleSaveTransaction = () => {
    // Validate form
    if (!formData.title.trim() || !formData.amount.trim() || !formData.category || !formData.date) {
      // You could add error handling here
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      // Invalid amount
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      amount: amount,
      type: formData.type,
      category: formData.category,
      date: formData.date,
      description: formData.description.trim() || undefined,
    };

    setTransactions([newTransaction, ...transactions]);
    handleCloseDialog();
  };

  const filteredTransactions = transactions.filter(t => {
    // Type filter
    if (filter !== 'all' && t.type !== filter) return false;
    
    // Category filter (multi-select)
    if (!categoryFilter.includes('all') && !categoryFilter.includes(t.category)) {
      return false;
    }
    
    // Time filter
    if (timeFilter !== 'ALL') {
      const startDate = getDateRange();
      if (startDate) {
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0, 0, 0, 0);
        if (transactionDate < startDate) return false;
      }
    }
    
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, isLargeScreen && styles.headerContentLarge]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Transaction Entry</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Manage your income and expenses
            </Text>
          </View>
          <View style={[styles.addButtonContainer, isLargeScreen && styles.addButtonContainerLarge]}>
            <Pressable
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={handleOpenDialog}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Filter Section */}
      <View style={[styles.filters, { borderBottomColor: colors.border }]}>
        <View style={[styles.filterRow, isLargeScreen && styles.filterRowLarge]}>
          {/* Type Filter */}
          <Dropdown
            id="type"
            title="Type"
            options={typeOptions}
            selectedValue={filter}
            onValueChange={(value) => setFilter(value as 'all' | 'income' | 'expense')}
            placeholder="Select type"
            openDropdownId={openDropdownId}
            onOpenChange={setOpenDropdownId}
          />

          {/* Category Filter */}
          <Dropdown
            id="category"
            title="Category"
            options={categoryOptions}
            selectedValues={categoryFilter}
            onValuesChange={setCategoryFilter}
            placeholder="Select category"
            openDropdownId={openDropdownId}
            onOpenChange={setOpenDropdownId}
            multiSelect={true}
          />

          {/* Time Period Filter */}
          <Dropdown
            id="time"
            title="Time Period"
            options={timeOptions}
            selectedValue={timeFilter}
            onValueChange={(value) => setTimeFilter(value as '1D' | '1W' | '1F' | '1M' | '1Y' | 'ALL')}
            placeholder="Select period"
            openDropdownId={openDropdownId}
            onOpenChange={setOpenDropdownId}
          />
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge
        ]}
      >
        {filteredTransactions.map((transaction) => (
          <View
            key={transaction.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: transaction.type === 'income' ? '#10B98120' : '#EF444420' }
                ]}>
                  <Ionicons
                    name={transaction.type === 'income' ? 'arrow-up' : 'arrow-down'}
                    size={24}
                    color={transaction.type === 'income' ? '#10B981' : '#EF4444'}
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{transaction.title}</Text>
                  <Text style={[styles.cardCategory, { color: colors.textSecondary }]}>
                    {transaction.category}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.cardAmount,
                  { color: transaction.type === 'income' ? '#10B981' : '#EF4444' }
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </Text>
            </View>
            {transaction.description && (
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {transaction.description}
              </Text>
            )}
            <View style={styles.cardFooter}>
              <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                {transaction.date}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Transaction Dialog */}
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
              <Text style={[styles.dialogTitle, { color: colors.text }]}>Add Transaction</Text>
              <Pressable onPress={handleCloseDialog}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView style={styles.dialogContent} showsVerticalScrollIndicator={false}>
              {/* Title */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Title *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.inputBackground || colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="Enter transaction title"
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
                  onValueChange={(value) => setFormData({ ...formData, type: value as 'income' | 'expense' })}
                  placeholder="Select type"
                  openDropdownId={formDropdownOpen}
                  onOpenChange={setFormDropdownOpen}
                />
              </View>

              {/* Category */}
              <View style={styles.formField}>
                <Dropdown
                  id="form-category"
                  title="Category *"
                  options={formCategoryOptions}
                  selectedValue={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  placeholder="Select category"
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
                onPress={handleSaveTransaction}
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
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  cardAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  cardDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    maxHeight: 400,
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



