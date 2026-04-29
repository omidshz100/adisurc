import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle, Path } from 'react-native-svg';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { AZ, ff } from '../theme';
import { LangChip } from '../components/LangChip';
import { LangPickerModal } from '../components/LangPickerModal';
import { formatClock, formatDate, formatTime } from '../utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const { t, isRTL, user, language, setLanguage, trips } = useApp();
  const navigation = useNavigation<Nav>();
  const [showLang, setShowLang] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(toastAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start(() => setToastMsg(''));
  };

  const displayName = user?.fullName ?? t.fullName;
  const displayRoom = user ? `Room ${user.roomNumber}` : t.room;

  // Derive live status from last recorded trip
  const lastTrip = trips[0] ?? null;
  const isInDorm = !lastTrip || lastTrip.type === 'in';
  const statusText = isInDorm ? t.inDorm : t.outDorm;
  const statusSub = lastTrip
    ? (lastTrip.type === 'in'
        ? t.lastReturnAt(formatTime(lastTrip.timestamp))
        : t.lastExitAt(formatTime(lastTrip.timestamp)))
    : t.lastReturn;

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const row = isRTL ? ('row-reverse' as const) : ('row' as const);
  const ta = isRTL ? ('right' as const) : ('left' as const);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Top strip: date · lang chip · avatar */}
        <View style={[s.topStrip, { flexDirection: row }]}>
          <View style={{ flex: 1 }}>
            <Text style={[s.dateLabel, { textAlign: ta, fontFamily: ff(t.code, 'semiBold') }]}>
              {formatDate(t.code)}
            </Text>
            <Text style={[s.clockLabel, { textAlign: ta, fontFamily: ff(t.code, 'regular') }]}>
              {formatClock(now, t.code)}
            </Text>
          </View>
          <LangChip t={t} onPress={() => setShowLang(true)} />
          <TouchableOpacity style={s.avatar} onPress={() => navigation.navigate('Profile')} activeOpacity={0.75}>
            <Text style={[s.avatarText, { fontFamily: ff(t.code, 'bold') }]}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={[s.greeting, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[s.hello, { textAlign: ta, fontFamily: ff(t.code, 'regular') }]}>{t.hello}</Text>
          <Text style={[s.name, { textAlign: ta, fontFamily: ff(t.code, 'bold') }]}>{displayName}</Text>

          {/* Room chip */}
          <View style={[s.roomChip, { flexDirection: row }]}>
            <View style={s.dot} />
            <Text style={[s.roomText, { fontFamily: ff(t.code, 'semiBold') }]}>{displayRoom}</Text>
          </View>
        </View>

        {/* Status card */}
        <View style={[s.statusCard, { flexDirection: row }]}>
          <PulseDot color={isInDorm ? AZ.gold : AZ.danger} bgColor={isInDorm ? AZ.navySoft : AZ.goldSoft} />
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={[s.statusTitle, { textAlign: ta, fontFamily: ff(t.code, 'semiBold') }]}>
              {statusText}
            </Text>
            <Text style={[s.statusSub, { textAlign: ta, fontFamily: ff(t.code, 'regular') }]}>
              {statusSub}
            </Text>
          </View>
        </View>

        {/* Big action buttons */}
        <View style={[s.actionsRow, { flexDirection: row }]}>
          <BigAction
            label={t.exit}
            sub={t.exitSub}
            bg={AZ.navy}
            fg="#fff"
            accent={AZ.gold}
            iconType="out"
            isRTL={isRTL}
            t={t}
            disabled={!isInDorm}
            onPress={() => navigation.navigate('Scan', { mode: 'exit' })}
            onDisabledPress={() => showToast(t.needReturnFirst)}
          />
          <BigAction
            label={t.return}
            sub={t.returnSub}
            bg={AZ.goldSoft}
            fg={AZ.navy}
            accent={AZ.gold}
            iconType="in"
            isRTL={isRTL}
            t={t}
            disabled={isInDorm}
            onPress={() => navigation.navigate('Scan', { mode: 'return' })}
            onDisabledPress={() => showToast(t.needExitFirst)}
          />
        </View>

        <View style={{ flex: 1, minHeight: 20 }} />

        {/* History link */}
        <TouchableOpacity
          style={[s.historyCard, { flexDirection: row }]}
          onPress={() => navigation.navigate('History')}
          activeOpacity={0.8}
        >
          <View style={s.historyIcon}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={8} stroke={AZ.navy} strokeWidth={1.8} />
              <Path d="M12 8v4l2.5 2.5" stroke={AZ.navy} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
          </View>
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={[s.histTitle, { textAlign: ta, fontFamily: ff(t.code, 'semiBold') }]}>
              {t.myHistory}
            </Text>
            <Text style={[s.histSub, { textAlign: ta, fontFamily: ff(t.code, 'regular') }]}>
              {t.pastTrips}
            </Text>
          </View>
          <View style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 6l6 6-6 6"
                stroke={AZ.inkFaint}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast */}
      {toastMsg !== '' && (
        <Animated.View
          style={[
            s.toast,
            {
              opacity: toastAnim,
              transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={[s.toastText, { fontFamily: ff(t.code, 'semiBold') }]}>{toastMsg}</Text>
        </Animated.View>
      )}

      <LangPickerModal
        visible={showLang}
        current={language}
        onSelect={setLanguage}
        onClose={() => setShowLang(false)}
      />
    </SafeAreaView>
  );
}

interface BigActionProps {
  label: string;
  sub: string;
  bg: string;
  fg: string;
  accent: string;
  iconType: 'out' | 'in';
  isRTL: boolean;
  t: ReturnType<typeof useApp>['t'];
  disabled?: boolean;
  onPress: () => void;
  onDisabledPress?: () => void;
}

function PulseDot({ color, bgColor }: { color: string; bgColor: string }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true })
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 3.2] });
  const opacity = pulse.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.55, 0.2, 0] });

  return (
    <View style={[s.statusIcon, { backgroundColor: bgColor }]}>
      <Animated.View style={[s.pulseRing, { backgroundColor: color, transform: [{ scale }], opacity }]} />
      <View style={[s.statusDot, { backgroundColor: color }]} />
    </View>
  );
}

function BigAction({ label, sub, bg, fg, accent, iconType, isRTL, t, disabled, onPress, onDisabledPress }: BigActionProps) {
  const iconBg = bg === AZ.navy ? 'rgba(255,255,255,0.1)' : '#fff';
  return (
    <TouchableOpacity
      style={[s.bigAction, { backgroundColor: bg, alignItems: isRTL ? 'flex-end' : 'flex-start', opacity: disabled ? 0.35 : 1 }]}
      onPress={disabled ? onDisabledPress : onPress}
      activeOpacity={0.85}
    >
      <View style={[s.actionIconBox, { backgroundColor: iconBg }]}>
        <View style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}>
          {iconType === 'out' ? (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" stroke={accent} strokeWidth={2} strokeLinecap="round" />
              <Path d="M10 12h10m0 0l-3-3m3 3l-3 3" stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          ) : (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M10 20H6a2 2 0 01-2-2V6a2 2 0 012-2h4" stroke={accent} strokeWidth={2} strokeLinecap="round" />
              <Path d="M20 12H10m0 0l3-3m-3 3l3 3" stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          )}
        </View>
      </View>
      <Text style={[s.actionLabel, { color: fg, fontFamily: ff(t.code, 'bold') }]}>{label}</Text>
      <Text style={[s.actionSub, { color: fg, fontFamily: ff(t.code, 'regular') }]}>{sub}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AZ.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  topStrip: {
    paddingTop: 14,
    alignItems: 'center',
    gap: 10,
  },
  dateLabel: {
    fontSize: 11,
    color: AZ.inkFaint,
    letterSpacing: 0.6,
  },
  clockLabel: {
    fontSize: 13,
    color: AZ.inkSoft,
    letterSpacing: 0.3,
    marginTop: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AZ.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    color: AZ.gold,
    letterSpacing: 0.5,
  },
  greeting: {
    paddingTop: 16,
    gap: 4,
  },
  hello: {
    fontSize: 14,
    color: AZ.inkSoft,
  },
  name: {
    fontSize: 28,
    color: AZ.navy,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  roomChip: {
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: AZ.surface,
    borderWidth: 1,
    borderColor: AZ.line,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AZ.gold,
  },
  roomText: {
    fontSize: 12,
    color: AZ.navy,
  },
  statusCard: {
    marginTop: 18,
    padding: 14,
    backgroundColor: AZ.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AZ.line,
    alignItems: 'center',
    gap: 14,
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: AZ.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pulseRing: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusTitle: {
    fontSize: 14,
    color: AZ.navy,
  },
  statusSub: {
    fontSize: 12,
    color: AZ.inkSoft,
    marginTop: 2,
  },
  actionsRow: {
    marginTop: 18,
    gap: 12,
  },
  bigAction: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    paddingBottom: 20,
    minHeight: 144,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  actionLabel: {
    fontSize: 22,
    letterSpacing: -0.3,
  },
  actionSub: {
    fontSize: 12,
    opacity: 0.75,
    marginTop: 3,
  },
  historyCard: {
    padding: 14,
    backgroundColor: AZ.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AZ.line,
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: AZ.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  histTitle: {
    fontSize: 14,
    color: AZ.navy,
  },
  histSub: {
    fontSize: 12,
    color: AZ.inkSoft,
    marginTop: 1,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: AZ.navyDeep,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  toastText: {
    fontSize: 13,
    color: '#fff',
    letterSpacing: 0.2,
  },
});
