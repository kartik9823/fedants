import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCompetition } from '../../hooks/useCompetition';
import { useCountdown } from '../../hooks/useCountdown';
import { api } from '../../services/api';
import { CompetitionHeader } from '../../components/CompetitionHeader';
import { ParticipantBar } from '../../components/ParticipantBar';
import { CountdownTimer } from '../../components/CountdownTimer';
import { CompetitionInfo } from '../../components/CompetitionInfo';
import { PreviousWinners } from '../../components/PreviousWinners';
import { RegisterButton } from '../../components/RegisterButton';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';

export default function CompetitionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, status, error, refetch } = useCompetition(id || '');

  // Action states
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [submissionTitle, setSubmissionTitle] = useState('My Kathak Performance');
  const [submissionUrl, setSubmissionUrl] = useState('https://drive.google.com/file/d/sample-dance-video.mp4');

  const countdown = useCountdown(
    data?.competition?.registrationEnd ?? new Date()
  );

  const handleRegister = async () => {
    if (!id) return;
    setLoadingAction(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await api.register(id);
      await refetch();
      setActionSuccess('Successfully registered for the competition! 🎉');
    } catch (e: any) {
      setActionError(e.message || 'Registration failed');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUnregister = async () => {
    if (!id) return;
    setLoadingAction(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await api.unregister(id);
      await refetch();
      setActionSuccess('Registration cancelled successfully.');
    } catch (e: any) {
      setActionError(e.message || 'Failed to cancel registration');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSubmitEntry = async () => {
    if (!id) return;
    setLoadingAction(true);
    setActionError(null);
    try {
      await api.submit(id, {
        submissionName: submissionTitle || 'Dance Performance Video',
        submissionUrl: submissionUrl || 'sample_video.mp4',
      });
      await refetch();
      setModalVisible(false);
      setActionSuccess('🌟 Submission uploaded successfully! Your entry is under review.');
    } catch (e: any) {
      setActionError(e.message || 'Submission failed');
    } finally {
      setLoadingAction(false);
    }
  };

  if (status === 'loading') return <LoadingState />;
  if (status === 'error' || !data) return <ErrorState message={error || 'Error'} onRetry={refetch} />;

  const { competition: comp, userState, submission } = data;
  const cs = comp.computedState || 'REGISTRATION_OPEN';

  return (
    <View style={s.wrapper}>
      <ScrollView style={s.screen} contentContainerStyle={s.content}>
        <CompetitionHeader competition={comp} userState={userState} />
        <ParticipantBar current={comp.currentParticipants} max={comp.maxParticipants} />

        {/* Action success message banner */}
        {actionSuccess && (
          <View style={s.successBanner}>
            <Text style={s.successText}>{actionSuccess}</Text>
          </View>
        )}

        {/* Blistering Success Banner when Submission Exists */}
        {submission && submission.submittedAt && (
          <View style={s.submissionCard}>
            <View style={s.submissionCardHeader}>
              <Text style={s.submissionBadge}>✨ SUBMISSION RECEIVED</Text>
              <Text style={s.submissionDate}>
                {new Date(submission.submittedAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={s.submissionTitle}>{submission.submissionName}</Text>
            <Text style={s.submissionUrl} numberOfLines={1}>
              🔗 {submission.submissionUrl}
            </Text>
            <TouchableOpacity style={s.editBtn} onPress={() => setModalVisible(true)}>
              <Text style={s.editBtnText}>✏️ Re-upload or Edit Submission</Text>
            </TouchableOpacity>
          </View>
        )}

        {cs === 'REGISTRATION_OPEN' && (
          <CountdownTimer label="Registration closes in" timeLeft={countdown} />
        )}

        <CompetitionInfo competition={comp} />
        <PreviousWinners winners={comp.winners} />

        {actionError && (
          <View style={s.errContainer}>
            <Text style={s.regErr}>{actionError}</Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Button / Dual Buttons */}
      <View style={s.stickyFooter}>
        <RegisterButton
          competitionState={cs}
          userState={userState}
          loading={loadingAction}
          onPress={handleRegister}
          onUnregister={handleUnregister}
          onUploadSubmission={() => setModalVisible(true)}
        />
      </View>

      {/* Submission Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>Upload Competition Entry</Text>
            <Text style={s.modalSub}>
              Select or paste the link to your performance video/document.
            </Text>

            <Text style={s.inputLabel}>Title / Performance Name</Text>
            <TextInput
              style={s.input}
              value={submissionTitle}
              onChangeText={setSubmissionTitle}
              placeholder="e.g. Classical Kathak Solo"
            />

            <Text style={s.inputLabel}>Video URL / Drive Link</Text>
            <TextInput
              style={s.input}
              value={submissionUrl}
              onChangeText={setSubmissionUrl}
              placeholder="https://..."
            />

            <View style={s.quickSelectBox}>
              <Text style={s.quickLabel}>Or select sample file:</Text>
              <TouchableOpacity
                style={s.sampleChip}
                onPress={() => {
                  setSubmissionTitle('Classical Dance Video Entry.mp4');
                  setSubmissionUrl('https://storage.feedants.com/demo/dance_entry.mp4');
                }}
              >
                <Text style={s.sampleChipText}>📁 dance_entry.mp4 (Sample)</Text>
              </TouchableOpacity>
            </View>

            <View style={s.modalActions}>
              <TouchableOpacity
                style={s.modalCancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={loadingAction}
              >
                <Text style={s.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.modalSubmitBtn}
                onPress={handleSubmitEntry}
                disabled={loadingAction}
              >
                {loadingAction ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={s.modalSubmitText}>Submit Entry</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F7FAFC' },
  screen: { flex: 1 },
  content: { paddingBottom: 24 },
  errContainer: { paddingHorizontal: 16, marginVertical: 8 },
  regErr: { color: '#E53E3E', fontSize: 13, textAlign: 'center', fontWeight: '600' },
  stickyFooter: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EDF2F7' },

  successBanner: {
    backgroundColor: '#DEF7EC',
    borderColor: '#31C48D',
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
  },
  successText: { color: '#03543F', fontWeight: 'bold', textAlign: 'center', fontSize: 14 },

  submissionCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    borderWidth: 1.5,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    borderRadius: 14,
  },
  submissionCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  submissionBadge: { color: '#166534', fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5 },
  submissionDate: { color: '#15803D', fontSize: 12 },
  submissionTitle: { fontSize: 17, fontWeight: 'bold', color: '#14532D', marginBottom: 4 },
  submissionUrl: { fontSize: 13, color: '#166534', marginBottom: 12 },
  editBtn: { backgroundColor: '#DCFCE7', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  editBtnText: { color: '#15803D', fontWeight: 'bold', fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { width: '100%', backgroundColor: 'white', borderRadius: 16, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A202C', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#718096', marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#4A5568', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 12 },
  quickSelectBox: { marginBottom: 16 },
  quickLabel: { fontSize: 12, color: '#718096', marginBottom: 6 },
  sampleChip: { backgroundColor: '#EDF2F7', padding: 8, borderRadius: 6, alignSelf: 'flex-start' },
  sampleChipText: { fontSize: 12, color: '#2D3748', fontWeight: '600' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  modalCancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  modalCancelText: { color: '#718096', fontWeight: 'bold' },
  modalSubmitBtn: { backgroundColor: '#00B4A6', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalSubmitText: { color: 'white', fontWeight: 'bold' },
});
