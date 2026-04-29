import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Translation } from '../types';
import { AZ, ff } from '../theme';

type BtnKind = 'primary' | 'gold' | 'ghost' | 'danger';

interface AZBtnProps {
  label: string;
  kind?: BtnKind;
  t: Translation;
  onPress?: () => void;
  style?: ViewStyle;
}

const STYLES: Record<BtnKind, { bg: string; fg: string; border?: string }> = {
  primary: { bg: AZ.navy, fg: '#fff' },
  gold: { bg: AZ.gold, fg: AZ.navy },
  ghost: { bg: 'transparent', fg: AZ.navy, border: AZ.navy },
  danger: { bg: AZ.danger, fg: '#fff' },
};

export function AZBtn({ label, kind = 'primary', t, onPress, style }: AZBtnProps) {
  const { bg, fg, border } = STYLES[kind];
  return (
    <TouchableOpacity
      style={[
        s.btn,
        { backgroundColor: bg, borderColor: border ?? 'transparent', borderWidth: border ? 1.5 : 0 },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <Text style={[s.label, { color: fg, fontFamily: ff(t.code, 'bold') }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
