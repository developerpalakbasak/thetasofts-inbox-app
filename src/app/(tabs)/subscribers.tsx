import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useInbox } from '@/context/inbox-context';
import { Subscriber } from '@/types';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorBanner } from '@/components/common/error-banner';
import {
  SubscriberCard,
  SubscriberFilter,
  SubscriberHeader,
  SubscriberStats,
} from '@/components/subscribers';
import { BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const keyExtractor = (item: Subscriber) => item._id;

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

  const handleResetFilters = useCallback(() => {
    setFilter('all');
    setSearchQuery('');
  }, []);

  const renderEmpty = useCallback(
    () => (
      <EmptyState
        icon="mail-open-outline"
        title="No subscribers found"
        subtitle={
          searchQuery
            ? `No subscriber emails matching "${searchQuery}"`
            : `No ${filter} subscribers in the list.`
        }
        actionLabel={
          filter !== 'all' || searchQuery.length > 0 ? 'Show All Subscribers' : undefined
        }
        onAction={handleResetFilters}
      />
    ),
    [filter, searchQuery, handleResetFilters]
  );

  const renderItem = useCallback(
    ({ item }: { item: Subscriber }) => (
      <View style={styles.cardWrapper}>
        <SubscriberCard subscriber={item} />
      </View>
    ),
    []
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <SubscriberHeader totalCount={subscribers.length} onRefresh={refreshSubscribers} />

        {/* Server error notice if API fails */}
        {subscribersError ? (
          <ErrorBanner error={subscribersError} onRetry={refreshSubscribers} />
        ) : null}

        {/* Analytics Summary Filter Cards */}
        <SubscriberStats
          analytics={subscribersAnalytics}
          currentFilter={filter}
          onSelectFilter={setFilter}
        />

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

          {filter !== 'all' || searchQuery.length > 0 ? (
            <TouchableOpacity onPress={handleResetFilters}>
              <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>
                Reset filters
              </ThemedText>
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          data={filteredSubscribers}
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: BottomTabInset + 24 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingSubscribers}
              onRefresh={refreshSubscribers}
              tintColor={theme.primary}
              colors={[theme.primary]}
              progressBackgroundColor={theme.card}
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
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  cardWrapper: {
    paddingHorizontal: 16,
  },
});
