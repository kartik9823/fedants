import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

type Props = {
  competitionState: string;
  userState: string;
  loading: boolean;
  onPress: () => void;
  onUnregister?: () => void;
  onUploadSubmission?: () => void;
};

const BUTTON_CONFIG: Record<string, { label: string; disabled: boolean; color: string }> = {
  LOADING: { label: 'Loading…', disabled: true, color: '#A0AEC0' },
  REGISTRATION_OPEN: { label: 'Register Now', disabled: false, color: '#00B4A6' },
  REGISTERED: { label: 'Upload Submission', disabled: false, color: '#38A169' },
  FULL: { label: 'Registration Full', disabled: true, color: '#718096' },
  REGISTRATION_CLOSED: { label: 'Registration Closed', disabled: true, color: '#718096' },
  COMPLETED: { label: 'Competition Completed', disabled: true, color: '#718096' },
  CANCELLED: { label: 'Competition Cancelled', disabled: true, color: '#E53E3E' },
};

export function RegisterButton({
  competitionState,
  userState,
  loading,
  onPress,
  onUnregister,
  onUploadSubmission,
}: Props) {
  if (userState === 'REGISTERED') {
    return (
      <View style={s.registeredRow}>
        <TouchableOpacity
          style={[s.btn, s.btnCancel]}
          onPress={onUnregister}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={s.labelCancel}>Cancel Registration</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.btn, s.btnSubmit, loading && s.disabled]}
          onPress={onUploadSubmission || onPress}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={s.label}>📤 Upload Submission</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  const key = competitionState;
  const config = BUTTON_CONFIG[key] ?? BUTTON_CONFIG.REGISTRATION_CLOSED;

  return (
    <TouchableOpacity
      style={[
        s.btnSingle,
        { backgroundColor: config.color },
        (config.disabled || loading) && s.disabled,
      ]}
      onPress={onPress}
      disabled={config.disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={s.label}>{config.label}</Text>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  registeredRow: { flexDirection: 'row', padding: 12, gap: 10 },
  btnSingle: { margin: 16, padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  btn: { padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FEB2B2', flex: 1 },
  labelCancel: { color: '#E53E3E', fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: '#38A169', flex: 1.4 },
  disabled: { opacity: 0.65 },
  label: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});
