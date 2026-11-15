import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Contact, Subscriber } from '@/types';

/**
 * Configure your authentication token and server base URL here.
 * The placeholder <AUTH_TOKEN> can be replaced with your actual token.
 *
 * NOTE for Mobile testing:
 * - When running on a physical Android or iOS device via Expo Go, 'localhost' points
 *   to the phone itself, NOT your PC.
 * - This function automatically extracts your development PC's IP from Metro (hostUri),
 *   falling back to 192.168.1.106:4000 or EXPO_PUBLIC_API_URL.
 */
export const AUTH_TOKEN = 'e95a5dc562902ba747f11c0f90b02c19';

const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.trim().replace(/\/+$/, '');
  }
  if (Platform.OS === 'web') {
    return 'http://localhost:4000';
  }
  // Automatically extract PC's IP from Expo's Metro host URI (e.g. "192.168.1.106:8081" -> "192.168.1.106")
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:4000`;
  }
  return 'http://192.168.1.106:4000';
};

export const API_BASE_URL = getBaseUrl();

// eslint-disable-next-line import/no-named-as-default-member
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AUTH_TOKEN}`,
    'x-auth-token': AUTH_TOKEN,
  },
});

export const contactsApi = {
  /**
   * GET /contacts - Retrieve all contact submissions
   */
  async getAllContacts(): Promise<Contact[]> {
    const response = await axiosInstance.get<Contact[]>('/contacts');
    return response.data;
  },

  /**
   * GET /contacts/unread - Retrieve all unread contact submissions
   */
  async getUnreadContacts(): Promise<Contact[]> {
    const response = await axiosInstance.get<Contact[]>('/contacts/unread');
    return response.data;
  },

  /**
   * GET /contacts/read - Retrieve all read contact submissions
   */
  async getReadContacts(): Promise<Contact[]> {
    const response = await axiosInstance.get<Contact[]>('/contacts/read');
    return response.data;
  },

  /**
   * PATCH /contacts/:id/read - Mark contact inquiry as read
   */
  async markAsRead(id: string): Promise<Contact> {
    const response = await axiosInstance.patch<Contact>(`/contacts/${id}/read`);
    return response.data;
  },

  /**
   * PATCH /contacts/:id/replyed - Mark contact inquiry as replied
   */
  async markAsReplied(id: string): Promise<Contact> {
    const response = await axiosInstance.patch<Contact>(`/contacts/${id}/replyed`);
    return response.data;
  },

  /**
   * DELETE /contacts/:id - Delete a contact inquiry by ID
   */
  async deleteContact(id: string): Promise<{ message: string; contact?: Contact }> {
    const response = await axiosInstance.delete<{ message: string; contact?: Contact }>(`/contacts/${id}`);
    return response.data;
  },
};

export const subscribersApi = {
  /**
   * GET /subscribers - Retrieve all newsletter subscribers
   */
  async getAllSubscribers(): Promise<Subscriber[]> {
    const response = await axiosInstance.get<Subscriber[]>('/subscribers');
    return response.data;
  },

  /**
   * DELETE /subscribers/:id - Delete a subscriber by ID or email
   */
  async deleteSubscriber(idOrEmail: string): Promise<{ message: string; subscriber?: Subscriber }> {
    const response = await axiosInstance.delete<{ message: string; subscriber?: Subscriber }>(
      `/subscribers/${encodeURIComponent(idOrEmail)}`
    );
    return response.data;
  },
};
