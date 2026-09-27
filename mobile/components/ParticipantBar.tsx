import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { current: number; max: number };

export function ParticipantBar({ current, max }: Props) {
  const pct = Math.min(current / (max || 1), 1);
  const remaining = Math.max(max - current, 0);
  const isCritical = remaining <= 5 && remaining > 0;

  return (
    <View style={s.container}>
      <View style={s.labelRow}>
        <Text style={[s.label, isCritical && s.urgent]}>
          {isCritical ? `Only ${remaining} spots left!` : `${current} / ${max} Booked`}
        </Text>
        <Text style={s.pctText}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={s.track}>
        <View
          style={[
            s.fill,
            {
              width: `${pct * 100}%`,
              backgroundColor: isCritical ? '#E53E3E' : '#00B4A6',
            },
          ]}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 16, marginVertical: 12 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 13, color: '#4A5568', fontWeight: '600' },
  pctText: { fontSize: 13, color: '#718096', fontWeight: '600' },
  urgent: { color: '#E53E3E', fontWeight: 'bold' },
  track: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
});
