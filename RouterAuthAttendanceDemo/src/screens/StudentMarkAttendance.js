import React, { useState } from 'react';
import { View, Text, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import InputField from '../components/InputField';
import ButtonPrimary from '../components/ButtonPrimary';
import Card from '../components/Card';
import SafeQRScanner from '../components/SafeQRScanner';
import api from '../services/api';
import { getCurrentSsidSafe } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/config';

export default function StudentMarkAttendance() {
  const { user } = useAuth();
  const student = user?.profile || { id: 1, name: 'Demo Student' };
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const markAttendance = async (otpToUse = otpInput) => {
    try {
      setLoading(true);
      const sessionsRes = await api.get('/otpSessions');
      const latestSession = Array.isArray(sessionsRes.data)
        ? sessionsRes.data[sessionsRes.data.length - 1]
        : sessionsRes.data?.value?.[sessionsRes.data.value.length - 1];
      const currentSsid = await getCurrentSsidSafe();

      if (!latestSession) return Alert.alert('No active OTP session');
      if (latestSession.otp !== otpToUse) return Alert.alert('Wrong OTP');
      if (latestSession.ssid !== currentSsid)
        return Alert.alert('Wrong WiFi', `Connect to ${latestSession.ssid}`);

      await api.post('/attendance', {
        studentId: student.id,
        ssid: currentSsid,
        date: new Date().toISOString(),
        status: 'Present',
      });

      Alert.alert('Attendance Marked ✅');
      setOtpInput('');
      setShowScanner(false);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (otp) => {
    markAttendance(otp);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      <LinearGradient
        colors={COLORS.gradient.secondary}
        style={{ paddingTop: 50, paddingBottom: SPACING.xl, paddingHorizontal: SPACING.lg }}
      >
        <Text style={[TYPOGRAPHY.h2, { color: 'white', marginBottom: SPACING.sm }]}>Mark Attendance</Text>
        <Text style={[TYPOGRAPHY.body, { color: 'white', opacity: 0.9 }]}>
          {student.name} • {student.rollNo}
        </Text>
      </LinearGradient>

      <View style={{ padding: SPACING.lg }}>
        <Card>
          <Text style={[TYPOGRAPHY.h3, { marginBottom: SPACING.md }]}>📝 Mark Attendance</Text>
          <Text style={[TYPOGRAPHY.caption, { marginBottom: SPACING.md, color: COLORS.textSecondary }]}>Enter the 4-digit OTP provided by your teacher</Text>
          <InputField label="Enter OTP" value={otpInput} onChangeText={setOtpInput} keyboardType="numeric" style={{ marginBottom: SPACING.lg }} />
          <ButtonPrimary title="Mark Attendance" onPress={markAttendance} loading={loading} gradient={COLORS.gradient.success} style={{ marginBottom: SPACING.sm }} />
          <ButtonPrimary title="📱 Scan QR Code Instead" onPress={() => setShowScanner(true)} mode="outlined" />
        </Card>
      </View>

      <SafeQRScanner visible={showScanner} onClose={() => setShowScanner(false)} onScan={handleQRScan} />
    </View>
  );
}


