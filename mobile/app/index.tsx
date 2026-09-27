import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CONFIG } from '../constants/config';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <Text style={s.title}>Feedants</Text>
      <Text style={s.subtitle}>Explore & Compete in Live Events</Text>
      <TouchableOpacity
        style={s.btn}
        onPress={() => router.push(`/competition/${CONFIG.COMPETITION_ID}`)}
        activeOpacity={0.8}
      >
        <Text style={s.btnText}>View Competition</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFC', padding: 24 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#00B4A6', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#718096', marginBottom: 32, textAlign: 'center' },
  btn: { backgroundColor: '#00B4A6', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
