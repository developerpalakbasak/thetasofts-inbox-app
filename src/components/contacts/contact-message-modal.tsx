import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '@/types';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface ContactMessageModalProps {
  visible: boolean;
  contact: Contact;
  onClose: () => void;
  onReplyEmail: () => void;
}

export function ContactMessageModal({
  visible,
  contact,
  onClose,
  onReplyEmail,
}: ContactMessageModalProps) {
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
            Inquiry Message
          </ThemedText>
          <ThemedText type="small" style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
            From {contact.fullName}
          </ThemedText>

          <View
            style={[
              styles.modalMessageBox,
              { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
            ]}>
            <ThemedText type="default" style={styles.messageText} selectable>
              {contact.message || 'No message provided.'}
            </ThemedText>
          </View>

          <TouchableOpacity style={styles.modalOptionBtn} activeOpacity={0.7} onPress={onReplyEmail}>
            <Ionicons name="mail-outline" size={18} color={theme.primary} />
            <ThemedText type="smallBold" style={[styles.modalOptionText, { color: theme.text }]}>
              Reply via Email
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
    marginBottom: 12,
  },
  modalMessageBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    maxHeight: 200,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
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

