import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import InputField from '../components/InputField';
import ButtonPrimary from '../components/ButtonPrimary';
import Card from '../components/Card';
import SafeQRScanner from '../components/SafeQRScanner';
import api from '../services/api';
import { getCurrentSsidSafe } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/config';

export default function StudentDashboard() {
  const { user } = useAuth();
  const student = user?.profile || { id: 1, name: 'Demo Student' };
  const [schedule, setSchedule] = useState([]);
  const [markedMessage, setMarkedMessage] = useState('');

  const todayIsoDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const loadSchedule = async () => {
    try {
      const res = await api.get('/schedules', { params: { studentId: student.id, date: todayIsoDate } });
      setSchedule(Array.isArray(res.data) ? res.data : res.data?.value ?? []);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [student.id, todayIsoDate]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      {/* Header */}
      <LinearGradient
        colors={COLORS.gradient.secondary}
        style={{
          paddingTop: 50,
          paddingBottom: SPACING.xl,
          paddingHorizontal: SPACING.lg,
        }}
      >
        <Text style={[TYPOGRAPHY.h2, { color: 'white', marginBottom: SPACING.sm }]}>Hello there!</Text>
        <Text style={[TYPOGRAPHY.body, { color: 'white', opacity: 0.9 }]}>
          {student.name} • {student.rollNo}
        </Text>
      </LinearGradient>

      <View style={{ flex: 1, padding: SPACING.lg }}>
        <Card>
          <Text style={[TYPOGRAPHY.h3, { marginBottom: SPACING.md }]}>🗓️ Today’s Schedule</Text>
          {schedule[0] ? (
            <View>
              <Text style={[TYPOGRAPHY.body]}>{schedule[0].subject}</Text>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>{schedule[0].time} • Room {schedule[0].room}</Text>
            </View>
          ) : (
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>No classes scheduled today</Text>
          )}
          {markedMessage ? (
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.success, marginTop: SPACING.sm }]}>{markedMessage}</Text>
          ) : null}
        </Card>
      </View>
    </View>
  );
}