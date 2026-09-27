import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

type Props = { winners?: any[] };

export function PreviousWinners({ winners }: Props) {
  if (!winners || winners.length === 0) return null;

  return (
    <View style={s.container}>
      <Text style={s.sectionTitle}>Previous Winners</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {winners.map((winner, i) => (
          <View key={i} style={s.winnerCard}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{winner.name ? winner.name[0] : '🏆'}</Text>
            </View>
            <Text style={s.winnerName}>{winner.name || `Winner ${i + 1}`}</Text>
            <Text style={s.winnerTitle}>{winner.title || 'Past Champion'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingVertical: 12, paddingLeft: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginBottom: 10 },
  scroll: { gap: 12, paddingRight: 16 },
  winnerCard: { width: 100, alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#EDF2F7' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E6FFFA', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  avatarText: { fontSize: 18, color: '#00B4A6', fontWeight: 'bold' },
  winnerName: { fontSize: 12, fontWeight: '600', color: '#2D3748', textAlign: 'center' },
  winnerTitle: { fontSize: 10, color: '#718096', textAlign: 'center', marginTop: 2 },
});
