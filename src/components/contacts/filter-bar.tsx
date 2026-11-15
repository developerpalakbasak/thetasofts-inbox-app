import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ContactFilter, ContactsAnalytics } from '@/types';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface FilterBarProps {
  currentFilter: ContactFilter;
  onSelectFilter: (filter: ContactFilter) => void;
  analytics?: ContactsAnalytics;
}

interface FilterOption {
  key: ContactFilter;
  label: string;
  getCount?: (stats: ContactsAnalytics) => number;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All', getCount: (s) => s.total },
  { key: 'unread', label: 'Unread', getCount: (s) => s.unread },
  { key: 'not_replyed', label: 'Not Replied', getCount: (s) => s.notReplyed },
  { key: 'read', label: 'Read', getCount: (s) => s.read },
  { key: 'replyed', label: 'Replied', getCount: (s) => s.replyed },
];

export const FilterBar = React.memo(function FilterBar({ currentFilter, onSelectFilter, analytics }: FilterBarProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {FILTER_OPTIONS.map((item) => {
          const isSelected = currentFilter === item.key;
          const count = analytics && item.getCount ? item.getCount(analytics) : undefined;

          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => onSelectFilter(item.key)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.primary : theme.backgroundElement,
                  borderColor: isSelected ? theme.primary : theme.cardBorder,
                },
              ]}>
              <ThemedText
                type="small"
                style={[
                  styles.label,
                  {
                    color: isSelected ? theme.primaryText : theme.text,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {item.label}
              </ThemedText>

              {count !== undefined && (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor: isSelected
                        ? theme.primary === '#000000'
                          ? 'rgba(255, 255, 255, 0.25)'
                          : 'rgba(0, 0, 0, 0.15)'
                        : theme.backgroundSelected,
                    },
                  ]}>
                  <ThemedText
                    type="small"
                    style={[
                      styles.countText,
                      {
                        color: isSelected ? theme.primaryText : theme.textSecondary,
                        fontWeight: '700',
                      },
                    ]}>
                    {count}
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
  },
  countBadge: {
    marginLeft: 5,
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    includeFontPadding: false,
  },
});

