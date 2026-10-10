import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContactFilter, ContactsAnalytics } from '@/types';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface AnalyticsSummaryProps {
  analytics: ContactsAnalytics;
  onFilterPress?: (filter: ContactFilter) => void;
}

export function AnalyticsSummary({ analytics, onFilterPress }: AnalyticsSummaryProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Total Card */}
        <TouchableOpacity
          onPress={() => onFilterPress?.('all')}
          activeOpacity={0.7}
          style={[
            styles.statCard,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}>
          <View style={styles.statHeader}>
            <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 10, fontWeight: '600' }}>
              Total
            </ThemedText>
            <Ionicons name="documents-outline" size={13} color={theme.textSecondary} />
          </View>
          <ThemedText type="subtitle" style={[styles.statValue, { color: theme.text }]}>
            {analytics.total}
          </ThemedText>
        </TouchableOpacity>

        {/* Unread Card */}
        <TouchableOpacity
          onPress={() => onFilterPress?.('unread')}
          activeOpacity={0.7}
          style={[
            styles.statCard,
            {
              backgroundColor: theme.unreadBg,
              borderColor: theme.unread,
              borderWidth: 1,
            },
          ]}>
          <View style={styles.statHeader}>
            <ThemedText
              type="smallBold"
              style={{ color: theme.unread, fontSize: 10, textTransform: 'uppercase' }}>
              Unread
            </ThemedText>
            <Ionicons name="mail-unread" size={13} color={theme.unread} />
          </View>
          <ThemedText type="subtitle" style={[styles.statValue, { color: theme.unread }]}>
            {analytics.unread}
          </ThemedText>
        </TouchableOpacity>

        {/* Pending Reply Card */}
        <TouchableOpacity
          onPress={() => onFilterPress?.('not_replyed')}
          activeOpacity={0.7}
          style={[
            styles.statCard,
            {
              backgroundColor: theme.warningMuted,
              borderColor: theme.warning,
              borderWidth: 1,
            },
          ]}>
          <View style={styles.statHeader}>
            <ThemedText
              type="smallBold"
              style={{ color: theme.warning, fontSize: 10, textTransform: 'uppercase' }}>
              Pending
            </ThemedText>
            <Ionicons name="time" size={13} color={theme.warning} />
          </View>
          <ThemedText type="subtitle" style={[styles.statValue, { color: theme.warning }]}>
            {analytics.notReplyed}
          </ThemedText>
        </TouchableOpacity>

        {/* Replied Card */}
        <TouchableOpacity
          onPress={() => onFilterPress?.('replyed')}
          activeOpacity={0.7}
          style={[
            styles.statCard,
            {
              backgroundColor: theme.repliedBg,
              borderColor: theme.replied,
              borderWidth: 1,
            },
          ]}>
          <View style={styles.statHeader}>
            <ThemedText
              type="smallBold"
              style={{ color: theme.replied, fontSize: 10, textTransform: 'uppercase' }}>
              Replied
            </ThemedText>
            <Ionicons name="checkmark-done" size={13} color={theme.replied} />
          </View>
          <ThemedText type="subtitle" style={[styles.statValue, { color: theme.replied }]}>
            {analytics.replyed}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    marginBottom: 6,
  },
  grid: {
    flexDirection: 'row',
    gap: 6,
  },
  statCard: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 48,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },
});
