import React from 'react';
import { TextInput } from 'react-native-paper';
import { COLORS, SPACING, SHADOWS } from '../constants/config';

export default function InputField({ label, value, onChangeText, secureTextEntry, keyboardType, style }) {
  return (
    <TextInput
      mode="outlined"
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={[
        {
          marginVertical: SPACING.sm,
          backgroundColor: COLORS.surface,
          ...SHADOWS.small,
        },
        style,
      ]}
      outlineColor={COLORS.border}
      activeOutlineColor={COLORS.primary}
      textColor={COLORS.text}
      labelStyle={{ color: COLORS.textSecondary }}
    />
  );
}

