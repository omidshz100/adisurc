import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { AZ, ff } from '../theme';
import { AZBar } from '../components/AZBar';
import { StepBar } from '../components/StepBar';
import { validateGateQR } from '../utils/qrValidation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Scan'>;
type RouteT = RouteProp<RootStackParamList, 'Scan'>;

export function ScanScreen() {
  const { t, isRTL } = useApp();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { mode } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [detectedGate, setDetectedGate] = useState('');

  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanLineAnim]);

  const handleBarCodeScanned = useCallback(
    ({ data }: { type: string; data: string }) => {
      if (scanned) return;
      const result = validateGateQR(data);
      if (!result.valid) return; // silently ignore non-Adizrak QR codes
      setScanned(true);
      setDetectedGate(result.gate);
      setTimeout(() => {
        navigation.replace('Confirm', { mode, gate: result.gate });
      }, 1200);
    },
    [scanned, navigation, mode]
  );

  const title = mode === 'exit' ? t.exit : t.return;

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: AZ.bg }} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={s.safe}>
        <AZBar title={title} back onBack={() => navigation.goBack()} t={t} />
        <View style={s.permBox}>
          <Text style={[s.permText, { fontFamily: ff(t.code, 'semiBold') }]}>
            Camera permission is required to scan the gate QR code.
          </Text>
          <TouchableOpacity style={s.permBtn} onPress={requestPermission} activeOpacity={0.8}>
            <Text style={[s.permBtnText, { fontFamily: ff(t.code, 'bold') }]}>
              Grant permission
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <AZBar title={title} back onBack={() => navigation.goBack()} t={t} />

      <View style={s.body}>
        <StepBar step={1} t={t} />
        <Text style={[s.scanTitle, { textAlign: isRTL ? 'right' : 'left', fontFamily: ff(t.code, 'bold') }]}>
          {t.scanTitle}
        </Text>
        <Text style={[s.scanSub, { textAlign: isRTL ? 'right' : 'left', fontFamily: ff(t.code, 'regular') }]}>
          {t.scanSub}
        </Text>
      </View>

      {/* Camera viewport */}
      <View style={s.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {/* Dim overlay outside scan area */}
        <View style={s.dimOverlay} pointerEvents="none" />

        {/* Corner brackets */}
        <View style={[s.corner, s.cornerTL]} />
        <View style={[s.corner, s.cornerTR]} />
        <View style={[s.corner, s.cornerBL]} />
        <View style={[s.corner, s.cornerBR]} />

        {/* Animated scan line */}
        <Animated.View
          pointerEvents="none"
          style={[
            s.scanLine,
            {
              transform: [
                {
                  translateY: scanLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 220],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <View style={{ flex: 1 }} />

      {/* Detection banner */}
      <View
        style={[
          s.banner,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
          scanned ? s.bannerActive : s.bannerIdle,
        ]}
      >
        <View style={[s.bannerDot, { backgroundColor: scanned ? AZ.gold : AZ.line }]}>
          {scanned && (
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 13l4 4L19 7"
                stroke={AZ.navy}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>
        <Text style={[s.bannerText, { fontFamily: ff(t.code, 'semiBold') }]}>
          {scanned
            ? `${t.detected.split('·')[0].trim()} · ${detectedGate}`
            : (isRTL ? '...در انتظار اسکن' : 'Waiting for gate QR code…')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const CORNER = 28;
const CORNER_BORDER = 3;
const ACCENT = AZ.gold;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AZ.bg },
  body: { paddingHorizontal: 24, paddingTop: 4 },
  scanTitle: {
    fontSize: 22,
    color: AZ.navy,
    letterSpacing: -0.3,
  },
  scanSub: {
    fontSize: 14,
    color: AZ.inkSoft,
    marginTop: 4,
  },
  cameraWrap: {
    marginHorizontal: 24,
    marginTop: 24,
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: AZ.navyDeep,
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
  },
  cornerTL: {
    top: 16,
    left: 16,
    borderTopWidth: CORNER_BORDER,
    borderLeftWidth: CORNER_BORDER,
    borderTopLeftRadius: 6,
    borderColor: ACCENT,
  },
  cornerTR: {
    top: 16,
    right: 16,
    borderTopWidth: CORNER_BORDER,
    borderRightWidth: CORNER_BORDER,
    borderTopRightRadius: 6,
    borderColor: ACCENT,
  },
  cornerBL: {
    bottom: 16,
    left: 16,
    borderBottomWidth: CORNER_BORDER,
    borderLeftWidth: CORNER_BORDER,
    borderBottomLeftRadius: 6,
    borderColor: ACCENT,
  },
  cornerBR: {
    bottom: 16,
    right: 16,
    borderBottomWidth: CORNER_BORDER,
    borderRightWidth: CORNER_BORDER,
    borderBottomRightRadius: 6,
    borderColor: ACCENT,
  },
  scanLine: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: 16,
    height: 2,
    backgroundColor: ACCENT,
    borderRadius: 2,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    opacity: 0.85,
  },
  banner: {
    marginHorizontal: 24,
    marginBottom: 24,
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  bannerIdle: {
    backgroundColor: AZ.navySoft,
  },
  bannerActive: {
    backgroundColor: AZ.goldSoft,
  },
  bannerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: AZ.navy,
    lineHeight: 1.4 * 13,
  },
  permBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 20,
  },
  permText: {
    fontSize: 15,
    color: AZ.inkSoft,
    textAlign: 'center',
    lineHeight: 22,
  },
  permBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: AZ.navy,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permBtnText: {
    fontSize: 16,
    color: '#fff',
  },
});
