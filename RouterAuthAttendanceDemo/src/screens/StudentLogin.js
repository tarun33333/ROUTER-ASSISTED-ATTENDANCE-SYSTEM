import React, { useState } from 'react';
import { View, Alert, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import InputField from '../components/InputField';
import ButtonPrimary from '../components/ButtonPrimary';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/config';

export default function StudentLogin({ navigation }) {
  const { loginStudent } = useAuth();
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const ok = await loginStudent(rollNo, password);
      if (!ok) return;
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={{ padding: SPACING.xl }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: SPACING.xxl }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: COLORS.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: SPACING.lg,
              }}
            >
              <Text style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }}>🎓</Text>
            </View>
            <Text style={[TYPOGRAPHY.h1, { textAlign: 'center', marginBottom: SPACING.sm }]}>
              Student Login
            </Text>
            <Text style={[TYPOGRAPHY.caption, { textAlign: 'center' }]}>
              Enter your credentials to mark attendance
            </Text>
          </View>

          {/* Form */}
          <View style={{ marginBottom: SPACING.xl }}>
            <InputField 
              label="Roll Number" 
              value={rollNo} 
              onChangeText={setRollNo}
              style={{ marginBottom: SPACING.md }}
            />
            <InputField 
              label="Password" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry
              style={{ marginBottom: SPACING.lg }}
            />
            
            <ButtonPrimary 
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading}
              gradient={COLORS.gradient.secondary}
              style={{ marginBottom: SPACING.md }}
            />
            
            <ButtonPrimary 
              title="Teacher Login" 
              onPress={() => navigation.navigate('TeacherLogin')}
              mode="outlined"
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

