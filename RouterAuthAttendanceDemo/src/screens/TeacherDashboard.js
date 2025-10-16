import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StatusBar, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import ButtonPrimary from '../components/ButtonPrimary';
import Card from '../components/Card';
import api from '../services/api';
import { getCurrentSsidSafe } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/config';

export default function TeacherDashboard({ navigation }) {
  const { user } = useAuth();
  const teacher = user?.profile || { id: 1, name: 'Demo Teacher' };
  const [schedule, setSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const todayIsoDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const loadSchedule = async () => {
    try {
      setLoadingSchedule(true);
      const res = await api.get('/schedules', { params: { teacherId: teacher.id, date: todayIsoDate } });
      setSchedule(Array.isArray(res.data) ? res.data : res.data?.value ?? []);
    } catch (e) {
      // ignore
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [teacher.id, todayIsoDate]);

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
        <Text style={[TYPOGRAPHY.h2, { color: 'white', marginBottom: SPACING.sm }]}>Welcome back!</Text>
        <Text style={[TYPOGRAPHY.body, { color: 'white', opacity: 0.9 }]}>{teacher.name}</Text>
      </LinearGradient>

      <View style={{ flex: 1, padding: SPACING.lg }}>
        {/* Summary Card */}
        <Card style={{ marginBottom: SPACING.lg }}>
          <Text style={[TYPOGRAPHY.h3, { marginBottom: SPACING.md }]}>🗓️ Today</Text>
          <View style={{ marginBottom: SPACING.sm }}>
            <Text style={[TYPOGRAPHY.body]}>{`Today: ${schedule.length} Classes Scheduled`}</Text>
          </View>
          <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
            {schedule[0] ? `Next: ${schedule[0].time.split('-')[0]} - ${schedule[0].subject} (${schedule[0].room})` : 'No upcoming classes'}
          </Text>
        </Card>

        {/* Schedule List */}
        <Card>
          <Text style={[TYPOGRAPHY.h3, { marginBottom: SPACING.md }]}>📚 Today’s Schedule</Text>
          <FlatList
            data={schedule}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={<Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>No schedule found for today</Text>}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                <Text style={[TYPOGRAPHY.body]}>{item.subject}</Text>
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>{item.time} • Room {item.room}</Text>
              </View>
            )}
          />
        </Card>
      </View>
    </View>
  );
}