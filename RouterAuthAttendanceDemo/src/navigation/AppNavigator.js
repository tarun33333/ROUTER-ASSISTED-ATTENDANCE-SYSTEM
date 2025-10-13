import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherLogin from '../screens/TeacherLogin';
import TeacherDashboard from '../screens/TeacherDashboard';
import StudentLogin from '../screens/StudentLogin';
import StudentDashboard from '../screens/StudentDashboard';
import AttendanceHistory from '../screens/AttendanceHistory';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator initialRouteName="TeacherLogin">
          <Stack.Screen name="TeacherLogin" component={TeacherLogin} />
          <Stack.Screen name="StudentLogin" component={StudentLogin} />
        </Stack.Navigator>
      ) : user.role === 'teacher' ? (
        <Stack.Navigator>
          <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
          <Stack.Screen name="AttendanceHistory" component={AttendanceHistory} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

