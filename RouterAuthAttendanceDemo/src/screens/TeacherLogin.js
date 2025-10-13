import React, { useState } from 'react';
import { View, Alert, ScrollView, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import InputField from '../components/InputField';
import ButtonPrimary from '../components/ButtonPrimary';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/config';

export default function TeacherLogin({ navigation }) {
  const { loginTeacher } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const ok = await loginTeacher(email, password);
      if (!ok) return;
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#E2E8F0']}
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
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: SPACING.lg,
              }}
            >
              <Text style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }}>👩‍🏫</Text>
            </View>
            <Text style={[TYPOGRAPHY.h1, { textAlign: 'center', marginBottom: SPACING.sm }]}>
              Teacher Login
            </Text>
            <Text style={[TYPOGRAPHY.caption, { textAlign: 'center' }]}>
              Welcome back! Please sign in to continue
            </Text>
          </View>

          {/* Form */}
          <View style={{ marginBottom: SPACING.xl }}>
            <InputField 
              label="Email Address" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
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
              style={{ marginBottom: SPACING.md }}
            />
            
            <ButtonPrimary 
              title="Student Login" 
              onPress={() => navigation.navigate('StudentLogin')}
              mode="outlined"
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

