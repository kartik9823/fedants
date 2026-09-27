import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Competition, UserState } from '../services/api';

type Props = {
  competition: Competition;
  userState: UserState;
};

export function CompetitionHeader({ competition, userState }: Props) {
  return (
    <View style={s.header}>
      <View style={s.badgeRow}>
        <View style={s.tag}>
          <Text style={s.tagText}>{competition.category || 'Dance'}</Text>
        </View>
        {competition.type && (
          <View style={[s.tag, s.typeTag]}>
            <Text style={s.typeTagText}>{competition.type}</Text>
          </View>
        )}
        {userState === 'REGISTERED' && (
          <View style={s.registeredBadge}>
            <Text style={s.registeredBadgeText}>✓ REGISTERED</Text>
          </View>
        )}
      </View>
      <Text style={s.title}>{competition.title}</Text>
      <Text style={s.description}>{competition.description}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  tag: { backgroundColor: '#E6FFFA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tagText: { color: '#00B4A6', fontWeight: 'bold', fontSize: 12 },
  typeTag: { backgroundColor: '#EBF8FF' },
  typeTagText: { color: '#3182CE', fontWeight: 'bold', fontSize: 12 },
  registeredBadge: { backgroundColor: '#C6F6D5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  registeredBadgeText: { color: '#22543D', fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A202C', marginVertical: 6 },
  description: { fontSize: 14, color: '#4A5568', lineHeight: 20 },
});
