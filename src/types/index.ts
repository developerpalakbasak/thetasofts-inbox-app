export interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  plan?: string;
  projectType?: string;
  message?: string;
  isRead: boolean;
  isReplyed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  _id: string;
  email: string;
  subscribedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ContactFilter = 'all' | 'unread' | 'read' | 'replyed' | 'not_replyed';

export interface ContactsAnalytics {
  total: number;
  unread: number;
  read: number;
  replyed: number;
  notReplyed: number;
}

export interface SubscribersAnalytics {
  total: number;
  active: number;
  inactive: number;
}
