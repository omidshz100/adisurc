import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Translation } from '../types';
import { AZ, ff } from '../theme';

interface StepProps {
  n: number;
  label: string;
  active?: boolean;
  done?: boolean;
  t: Translation;
}

function Step({ n, label, active, done, t }: StepProps) {
  const bg = active ? AZ.navy : done ? AZ.gold : 'transparent';
  const fg = active || done ? '#fff' : AZ.inkFaint;
  const hasBorder = !active && !done;

  return (
    <View style={s.stepRow}>
      <View
        style={[
          s.circle,
          {
            backgroundColor: bg,
            borderWidth: hasBorder ? 1.5 : 0,
            borderColor: hasBorder ? AZ.line : 'transparent',
          },
        ]}
      >
        {done ? (
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 13l4 4L19 7"
              stroke="#fff"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : (
          <Text style={[s.num, { color: fg }]}>{n}</Text>
        )}
      </View>
      <Text
        style={[
          s.label,
          {
            color: active ? AZ.navy : AZ.inkFaint,
            fontFamily: ff(t.code, active ? 'semiBold' : 'regular'),
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

interface StepBarProps {
  step: 1 | 2;
  t: Translation;
}

export function StepBar({ step, t }: StepBarProps) {
  const isRTL = t.dir === 'rtl';
  const connectorColor = step === 2 ? AZ.gold : AZ.line;

  return (
    <View style={[s.bar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <Step n={1} label={t.step1} active={step === 1} done={step === 2} t={t} />
      <View style={[s.line, { backgroundColor: connectorColor }]} />
      <Step n={2} label={t.step2} active={step === 2} t={t} />
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {
    fontSize: 12,
    fontFamily: ff('en', 'bold'),
  },
  label: {
    fontSize: 12,
  },
  line: {
    flex: 1,
    height: 1,
  },
});
