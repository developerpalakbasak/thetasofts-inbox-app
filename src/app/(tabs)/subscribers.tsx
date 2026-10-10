import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useInbox } from '@/context/inbox-context';
import { Subscriber } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SubscriberCard } from '@/components/subscriber-card';
import { SearchBar } from '@/components/search-bar';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SubscriberFilter = 'all' | 'active' | 'inactive';

export default function SubscribersScreen() {
  const theme = useTheme();
  const {
    subscribers,
    isLoadingSubscribers,
    refreshSubscribers,
    subscribersAnalytics,
    subscribersError,
  } = useInbox();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<SubscriberFilter>('all');

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      if (filter === 'active' && !sub.isActive) return false;
      if (filter === 'inactive' && sub.isActive) return false;

      if (searchQuery.trim().length > 0) {
        return sub.email.toLowerCase().includes(searchQuery.toLowerCase().trim());
      }
      return true;
    });
  }, [subscribers, filter, searchQuery]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.backgroundElement }]}>
        <Ionicons name="mail-open-outline" size={38} color={theme.textSecondary} />
      </View>
      <ThemedText type="smallBold" style={[styles.emptyTitle, { color: theme.text }]}>
        No subscribers found
      </ThemedText>
      <ThemedText type="small" style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {searchQuery
          ? `No subscriber emails matching "${searchQuery}"`
          : `No ${filter} subscribers in the list.`}
      </ThemedText>
      {(filter !== 'all' || searchQuery.length > 0) && (
        <TouchableOpacity
          onPress={() => {
            setFilter('all');
            setSearchQuery('');
          }}
          style={[styles.resetBtn, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}>
          <ThemedText type="small" style={{ color: theme.primaryText, fontWeight: '700' }}>
            Show All Subscribers
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <ThemedText type="subtitle" style={styles.screenTitle}>
              Subscribers
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {subscribers.length} newsletter subscriptions
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={() => refreshSubscribers()}
            style={[styles.refreshIconBtn, { backgroundColor: theme.backgroundElement }]}
            activeOpacity={0.7}>
            <Ionicons name="refresh" size={18} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Server error notice if API fails */}
        {subscribersError ? (
          <View
            style={[
              styles.errorBanner,
              { backgroundColor: theme.dangerMuted, borderColor: theme.danger },
            ]}>
            <View style={styles.errorTextRow}>
              <Ionicons name="alert-circle" size={16} color={theme.danger} />
              <ThemedText type="small" style={{ color: theme.danger, flex: 1, fontWeight: '600' }}>
                {subscribersError}
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={refreshSubscribers}
              style={[styles.retryBtn, { backgroundColor: theme.danger }]}
              activeOpacity={0.7}>
              <ThemedText type="small" style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 11 }}>
                Retry
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Analytics Summary */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            onPress={() => setFilter('all')}
            style={[
              styles.statCard,
              {
                backgroundColor: theme.card,
                borderColor: filter === 'all' ? theme.primary : theme.cardBorder,
                borderWidth: filter === 'all' ? 1.5 : 1,
              },
            ]}>
            <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 11 }}>
              Total
            </ThemedText>
            <ThemedText type="subtitle" style={[styles.statNum, { color: theme.text }]}>
              {subscribersAnalytics.total}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('active')}
            style={[
              styles.statCard,
              {
                backgroundColor: theme.successMuted,
                borderColor: filter === 'active' ? theme.success : theme.cardBorder,
                borderWidth: 1.2,
              },
            ]}>
            <ThemedText
              type="smallBold"
              style={{ color: theme.success, fontSize: 11, textTransform: 'uppercase' }}>
              Active
            </ThemedText>
            <ThemedText type="subtitle" style={[styles.statNum, { color: theme.success }]}>
              {subscribersAnalytics.active}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('inactive')}
            style={[
              styles.statCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: filter === 'inactive' ? theme.textSecondary : theme.cardBorder,
                borderWidth: filter === 'inactive' ? 1.5 : 1,
              },
            ]}>
            <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 11 }}>
              Inactive
            </ThemedText>
            <ThemedText type="subtitle" style={[styles.statNum, { color: theme.textSecondary }]}>
              {subscribersAnalytics.inactive}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Search Bar - Rendered outside FlatList to retain focus */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search subscriber by email..."
        />

        {/* Count label & clear button */}
        <View style={styles.resultRow}>
          <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 13 }}>
            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
            {filter !== 'all' ? ` (${filter})` : ''}
          </ThemedText>

          {(filter !== 'all' || searchQuery.length > 0) && (
            <TouchableOpacity
              onPress={() => {
                setFilter('all');
                setSearchQuery('');
              }}>
              <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>
                Reset filters
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredSubscribers}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={({ item }: { item: Subscriber }) => (
            <View style={styles.cardWrapper}>
              <SubscriberCard subscriber={item} />
            </View>
          )}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: BottomTabInset + Spacing.six },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingSubscribers}
              onRefresh={refreshSubscribers}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
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
  listContent: {
    flexGrow: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Platform.OS === 'android' ? Spacing.two : Spacing.one,
    paddingBottom: Spacing.two,
  },
  screenTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
  },
  refreshIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  statCard: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  statNum: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  cardWrapper: {
    paddingHorizontal: Spacing.four,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  emptyTitle: {
    fontSize: 17,
    marginBottom: 4,
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.four,
  },
  resetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  errorBanner: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    padding: Spacing.three,
    borderRadius: 12,
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
});
