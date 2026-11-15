import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
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
          <ThemedText
            type="smallBold"
            style={[styles.modalTitle, { color: isDestructive ? theme.danger : theme.text }]}>
            {title}
          </ThemedText>
          <ThemedText type="small" style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
            {message}
          </ThemedText>

          <View style={styles.modalBtnRow}>
            <TouchableOpacity
              style={[styles.modalActionBtn, { backgroundColor: theme.backgroundElement }]}
              activeOpacity={0.7}
              onPress={onClose}>
              <ThemedText type="smallBold" style={{ color: theme.text }}>
                {cancelText}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalActionBtn,
                { backgroundColor: isDestructive ? theme.danger : theme.primary },
              ]}
              activeOpacity={0.7}
              onPress={onConfirm}>
              <ThemedText
                type="smallBold"
                style={{ color: isDestructive ? '#FFFFFF' : theme.primaryText }}>
                {confirmText}
              </ThemedText>
            </TouchableOpacity>
          </View>
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
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

