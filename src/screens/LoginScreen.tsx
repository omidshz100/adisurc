import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { AZ, ff } from '../theme';
import { AZBar } from '../components/AZBar';
import { AZBtn } from '../components/AZBtn';
import { LangChip } from '../components/LangChip';
import { LangPickerModal } from '../components/LangPickerModal';

export function LoginScreen() {
  const { t, isRTL, setUser, setLanguage, language } = useApp();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [showLang, setShowLang] = useState(false);

  const handleContinue = async () => {
    const trimmedName = name.trim();
    const trimmedRoom = room.trim();
    if (!trimmedName || !trimmedRoom) return;
    await setUser({ fullName: trimmedName, roomNumber: trimmedRoom });
  };

  const textStyle = {
    textAlign: isRTL ? ('right' as const) : ('left' as const),
    writingDirection: isRTL ? ('rtl' as const) : ('ltr' as const),
  };

  return (
    <SafeAreaView style={s.safe}>
      <AZBar
        t={t}
        right={
          <View style={{ paddingRight: 8 }}>
            <LangChip t={t} onPress={() => setShowLang(true)} />
          </View>
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[s.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={s.logo}>
            <Text style={s.logoLetter}>A</Text>
          </View>
          <Text style={[s.appName, textStyle, { fontFamily: ff(t.code, 'bold') }]}>
            Adizrak
          </Text>
          <Text style={[s.subtitle, textStyle, { fontFamily: ff(t.code, 'regular') }]}>
            {t.welcome}
          </Text>

          <View style={s.spacer20} />

          {/* Full name */}
          <Text style={[s.label, textStyle, { fontFamily: ff(t.code, 'semiBold') }]}>
            {t.nameLabel}
          </Text>
          <TextInput
            style={[
              s.field,
              textStyle,
              { fontFamily: ff(t.code, 'regular') },
              name.length > 0 ? s.fieldFocused : null,
            ]}
            value={name}
            onChangeText={setName}
            placeholder={t.fullName}
            placeholderTextColor={AZ.inkFaint}
            returnKeyType="next"
            autoCapitalize="words"
          />

          <View style={s.spacer16} />

          {/* Room number */}
          <Text style={[s.label, textStyle, { fontFamily: ff(t.code, 'semiBold') }]}>
            {t.roomLabel}
          </Text>
          <TextInput
            style={[
              s.field,
              textStyle,
              { fontFamily: ff(t.code, 'regular') },
              s.fieldFocused,
            ]}
            value={room}
            onChangeText={setRoom}
            placeholder="701"
            placeholderTextColor={AZ.inkFaint}
            keyboardType="default"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />

          <View style={s.spacer32} />

          <AZBtn
            label={t.continue}
            t={t}
            onPress={handleContinue}
            style={s.fullWidth}
          />
          <Text style={[s.footer, { fontFamily: ff(t.code, 'regular') }]}>
            {t.residents}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <LangPickerModal
        visible={showLang}
        current={language}
        onSelect={setLanguage}
        onClose={() => setShowLang(false)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AZ.bg,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 32,
    width: '100%',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: AZ.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoLetter: {
    fontSize: 26,
    fontFamily: ff('en', 'bold'),
    color: AZ.gold,
    letterSpacing: -0.5,
  },
  appName: {
    fontSize: 30,
    color: AZ.navy,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: AZ.inkSoft,
    marginTop: 6,
  },
  spacer20: { height: 20 },
  spacer16: { height: 16 },
  spacer32: { height: 32 },
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
  fieldFocused: {
    borderWidth: 1.5,
    borderColor: AZ.gold,
  },
  fullWidth: {
    width: '100%',
  },
  footer: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 12,
    color: AZ.inkFaint,
    width: '100%',
  },
});
