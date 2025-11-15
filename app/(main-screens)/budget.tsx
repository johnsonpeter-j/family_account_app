import { Dropdown } from '@/components/ui/dropdown';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
}

interface BudgetFormData {
  categoryId: string;
  budgetAmount: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
}

// Mock categories (in real app, these would come from the categories state)
const mockCategories = [
  { id: '1', name: 'Food', type: 'expense' },
  { id: '3', name: 'Utilities', type: 'expense' },
  { id: '5', name: 'Transport', type: 'expense' },
  { id: '6', name: 'Shopping', type: 'expense' },
];

const mockBudgets: Budget[] = [
  { id: '1', categoryId: '1', categoryName: 'Food', budgetAmount: 500, spentAmount: 320.50, period: 'monthly' },
  { id: '2', categoryId: '3', categoryName: 'Utilities', budgetAmount: 200, spentAmount: 175.25, period: 'monthly' },
  { id: '3', categoryId: '5', categoryName: 'Transport', budgetAmount: 300, spentAmount: 250, period: 'weekly' },
  { id: '4', categoryId: '6', categoryName: 'Shopping', budgetAmount: 400, spentAmount: 450, period: 'monthly' },
];

export default function Budget() {
  const { colors } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [filter, setFilter] = useState<'all' | 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly'>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<BudgetFormData>({
    categoryId: '',
    budgetAmount: '',
    period: 'monthly',
  });
  
  const [formDropdownOpen, setFormDropdownOpen] = useState<string | null>(null);
  const isLargeScreen = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Get expense categories only
  const expenseCategories = mockCategories.filter(cat => cat.type === 'expense');
  const categoryOptions = expenseCategories.map(cat => ({ label: cat.name, value: cat.id }));

  // Period options
  const periodOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Half-Yearly', value: 'half-yearly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  // Filter options
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Half-Yearly', value: 'half-yearly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  // Filter budgets based on selected period
  const filteredBudgets = budgets.filter(budget => {
    if (filter === 'all') return true;
    return budget.period === filter;
  });

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        categoryId: budget.categoryId,
        budgetAmount: budget.budgetAmount.toString(),
        period: budget.period,
      });
    } else {
      setEditingBudget(null);
      setFormData({
        categoryId: '',
        budgetAmount: '',
        period: 'monthly',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBudget(null);
    setFormData({
      categoryId: '',
      budgetAmount: '',
      period: 'monthly',
    });
  };

  const handleSaveBudget = () => {
    // Validate form
    if (!formData.categoryId || !formData.budgetAmount.trim()) {
      return;
    }

    const budgetAmount = parseFloat(formData.budgetAmount);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      return;
    }

    const selectedCategory = expenseCategories.find(cat => cat.id === formData.categoryId);
    if (!selectedCategory) return;

    // Check if category already has a budget for this period
    const existingBudget = budgets.find(
      b => b.categoryId === formData.categoryId && 
      b.period === formData.period &&
      (!editingBudget || b.id !== editingBudget.id)
    );

    if (existingBudget) {
      // You could show an error message here
      return;
    }

    if (editingBudget) {
      // Update existing budget
      setBudgets(budgets.map(budget => 
        budget.id === editingBudget.id
          ? {
              ...budget,
              categoryId: formData.categoryId,
              categoryName: selectedCategory.name,
              budgetAmount: budgetAmount,
              period: formData.period,
            }
          : budget
      ));
    } else {
      // Create new budget
      const newBudget: Budget = {
        id: Date.now().toString(),
        categoryId: formData.categoryId,
        categoryName: selectedCategory.name,
        budgetAmount: budgetAmount,
        spentAmount: 0, // In real app, calculate from transactions
        period: formData.period,
      };
      setBudgets([newBudget, ...budgets]);
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (budget: Budget) => {
    setBudgetToDelete(budget);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (budgetToDelete) {
      setBudgets(budgets.filter(budget => budget.id !== budgetToDelete.id));
      setBudgetToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setBudgetToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const calculateRemaining = (budget: Budget) => {
    return budget.budgetAmount - budget.spentAmount;
  };

  const calculateProgress = (budget: Budget) => {
    if (budget.budgetAmount === 0) return 0;
    return Math.min((budget.spentAmount / budget.budgetAmount) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return '#EF4444'; // Over budget
    if (progress >= 80) return '#F59E0B'; // Warning
    return '#10B981'; // Good
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, isLargeScreen && styles.headerContentLarge]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Budget Management</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Set and track budgets by category
            </Text>
          </View>
          <View style={[styles.addButtonContainer, isLargeScreen && styles.addButtonContainerLarge]}>
            <Pressable
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => handleOpenDialog()}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Budget</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Filter Section */}
      <View style={[styles.filters, { borderBottomColor: colors.border }]}>
        <View style={[styles.filterRow, isLargeScreen && styles.filterRowLarge]}>
          <Dropdown
            id="period-filter"
            title="Period"
            options={filterOptions}
            selectedValue={filter}
            onValueChange={(value) =>
              setFilter(value as 'all' | 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly')
            }
            placeholder="Select period"
            openDropdownId={openDropdownId}
            onOpenChange={setOpenDropdownId}
          />
        </View>
      </View>

      {/* Budgets List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge
        ]}
      >
        {filteredBudgets.map((budget) => {
          const remaining = calculateRemaining(budget);
          const progress = calculateProgress(budget);
          const progressColor = getProgressColor(progress);
          const isOverBudget = budget.spentAmount > budget.budgetAmount;

          return (
            <View
              key={budget.id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="wallet" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{budget.categoryName}</Text>
                    <View style={styles.cardMeta}>
                      <View style={[
                        styles.periodBadge,
                        { 
                          backgroundColor: budget.period === 'weekly' ? '#10B98120' : 
                                          budget.period === 'monthly' ? '#3B82F620' : 
                                          budget.period === 'quarterly' ? '#F59E0B20' :
                                          budget.period === 'half-yearly' ? '#EC489920' : '#8B5CF620' 
                        }
                      ]}>
                        <Text style={[
                          styles.periodText,
                          { 
                            color: budget.period === 'weekly' ? '#10B981' : 
                                   budget.period === 'monthly' ? '#3B82F6' : 
                                   budget.period === 'quarterly' ? '#F59E0B' :
                                   budget.period === 'half-yearly' ? '#EC4899' : '#8B5CF6' 
                          }
                        ]}>
                          {budget.period === 'weekly' ? 'Weekly' : 
                           budget.period === 'monthly' ? 'Monthly' : 
                           budget.period === 'quarterly' ? 'Quarterly' :
                           budget.period === 'half-yearly' ? 'Half-Yearly' : 'Yearly'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <Pressable
                    style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                    onPress={() => handleOpenDialog(budget)}
                  >
                    <Ionicons name="create-outline" size={20} color={colors.primary} />
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
                    onPress={() => handleDeleteClick(budget)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </Pressable>
                </View>
              </View>

              {/* Budget Amounts */}
              <View style={styles.budgetAmounts}>
                <View style={styles.amountRow}>
                  <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Budget</Text>
                  <Text style={[styles.budgetAmount, { color: colors.text }]}>
                    ${budget.budgetAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Spent</Text>
                  <Text style={[
                    styles.spentAmount,
                    { color: isOverBudget ? '#EF4444' : colors.text }
                  ]}>
                    ${budget.spentAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Remaining</Text>
                  <Text style={[
                    styles.remainingAmount,
                    { color: remaining >= 0 ? '#10B981' : '#EF4444' }
                  ]}>
                    ${remaining >= 0 ? '+' : ''}{remaining.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: progressColor,
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  {progress.toFixed(1)}%
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Add/Edit Budget Dialog */}
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
                {editingBudget ? 'Edit Budget' : 'Add Budget'}
              </Text>
              <Pressable onPress={handleCloseDialog}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView style={styles.dialogContent} showsVerticalScrollIndicator={false}>
              {/* Category */}
              <View style={styles.formField}>
                <Dropdown
                  id="form-category"
                  title="Category *"
                  options={categoryOptions}
                  selectedValue={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  placeholder="Select category"
                  openDropdownId={formDropdownOpen}
                  onOpenChange={setFormDropdownOpen}
                />
              </View>

              {/* Budget Amount */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Budget Amount *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.inputBackground || colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.budgetAmount}
                  onChangeText={(text) => setFormData({ ...formData, budgetAmount: text })}
                  placeholder="Enter budget amount"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Period */}
              <View style={styles.formField}>
                <Dropdown
                  id="form-period"
                  title="Period *"
                  options={periodOptions}
                  selectedValue={formData.period}
                  onValueChange={(value) => setFormData({ ...formData, period: value as 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly' })}
                  placeholder="Select period"
                  openDropdownId={formDropdownOpen}
                  onOpenChange={setFormDropdownOpen}
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
                onPress={handleSaveBudget}
              >
                <Text style={styles.saveButtonText}>Save</Text>
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
              <Text style={[styles.deleteDialogTitle, { color: colors.text }]}>Delete Budget</Text>
              <Text style={[styles.deleteDialogMessage, { color: colors.textSecondary }]}>
                Are you sure you want to delete the budget for "{budgetToDelete?.categoryName}" ({budgetToDelete?.period})? This action cannot be undone.
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
                <Text style={styles.deleteConfirmButtonText}>Delete</Text>
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
    alignItems: 'flex-start',
    marginBottom: spacing.md,
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
  periodBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  periodText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetAmounts: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  budgetAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  spentAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  remainingAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  progressText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    minWidth: 50,
    textAlign: 'right',
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
});
