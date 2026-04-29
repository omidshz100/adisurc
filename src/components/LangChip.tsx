import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Translation } from '../types';
import { AZ, ff } from '../theme';

interface Props {
  t: Translation;
  onPress: () => void;
}

export function LangChip({ t, onPress }: Props) {
  return (
    <TouchableOpacity style={s.chip} onPress={onPress} activeOpacity={0.7}>
      <Text style={s.flag}>{t.flag}</Text>
      <Text style={[s.short, { fontFamily: ff(t.code, 'bold') }]}>{t.short}</Text>
      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
        <Path
          d="M6 9l6 6 6-6"
          stroke={AZ.navy}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 100,
    backgroundColor: AZ.surface,
    borderWidth: 1,
    borderColor: AZ.line,
  },
  flag: {
    fontSize: 13,
  },
  short: {
    fontSize: 12,
    color: AZ.navy,
  },
});
