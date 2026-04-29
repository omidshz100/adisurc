import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Language } from '../types';
import { AZ, ff } from '../theme';
import { I18N } from '../i18n';

const LANGS: Language[] = ['en', 'it', 'fa', 'ar'];

interface Props {
  visible: boolean;
  current: Language;
  onSelect: (lang: Language) => void;
  onClose: () => void;
}

export function LangPickerModal({ visible, current, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <View style={s.sheet}>
          <Text style={s.heading}>Select language</Text>
          {LANGS.map((code) => {
            const lang = I18N[code];
            const selected = code === current;
            return (
              <TouchableOpacity
                key={code}
                style={[s.row, selected && s.rowActive]}
                onPress={() => { onSelect(code); onClose(); }}
                activeOpacity={0.7}
              >
                <Text style={s.flag}>{lang.flag}</Text>
                <Text
                  style={[
                    s.name,
                    { fontFamily: ff(code, 'semiBold'), color: selected ? AZ.navy : AZ.inkSoft },
                  ]}
                >
                  {lang.name}
                </Text>
                {selected && (
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M5 12l5 5L20 6"
                      stroke={AZ.gold}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,29,54,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: AZ.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 13,
    color: AZ.inkFaint,
    fontFamily: ff('en', 'semiBold'),
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: AZ.line,
  },
  rowActive: {
    backgroundColor: AZ.navySoft,
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  flag: {
    fontSize: 20,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
});
