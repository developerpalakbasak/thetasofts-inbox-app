import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Subscriber } from '@/types';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface SubscriberOptionsModalProps {
  visible: boolean;
  subscriber: Subscriber;
  onClose: () => void;
  onSendEmail: () => void;
  onDelete: () => void;
}

export function SubscriberOptionsModal({
  visible,
  subscriber,
  onClose,
  onSendEmail,
  onDelete,
}: SubscriberOptionsModalProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
          onStartShouldSetResponder={() => true}>
          <ThemedText type="smallBold" style={styles.modalTitle}>
            Subscriber Options
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.modalSubtitle, { color: theme.textSecondary }]}
            numberOfLines={1}>
            {subscriber.email}
          </ThemedText>

          <TouchableOpacity style={styles.modalOptionBtn} activeOpacity={0.7} onPress={onSendEmail}>
            <Ionicons name="mail-outline" size={18} color={theme.primary} />
            <ThemedText type="smallBold" style={[styles.modalOptionText, { color: theme.text }]}>
              Send Email
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOptionBtn} activeOpacity={0.7} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color={theme.danger} />
            <ThemedText type="smallBold" style={[styles.modalOptionText, { color: theme.danger }]}>
              Delete Subscriber
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalCloseBtn, { backgroundColor: theme.backgroundElement }]}
            activeOpacity={0.7}
            onPress={onClose}>
            <ThemedText type="smallBold" style={{ color: theme.text }}>
              Close
            </ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    marginBottom: 16,
  },
  modalOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8882',
  },
  modalOptionText: {
    fontSize: 14,
  },
  modalCloseBtn: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});

