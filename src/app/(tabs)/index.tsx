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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useInbox } from '@/context/inbox-context';
import { Contact, ContactFilter } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ContactCard } from '@/components/contact-card';
import { FilterBar } from '@/components/filter-bar';
import { AnalyticsSummary } from '@/components/analytics-summary';
import { SearchBar } from '@/components/search-bar';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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

  const handleOpenDetails = (contact: Contact) => {
    // Navigate to single contact details page
    router.push({
      pathname: '/contact/[id]',
      params: { id: contact._id },
    });
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.backgroundElement }]}>
        <Ionicons name="file-tray-outline" size={38} color={theme.textSecondary} />
      </View>
      <ThemedText type="smallBold" style={[styles.emptyTitle, { color: theme.text }]}>
        No inquiries found
      </ThemedText>
      <ThemedText type="small" style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {searchQuery
          ? `No results matching "${searchQuery}"`
          : `No contact inquiries found under "${currentFilter.replace('_', ' ')}" filter.`}
      </ThemedText>
      {(currentFilter !== 'all' || searchQuery.length > 0) && (
        <TouchableOpacity
          onPress={() => {
            setCurrentFilter('all');
            setSearchQuery('');
          }}
          style={[styles.resetFilterBtn, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}>
          <ThemedText type="small" style={{ color: theme.primaryText, fontWeight: '700' }}>
            Show All Inquiries
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
              Contacts Inbox
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {contacts.length} total contact submissions
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={() => refreshContacts()}
            style={[styles.refreshIconBtn, { backgroundColor: theme.backgroundElement }]}
            activeOpacity={0.7}>
            <Ionicons name="refresh" size={18} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Server error notice if API fails */}
        {contactsError ? (
          <View
            style={[
              styles.errorBanner,
              { backgroundColor: theme.dangerMuted, borderColor: theme.danger },
            ]}>
            <View style={styles.errorTextRow}>
              <Ionicons name="alert-circle" size={16} color={theme.danger} />
              <ThemedText type="small" style={{ color: theme.danger, flex: 1, fontWeight: '600' }}>
                {contactsError}
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={refreshContacts}
              style={[styles.retryBtn, { backgroundColor: theme.danger }]}
              activeOpacity={0.7}>
              <ThemedText type="small" style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 11 }}>
                Retry
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Analytics Summary */}
        <AnalyticsSummary
          analytics={contactsAnalytics}
          onFilterPress={(filter) => setCurrentFilter(filter)}
        />

        {/* Search Input - Rendered outside FlatList to retain focus and keep keyboard open */}
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
            <TouchableOpacity
              onPress={() => {
                setCurrentFilter('all');
                setSearchQuery('');
              }}>
              <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>
                Reset filters
              </ThemedText>
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => (
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
          )}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: BottomTabInset + Spacing.six },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingContacts}
              onRefresh={refreshContacts}
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
  resultCountRow: {
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
  resetFilterBtn: {
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
