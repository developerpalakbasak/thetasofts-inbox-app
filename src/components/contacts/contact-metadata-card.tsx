import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { formatFullDateTime } from '@/utils/contact-actions';

export interface ContactMetadataCardProps {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export function ContactMetadataCard({ id, createdAt, updatedAt }: ContactMetadataCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}>
      <View style={[styles.cardHeaderLeft, { marginBottom: 6 }]}>
        <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
        <ThemedText type="smallBold" style={styles.sectionHeaderTitle}>
          Submission Information
        </ThemedText>
      </View>

      <View style={styles.metaRow}>
        <ThemedText type="small" style={[styles.metaLabel, { color: theme.textSecondary }]}>
          Inquiry ID:
        </ThemedText>
        <ThemedText type="code" style={[styles.metaValue, { color: theme.text }]}>
          {id}
        </ThemedText>
      </View>

      <View style={styles.metaRow}>
        <ThemedText type="small" style={[styles.metaLabel, { color: theme.textSecondary }]}>
          Received At:
        </ThemedText>
        <ThemedText type="small" style={[styles.metaValue, { color: theme.text }]}>
          {formatFullDateTime(createdAt)}
        </ThemedText>
      </View>

      <View style={styles.metaRow}>
        <ThemedText type="small" style={[styles.metaLabel, { color: theme.textSecondary }]}>
          Last Modified:
        </ThemedText>
        <ThemedText type="small" style={[styles.metaValue, { color: theme.text }]}>
          {formatFullDateTime(updatedAt)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderTitle: {
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  metaLabel: {
    fontSize: 12,
  },
  metaValue: {
    fontSize: 12,
  },
});

