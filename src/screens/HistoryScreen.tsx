import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { HistoryFilter, RootStackParamList, TripRecord, TripType } from '../types';
import { useApp } from '../context/AppContext';
import { AZ, ff } from '../theme';
import { AZBar } from '../components/AZBar';
import { formatTime, formatGroupLabel, getDateKey } from '../utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList, 'History'>;

const SAMPLE_TRIPS: TripRecord[] = [
  { id: 's1', type: 'in', gate: 'Main Gate', timestamp: Date.now() - 6 * 3600000 },
  { id: 's2', type: 'out', gate: 'Main Gate', timestamp: Date.now() - 30 * 3600000 },
  { id: 's3', type: 'in', gate: 'Main Gate', timestamp: Date.now() - 33 * 3600000 },
  { id: 's4', type: 'out', gate: 'Main Gate', timestamp: Date.now() - 37 * 3600000 },
  { id: 's5', type: 'in', gate: 'Main Gate', timestamp: Date.now() - 53 * 3600000 },
  { id: 's6', type: 'out', gate: 'Main Gate', timestamp: Date.now() - 60 * 3600000 },
  { id: 's7', type: 'in', gate: 'Main Gate', timestamp: Date.now() - 75 * 3600000 },
  { id: 's8', type: 'out', gate: 'Main Gate', timestamp: Date.now() - 87 * 3600000 },
  { id: 's9', type: 'in', gate: 'Main Gate', timestamp: Date.now() - 99 * 3600000 },
];

interface Group {
  dateKey: string;
  label: string;
  items: TripRecord[];
}

function groupTrips(trips: TripRecord[]): Group[] {
  const map = new Map<string, TripRecord[]>();
  for (const trip of trips) {
    const key = getDateKey(trip.timestamp);
    const arr = map.get(key) ?? [];
    arr.push(trip);
    map.set(key, arr);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, items]) => ({
      dateKey,
      label: formatGroupLabel(dateKey),
      items: items.sort((a, b) => b.timestamp - a.timestamp),
    }));
}

export function HistoryScreen() {
  const { t, isRTL, trips } = useApp();
  const navigation = useNavigation<Nav>();
  const [filter, setFilter] = useState<HistoryFilter>('all');

  const allTrips = trips.length > 0 ? trips : SAMPLE_TRIPS;

  const filtered = useMemo(() => {
    if (filter === 'exits') return allTrips.filter((x) => x.type === 'out');
    if (filter === 'returns') return allTrips.filter((x) => x.type === 'in');
    return allTrips;
  }, [allTrips, filter]);

  const groups = useMemo(() => groupTrips(filtered), [filtered]);

  const exitCount = allTrips.filter((x) => x.type === 'out').length;
  const avgReturn = t.avgTime;
  const row = isRTL ? ('row-reverse' as const) : ('row' as const);
  const ta = isRTL ? ('right' as const) : ('left' as const);

  return (
    <SafeAreaView style={s.safe}>
      <AZBar title={t.myHistory} back onBack={() => navigation.goBack()} t={t} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats chips */}
        <View style={[s.statsRow, { flexDirection: row }]}>
          <StatChip topLabel={t.week} value={`${exitCount} ${t.exits.toLowerCase()}`} t={t} />
          <StatChip topLabel={t.avgReturn} value={avgReturn} t={t} />
        </View>

        {/* Filter pills */}
        <View style={[s.pillsRow, { flexDirection: row }]}>
          {(['all', 'exits', 'returns'] as HistoryFilter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.pill, filter === f && s.pillActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  s.pillText,
                  { color: filter === f ? '#fff' : AZ.inkSoft, fontFamily: ff(t.code, 'semiBold') },
                ]}
              >
                {f === 'all' ? t.all : f === 'exits' ? t.exits : t.returns}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Groups */}
        {groups.length === 0 ? (
          <View style={s.empty}>
            <Text style={[s.emptyText, { fontFamily: ff(t.code, 'regular') }]}>
              No records yet.
            </Text>
          </View>
        ) : (
          groups.map((g) => (
            <View key={g.dateKey} style={s.group}>
              <Text style={[s.groupLabel, { textAlign: ta, fontFamily: ff(t.code, 'semiBold') }]}>
                {g.label.toUpperCase()}
              </Text>
              <View style={s.groupCard}>
                {g.items.map((item, i) => (
                  <View key={item.id}>
                    <TripRow item={item} row={row} t={t} isRTL={isRTL} />
                    {i < g.items.length - 1 && <View style={s.divider} />}
                  </View>
                ))}
              </View>
            </View>
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatChip({ topLabel, value, t }: { topLabel: string; value: string; t: ReturnType<typeof useApp>['t'] }) {
  return (
    <View style={s.statChip}>
      <Text style={[s.statLabel, { fontFamily: ff(t.code, 'semiBold') }]}>{topLabel}</Text>
      <Text style={[s.statValue, { fontFamily: ff(t.code, 'bold') }]}>{value}</Text>
    </View>
  );
}

interface TripRowProps {
  item: TripRecord;
  row: 'row' | 'row-reverse';
  t: ReturnType<typeof useApp>['t'];
  isRTL: boolean;
}

function TripRow({ item, row, t, isRTL }: TripRowProps) {
  const isOut = item.type === 'out';
  return (
    <View style={[s.tripRow, { flexDirection: row }]}>
      <View style={[s.tripIcon, { backgroundColor: isOut ? AZ.navy : AZ.goldSoft }]}>
        <View style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}>
          {isOut ? (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M10 12h10m0 0l-3-3m3 3l-3 3"
                stroke={AZ.gold}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 12H10m0 0l3-3m-3 3l3 3"
                stroke={AZ.navy}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.tripType, { fontFamily: ff(t.code, 'semiBold') }]}>
          {isOut ? t.exit : t.return}
        </Text>
        <Text style={[s.tripGate, { fontFamily: ff(t.code, 'regular') }]}>{item.gate}</Text>
      </View>
      <Text style={[s.tripTime, { fontFamily: ff(t.code, 'bold') }]}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AZ.bg },
  statsRow: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 10,
  },
  statChip: {
    flex: 1,
    backgroundColor: AZ.surface,
    borderWidth: 1,
    borderColor: AZ.line,
    borderRadius: 14,
    padding: 14,
  },
  statLabel: {
    fontSize: 11,
    color: AZ.inkFaint,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 17,
    color: AZ.navy,
    marginTop: 2,
  },
  pillsRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 100,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AZ.line,
  },
  pillActive: {
    backgroundColor: AZ.navy,
    borderColor: AZ.navy,
  },
  pillText: {
    fontSize: 12,
  },
  group: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  groupLabel: {
    fontSize: 11,
    color: AZ.inkFaint,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  groupCard: {
    backgroundColor: AZ.surface,
    borderWidth: 1,
    borderColor: AZ.line,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tripRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 14,
  },
  tripIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripType: {
    fontSize: 14,
    color: AZ.navy,
  },
  tripGate: {
    fontSize: 12,
    color: AZ.inkSoft,
    marginTop: 1,
  },
  tripTime: {
    fontSize: 14,
    color: AZ.navy,
  },
  divider: {
    height: 1,
    backgroundColor: AZ.line,
    marginHorizontal: 16,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: AZ.inkFaint,
  },
});
