import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Contact, Subscriber, ContactsAnalytics, SubscribersAnalytics } from '@/types';
import { contactsApi, subscribersApi } from '@/services/api';

interface InboxContextValue {
  contacts: Contact[];
  subscribers: Subscriber[];
  isLoadingContacts: boolean;
  isLoadingSubscribers: boolean;
  contactsError: string | null;
  subscribersError: string | null;
  refreshContacts: () => Promise<void>;
  refreshSubscribers: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAsReplied: (id: string) => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;
  deleteSubscriber: (idOrEmail: string) => Promise<boolean>;
  getContactById: (id: string) => Contact | undefined;
  contactsAnalytics: ContactsAnalytics;
  subscribersAnalytics: SubscribersAnalytics;
  updatingReadIds: Record<string, boolean>;
  updatingRepliedIds: Record<string, boolean>;
  deletingContactIds: Record<string, boolean>;
  deletingSubscriberIds: Record<string, boolean>;
}

const InboxContext = createContext<InboxContextValue | null>(null);

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [subscribersError, setSubscribersError] = useState<string | null>(null);
  
  const [updatingReadIds, setUpdatingReadIds] = useState<Record<string, boolean>>({});
  const [updatingRepliedIds, setUpdatingRepliedIds] = useState<Record<string, boolean>>({});
  const [deletingContactIds, setDeletingContactIds] = useState<Record<string, boolean>>({});
  const [deletingSubscriberIds, setDeletingSubscriberIds] = useState<Record<string, boolean>>({});

  const fetchContactsData = useCallback(async () => {
    setIsLoadingContacts(true);
    setContactsError(null);
    try {
      const data = await contactsApi.getAllContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.warn('Failed to fetch contacts from API:', err?.message || err);
      const msg = err?.response?.data?.message || err?.message || 'Error connecting to server';
      setContactsError(msg);
    } finally {
      setIsLoadingContacts(false);
    }
  }, []);

  const fetchSubscribersData = useCallback(async () => {
    setIsLoadingSubscribers(true);
    setSubscribersError(null);
    try {
      const data = await subscribersApi.getAllSubscribers();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.warn('Failed to fetch subscribers from API:', err?.message || err);
      const msg = err?.response?.data?.message || err?.message || 'Error connecting to server';
      setSubscribersError(msg);
    } finally {
      setIsLoadingSubscribers(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchContactsData();
    void fetchSubscribersData();
  }, [fetchContactsData, fetchSubscribersData]);

  const refreshContacts = useCallback(async () => {
    await fetchContactsData();
  }, [fetchContactsData]);

  const refreshSubscribers = useCallback(async () => {
    await fetchSubscribersData();
  }, [fetchSubscribersData]);

  const markAsRead = useCallback(
    async (id: string): Promise<boolean> => {
      setUpdatingReadIds((prev) => ({ ...prev, [id]: true }));

      try {
        const updated = await contactsApi.markAsRead(id);
        setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, ...updated, isRead: true } : c)));
        return true;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to mark as read';
        Alert.alert('Update Failed', msg);
        return false;
      } finally {
        setUpdatingReadIds((prev) => ({ ...prev, [id]: false }));
      }
    },
    []
  );

  const markAsReplied = useCallback(
    async (id: string): Promise<boolean> => {
      setUpdatingRepliedIds((prev) => ({ ...prev, [id]: true }));

      try {
        const updated = await contactsApi.markAsReplied(id);
        setContacts((prev) =>
          prev.map((c) => (c._id === id ? { ...c, ...updated, isReplyed: true, isRead: true } : c))
        );
        return true;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to mark as replied';
        Alert.alert('Update Failed', msg);
        return false;
      } finally {
        setUpdatingRepliedIds((prev) => ({ ...prev, [id]: false }));
      }
    },
    []
  );

  const deleteContact = useCallback(
    async (id: string): Promise<boolean> => {
      setDeletingContactIds((prev) => ({ ...prev, [id]: true }));
      try {
        await contactsApi.deleteContact(id);
        setContacts((prev) => prev.filter((c) => c._id !== id));
        return true;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to delete contact inquiry';
        Alert.alert('Delete Failed', msg);
        return false;
      } finally {
        setDeletingContactIds((prev) => ({ ...prev, [id]: false }));
      }
    },
    []
  );

  const deleteSubscriber = useCallback(
    async (idOrEmail: string): Promise<boolean> => {
      setDeletingSubscriberIds((prev) => ({ ...prev, [idOrEmail]: true }));
      try {
        await subscribersApi.deleteSubscriber(idOrEmail);
        setSubscribers((prev) => prev.filter((s) => s._id !== idOrEmail && s.email !== idOrEmail));
        return true;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to delete subscriber';
        Alert.alert('Delete Failed', msg);
        return false;
      } finally {
        setDeletingSubscriberIds((prev) => ({ ...prev, [idOrEmail]: false }));
      }
    },
    []
  );

  const getContactById = useCallback(
    (id: string) => {
      return contacts.find((c) => c._id === id);
    },
    [contacts]
  );

  const contactsAnalytics = useMemo<ContactsAnalytics>(() => {
    const total = contacts.length;
    const unread = contacts.filter((c) => !c.isRead).length;
    const read = contacts.filter((c) => c.isRead).length;
    const replyed = contacts.filter((c) => c.isReplyed).length;
    const notReplyed = contacts.filter((c) => !c.isReplyed).length;
    return { total, unread, read, replyed, notReplyed };
  }, [contacts]);

  const subscribersAnalytics = useMemo<SubscribersAnalytics>(() => {
    const total = subscribers.length;
    const active = subscribers.filter((s) => s.isActive).length;
    const inactive = subscribers.filter((s) => !s.isActive).length;
    return { total, active, inactive };
  }, [subscribers]);

  return (
    <InboxContext.Provider
      value={{
        contacts,
        subscribers,
        isLoadingContacts,
        isLoadingSubscribers,
        contactsError,
        subscribersError,
        refreshContacts,
        refreshSubscribers,
        markAsRead,
        markAsReplied,
        deleteContact,
        deleteSubscriber,
        getContactById,
        contactsAnalytics,
        subscribersAnalytics,
        updatingReadIds,
        updatingRepliedIds,
        deletingContactIds,
        deletingSubscriberIds,
      }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error('useInbox must be used within an InboxProvider');
  }
  return context;
}
