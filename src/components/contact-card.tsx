import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '@/types';
import { StatusBadge } from './status-badge';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';
import { formatDate, makePhoneCall, sendEmail } from '@/utils/contact-actions';

interface ContactCardProps {
  contact: Contact;
  onPress: () => void;
  onToggleRead?: () => void;
  onToggleReplied?: () => void;
  isUpdatingRead?: boolean;
  isUpdatingReplied?: boolean;
}

export function ContactCard({
  contact,
  onPress,
  onToggleRead,
  onToggleReplied,
  isUpdatingRead = false,
  isUpdatingReplied = false,
}: ContactCardProps) {
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
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: !contact.isRead ? theme.primary : theme.cardBorder,
          borderWidth: !contact.isRead ? 1.5 : 1,
        },
      ]}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.nameContainer}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: !contact.isRead ? theme.primary : theme.backgroundSelected,
              },
            ]}>
            <ThemedText
              type="smallBold"
              style={{ color: !contact.isRead ? theme.primaryText : theme.textSecondary }}>
              {getInitials(contact.fullName)}
            </ThemedText>
          </View>
          <View style={styles.nameDetails}>
            <View style={styles.fullNameRow}>
              <ThemedText type="smallBold" style={styles.fullName} numberOfLines={1}>
                {contact.fullName}
              </ThemedText>
              {!contact.isRead && (
                <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
              )}
            </View>
            <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 12 }}>
              {formatDate(contact.createdAt)}
            </ThemedText>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
      </View>

      {/* Badges Row */}
      <View style={styles.badgesRow}>
        <StatusBadge type={contact.isRead ? 'read' : 'unread'} />
        <StatusBadge type={contact.isReplyed ? 'replied' : 'not_replied'} />

        {contact.plan && (
          <View style={[styles.tagBadge, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="small" style={[styles.tagText, { color: theme.text }]}>
              {contact.plan}
            </ThemedText>
          </View>
        )}

        {contact.projectType && (
          <View style={[styles.tagBadge, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText
              type="small"
              style={[styles.tagText, { color: theme.textSecondary }]}
              numberOfLines={1}>
              {contact.projectType}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Message preview */}
      {contact.message ? (
        <ThemedText
          type="small"
          numberOfLines={2}
          style={[styles.message, { color: theme.text, opacity: 0.85 }]}>
          {contact.message}
        </ThemedText>
      ) : null}

      {/* Contact info snippets */}
      <View style={styles.infoRow}>
        <TouchableOpacity
          onPress={() => sendEmail(contact.email)}
          style={styles.infoItem}
          activeOpacity={0.7}>
          <Ionicons name="mail-outline" size={14} color={theme.primary} />
          <ThemedText
            type="small"
            numberOfLines={1}
            style={[styles.infoText, { color: theme.primary }]}>
            {contact.email}
          </ThemedText>
        </TouchableOpacity>

        {contact.phone ? (
          <TouchableOpacity
            onPress={() => makePhoneCall(contact.phone)}
            style={styles.infoItem}
            activeOpacity={0.7}>
            <Ionicons name="call-outline" size={14} color={theme.success} />
            <ThemedText
              type="small"
              numberOfLines={1}
              style={[styles.infoText, { color: theme.success }]}>
              {contact.phone}
            </ThemedText>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

      {/* Bottom Action Bar */}
      <View style={styles.actionsRow}>
        {/* Quick Contact buttons */}
        <View style={styles.quickContactGroup}>
          {contact.phone ? (
            <TouchableOpacity
              onPress={() => makePhoneCall(contact.phone)}
              style={[styles.actionIconBtn, { backgroundColor: theme.backgroundElement }]}
              activeOpacity={0.7}>
              <Ionicons name="call" size={15} color={theme.success} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => sendEmail(contact.email, `Response to inquiry: ${contact.fullName}`)}
            style={[styles.actionIconBtn, { backgroundColor: theme.backgroundElement }]}
            activeOpacity={0.7}>
            <Ionicons name="mail" size={15} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Status Toggle Buttons */}
        <View style={styles.statusButtonsGroup}>
          {/* Read button */}
          <TouchableOpacity
            onPress={onToggleRead}
            disabled={isUpdatingRead || contact.isRead}
            activeOpacity={0.7}
            style={[
              styles.statusButton,
              {
                backgroundColor: contact.isRead ? theme.backgroundElement : theme.unreadBg,
                borderColor: contact.isRead ? theme.cardBorder : theme.primary,
              },
            ]}>
            {isUpdatingRead ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <>
                <Ionicons
                  name={contact.isRead ? 'checkmark' : 'mail-unread'}
                  size={14}
                  color={contact.isRead ? theme.textSecondary : theme.primary}
                />
                <ThemedText
                  type="small"
                  style={[
                    styles.statusBtnText,
                    { color: contact.isRead ? theme.textSecondary : theme.primary },
                  ]}>
                  {contact.isRead ? 'Read' : 'Mark Read'}
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

          {/* Replied button */}
          <TouchableOpacity
            onPress={onToggleReplied}
            disabled={isUpdatingReplied || contact.isReplyed}
            activeOpacity={0.7}
            style={[
              styles.statusButton,
              {
                backgroundColor: contact.isReplyed ? theme.backgroundElement : theme.repliedBg,
                borderColor: contact.isReplyed ? theme.cardBorder : theme.replied,
              },
            ]}>
            {isUpdatingReplied ? (
              <ActivityIndicator size="small" color={theme.replied} />
            ) : (
              <>
                <Ionicons
                  name={contact.isReplyed ? 'checkmark-done' : 'paper-plane-outline'}
                  size={14}
                  color={contact.isReplyed ? theme.textSecondary : theme.replied}
                />
                <ThemedText
                  type="small"
                  style={[
                    styles.statusBtnText,
                    { color: contact.isReplyed ? theme.textSecondary : theme.replied },
                  ]}>
                  {contact.isReplyed ? 'Replied' : 'Mark Replied'}
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  nameDetails: {
    flex: 1,
  },
  fullNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullName: {
    fontSize: 14,
    fontWeight: '700',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 6,
  },
  tagBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  message: {
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  quickContactGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
