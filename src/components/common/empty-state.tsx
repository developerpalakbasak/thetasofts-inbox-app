import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.backgroundElement }]}>
        <Ionicons name={icon} size={38} color={theme.textSecondary} />
      </View>
      <ThemedText type="smallBold" style={[styles.emptyTitle, { color: theme.text }]}>
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText type="small" style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.actionBtn, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}>
          <ThemedText type="small" style={{ color: theme.primaryText, fontWeight: '700' }}>
            {actionLabel}
          </ThemedText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: 280,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
});

