import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StatusBar, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import api from '../services/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/config';

export default function AttendanceHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance', { params: { _sort: 'date', _order: 'desc', _limit: 50 } });
      setItems(Array.isArray(res.data) ? res.data : res.data?.value ?? []);
    } catch (e) {
      console.error('Failed to load attendance:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return COLORS.success;
      case 'absent': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={COLORS.gradient.primary}
        style={{
          paddingTop: 50,
          paddingBottom: SPACING.lg,
          paddingHorizontal: SPACING.lg,
        }}
      >
        <Text style={[TYPOGRAPHY.h2, { color: 'white', marginBottom: SPACING.sm }]}>
          📊 Attendance History
        </Text>
        <Text style={[TYPOGRAPHY.caption, { color: 'white', opacity: 0.9 }]}>
          {items.length} records found
        </Text>
      </LinearGradient>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: SPACING.lg }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadData} />
        }
        renderItem={({ item }) => (
          <Card style={{ marginBottom: SPACING.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={[TYPOGRAPHY.h3, { marginBottom: SPACING.xs }]}>
                  Student #{item.studentId}
                </Text>
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, marginBottom: SPACING.xs }]}>
                  📅 {formatDate(item.date)}
                </Text>
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, marginBottom: SPACING.sm }]}>
                  📶 {item.ssid}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: getStatusColor(item.status) + '20',
                  paddingHorizontal: SPACING.sm,
                  paddingVertical: SPACING.xs,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: getStatusColor(item.status) + '40',
                }}
              >
                <Text style={[TYPOGRAPHY.caption, { color: getStatusColor(item.status), fontWeight: '600' }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <Card>
            <Text style={[TYPOGRAPHY.body, { textAlign: 'center', color: COLORS.textSecondary }]}>
              No attendance records found
            </Text>
          </Card>
        }
      />
    </View>
  );
}

