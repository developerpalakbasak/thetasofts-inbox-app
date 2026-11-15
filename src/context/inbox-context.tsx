import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { Contact, ContactsAnalytics, Subscriber, SubscribersAnalytics } from '@/types';
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

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
    return errorObj.response?.data?.message || errorObj.message || fallback;
  }
  return fallback;
}

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
    } catch (err: unknown) {
      console.warn('Failed to fetch contacts from API:', err);
      setContactsError(getErrorMessage(err, 'Error connecting to server'));
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
    } catch (err: unknown) {
      console.warn('Failed to fetch subscribers from API:', err);
      setSubscribersError(getErrorMessage(err, 'Error connecting to server'));
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

  const markAsRead = useCallback(async (id: string): Promise<boolean> => {
    setUpdatingReadIds((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await contactsApi.markAsRead(id);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...updated, isRead: true } : c))
      );
      return true;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to mark as read');
      Alert.alert('Update Failed', msg);
      return false;
    } finally {
      setUpdatingReadIds((prev) => ({ ...prev, [id]: false }));
    }
  }, []);

  const markAsReplied = useCallback(async (id: string): Promise<boolean> => {
    setUpdatingRepliedIds((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await contactsApi.markAsReplied(id);
      setContacts((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, ...updated, isReplyed: true, isRead: true } : c
        )
      );
      return true;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to mark as replied');
      Alert.alert('Update Failed', msg);
      return false;
    } finally {
      setUpdatingRepliedIds((prev) => ({ ...prev, [id]: false }));
    }
  }, []);

  const deleteContact = useCallback(async (id: string): Promise<boolean> => {
    setDeletingContactIds((prev) => ({ ...prev, [id]: true }));
    try {
      await contactsApi.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      return true;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to delete contact inquiry');
      Alert.alert('Delete Failed', msg);
      return false;
    } finally {
      setDeletingContactIds((prev) => ({ ...prev, [id]: false }));
    }
  }, []);

  const deleteSubscriber = useCallback(async (idOrEmail: string): Promise<boolean> => {
    setDeletingSubscriberIds((prev) => ({ ...prev, [idOrEmail]: true }));
    try {
      await subscribersApi.deleteSubscriber(idOrEmail);
      setSubscribers((prev) => prev.filter((s) => s._id !== idOrEmail && s.email !== idOrEmail));
      return true;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to delete subscriber');
      Alert.alert('Delete Failed', msg);
      return false;
    } finally {
      setDeletingSubscriberIds((prev) => ({ ...prev, [idOrEmail]: false }));
    }
  }, []);

  const getContactById = useCallback(
    (id: string) => {
      return contacts.find((c) => c._id === id);
    },
    [contacts]
  );

  // Optimized single-pass analytics computation
  const contactsAnalytics = useMemo<ContactsAnalytics>(() => {
    let unread = 0;
    let read = 0;
    let replyed = 0;
    let notReplyed = 0;

    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i];
      if (c.isRead) {
        read++;
      } else {
        unread++;
      }
      if (c.isReplyed) {
        replyed++;
      } else {
        notReplyed++;
      }
    }

    return { total: contacts.length, unread, read, replyed, notReplyed };
  }, [contacts]);

  // Optimized single-pass subscribers analytics computation
  const subscribersAnalytics = useMemo<SubscribersAnalytics>(() => {
    let active = 0;
    let inactive = 0;

    for (let i = 0; i < subscribers.length; i++) {
      if (subscribers[i].isActive) {
        active++;
      } else {
        inactive++;
      }
    }

    return { total: subscribers.length, active, inactive };
  }, [subscribers]);

  // Memoize context value to prevent unneeded consumer re-renders
  const contextValue = useMemo<InboxContextValue>(
    () => ({
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
    }),
    [
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
    ]
  );

  return <InboxContext.Provider value={contextValue}>{children}</InboxContext.Provider>;
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error('useInbox must be used within an InboxProvider');
  }
  return context;
}
