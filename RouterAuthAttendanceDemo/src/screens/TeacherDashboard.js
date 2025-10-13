import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, StatusBar, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import ButtonPrimary from '../components/ButtonPrimary';
import Card from '../components/Card';
import api from '../services/api';
import { getCurrentSsidSafe } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/config';

export default function TeacherDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const teacher = user?.profile || { id: 1, name: 'Demo Teacher' };
  const [otp, setOtp] = useState(null);
  const [ssid, setSsid] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const generateOtp = async () => {
    try {
      setLoading(true);
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const currentSsid = await getCurrentSsidSafe();
      setOtp(newOtp);
      setSsid(currentSsid);

      const res = await api.post('/otpSessions', {
        teacherId: teacher.id,
        otp: newOtp,
        ssid: currentSsid,
        createdAt: new Date().toISOString(),
      });
      setSessionId(res.data.id);
      Alert.alert('OTP Generated', `OTP: ${newOtp}\nSSID: ${currentSsid}`);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    try {
      setLoading(true);
      if (sessionId) await api.delete(`/otpSessions/${sessionId}`);
      setSessionId(null);
      setOtp(null);
      setShowQR(false);
      Alert.alert('Session Ended');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const getQRData = () => {
    if (!otp || !ssid) return null;
    return JSON.stringify({ otp, ssid, teacherId: teacher.id });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={COLORS.gradient.primary}
        style={{
          paddingTop: 50,
          paddingBottom: SPACING.xl,
          paddingHorizontal: SPACING.lg,
        }}
      >
        <Text style={[TYPOGRAPHY.h2, { color: 'white', marginBottom: SPACING.sm }]}>
          Welcome back!
        </Text>
        <Text style={[TYPOGRAPHY.body, { color: 'white', opacity: 0.9 }]}>
          {teacher.name}
        </Text>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SPACING.lg }}>
        {/* OTP Card */}
        <Card style={{ marginBottom: SPACING.lg }}>
          <Text style={[TYPOGRAPHY.h3, { marginBottom: SPACING.md }]}>
            📱 Generate OTP Session
          </Text>
          
          {otp ? (
            <View style={{ marginBottom: SPACING.lg }}>
              <View
                style={{
                  backgroundColor: COLORS.primary + '10',
                  padding: SPACING.lg,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: SPACING.md,
                }}
              >
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, marginBottom: SPACING.xs }]}>
                  Generated OTP
                </Text>
                <Text style={[TYPOGRAPHY.h1, { color: COLORS.primary, fontFamily: 'monospace' }]}>
                  {otp}
                </Text>
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, marginTop: SPACING.sm }]}>
                  SSID: {ssid}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                <ButtonPrimary 
                  title="Show QR Code" 
                  onPress={() => setShowQR(true)}
                  gradient={COLORS.gradient.secondary}
                  style={{ flex: 1 }}
                />
                <ButtonPrimary 
                  title="End Session" 
                  mode="outlined" 
                  onPress={endSession} 
                  disabled={loading}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ) : (
            <ButtonPrimary 
              title="Generate 4-digit OTP" 
              onPress={generateOtp} 
              loading={loading}
            />
          )}
        </Card>

        {/* Quick Actions */}
        <Card style={{ marginBottom: SPACING.lg }}>
          <Text style={[TYPOGRAPHY.h3, { marginBottom: SPACING.md }]}>
            📊 Quick Actions
          </Text>
          
          <ButtonPrimary 
            title="View Attendance History" 
            onPress={() => navigation.navigate('AttendanceHistory')}
            gradient={COLORS.gradient.success}
            style={{ marginBottom: SPACING.sm }}
          />
          
          <ButtonPrimary 
            title="Sign Out" 
            mode="outlined" 
            onPress={logout}
          />
        </Card>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={showQR}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowQR(false)}
      >
        <View style={{ flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg }}>
          <View style={{ alignItems: 'center', marginTop: SPACING.xxl }}>
            <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.lg }]}>
              📱 QR Code
            </Text>
            <Text style={[TYPOGRAPHY.caption, { textAlign: 'center', marginBottom: SPACING.xl, color: COLORS.textSecondary }]}>
              Students can scan this QR code to mark attendance
            </Text>
            
            {getQRData() && (
              <View style={{ 
                backgroundColor: 'white', 
                padding: SPACING.lg, 
                borderRadius: 16,
                ...SHADOWS.large,
                marginBottom: SPACING.xl 
              }}>
                <QRCode
                  value={getQRData()}
                  size={200}
                  color={COLORS.text}
                  backgroundColor="white"
                />
              </View>
            )}
            
            <Text style={[TYPOGRAPHY.caption, { textAlign: 'center', color: COLORS.textSecondary, marginBottom: SPACING.lg }]}>
              OTP: {otp} | SSID: {ssid}
            </Text>
            
            <ButtonPrimary 
              title="Close" 
              onPress={() => setShowQR(false)}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}