import React from 'react';
import { View } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/config';

export default function Card({ children, style, padding = SPACING.lg }) {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding,
          ...SHADOWS.medium,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
