import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ContactFilter, ContactsAnalytics } from '@/types';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface FilterBarProps {
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
  { key: 'read', label: 'Read', getCount: (s) => s.read },
  { key: 'replyed', label: 'Replied', getCount: (s) => s.replyed },
  { key: 'not_replyed', label: 'Not Replied', getCount: (s) => s.notReplyed },
];

export function FilterBar({ currentFilter, onSelectFilter, analytics }: FilterBarProps) {
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
                        ? (theme.primary === '#000000'
                            ? 'rgba(255, 255, 255, 0.25)'
                            : 'rgba(0, 0, 0, 0.15)')
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
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.two,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 11,
  },
});
