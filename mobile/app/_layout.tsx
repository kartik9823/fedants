import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#00B4A6',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Feedants Competitions' }} />
      <Stack.Screen name="competition/[id]" options={{ title: 'Competition Details' }} />
    </Stack>
  );
}
