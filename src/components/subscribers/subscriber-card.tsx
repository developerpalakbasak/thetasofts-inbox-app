import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInbox } from '@/context/inbox-context';
import { useTheme } from '@/hooks/use-theme';
import { Subscriber } from '@/types';
import { formatDate, sendEmail } from '@/utils/contact-actions';
import { StatusBadge } from '@/components/common/status-badge';
import { ThemedText } from '@/components/common/themed-text';
import { ConfirmModal } from '@/components/common/confirm-modal';
import { SubscriberOptionsModal } from './subscriber-options-modal';

export interface SubscriberCardProps {
  subscriber: Subscriber;
}

export const SubscriberCard = React.memo(function SubscriberCard({ subscriber }: SubscriberCardProps) {
  const theme = useTheme();
  const { deleteSubscriber } = useInbox();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const getInitial = (email: string) => {
    return (email[0] || 'S').toUpperCase();
  };

  const handleDeleteSubscriber = async () => {
    setDeleteConfirmVisible(false);
    await deleteSubscriber(subscriber._id || subscriber.email);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        },
      ]}>
      <View style={styles.contentRow}>
        {/* Avatar */}
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: subscriber.isActive
                ? theme.successMuted
                : theme.backgroundElement,
            },
          ]}>
          <ThemedText
            type="smallBold"
            style={{
              color: subscriber.isActive ? theme.success : theme.textSecondary,
              fontSize: 14,
            }}>
            {getInitial(subscriber.email)}
          </ThemedText>
        </View>

        {/* Email & Date */}
        <View style={styles.details}>
          <ThemedText type="smallBold" style={styles.email} numberOfLines={1}>
            {subscriber.email}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 12 }}>
            Subscribed {formatDate(subscriber.subscribedAt || subscriber.createdAt)}
          </ThemedText>
        </View>

        {/* Status Badge */}
        <StatusBadge type={subscriber.isActive ? 'active' : 'inactive'} />
      </View>

      {/* Action buttons */}
      <View style={[styles.actionsRow, { borderTopColor: theme.cardBorder }]}>
        <TouchableOpacity
          onPress={() => sendEmail(subscriber.email, 'Update from Company')}
          style={[styles.actionBtn, { backgroundColor: theme.primaryMuted }]}
          activeOpacity={0.7}>
          <Ionicons name="mail" size={14} color={theme.primary} />
          <ThemedText type="small" style={[styles.actionBtnText, { color: theme.primary }]}>
            Send Email
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setOptionsVisible(true)}
          style={[styles.actionBtn, { backgroundColor: theme.backgroundElement }]}
          activeOpacity={0.7}>
          <Ionicons name="settings" size={14} color={theme.text} />
          <ThemedText type="small" style={[styles.actionBtnText, { color: theme.text }]}>
            Options
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Subscriber Options Modal */}
      <SubscriberOptionsModal
        visible={optionsVisible}
        subscriber={subscriber}
        onClose={() => setOptionsVisible(false)}
        onSendEmail={() => {
          setOptionsVisible(false);
          sendEmail(subscriber.email);
        }}
        onDelete={() => {
          setOptionsVisible(false);
          setDeleteConfirmVisible(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={deleteConfirmVisible}
        title="Delete Subscriber?"
        message={`Are you sure you want to remove "${subscriber.email}" from your subscriber newsletter list?`}
        confirmText="Delete"
        isDestructive
        onConfirm={handleDeleteSubscriber}
        onClose={() => setDeleteConfirmVisible(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
  },
  email: {
    fontSize: 13,
    marginBottom: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    paddingTop: 8,
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

