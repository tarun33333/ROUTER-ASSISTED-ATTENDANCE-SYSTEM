import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { API_URL } from '@env';

function resolveHost() {
  const hostFromExpo =
    (Constants?.expoConfig?.hostUri && Constants.expoConfig.hostUri.split(':')[0]) ||
    (Constants?.manifest?.debuggerHost && Constants.manifest.debuggerHost.split(':')[0]) ||
    'localhost';

  if (Platform.OS === 'android') {
    if (hostFromExpo === 'localhost' || hostFromExpo === '127.0.0.1') {
      // Android emulator maps host loopback to 10.0.2.2
      return '10.0.2.2';
    }
  }
  return hostFromExpo;
}

export const BASE_URL = (API_URL && API_URL.trim()) ? API_URL.trim() : `http://${resolveHost()}:5001`;

// Theme Colors
export const COLORS = {
  primary: '#6366F1', // Indigo
  primaryDark: '#4F46E5',
  secondary: '#EC4899', // Pink
  accent: '#10B981', // Emerald
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gradient: {
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#EC4899', '#F59E0B'],
    success: ['#10B981', '#059669'],
  }
};

// Typography
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold', color: COLORS.text },
  h2: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  h3: { fontSize: 20, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 16, color: COLORS.text },
  caption: { fontSize: 14, color: COLORS.textSecondary },
  button: { fontSize: 16, fontWeight: '600' },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

