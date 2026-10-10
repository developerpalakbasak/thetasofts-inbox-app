import { Alert, Linking, Platform } from 'react-native';

export function makePhoneCall(phoneNumber?: string) {
  if (!phoneNumber) {
    Alert.alert('Phone Number Missing', 'No phone number is available for this contact.');
    return;
  }
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  const url = `tel:${cleanNumber}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported || Platform.OS === 'android') {
        return Linking.openURL(url);
      } else {
        Alert.alert('Cannot Make Call', `Calling is not supported on this device. Number: ${phoneNumber}`);
      }
    })
    .catch((err) => {
      console.warn('Error making phone call:', err);
      Alert.alert('Error', 'Unable to initiate phone call.');
    });
}

export function sendSms(phoneNumber?: string, body?: string) {
  if (!phoneNumber) {
    Alert.alert('Phone Number Missing', 'No phone number is available for this contact.');
    return;
  }
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  const separator = Platform.OS === 'ios' ? '&' : '?';
  const url = body
    ? `sms:${cleanNumber}${separator}body=${encodeURIComponent(body)}`
    : `sms:${cleanNumber}`;

  Linking.openURL(url).catch((err) => {
    console.warn('Error opening SMS:', err);
    Alert.alert('Error', 'Unable to open messaging app.');
  });
}

export function sendEmail(email: string, subject?: string, body?: string) {
  if (!email) {
    Alert.alert('Email Missing', 'No email address available.');
    return;
  }
  const queryParams: string[] = [];
  if (subject) queryParams.push(`subject=${encodeURIComponent(subject)}`);
  if (body) queryParams.push(`body=${encodeURIComponent(body)}`);

  const query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  const url = `mailto:${email}${query}`;

  Linking.openURL(url).catch((err) => {
    console.warn('Error opening Email:', err);
    Alert.alert('Error', 'Unable to open email client.');
  });
}

export function openWhatsApp(phoneNumber?: string, message?: string) {
  if (!phoneNumber) {
    Alert.alert('Phone Number Missing', 'No phone number available.');
    return;
  }
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const url = `whatsapp://send?phone=${cleanNumber}${message ? `&text=${encodeURIComponent(message)}` : ''}`;
  const webUrl = `https://wa.me/${cleanNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        return Linking.openURL(webUrl);
      }
    })
    .catch((err) => {
      console.warn('Error opening WhatsApp:', err);
      Alert.alert('Error', 'Unable to open WhatsApp.');
    });
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return dateString;
  }
}

export function formatFullDateTime(dateString?: string): string {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}
