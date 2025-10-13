import React, { createContext, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { loginTeacher as apiLoginTeacher, loginStudent as apiLoginStudent } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { role: 'teacher'|'student', profile: {...} }

  const loginTeacher = async (email, password) => {
    const profile = await apiLoginTeacher(email, password);
    if (!profile) {
      Alert.alert('Login Failed', 'Invalid teacher credentials');
      return false;
    }
    setUser({ role: 'teacher', profile });
    return true;
  };

  const loginStudent = async (rollNo, password) => {
    const profile = await apiLoginStudent(rollNo, password);
    if (!profile) {
      Alert.alert('Login Failed', 'Invalid student credentials');
      return false;
    }
    setUser({ role: 'student', profile });
    return true;
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, loginTeacher, loginStudent, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

