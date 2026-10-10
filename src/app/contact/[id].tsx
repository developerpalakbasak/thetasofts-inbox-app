import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useInbox } from '@/context/inbox-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StatusBadge } from '@/components/status-badge';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  formatFullDateTime,
  makePhoneCall,
  openWhatsApp,
  sendEmail,
  sendSms,
} from '@/utils/contact-actions';

export default function ContactDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { getContactById, markAsRead, markAsReplied, deleteContact } = useInbox();

  const contact = getContactById(id || '');

  const [isReading, setIsReading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteContact = () => {
    if (!contact) return;
    Alert.alert(
      'Delete Contact Inquiry?',
      `Are you sure you want to permanently delete the inquiry from "${contact.fullName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            const success = await deleteContact(contact._id);
            setIsDeleting(false);
            if (success) {
              Alert.alert('Deleted', 'Contact inquiry was deleted successfully.', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            }
          },
        },
      ]
    );
  };

  const handleMarkRead = async () => {
    if (!contact || contact.isRead) return;
    setIsReading(true);
    const success = await markAsRead(contact._id);
    setIsReading(false);
    if (success) {
      Alert.alert('Success', 'Inquiry marked as read.');
    }
  };

  const handleMarkReplied = async () => {
    if (!contact || contact.isReplyed) return;
    setIsReplying(true);
    const success = await markAsReplied(contact._id);
    setIsReplying(false);
    if (success) {
      Alert.alert('Success', 'Inquiry marked as replied.');
    }
  };

  const handleCopyMessage = () => {
    if (!contact?.message) return;
    Alert.alert('Message Content', contact.message, [
      {
        text: 'Reply via Email',
        onPress: () =>
          sendEmail(
            contact.email,
            `Re: ${contact.projectType || 'Inquiry'}`,
            `Hi ${contact.fullName},\n\nThank you for reaching out to us.\n\nBest regards.`
          ),
      },
      { text: 'Close', style: 'cancel' },
    ]);
  };

  if (!contact) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={theme.text} />
            </TouchableOpacity>
            <ThemedText type="smallBold">Inquiry Details</ThemedText>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.notFoundContainer}>
            <Ionicons name="alert-circle-outline" size={54} color={theme.warning} />
            <ThemedText type="subtitle" style={styles.notFoundTitle}>
              Contact Not Found
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: 'center' }}>
              The contact inquiry with ID {id} was not found or may have been removed.
            </ThemedText>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.returnBtn, { backgroundColor: theme.primary }]}>
              <ThemedText type="small" style={{ color: theme.primaryText, fontWeight: '700' }}>
                Go Back to Inquiries
              </ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

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
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Navigation Bar */}
        <View style={[styles.navBar, { borderBottomColor: theme.cardBorder }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.backgroundElement }]}
            activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <ThemedText type="smallBold" style={styles.navTitle}>
            Inquiry Details
          </ThemedText>
          <View style={styles.navActionsRow}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Inquiry Options', `ID: ${contact._id}`, [
                  { text: 'Copy ID', onPress: () => {} },
                  { text: 'Delete Inquiry', style: 'destructive', onPress: confirmDeleteContact },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
              style={[styles.backBtn, { backgroundColor: theme.backgroundElement }]}
              activeOpacity={0.7}>
              <Ionicons name="ellipsis-horizontal" size={18} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmDeleteContact}
              disabled={isDeleting}
              style={[styles.backBtn, { backgroundColor: theme.dangerMuted }]}
              activeOpacity={0.7}>
              {isDeleting ? (
                <ActivityIndicator size="small" color={theme.danger} />
              ) : (
                <Ionicons name="trash-outline" size={18} color={theme.danger} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Main Profile Header Card */}
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
                  type="title"
                  style={{
                    color: !contact.isRead ? theme.primaryText : theme.textSecondary,
                    fontSize: 22,
                  }}>
                  {getInitials(contact.fullName)}
                </ThemedText>
              </View>

              <View style={styles.profileDetails}>
                <ThemedText type="subtitle" style={styles.fullName}>
                  {contact.fullName}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Submitted {formatFullDateTime(contact.createdAt)}
                </ThemedText>
              </View>
            </View>

            {/* Badges */}
            <View style={styles.statusBadgesRow}>
              <StatusBadge type={contact.isRead ? 'read' : 'unread'} size="md" />
              <StatusBadge type={contact.isReplyed ? 'replied' : 'not_replied'} size="md" />
            </View>
          </View>

          {/* Prominent Status Update Buttons */}
          <View
            style={[
              styles.statusActionsCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <ThemedText type="smallBold" style={styles.sectionHeaderTitle}>
              Update Submission Status
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, fontSize: 12, marginBottom: Spacing.two }}>
              Mark when this inquiry has been reviewed and responded to:
            </ThemedText>

            <View style={styles.statusButtonsRow}>
              {/* Mark as Read button */}
              <TouchableOpacity
                onPress={handleMarkRead}
                disabled={isReading || contact.isRead}
                style={[
                  styles.statusActionBtn,
                  {
                    backgroundColor: contact.isRead
                      ? theme.backgroundElement
                      : theme.primary,
                    borderColor: contact.isRead ? theme.cardBorder : theme.primary,
                  },
                ]}
                activeOpacity={0.8}>
                {isReading ? (
                  <ActivityIndicator size="small" color={contact.isRead ? theme.text : theme.primaryText} />
                ) : (
                  <>
                    <Ionicons
                      name={contact.isRead ? 'checkmark-circle' : 'mail-unread-outline'}
                      size={18}
                      color={contact.isRead ? theme.success : theme.primaryText}
                    />
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: contact.isRead ? theme.text : theme.primaryText,
                        fontSize: 13,
                        marginLeft: 6,
                      }}>
                      {contact.isRead ? 'Readed ✓' : 'Mark as Readed'}
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>

              {/* Mark as Replied button */}
              <TouchableOpacity
                onPress={handleMarkReplied}
                disabled={isReplying || contact.isReplyed}
                style={[
                  styles.statusActionBtn,
                  {
                    backgroundColor: contact.isReplyed
                      ? theme.repliedBg
                      : theme.success,
                    borderColor: contact.isReplyed ? theme.replied : theme.success,
                  },
                ]}
                activeOpacity={0.8}>
                {isReplying ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name={contact.isReplyed ? 'checkmark-done-circle' : 'paper-plane-outline'}
                      size={18}
                      color={contact.isReplyed ? theme.replied : '#FFFFFF'}
                    />
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: contact.isReplyed ? theme.replied : '#FFFFFF',
                        fontSize: 13,
                        marginLeft: 6,
                      }}>
                      {contact.isReplyed ? 'Replyed ✓' : 'Mark as Replyed'}
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Communication Hub */}
          <View
            style={[
              styles.commCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <ThemedText type="smallBold" style={styles.sectionHeaderTitle}>
              Contact Channels
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, fontSize: 12, marginBottom: Spacing.two }}>
              Directly reach out to {contact.fullName} from your phone:
            </ThemedText>

            <View style={styles.channelGrid}>
              {/* Call */}
              {contact.phone && (
                <TouchableOpacity
                  onPress={() => makePhoneCall(contact.phone)}
                  style={[styles.channelItem, { backgroundColor: theme.backgroundElement }]}
                  activeOpacity={0.7}>
                  <View style={[styles.channelIconCircle, { backgroundColor: theme.successMuted }]}>
                    <Ionicons name="call" size={18} color={theme.success} />
                  </View>
                  <ThemedText type="smallBold" style={styles.channelLabel}>
                    Call
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary, fontSize: 11 }}
                    numberOfLines={1}>
                    {contact.phone}
                  </ThemedText>
                </TouchableOpacity>
              )}

              {/* Email */}
              <TouchableOpacity
                onPress={() =>
                  sendEmail(
                    contact.email,
                    `Response: ${contact.projectType || 'Project Inquiry'}`,
                    `Hi ${contact.fullName},\n\nThank you for reaching out regarding your project.`
                  )
                }
                style={[styles.channelItem, { backgroundColor: theme.backgroundElement }]}
                activeOpacity={0.7}>
                <View style={[styles.channelIconCircle, { backgroundColor: theme.primaryMuted }]}>
                  <Ionicons name="mail" size={18} color={theme.primary} />
                </View>
                <ThemedText type="smallBold" style={styles.channelLabel}>
                  Email
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary, fontSize: 11 }}
                  numberOfLines={1}>
                  {contact.email}
                </ThemedText>
              </TouchableOpacity>

              {/* WhatsApp */}
              {contact.phone && (
                <TouchableOpacity
                  onPress={() =>
                    openWhatsApp(
                      contact.phone,
                      `Hello ${contact.fullName}, thank you for contacting us regarding your inquiry.`
                    )
                  }
                  style={[styles.channelItem, { backgroundColor: theme.backgroundElement }]}
                  activeOpacity={0.7}>
                  <View style={[styles.channelIconCircle, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="logo-whatsapp" size={18} color="#16A34A" />
                  </View>
                  <ThemedText type="smallBold" style={styles.channelLabel}>
                    WhatsApp
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 11 }}>
                    Chat Direct
                  </ThemedText>
                </TouchableOpacity>
              )}

              {/* SMS */}
              {contact.phone && (
                <TouchableOpacity
                  onPress={() =>
                    sendSms(
                      contact.phone,
                      `Hi ${contact.fullName}, this is regarding your recent inquiry.`
                    )
                  }
                  style={[styles.channelItem, { backgroundColor: theme.backgroundElement }]}
                  activeOpacity={0.7}>
                  <View style={[styles.channelIconCircle, { backgroundColor: '#F3E8FF' }]}>
                    <Ionicons name="chatbubble-ellipses" size={18} color="#9333EA" />
                  </View>
                  <ThemedText type="smallBold" style={styles.channelLabel}>
                    SMS
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 11 }}>
                    Send SMS
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Message Section */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="chatbox-ellipses-outline" size={18} color={theme.primary} />
                <ThemedText type="smallBold" style={styles.sectionHeaderTitle}>
                  Inquiry Message
                </ThemedText>
              </View>
              <TouchableOpacity onPress={handleCopyMessage} activeOpacity={0.7}>
                <Ionicons name="copy-outline" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.messageBox,
                { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
              ]}>
              <ThemedText type="default" style={styles.messageText} selectable>
                {contact.message || 'No message provided in this submission.'}
              </ThemedText>
            </View>
          </View>

          {/* Project & Plan Details */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="layers-outline" size={18} color={theme.primary} />
              <ThemedText type="smallBold" style={styles.sectionHeaderTitle}>
                Service & Plan Specifications
              </ThemedText>
            </View>

            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 12 }}>
                  Selected Plan
                </ThemedText>
                <ThemedText type="smallBold" style={styles.specValue}>
                  {contact.plan || 'Not specified'}
                </ThemedText>
              </View>

              <View style={styles.specItem}>
                <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 12 }}>
                  Project Type
                </ThemedText>
                <ThemedText type="smallBold" style={styles.specValue}>
                  {contact.projectType || 'General Consultation'}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Technical Metadata */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="information-circle-outline" size={18} color={theme.textSecondary} />
              <ThemedText type="smallBold" style={styles.sectionHeaderTitle}>
                Submission Information
              </ThemedText>
            </View>

            <View style={styles.metaRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 12 }}>
                Inquiry ID:
              </ThemedText>
              <ThemedText type="code" style={{ fontSize: 11, color: theme.text }}>
                {contact._id}
              </ThemedText>
            </View>

            <View style={styles.metaRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 12 }}>
                Received At:
              </ThemedText>
              <ThemedText type="small" style={{ fontSize: 12, color: theme.text }}>
                {formatFullDateTime(contact.createdAt)}
              </ThemedText>
            </View>

            <View style={styles.metaRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 12 }}>
                Last Modified:
              </ThemedText>
              <ThemedText type="small" style={{ fontSize: 12, color: theme.text }}>
                {formatFullDateTime(contact.updatedAt)}
              </ThemedText>
            </View>
          </View>

          {/* Delete Contact Section */}
          <View style={styles.dangerSection}>
            <TouchableOpacity
              onPress={confirmDeleteContact}
              disabled={isDeleting}
              style={[
                styles.deleteContactBtn,
                {
                  backgroundColor: theme.dangerMuted,
                  borderColor: theme.danger,
                },
              ]}
              activeOpacity={0.8}>
              {isDeleting ? (
                <ActivityIndicator size="small" color={theme.danger} />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color={theme.danger} />
                  <ThemedText
                    type="smallBold"
                    style={{ color: theme.danger, marginLeft: 8, fontSize: 14 }}>
                    Delete Contact Inquiry
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  navActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dangerSection: {
    marginTop: Spacing.two,
    marginBottom: Spacing.five,
  },
  deleteContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 16,
  },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  profileCard: {
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  profileDetails: {
    flex: 1,
  },
  fullName: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    marginBottom: 2,
  },
  statusBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  statusActionsCard: {
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statusActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  commCard: {
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
  },
  channelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  channelItem: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.three,
    borderRadius: 12,
    alignItems: 'center',
  },
  channelIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  channelLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  sectionCard: {
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.two,
  },
  messageBox: {
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
  },
  specGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  specItem: {
    flex: 1,
  },
  specValue: {
    fontSize: 15,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  notFoundTitle: {
    fontSize: 20,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  returnBtn: {
    marginTop: Spacing.four,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
});
