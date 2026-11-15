import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Contact } from '@/types';
import { ThemedText } from '@/components/common/themed-text';
import { StatusBadge } from '@/components/common/status-badge';
import { useTheme } from '@/hooks/use-theme';
import { formatFullDateTime } from '@/utils/contact-actions';

export interface ContactProfileCardProps {
  contact: Contact;
}

export function ContactProfileCard({ contact }: ContactProfileCardProps) {
  const theme = useTheme();

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .trim()
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <View
      style={[
        styles.profileCard,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}>
      <View style={styles.profileHeader}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: !contact.isRead ? theme.primary : theme.backgroundSelected,
            },
          ]}>
          <ThemedText
            style={[
              styles.avatarText,
              {
                color: !contact.isRead ? theme.primaryText : theme.textSecondary,
              },
            ]}>
            {getInitials(contact.fullName)}
          </ThemedText>
        </View>

        <View style={styles.profileDetails}>
          <ThemedText type="subtitle" style={styles.fullName}>
            {contact.fullName}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 12 }}>
            Submitted {formatFullDateTime(contact.createdAt)}
          </ThemedText>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.statusBadgesRow}>
        <StatusBadge type={contact.isRead ? 'read' : 'unread'} size="sm" />
        <StatusBadge type={contact.isReplyed ? 'replied' : 'not_replied'} size="sm" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileDetails: {
    flex: 1,
  },
  fullName: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  statusBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
});

