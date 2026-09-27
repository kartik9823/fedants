import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { label: string; timeLeft: string };

export function CountdownTimer({ label, timeLeft }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.timer}>{timeLeft || '00d : 00h : 00m : 00s'}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#F0FDFA', marginHorizontal: 16, marginVertical: 8, padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#CCFBF1' },
  label: { fontSize: 12, color: '#0D9488', textTransform: 'uppercase', fontWeight: '700', marginBottom: 4 },
  timer: { fontSize: 18, fontWeight: 'bold', color: '#0F766E' },
});
