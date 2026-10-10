/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111827',
    textSecondary: '#6B7280',
    background: '#FFFFFF',
    backgroundElement: '#F3F4F6',
    backgroundSelected: '#E5E7EB',
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    primary: '#000000',
    primaryText: '#FFFFFF',
    primaryMuted: '#F3F4F6',
    unread: '#000000',
    unreadBg: '#F3F4F6',
    replied: '#111827',
    repliedBg: '#E5E7EB',
    success: '#16A34A',
    successMuted: '#DCFCE7',
    warning: '#D97706',
    warningMuted: '#FEF3C7',
    danger: '#DC2626',
    dangerMuted: '#FEE2E2',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    background: '#1A1A1E',
    backgroundElement: '#26262B',
    backgroundSelected: '#33333A',
    card: '#222227',
    cardBorder: '#36363E',
    primary: '#FFFFFF',
    primaryText: '#000000',
    primaryMuted: '#26262B',
    unread: '#FFFFFF',
    unreadBg: '#26262B',
    replied: '#E5E7EB',
    repliedBg: '#26262B',
    success: '#22C55E',
    successMuted: '#143823',
    warning: '#FBBF24',
    warningMuted: '#382B14',
    danger: '#F87171',
    dangerMuted: '#3A1818',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
