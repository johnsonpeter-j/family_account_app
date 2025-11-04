import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  title: string;
  options: DropdownOption[];
  selectedValue?: string;
  selectedValues?: string[];
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  placeholder?: string;
  id?: string;
  openDropdownId?: string | null;
  onOpenChange?: (id: string | null) => void;
  multiSelect?: boolean;
}

export function Dropdown({ 
  title, 
  options, 
  selectedValue, 
  selectedValues = [],
  onValueChange, 
  onValuesChange,
  placeholder = 'Select...', 
  id, 
  openDropdownId, 
  onOpenChange,
  multiSelect = false
}: DropdownProps) {
  const { colors } = useTheme();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const dropdownRef = useRef<View>(null);
  
  // Use controlled state if id and callbacks are provided, otherwise use internal state
  const isOpen = id && openDropdownId !== undefined && onOpenChange ? openDropdownId === id : internalIsOpen;

  // Handle display text for both single and multi-select
  const getDisplayText = () => {
    if (multiSelect) {
      if (selectedValues.length === 0) {
        return placeholder;
      }
      if (selectedValues.includes('all')) {
        return 'All Categories';
      }
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0]);
        return option ? option.label : placeholder;
      }
      return `${selectedValues.length} selected`;
    } else {
      const selectedOption = options.find(opt => opt.value === selectedValue);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  const displayText = getDisplayText();
  const hasSelection = multiSelect ? selectedValues.length > 0 : !!selectedValue;

  const handleButtonLayout = (event: any) => {
    dropdownRef.current?.measureInWindow((x, y, width, height) => {
      setButtonLayout({ x, y, width, height });
    });
  };

  const handleToggle = () => {
    if (!isOpen) {
      // Measure button position before opening
      dropdownRef.current?.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
      });
      // Open this dropdown (this will close others if managed by parent)
      if (onOpenChange && id) {
        onOpenChange(id);
      } else {
        setInternalIsOpen(true);
      }
    } else {
      // Close this dropdown
      if (onOpenChange) {
        onOpenChange(null);
      } else {
        setInternalIsOpen(false);
      }
    }
  };

  return (
    <View style={styles.container} ref={dropdownRef}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      <Pressable
        onPress={handleToggle}
        onLayout={handleButtonLayout}
        style={[
          styles.dropdownButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }
        ]}
      >
        <Text
          style={[
            styles.dropdownText,
            { color: hasSelection ? colors.text : colors.textSecondary }
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => {
          if (onOpenChange) {
            onOpenChange(null);
          } else {
            setInternalIsOpen(false);
          }
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            if (onOpenChange) {
              onOpenChange(null);
            } else {
              setInternalIsOpen(false);
            }
          }}
        >
          <View 
            style={[
              styles.dropdownListWrapper,
              {
                top: buttonLayout.y + buttonLayout.height + spacing.xs,
                left: buttonLayout.x,
                width: buttonLayout.width,
              }
            ]} 
            pointerEvents="box-none"
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={[
                styles.dropdownList,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  shadowColor: '#000',
                  width: buttonLayout.width || '100%',
                }
              ]}
            >
              <ScrollView
                style={styles.optionsContainer}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {options.map((option, index) => {
                  const isSelected = multiSelect 
                    ? selectedValues.includes(option.value)
                    : selectedValue === option.value;

                  const handlePress = () => {
                    if (multiSelect && onValuesChange) {
                      let newValues: string[];
                      if (option.value === 'all') {
                        // If "All" is selected, clear all other selections
                        newValues = isSelected ? [] : ['all'];
                      } else {
                        // Remove 'all' if it exists and select specific category
                        const valuesWithoutAll = selectedValues.filter(v => v !== 'all');
                        if (isSelected) {
                          // Deselect this option
                          newValues = valuesWithoutAll.filter(v => v !== option.value);
                        } else {
                          // Select this option
                          newValues = [...valuesWithoutAll, option.value];
                        }
                        // If no selections, default to 'all'
                        if (newValues.length === 0) {
                          newValues = ['all'];
                        }
                      }
                      onValuesChange(newValues);
                    } else if (onValueChange && !multiSelect) {
                      onValueChange(option.value);
                      if (onOpenChange) {
                        onOpenChange(null);
                      } else {
                        setInternalIsOpen(false);
                      }
                    }
                  };

                  return (
                    <Pressable
                      key={option.value}
                      onPress={handlePress}
                      style={[
                        styles.option,
                        {
                          backgroundColor: isSelected ? colors.primary : 'transparent',
                          borderBottomWidth: index < options.length - 1 ? 1 : 0,
                          borderBottomColor: colors.border,
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.text,
                          }
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 120,
    zIndex: 9999,
    elevation: 9999,
  },
  title: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
    marginBottom: spacing.xs,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    minHeight: 40,
  },
  dropdownText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    marginRight: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownListWrapper: {
    position: 'absolute',
    alignItems: 'flex-start',
  },
  dropdownList: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    maxHeight: 200,
    elevation: 10000,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  optionsContainer: {
    maxHeight: 200,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  optionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
});

