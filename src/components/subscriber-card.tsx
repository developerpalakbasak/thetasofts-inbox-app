import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Subscriber } from '@/types';
import { StatusBadge } from './status-badge';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useInbox } from '@/context/inbox-context';
import { Spacing } from '@/constants/theme';
import { formatDate, sendEmail } from '@/utils/contact-actions';

interface SubscriberCardProps {
  subscriber: Subscriber;
}

export function SubscriberCard({ subscriber }: SubscriberCardProps) {
  const theme = useTheme();
  const { deleteSubscriber, deletingSubscriberIds } = useInbox();
  const isDeleting = deletingSubscriberIds[subscriber._id] || deletingSubscriberIds[subscriber.email] || false;

  const getInitial = (email: string) => {
    return (email[0] || 'S').toUpperCase();
  };

  const confirmDeleteSubscriber = () => {
    Alert.alert(
      'Delete Subscriber?',
      `Are you sure you want to remove "${subscriber.email}" from the subscriber list? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteSubscriber(subscriber._id || subscriber.email);
            if (success) {
              Alert.alert('Deleted', 'Subscriber removed successfully.');
            }
          },
        },
      ]
    );
  };

  const handleCopy = () => {
    Alert.alert('Subscriber Options', subscriber.email, [
      { text: 'Send Email', onPress: () => sendEmail(subscriber.email) },
      { text: 'Delete Subscriber', style: 'destructive', onPress: confirmDeleteSubscriber },
      { text: 'Close', style: 'cancel' },
    ]);
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
          onPress={handleCopy}
          style={[styles.actionBtn, { backgroundColor: theme.backgroundElement }]}
          activeOpacity={0.7}>
          <Ionicons name="copy-outline" size={14} color={theme.text} />
          <ThemedText type="small" style={[styles.actionBtnText, { color: theme.text }]}>
            Options
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={confirmDeleteSubscriber}
          disabled={isDeleting}
          style={[styles.deleteBtn, { backgroundColor: theme.dangerMuted }]}
          activeOpacity={0.7}>
          {isDeleting ? (
            <ActivityIndicator size="small" color={theme.danger} />
          ) : (
            <Ionicons name="trash-outline" size={15} color={theme.danger} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.two,
  },
  details: {
    flex: 1,
    marginRight: Spacing.two,
  },
  email: {
    fontSize: 14,
    marginBottom: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 8,
  },
  deleteBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
