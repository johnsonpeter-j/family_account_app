import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreensLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <Slot />
    </SafeAreaView>
  );
}

