import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { ConfirmModal } from '@/components/common/confirm-modal';
import {
  ContactChannels,
  ContactMessageCard,
  ContactMessageModal,
  ContactMetadataCard,
  ContactOptionsModal,
  ContactProfileCard,
  ContactSpecsCard,
  ContactStatusActions,
} from '@/components/contacts';
import { MaxContentWidth } from '@/constants/theme';
import { useInbox } from '@/context/inbox-context';
import { useTheme } from '@/hooks/use-theme';
import { sendEmail } from '@/utils/contact-actions';

export default function ContactDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { getContactById, markAsRead, markAsReplied, deleteContact } = useInbox();

  const contact = getContactById(id || '');

  const [isReading, setIsReading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);

  const handleDeleteContact = useCallback(async () => {
    if (!contact) return;
    setDeleteConfirmVisible(false);
    const success = await deleteContact(contact._id);
    if (success) {
      router.back();
    }
  }, [contact, deleteContact]);

  const handleMarkRead = useCallback(async () => {
    if (!contact || contact.isRead) return;
    setIsReading(true);
    await markAsRead(contact._id);
    setIsReading(false);
  }, [contact, markAsRead]);

  const handleMarkReplied = useCallback(async () => {
    if (!contact || contact.isReplyed) return;
    setIsReplying(true);
    await markAsReplied(contact._id);
    setIsReplying(false);
  }, [contact, markAsReplied]);

  const handleReplyEmail = useCallback(() => {
    if (!contact) return;
    setOptionsVisible(false);
    setMessageModalVisible(false);
    sendEmail(
      contact.email,
      `Re: ${contact.projectType || 'Inquiry'}`,
      `Hi ${contact.fullName},\n\nThank you for reaching out regarding your project.`
    );
  }, [contact]);

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
              onPress={() => setOptionsVisible(true)}
              style={[styles.backBtn, { backgroundColor: theme.backgroundElement }]}
              activeOpacity={0.7}>
              <Ionicons name="ellipsis-horizontal" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Main Profile Header Card */}
          <ContactProfileCard contact={contact} />

          {/* Prominent Status Update Buttons */}
          <ContactStatusActions
            isRead={contact.isRead}
            isReplied={contact.isReplyed}
            isReading={isReading}
            isReplying={isReplying}
            onMarkRead={handleMarkRead}
            onMarkReplied={handleMarkReplied}
          />

          {/* Quick Communication Hub */}
          <ContactChannels contact={contact} />

          {/* Message Section */}
          <ContactMessageCard
            message={contact.message}
            onOpenMessageModal={() => setMessageModalVisible(true)}
          />

          {/* Project & Plan Details */}
          <ContactSpecsCard plan={contact.plan} projectType={contact.projectType} />

          {/* Technical Metadata */}
          <ContactMetadataCard
            id={contact._id}
            createdAt={contact.createdAt}
            updatedAt={contact.updatedAt}
          />
        </ScrollView>

        {/* Themed Inquiry Options Modal */}
        <ContactOptionsModal
          visible={optionsVisible}
          contact={contact}
          onClose={() => setOptionsVisible(false)}
          onReplyEmail={handleReplyEmail}
          onDelete={() => {
            setOptionsVisible(false);
            setDeleteConfirmVisible(true);
          }}
        />

        {/* Themed Delete Confirmation Modal */}
        <ConfirmModal
          visible={deleteConfirmVisible}
          title="Delete Contact Inquiry?"
          message={`Are you sure you want to permanently delete the inquiry from "${contact.fullName}"? This action cannot be undone.`}
          confirmText="Delete"
          isDestructive
          onConfirm={handleDeleteContact}
          onClose={() => setDeleteConfirmVisible(false)}
        />

        {/* Themed Message Action Modal */}
        <ContactMessageModal
          visible={messageModalVisible}
          contact={contact}
          onClose={() => setMessageModalVisible(false)}
          onReplyEmail={handleReplyEmail}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 15,
  },
  navActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 50,
    gap: 10,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  notFoundTitle: {
    fontSize: 18,
    marginTop: 8,
  },
  returnBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
