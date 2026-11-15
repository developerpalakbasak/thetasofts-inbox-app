import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface ContactSpecsCardProps {
  plan?: string;
  projectType?: string;
}

export function ContactSpecsCard({ plan, projectType }: ContactSpecsCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}>
      <View style={[styles.cardHeaderLeft, { marginBottom: 6 }]}>
        <Ionicons name="layers-outline" size={16} color={theme.primary} />
        <ThemedText type="smallBold" style={styles.sectionHeaderTitle}>
          Service & Plan Specifications
        </ThemedText>
      </View>

      <View style={styles.specGrid}>
        <View style={styles.specItem}>
          <ThemedText type="small" style={[styles.specLabel, { color: theme.textSecondary }]}>
            Selected Plan
          </ThemedText>
          <ThemedText type="smallBold" style={styles.specValue}>
            {plan || 'Not specified'}
          </ThemedText>
        </View>

        <View style={styles.specItem}>
          <ThemedText type="small" style={[styles.specLabel, { color: theme.textSecondary }]}>
            Project Type
          </ThemedText>
          <ThemedText type="smallBold" style={styles.specValue}>
            {projectType || 'General Consultation'}
          </ThemedText>
        </View>
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
  specGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  specItem: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
  },
  specLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 13,
  },
});

