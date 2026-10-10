import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface StatusBadgeProps {
  type: 'read' | 'unread' | 'replied' | 'not_replied' | 'active' | 'inactive';
  size?: 'sm' | 'md';
}

export function StatusBadge({ type, size = 'sm' }: StatusBadgeProps) {
  const theme = useTheme();

  const getBadgeConfig = () => {
    switch (type) {
      case 'unread':
        return {
          label: 'Unread',
          icon: 'mail-unread-outline' as const,
          color: theme.unread,
          bg: theme.unreadBg,
        };
      case 'read':
        return {
          label: 'Read',
          icon: 'mail-open-outline' as const,
          color: theme.textSecondary,
          bg: theme.backgroundElement,
        };
      case 'replied':
        return {
          label: 'Replied',
          icon: 'checkmark-circle-outline' as const,
          color: theme.replied,
          bg: theme.repliedBg,
        };
      case 'not_replied':
        return {
          label: 'Awaiting Reply',
          icon: 'time-outline' as const,
          color: theme.warning,
          bg: theme.warningMuted,
        };
      case 'active':
        return {
          label: 'Active',
          icon: 'radio-button-on' as const,
          color: theme.success,
          bg: theme.successMuted,
        };
      case 'inactive':
        return {
          label: 'Inactive',
          icon: 'pause-circle-outline' as const,
          color: theme.textSecondary,
          bg: theme.backgroundElement,
        };
    }
  };

  const config = getBadgeConfig();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 8 : 10,
        },
      ]}>
      <Ionicons name={config.icon} size={isSm ? 12 : 14} color={config.color} style={styles.icon} />
      <ThemedText
        type="small"
        style={[
          styles.text,
          {
            color: config.color,
            fontSize: isSm ? 11 : 12,
            fontWeight: '600',
          },
        ]}>
        {config.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    textTransform: 'capitalize',
  },
});
