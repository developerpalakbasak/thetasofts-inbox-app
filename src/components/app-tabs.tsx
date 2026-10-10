import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Contacts</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="mail" />}
          sf={{ default: 'envelope', selected: 'envelope.fill' }}
          md={{ default: 'mail_outline', selected: 'mail' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="subscribers">
        <NativeTabs.Trigger.Label>Subscribers</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="people" />}
          sf={{ default: 'person.2', selected: 'person.2.fill' }}
          md={{ default: 'people_outline', selected: 'people' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
