import axios, { AxiosInstance } from 'axios';
import { Contact, Subscriber } from '@/types';

/**
 * Configure your authentication token and server base URL here.
 * The placeholder <AUTH_TOKEN> can be replaced with your actual token.
 *
 * NOTE for Mobile testing:
 * - If running on a physical Android or iOS device via Expo Go, 'localhost' will point
 *   to your mobile device, NOT your development PC.
 * - Replace 'http://localhost:4000' with your PC's local Wi-Fi IP (e.g. 'http://192.168.1.50:4000')
 *   or an ngrok/cloud URL when testing on a real phone.
 * - For Android Emulator, use 'http://10.0.2.2:4000'.
 */
export const AUTH_TOKEN = 'e95a5dc562902ba747f11c0f90b02c19';
export const API_BASE_URL = 'https://thetasofts-inbox.hutchinsonapac.com';

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

// Demo fallback data matching the API schema in ApiDoc.md
export const DEMO_CONTACTS: Contact[] = [
  {
    _id: '67066914a1c6a2b34e8f1122',
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1234567890',
    plan: 'Enterprise',
    projectType: 'Web Development',
    message: 'Looking forward to working together on a modern redesign of our SaaS portal.',
    isRead: false,
    isReplyed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    _id: '67066914a1c6a2b34e8f1123',
    fullName: 'John Smith',
    email: 'john.smith@techcorp.io',
    phone: '+1987654321',
    plan: 'Startup',
    projectType: 'Mobile App',
    message: 'Need a consultation for React Native mobile application development and backend integration.',
    isRead: true,
    isReplyed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: '67066914a1c6a2b34e8f1124',
    fullName: 'Sarah Connor',
    email: 'sarah.connor@skyreach.com',
    phone: '+14155552671',
    plan: 'Custom',
    projectType: 'Cloud Architecture & DevOps',
    message: 'We require high availability AWS infrastructure setup and automated CI/CD pipeline.',
    isRead: true,
    isReplyed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    _id: '67066914a1c6a2b34e8f1125',
    fullName: 'Michael Vance',
    email: 'mvance@innovate.co',
    phone: '+13125559812',
    plan: 'Professional',
    projectType: 'UI/UX Design',
    message: 'Requesting portfolio samples and quote for full brand identity and design system.',
    isRead: false,
    isReplyed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export const DEMO_SUBSCRIBERS: Subscriber[] = [
  {
    _id: '670671a9a1c6a2b34e8f3344',
    email: 'subscriber@example.com',
    subscribedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    _id: '670671a9a1c6a2b34e8f3345',
    email: 'david.chen@ventures.io',
    subscribedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    _id: '670671a9a1c6a2b34e8f3346',
    email: 'elena.rostova@designhub.net',
    subscribedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    _id: '670671a9a1c6a2b34e8f3347',
    email: 'inactive_user@olddomain.org',
    subscribedAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
    isActive: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
];

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
