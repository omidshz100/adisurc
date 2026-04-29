import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Translation } from '../types';
import { AZ, ff } from '../theme';

interface AZBarProps {
  title?: string;
  back?: boolean;
  onBack?: () => void;
  t: Translation;
  right?: React.ReactNode;
}

export function AZBar({ title, back, onBack, t, right }: AZBarProps) {
  const isRTL = t.dir === 'rtl';
  const font = ff(t.code, 'semiBold');

  const BackBtn = back ? (
    <TouchableOpacity onPress={onBack} style={s.iconBtn} activeOpacity={0.7}>
      <View style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 6l-6 6 6 6"
            stroke={AZ.navy}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  ) : (
    <View style={s.iconBtn} />
  );

  return (
    <View style={[s.bar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      {BackBtn}
      {title ? (
        <Text
          style={[s.title, { textAlign: isRTL ? 'right' : 'left', fontFamily: font }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {right ?? <View style={s.iconBtn} />}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    height: 56,
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: AZ.bg,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: AZ.navy,
    letterSpacing: 0.1,
    paddingHorizontal: 4,
  },
});
