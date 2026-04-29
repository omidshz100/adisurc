import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { AZ, ff } from '../theme';
import { AZBar } from '../components/AZBar';
import { AZBtn } from '../components/AZBtn';
import { StepBar } from '../components/StepBar';
import { formatTime, formatShortDate, getDateKey, generateId } from '../utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Confirm'>;
type RouteT = RouteProp<RootStackParamList, 'Confirm'>;

export function ConfirmScreen() {
  const { t, isRTL, user, addTrip } = useApp();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { mode, gate } = route.params;

  const isExit = mode === 'exit';
  const now = useMemo(() => Date.now(), []);
  const timeStr = formatTime(now);
  const dateStr = formatShortDate(now);

  const displayName = user?.fullName ?? t.fullName;
  const displayRoom = user ? `Room ${user.roomNumber}` : t.room;

  const row = isRTL ? ('row-reverse' as const) : ('row' as const);
  const ta = isRTL ? ('right' as const) : ('left' as const);

  const handleConfirm = async () => {
    await addTrip({
      id: generateId(),
      type: isExit ? 'out' : 'in',
      gate,
      timestamp: now,
    });
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={s.safe}>
      <AZBar
        title={isExit ? t.exit : t.return}
        back
        onBack={() => navigation.goBack()}
        t={t}
      />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <StepBar step={2} t={t} />

        {/* Icon */}
        <View style={[s.iconWrap, { backgroundColor: isExit ? AZ.navySoft : AZ.goldSoft }]}>
          <View style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}>
            {isExit ? (
              <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
                <Path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" stroke={AZ.navy} strokeWidth={2} strokeLinecap="round" />
                <Path d="M10 12h10m0 0l-3-3m3 3l-3 3" stroke={AZ.gold} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            ) : (
              <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
                <Path d="M10 20H6a2 2 0 01-2-2V6a2 2 0 012-2h4" stroke={AZ.navy} strokeWidth={2} strokeLinecap="round" />
                <Path d="M20 12H10m0 0l3-3m-3 3l3 3" stroke={AZ.gold} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            )}
          </View>
        </View>

        <Text style={[s.title, { fontFamily: ff(t.code, 'bold') }]}>
          {isExit ? t.confirmExit : t.confirmReturn}
        </Text>
        <Text style={[s.subtitle, { fontFamily: ff(t.code, 'regular') }]}>
          {t.tapBelow(isExit ? t.dep : t.arr)}
        </Text>

        {/* Details card */}
        <View style={s.card}>
          <DetailRow
            label={t.resident}
            value={`${displayName} · ${displayRoom}`}
            row={row}
            t={t}
          />
          <View style={s.divider} />
          <DetailRow label={t.gate} value={gate} row={row} t={t} />
          <View style={s.divider} />
          <DetailRow
            label={isExit ? t.exitTime : t.returnTime}
            value={`${timeStr} · ${dateStr}`}
            row={row}
            t={t}
            bold
          />
        </View>

        <View style={s.spacer} />

        {/* Action buttons */}
        <AZBtn
          label={isExit ? t.confirmExitBtn : t.confirmReturnBtn}
          kind={isExit ? 'primary' : 'gold'}
          t={t}
          onPress={handleConfirm}
          style={s.fullWidth}
        />
        <View style={{ height: 10 }} />
        <AZBtn
          label={t.cancel}
          kind="ghost"
          t={t}
          onPress={() => navigation.goBack()}
          style={s.fullWidth}
        />
        <View style={{ height: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  row: 'row' | 'row-reverse';
  t: ReturnType<typeof useApp>['t'];
  bold?: boolean;
}

function DetailRow({ label, value, row, t, bold }: DetailRowProps) {
  return (
    <View style={[s.detailRow, { flexDirection: row }]}>
      <Text style={[s.detailLabel, { fontFamily: ff(t.code, 'regular') }]}>{label}</Text>
      <Text
        style={[
          s.detailValue,
          {
            fontFamily: ff(t.code, bold ? 'bold' : 'semiBold'),
            fontSize: bold ? 15 : 14,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AZ.bg },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 24,
    flexGrow: 1,
  },
  iconWrap: {
    width: 92,
    height: 92,
    borderRadius: 28,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: AZ.navy,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: AZ.inkSoft,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  card: {
    marginTop: 20,
    backgroundColor: AZ.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AZ.line,
    overflow: 'hidden',
  },
  detailRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: AZ.inkSoft,
    flex: 1,
  },
  detailValue: {
    color: AZ.navy,
  },
  divider: {
    height: 1,
    backgroundColor: AZ.line,
    marginHorizontal: 16,
  },
  spacer: { flex: 1, minHeight: 24 },
  fullWidth: { width: '100%' },
});
