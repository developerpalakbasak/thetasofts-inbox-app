import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SubscribersAnalytics } from '@/types';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type SubscriberFilter = 'all' | 'active' | 'inactive';

export interface SubscriberStatsProps {
  analytics: SubscribersAnalytics;
  currentFilter: SubscriberFilter;
  onSelectFilter: (filter: SubscriberFilter) => void;
}

export const SubscriberStats = React.memo(function SubscriberStats({
  analytics,
  currentFilter,
  onSelectFilter,
}: SubscriberStatsProps) {
  const theme = useTheme();

  return (
    <View style={styles.statsContainer}>
      <TouchableOpacity
        onPress={() => onSelectFilter('all')}
        style={[
          styles.statCard,
          {
            backgroundColor: theme.card,
            borderColor: currentFilter === 'all' ? theme.primary : theme.cardBorder,
            borderWidth: currentFilter === 'all' ? 1.5 : 1,
          },
        ]}>
        <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 11 }}>
          Total
        </ThemedText>
        <ThemedText type="subtitle" style={[styles.statNum, { color: theme.text }]}>
          {analytics.total}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelectFilter('active')}
        style={[
          styles.statCard,
          {
            backgroundColor: theme.successMuted,
            borderColor: currentFilter === 'active' ? theme.success : theme.cardBorder,
            borderWidth: 1.2,
          },
        ]}>
        <ThemedText
          type="smallBold"
          style={{ color: theme.success, fontSize: 11, textTransform: 'uppercase' }}>
          Active
        </ThemedText>
        <ThemedText type="subtitle" style={[styles.statNum, { color: theme.success }]}>
          {analytics.active}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelectFilter('inactive')}
        style={[
          styles.statCard,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: currentFilter === 'inactive' ? theme.textSecondary : theme.cardBorder,
            borderWidth: currentFilter === 'inactive' ? 1.5 : 1,
          },
        ]}>
        <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 11 }}>
          Inactive
        </ThemedText>
        <ThemedText type="subtitle" style={[styles.statNum, { color: theme.textSecondary }]}>
          {analytics.inactive}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 6,
  },
  statCard: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  statNum: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    marginTop: 2,
  },
});

