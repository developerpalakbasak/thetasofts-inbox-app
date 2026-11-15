import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface ContactStatusActionsProps {
  isRead: boolean;
  isReplied: boolean;
  isReading: boolean;
  isReplying: boolean;
  onMarkRead: () => void;
  onMarkReplied: () => void;
}

export function ContactStatusActions({
  isRead,
  isReplied,
  isReading,
  isReplying,
  onMarkRead,
  onMarkReplied,
}: ContactStatusActionsProps) {
  const theme = useTheme();

  return (
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
        style={{ color: theme.textSecondary, fontSize: 11, marginBottom: 8 }}>
        Mark when this inquiry has been reviewed and responded to:
      </ThemedText>

      <View style={styles.statusButtonsRow}>
        {/* Mark as Read button */}
        <TouchableOpacity
          onPress={onMarkRead}
          disabled={isReading || isRead}
          style={[
            styles.statusActionBtn,
            {
              backgroundColor: isRead ? theme.backgroundElement : theme.primary,
              borderColor: isRead ? theme.cardBorder : theme.primary,
            },
          ]}
          activeOpacity={0.8}>
          {isReading ? (
            <ActivityIndicator size="small" color={isRead ? theme.text : theme.primaryText} />
          ) : (
            <>
              <Ionicons
                name={isRead ? 'checkmark-circle' : 'mail-unread-outline'}
                size={15}
                color={isRead ? theme.success : theme.primaryText}
              />
              <ThemedText
                type="smallBold"
                style={{
                  color: isRead ? theme.text : theme.primaryText,
                  fontSize: 12,
                  marginLeft: 5,
                }}>
                {isRead ? 'Read ✓' : 'Mark as Read'}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        {/* Mark as Replied button */}
        <TouchableOpacity
          onPress={onMarkReplied}
          disabled={isReplying || isReplied}
          style={[
            styles.statusActionBtn,
            {
              backgroundColor: isReplied ? theme.repliedBg : theme.success,
              borderColor: isReplied ? theme.replied : theme.success,
            },
          ]}
          activeOpacity={0.8}>
          {isReplying ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name={isReplied ? 'checkmark-done-circle' : 'paper-plane-outline'}
                size={15}
                color={isReplied ? theme.replied : '#FFFFFF'}
              />
              <ThemedText
                type="smallBold"
                style={{
                  color: isReplied ? theme.replied : '#FFFFFF',
                  fontSize: 12,
                  marginLeft: 5,
                }}>
                {isReplied ? 'Replied ✓' : 'Mark as Replied'}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusActionsCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    marginBottom: 2,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
});

