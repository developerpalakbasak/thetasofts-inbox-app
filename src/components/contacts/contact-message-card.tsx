import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface ContactMessageCardProps {
  message?: string;
  onOpenMessageModal?: () => void;
}

export function ContactMessageCard({ message, onOpenMessageModal }: ContactMessageCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="chatbox-ellipses-outline" size={16} color={theme.primary} />
          <ThemedText type="smallBold" style={styles.sectionHeaderTitle}>
            Inquiry Message
          </ThemedText>
        </View>
        {onOpenMessageModal ? (
          <TouchableOpacity onPress={onOpenMessageModal} activeOpacity={0.7}>
            <Ionicons name="copy-outline" size={15} color={theme.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View
        style={[
          styles.messageBox,
          { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
        ]}>
        <ThemedText type="default" style={styles.messageText} selectable>
          {message || 'No message provided in this submission.'}
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderTitle: {
    fontSize: 13,
  },
  messageBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
});

