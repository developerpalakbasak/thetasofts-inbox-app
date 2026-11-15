import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/common/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface SubscriberHeaderProps {
  totalCount: number;
  onRefresh: () => void;
}

export function SubscriberHeader({ totalCount, onRefresh }: SubscriberHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.topHeader}>
      <View>
        <ThemedText type="subtitle" style={styles.screenTitle}>
          Subscribers
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {totalCount} newsletter subscriptions
        </ThemedText>
      </View>

      <TouchableOpacity
        onPress={onRefresh}
        style={[styles.refreshIconBtn, { backgroundColor: theme.backgroundElement }]}
        activeOpacity={0.7}>
        <Ionicons name="refresh" size={16} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 8 : 4,
    paddingBottom: 6,
  },
  screenTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  refreshIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

