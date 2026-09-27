import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = { message: string; onRetry: () => void };

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={s.center}>
      <Text style={s.title}>Unable to load competition</Text>
      <Text style={s.message}>{message}</Text>
      <TouchableOpacity style={s.btn} onPress={onRetry}>
        <Text style={s.btnText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F7FAFC' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#E53E3E', marginBottom: 8 },
  message: { fontSize: 14, color: '#718096', textAlign: 'center', marginBottom: 16 },
  btn: { backgroundColor: '#00B4A6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});
