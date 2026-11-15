import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useInbox } from '@/context/inbox-context';
import { Contact, ContactFilter } from '@/types';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorBanner } from '@/components/common/error-banner';
import { ContactCard, ContactHeader, FilterBar } from '@/components/contacts';
import { BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const keyExtractor = (item: Contact) => item._id;

export default function ContactsScreen() {
  const theme = useTheme();
  const {
    contacts,
    isLoadingContacts,
    refreshContacts,
    markAsRead,
    markAsReplied,
    contactsAnalytics,
    updatingReadIds,
    updatingRepliedIds,
    contactsError,
  } = useInbox();

  const [currentFilter, setCurrentFilter] = useState<ContactFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered contacts based on active filter and search text
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // 1. Filter by status
      if (currentFilter === 'unread' && contact.isRead) return false;
      if (currentFilter === 'read' && !contact.isRead) return false;
      if (currentFilter === 'replyed' && !contact.isReplyed) return false;
      if (currentFilter === 'not_replyed' && contact.isReplyed) return false;

      // 2. Search query filter
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = contact.fullName.toLowerCase().includes(query);
        const emailMatch = contact.email.toLowerCase().includes(query);
        const phoneMatch = contact.phone ? contact.phone.includes(query) : false;
        const messageMatch = contact.message ? contact.message.toLowerCase().includes(query) : false;
        const projectMatch = contact.projectType ? contact.projectType.toLowerCase().includes(query) : false;
        const planMatch = contact.plan ? contact.plan.toLowerCase().includes(query) : false;

        return nameMatch || emailMatch || phoneMatch || messageMatch || projectMatch || planMatch;
      }

      return true;
    });
  }, [contacts, currentFilter, searchQuery]);

  const handleOpenDetails = useCallback((contact: Contact) => {
    router.push({
      pathname: '/contact/[id]',
      params: { id: contact._id },
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setCurrentFilter('all');
    setSearchQuery('');
  }, []);

  const renderEmptyList = useCallback(
    () => (
      <EmptyState
        icon="file-tray-outline"
        title="No inquiries found"
        subtitle={
          searchQuery
            ? `No results matching "${searchQuery}"`
            : `No contact inquiries found under "${currentFilter.replace('_', ' ')}" filter.`
        }
        actionLabel={
          currentFilter !== 'all' || searchQuery.length > 0 ? 'Show All Inquiries' : undefined
        }
        onAction={handleResetFilters}
      />
    ),
    [currentFilter, searchQuery, handleResetFilters]
  );

  const renderItem = useCallback(
    ({ item }: { item: Contact }) => (
      <View style={styles.cardWrapper}>
        <ContactCard
          contact={item}
          onPress={() => handleOpenDetails(item)}
          onToggleRead={() => markAsRead(item._id)}
          onToggleReplied={() => markAsReplied(item._id)}
          isUpdatingRead={!!updatingReadIds[item._id]}
          isUpdatingReplied={!!updatingRepliedIds[item._id]}
        />
      </View>
    ),
    [handleOpenDetails, markAsRead, markAsReplied, updatingReadIds, updatingRepliedIds]
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <ContactHeader totalCount={contacts.length} onRefresh={refreshContacts} />

        {/* Server error notice if API fails */}
        {contactsError ? (
          <ErrorBanner error={contactsError} onRetry={refreshContacts} />
        ) : null}

        {/* Search Input */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search contacts, emails, inquiries..."
        />

        {/* Status Filter Chips: All, Unread, Read, Replied, Not Replied */}
        <FilterBar
          currentFilter={currentFilter}
          onSelectFilter={setCurrentFilter}
          analytics={contactsAnalytics}
        />

        {/* Filter result label */}
        <View style={styles.resultCountRow}>
          <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 13 }}>
            Showing {filteredContacts.length} of {contacts.length} inquiries
            {currentFilter !== 'all' ? ` (${currentFilter.replace('_', ' ')})` : ''}
          </ThemedText>

          {currentFilter !== 'all' || searchQuery.length > 0 ? (
            <TouchableOpacity onPress={handleResetFilters}>
              <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>
                Reset filters
              </ThemedText>
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          data={filteredContacts}
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: BottomTabInset + 24 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingContacts}
              onRefresh={refreshContacts}
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
  resultCountRow: {
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
