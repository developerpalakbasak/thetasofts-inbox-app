import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '@/types';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';
import {
  makePhoneCall,
  openWhatsApp,
  sendEmail,
  sendSms,
} from '@/utils/contact-actions';

export interface ContactChannelsProps {
  contact: Contact;
}

export function ContactChannels({ contact }: ContactChannelsProps) {
  const theme = useTheme();

  return (
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
        style={{ color: theme.textSecondary, fontSize: 11, marginBottom: 8 }}>
        Directly reach out to {contact.fullName} from your phone:
      </ThemedText>

      <View style={styles.channelGrid}>
        {/* Call */}
        {contact.phone ? (
          <TouchableOpacity
            onPress={() => makePhoneCall(contact.phone)}
            style={[styles.channelItem, { backgroundColor: theme.backgroundElement }]}
            activeOpacity={0.7}>
            <View style={[styles.channelIconCircle, { backgroundColor: theme.successMuted }]}>
              <Ionicons name="call" size={15} color={theme.success} />
            </View>
            <ThemedText type="smallBold" style={styles.channelLabel}>
              Call
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, fontSize: 10 }}
              numberOfLines={1}>
              {contact.phone}
            </ThemedText>
          </TouchableOpacity>
        ) : null}

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
            <Ionicons name="mail" size={15} color={theme.primary} />
          </View>
          <ThemedText type="smallBold" style={styles.channelLabel}>
            Email
          </ThemedText>
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, fontSize: 10 }}
            numberOfLines={1}>
            {contact.email}
          </ThemedText>
        </TouchableOpacity>

        {/* WhatsApp */}
        {contact.phone ? (
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
              <Ionicons name="logo-whatsapp" size={15} color="#16A34A" />
            </View>
            <ThemedText type="smallBold" style={styles.channelLabel}>
              WhatsApp
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 10 }}>
              Chat Direct
            </ThemedText>
          </TouchableOpacity>
        ) : null}

        {/* SMS */}
        {contact.phone ? (
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
              <Ionicons name="chatbubble-ellipses" size={15} color="#9333EA" />
            </View>
            <ThemedText type="smallBold" style={styles.channelLabel}>
              SMS
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 10 }}>
              Send SMS
            </ThemedText>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    marginBottom: 2,
  },
  channelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  channelItem: {
    flex: 1,
    minWidth: '45%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  channelIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  channelLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
});

