import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface ErrorBannerProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.errorBanner,
        { backgroundColor: theme.dangerMuted, borderColor: theme.danger },
      ]}>
      <View style={styles.errorTextRow}>
        <Ionicons name="alert-circle" size={16} color={theme.danger} />
        <ThemedText type="small" style={{ color: theme.danger, flex: 1, fontWeight: '600' }}>
          {error}
        </ThemedText>
      </View>
      {onRetry ? (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.retryBtn, { backgroundColor: theme.danger }]}
          activeOpacity={0.7}>
          <ThemedText type="small" style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 11 }}>
            Retry
          </ThemedText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    marginHorizontal: 16,
    marginBottom: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  errorTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  retryBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
});

