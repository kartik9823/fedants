import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Competition } from '../services/api';

type Props = { competition: Competition };

export function CompetitionInfo({ competition }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'judge' | 'rules'>('info');

  return (
    <View style={s.container}>
      {/* Stats row */}
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statLabel}>Prize Pool</Text>
          <Text style={s.statValue}>₹{competition.prizePool?.toLocaleString()}</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statLabel}>Entry Fee</Text>
          <Text style={s.statValue}>
            {competition.entryFee === 0 ? 'FREE' : `₹${competition.entryFee}`}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        <TouchableOpacity
          style={[s.tab, activeTab === 'info' && s.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[s.tabText, activeTab === 'info' && s.activeTabText]}>Prizes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tab, activeTab === 'judge' && s.activeTab]}
          onPress={() => setActiveTab('judge')}
        >
          <Text style={[s.tabText, activeTab === 'judge' && s.activeTabText]}>Judge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tab, activeTab === 'rules' && s.activeTab]}
          onPress={() => setActiveTab('rules')}
        >
          <Text style={[s.tabText, activeTab === 'rules' && s.activeTabText]}>Rules</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <View style={s.rewardsList}>
          {competition.rewards?.map((reward, index) => (
            <View key={index} style={s.rewardItem}>
              <Text style={s.rewardIcon}>{reward.icon || '🏆'}</Text>
              <View style={s.rewardDetails}>
                <Text style={s.rewardLabel}>{reward.label}</Text>
                <Text style={s.rewardSub}>Rank #{reward.position}</Text>
              </View>
              <Text style={s.rewardAmount}>₹{reward.amount}</Text>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'judge' && competition.judge && (
        <View style={s.judgeCard}>
          {competition.judge.photoUrl && (
            <Image source={{ uri: competition.judge.photoUrl }} style={s.judgePhoto} />
          )}
          <View style={s.judgeInfo}>
            <Text style={s.judgeName}>{competition.judge.name}</Text>
            <Text style={s.judgeTitle}>{competition.judge.title}</Text>
            <Text style={s.judgeExp}>{competition.judge.experience}</Text>
          </View>
        </View>
      )}

      {activeTab === 'rules' && (
        <View style={s.rulesBox}>
          <Text style={s.rulesTitle}>Eligibility & Rules</Text>
          <Text style={s.rulesText}>
            {competition.rulesAndEligibility || 'Standard competition guidelines apply.'}
          </Text>
          {competition.judgeParameters && (
            <>
              <Text style={[s.rulesTitle, { marginTop: 12 }]}>Judging Criteria</Text>
              <Text style={s.rulesText}>{competition.judgeParameters}</Text>
            </>
          )}
          {competition.refundPolicy && (
            <>
              <Text style={[s.rulesTitle, { marginTop: 12 }]}>Refund Policy</Text>
              <Text style={s.rulesText}>{competition.refundPolicy}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 16, marginVertical: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#F7FAFC', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  statLabel: { fontSize: 12, color: '#718096', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1A202C' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginBottom: 16 },
  tab: { paddingVertical: 10, paddingHorizontal: 16, marginRight: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#00B4A6' },
  tabText: { fontSize: 14, color: '#718096', fontWeight: '600' },
  activeTabText: { color: '#00B4A6', fontWeight: 'bold' },
  rewardsList: { gap: 10 },
  rewardItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EDF2F7' },
  rewardIcon: { fontSize: 24, marginRight: 12 },
  rewardDetails: { flex: 1 },
  rewardLabel: { fontSize: 15, fontWeight: '600', color: '#2D3748' },
  rewardSub: { fontSize: 12, color: '#A0AEC0' },
  rewardAmount: { fontSize: 16, fontWeight: 'bold', color: '#38A169' },
  judgeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EDF2F7', gap: 14 },
  judgePhoto: { width: 60, height: 60, borderRadius: 30 },
  judgeInfo: { flex: 1 },
  judgeName: { fontSize: 16, fontWeight: 'bold', color: '#2D3748' },
  judgeTitle: { fontSize: 13, color: '#00B4A6', marginVertical: 2 },
  judgeExp: { fontSize: 12, color: '#718096' },
  rulesBox: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EDF2F7' },
  rulesTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D3748', marginBottom: 4 },
  rulesText: { fontSize: 13, color: '#4A5568', lineHeight: 18 },
});
