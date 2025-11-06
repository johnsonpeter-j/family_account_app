import { Dropdown } from '@/components/ui/dropdown';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Category {
  id: string;
  name: string;
  description?: string;
  type: 'income' | 'expense';
}

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  parentCategoryId: string;
  parentCategoryName: string;
  type: 'income' | 'expense';
}

interface SubCategoryFormData {
  name: string;
  description: string;
  parentCategoryId: string;
}

// Mock categories (in real app, these would come from the categories state)
const mockCategories: Category[] = [
  { id: '1', name: 'Food', description: 'Food and groceries', type: 'expense' },
  { id: '2', name: 'Salary', description: 'Monthly salary', type: 'income' },
  { id: '3', name: 'Utilities', description: 'Bills and utilities', type: 'expense' },
  { id: '4', name: 'Freelance', description: 'Freelance work', type: 'income' },
  { id: '5', name: 'Transport', description: 'Transportation costs', type: 'expense' },
  { id: '6', name: 'Shopping', description: 'Shopping expenses', type: 'expense' },
];

const mockSubCategories: SubCategory[] = [
  { id: '1', name: 'Restaurants', description: 'Dining out', parentCategoryId: '1', parentCategoryName: 'Food', type: 'expense' },
  { id: '2', name: 'Groceries', description: 'Grocery shopping', parentCategoryId: '1', parentCategoryName: 'Food', type: 'expense' },
  { id: '3', name: 'Electricity', description: 'Electricity bills', parentCategoryId: '3', parentCategoryName: 'Utilities', type: 'expense' },
  { id: '4', name: 'Water', description: 'Water bills', parentCategoryId: '3', parentCategoryName: 'Utilities', type: 'expense' },
];

export default function TransactionSubCategory() {
  const { colors } = useTheme();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<SubCategory | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(mockSubCategories);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [formDropdownOpen, setFormDropdownOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<SubCategoryFormData>({
    name: '',
    description: '',
    parentCategoryId: '',
  });
  
  const isLargeScreen = dimensions.width >= 1024;
  
  // Category options for dropdown
  const categoryOptions = mockCategories.map(cat => ({ label: cat.name, value: cat.id }));
  
  // Filter options
  const filterOptions = [
    { label: 'All', value: 'all' },
    ...mockCategories.map(cat => ({ label: cat.name, value: cat.id })),
  ];
  
  // Filter sub categories based on selected parent category
  const filteredSubCategories = subCategories.filter(subCategory => {
    if (filter === 'all') return true;
    return subCategory.parentCategoryId === filter;
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleOpenDialog = (subCategory?: SubCategory) => {
    if (subCategory) {
      setEditingSubCategory(subCategory);
      setFormData({
        name: subCategory.name,
        description: subCategory.description || '',
        parentCategoryId: subCategory.parentCategoryId,
      });
    } else {
      setEditingSubCategory(null);
      setFormData({
        name: '',
        description: '',
        parentCategoryId: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSubCategory(null);
    setFormData({
      name: '',
      description: '',
      parentCategoryId: '',
    });
  };

  const handleSaveSubCategory = () => {
    // Validate form
    if (!formData.name.trim() || !formData.parentCategoryId) {
      return;
    }

    const parentCategory = mockCategories.find(cat => cat.id === formData.parentCategoryId);
    if (!parentCategory) return;

    if (editingSubCategory) {
      // Update existing sub category
      setSubCategories(subCategories.map(subCat => 
        subCat.id === editingSubCategory.id
          ? {
              ...subCat,
              name: formData.name.trim(),
              description: formData.description.trim() || undefined,
              parentCategoryId: formData.parentCategoryId,
              parentCategoryName: parentCategory.name,
              type: parentCategory.type,
            }
          : subCat
      ));
    } else {
      // Create new sub category
      const newSubCategory: SubCategory = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        parentCategoryId: formData.parentCategoryId,
        parentCategoryName: parentCategory.name,
        type: parentCategory.type,
      };
      setSubCategories([newSubCategory, ...subCategories]);
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (subCategory: SubCategory) => {
    setSubCategoryToDelete(subCategory);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (subCategoryToDelete) {
      setSubCategories(subCategories.filter(subCat => subCat.id !== subCategoryToDelete.id));
      setSubCategoryToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setSubCategoryToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, isLargeScreen && styles.headerContentLarge]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Transaction Sub Categories</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Manage your transaction sub categories
            </Text>
          </View>
          <View style={[styles.addButtonContainer, isLargeScreen && styles.addButtonContainerLarge]}>
            <Pressable
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => handleOpenDialog()}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Sub Category</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Filter Section */}
      <View style={[styles.filters, { borderBottomColor: colors.border }]}>
        <View style={[styles.filterRow, isLargeScreen && styles.filterRowLarge]}>
          {/* Parent Category Filter */}
          <View style={[styles.filterDropdownContainer, isLargeScreen && styles.filterDropdownContainerLarge]}>
            <Dropdown
              id="category-filter"
              title="Category"
              options={filterOptions}
              selectedValue={filter}
              onValueChange={(value) => setFilter(value)}
              placeholder="Select category"
              openDropdownId={openDropdownId}
              onOpenChange={setOpenDropdownId}
            />
          </View>
        </View>
      </View>

      {/* Sub Categories List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge
        ]}
      >
        {filteredSubCategories.map((subCategory) => (
          <View
            key={subCategory.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: subCategory.type === 'income' ? '#10B98120' : '#EF444420' }
                ]}>
                  <Ionicons
                    name={subCategory.type === 'income' ? 'arrow-up' : 'arrow-down'}
                    size={24}
                    color={subCategory.type === 'income' ? '#10B981' : '#EF4444'}
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{subCategory.name}</Text>
                  <View style={styles.cardMeta}>
                    <View style={[
                      styles.parentBadge,
                      { backgroundColor: colors.primary + '20' }
                    ]}>
                      <Text style={[
                        styles.parentText,
                        { color: colors.primary }
                      ]}>
                        {subCategory.parentCategoryName}
                      </Text>
                    </View>
                    <View style={[
                      styles.typeBadge,
                      { 
                        backgroundColor: subCategory.type === 'income' ? '#10B98120' : '#EF444420' 
                      }
                    ]}>
                      <Text style={[
                        styles.typeText,
                        { 
                          color: subCategory.type === 'income' ? '#10B981' : '#EF4444' 
                        }
                      ]}>
                        {subCategory.type === 'income' ? 'Income' : 'Expense'}
                      </Text>
                    </View>
                    {subCategory.description && (
                      <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                        {subCategory.description}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                  onPress={() => handleOpenDialog(subCategory)}
                >
                  <Ionicons name="create-outline" size={20} color={colors.primary} />
                </Pressable>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
                  onPress={() => handleDeleteClick(subCategory)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add/Edit Sub Category Dialog */}
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
                {editingSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}
              </Text>
              <Pressable onPress={handleCloseDialog}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView style={styles.dialogContent} showsVerticalScrollIndicator={false}>
              {/* Name */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Name *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.inputBackground || colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter sub category name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* Parent Category */}
              <View style={styles.formField}>
                <Dropdown
                  id="form-parent-category"
                  title="Parent Category *"
                  options={categoryOptions}
                  selectedValue={formData.parentCategoryId}
                  onValueChange={(value) => setFormData({ ...formData, parentCategoryId: value })}
                  placeholder="Select parent category"
                  openDropdownId={formDropdownOpen}
                  onOpenChange={setFormDropdownOpen}
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
                  numberOfLines={3}
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
                onPress={handleSaveSubCategory}
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
              <Text style={[styles.deleteDialogTitle, { color: colors.text }]}>Delete Sub Category</Text>
              <Text style={[styles.deleteDialogMessage, { color: colors.textSecondary }]}>
                Are you sure you want to delete "{subCategoryToDelete?.name}"? This action cannot be undone.
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
    alignItems: 'center',
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
    marginBottom: spacing.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  parentBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  parentText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
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
  cardDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
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
    minHeight: 80,
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


