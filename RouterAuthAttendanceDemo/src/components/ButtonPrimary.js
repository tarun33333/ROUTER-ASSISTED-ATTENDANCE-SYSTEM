import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../constants/config';

export default function ButtonPrimary({ 
  title, 
  onPress, 
  mode = 'contained', 
  disabled, 
  loading,
  gradient = COLORS.gradient.primary,
  style 
}) {
  const isOutlined = mode === 'outlined';
  
  if (isOutlined) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          {
            marginVertical: SPACING.sm,
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.lg,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: COLORS.primary,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <Text style={[TYPOGRAPHY.button, { color: COLORS.primary }]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          marginVertical: SPACING.sm,
          borderRadius: 12,
          ...SHADOWS.medium,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={[TYPOGRAPHY.button, { color: 'white' }]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

