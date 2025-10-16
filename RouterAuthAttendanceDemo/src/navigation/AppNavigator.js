import React, { useMemo, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Modal } from 'react-native';
import { Drawer as PaperDrawer, IconButton, Text } from 'react-native-paper';
import TeacherLogin from '../screens/TeacherLogin';
import TeacherDashboard from '../screens/TeacherDashboard';
import StudentLogin from '../screens/StudentLogin';
import StudentDashboard from '../screens/StudentDashboard';
import AttendanceHistory from '../screens/AttendanceHistory';
import TeacherGenerateOTP from '../screens/TeacherGenerateOTP';
import StudentMarkAttendance from '../screens/StudentMarkAttendance';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
function RoleMenu({ visible, onClose, role, onNavigate, onLogout }) {
  const items = useMemo(() => (
    role === 'teacher'
      ? [
          { key: 'TeacherDashboard', label: 'Dashboard' },
          { key: 'GenerateOTP', label: 'Generate OTP' },
          { key: 'ViewAttendance', label: 'View Attendance' },
          { key: 'Logout', label: 'Logout' },
        ]
      : [
          { key: 'StudentDashboard', label: 'Dashboard' },
          { key: 'TodaysAttendance', label: "Today’s Attendance" },
          { key: 'History', label: 'History' },
          { key: 'Logout', label: 'Logout' },
        ]
  ), [role]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'flex-start' }}>
        <View style={{ backgroundColor: 'white', width: '75%', height: '100%', paddingTop: 48 }}>
          <Text style={{ marginLeft: 16, marginBottom: 8, fontSize: 18, fontWeight: '600' }}>Menu</Text>
          <PaperDrawer.Section>
            {items.map((it) => (
              <PaperDrawer.Item
                key={it.key}
                label={it.label}
                onPress={() => {
                  onClose();
                  if (it.key === 'Logout') onLogout(); else onNavigate(it.key);
                }}
              />
            ))}
          </PaperDrawer.Section>
        </View>
      </View>
    </Modal>
  );
}

export default function AppNavigator() {
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigationRef = createNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      {!user ? (
        <Stack.Navigator initialRouteName="TeacherLogin">
          <Stack.Screen name="TeacherLogin" component={TeacherLogin} />
          <Stack.Screen name="StudentLogin" component={StudentLogin} />
        </Stack.Navigator>
      ) : (
        <>
          <RoleMenu
            visible={menuVisible}
            role={user.role}
            onClose={() => setMenuVisible(false)}
            onLogout={logout}
            onNavigate={(screen) => {
              // Map menu keys to concrete screens in stacks
              const map = {
                GenerateOTP: 'TeacherGenerateOTP',
                TodaysAttendance: 'StudentMarkAttendance',
                ViewAttendance: 'ViewAttendance',
                History: 'History',
                TeacherDashboard: 'TeacherDashboard',
                StudentDashboard: 'StudentDashboard',
              };
              const target = map[screen] || screen;
              if (navigationRef.isReady()) {
                navigationRef.navigate(target);
              }
            }}
          />

          {user.role === 'teacher' ? (
            <Stack.Navigator screenOptions={{
              headerRight: () => (
                <IconButton icon="menu" onPress={() => setMenuVisible(true)} />
              ),
            }}>
              <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} options={{ title: 'Dashboard' }} />
              <Stack.Screen name="ViewAttendance" component={AttendanceHistory} options={{ title: 'View Attendance' }} />
              <Stack.Screen name="TeacherGenerateOTP" component={TeacherGenerateOTP} options={{ title: 'Generate OTP' }} />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator screenOptions={{
              headerRight: () => (
                <IconButton icon="menu" onPress={() => setMenuVisible(true)} />
              ),
            }}>
              <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{ title: 'Dashboard' }} />
              <Stack.Screen name="History" component={AttendanceHistory} options={{ title: 'History' }} />
              <Stack.Screen name="StudentMarkAttendance" component={StudentMarkAttendance} options={{ title: 'Today’s Attendance' }} />
            </Stack.Navigator>
          )}
        </>
      )}
    </NavigationContainer>
  );
}

