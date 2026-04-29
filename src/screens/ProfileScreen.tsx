import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { AZ, ff } from '../theme';
import { AZBtn } from '../components/AZBtn';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export function ProfileScreen() {
  const { t, isRTL, user, setUser } = useApp();
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState(user?.fullName ?? '');
  const [room, setRoom] = useState(user?.roomNumber ?? '');

  const initials = (user?.fullName ?? '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const ta = isRTL ? ('right' as const) : ('left' as const);
  const textStyle = { textAlign: ta, writingDirection: isRTL ? ('rtl' as const) : ('ltr' as const) };

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedRoom = room.trim();
    if (!trimmedName || !trimmedRoom) return;
    await setUser({ fullName: trimmedName, roomNumber: trimmedRoom });
    navigation.goBack();
  };

  const handleLogout = async () => {
    await setUser(null);
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <View style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke={AZ.navy} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </TouchableOpacity>
        <Text style={[s.headerTitle, { fontFamily: ff(t.code, 'semiBold') }]}>{t.profileTitle}</Text>
        <View style={s.backBtn} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[s.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={[s.avatarText, { fontFamily: ff(t.code, 'bold') }]}>{initials}</Text>
            </View>
          </View>

          <Text style={[s.label, textStyle, { fontFamily: ff(t.code, 'semiBold') }]}>{t.nameLabel}</Text>
          <TextInput
            style={[s.field, textStyle, { fontFamily: ff(t.code, 'regular') }, name.length > 0 && s.fieldActive]}
            value={name}
            onChangeText={setName}
            placeholder={t.fullName}
            placeholderTextColor={AZ.inkFaint}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <View style={s.spacer} />

          <Text style={[s.label, textStyle, { fontFamily: ff(t.code, 'semiBold') }]}>{t.roomLabel}</Text>
          <TextInput
            style={[s.field, textStyle, { fontFamily: ff(t.code, 'regular') }, room.length > 0 && s.fieldActive]}
            value={room}
            onChangeText={setRoom}
            placeholder="701"
            placeholderTextColor={AZ.inkFaint}
            keyboardType="default"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <View style={s.spacer32} />

          <AZBtn label={t.saveChanges} t={t} onPress={handleSave} style={s.fullWidth} />
          <View style={s.spacer12} />
          <AZBtn label={t.logout} kind="danger" t={t} onPress={handleLogout} style={s.fullWidth} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AZ.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AZ.line,
    backgroundColor: AZ.bg,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: AZ.navy,
    letterSpacing: 0.2,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 40,
    width: '100%',
  },
  avatarWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AZ.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    color: AZ.gold,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 12,
    color: AZ.inkSoft,
    marginBottom: 8,
    letterSpacing: 0.5,
    width: '100%',
  },
  field: {
    height: 52,
    backgroundColor: AZ.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AZ.line,
    paddingHorizontal: 16,
    fontSize: 16,
    color: AZ.navy,
    width: '100%',
  },
  fieldActive: {
    borderWidth: 1.5,
    borderColor: AZ.gold,
  },
  spacer: { height: 16 },
  spacer12: { height: 12 },
  spacer32: { height: 32 },
  fullWidth: { width: '100%' },
});
