import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export function LoadingState() {
  return (
    <View style={s.center}>
      <ActivityIndicator size="large" color="#00B4A6" />
      <Text style={s.text}>Loading competition...</Text>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F7FAFC' },
  text: { marginTop: 12, fontSize: 15, color: '#718096', fontWeight: '500' },
});
