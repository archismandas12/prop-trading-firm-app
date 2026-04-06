import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard, Modal, ScrollView
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { SupportService, LanguageOption } from '../services/SupportService';
import { Input } from '../components/ui/Input';

export const LiveChatModal = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [language, setLanguage] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [languages, setLanguages] = React.useState<LanguageOption[]>([]);
  React.useEffect(() => { SupportService.getLanguages().then(setLanguages); }, []);

  return (
    <KeyboardAvoidingView
      style={s.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); navigation.goBack(); }}>
        <View style={s.backdrop} />
      </TouchableWithoutFeedback>

      <View style={s.modalContainer}>
        {/* Close Button */}
        <TouchableOpacity style={s.closeButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Feather name="x" size={24} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* Decorative Top Icon */}
        <View style={s.topIconRow}>
          <MaterialCommunityIcons name="send-outline" size={24} color={colors.textTertiary} style={{ transform: [{ rotate: '-45deg' }], marginTop: -10 }} />
          <View style={s.dashedLine} />
          <MaterialCommunityIcons name="monitor-cellphone" size={32} color={colors.textTertiary} />
        </View>

        <Text style={s.title}>Welcome to the Yo Pips Live Chat</Text>

        <View style={[{ zIndex: isLangOpen ? 10 : 1, marginBottom: 20 }]}>
          <Text style={s.label}>Language</Text>
          <TouchableOpacity
            style={[s.inputContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 16 }]}
            onPress={() => { Keyboard.dismiss(); setIsLangOpen(!isLangOpen); }}
            activeOpacity={0.8}
          >
            <Text style={[s.input, { paddingHorizontal: 0, height: 'auto', borderWidth: 0 }, !language && { color: colors.textTertiary }]}>
              {language || "Select Language"}
            </Text>
            <Feather name={isLangOpen ? "chevron-up" : "chevron-down"} size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* Language Popover */}
          {isLangOpen && (
            <>
              {/* Invisible backdrop */}
              {Platform.OS === 'web' ? (
                <TouchableWithoutFeedback onPress={() => setIsLangOpen(false)}>
                  <View style={[StyleSheet.absoluteFill, { position: 'fixed', zIndex: 9, width: '100vw', height: '100vh', top: 0, left: 0 }] as any} />
                </TouchableWithoutFeedback>
              ) : (
                <Modal visible transparent animationType="none">
                  <TouchableWithoutFeedback onPress={() => setIsLangOpen(false)}>
                    <View style={[StyleSheet.absoluteFill, { zIndex: 9 }]} />
                  </TouchableWithoutFeedback>
                </Modal>
              )}

              <View style={[s.popoverContainer, { width: '100%', left: 0, right: 0 }]}>
                <ScrollView style={s.popoverScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                  {languages.map(lang => (
                    <TouchableOpacity
                      key={lang.id}
                      style={[s.dropdownItem, { paddingVertical: 12, borderBottomWidth: 0 }]}
                      onPress={() => { setLanguage(lang.label); setIsLangOpen(false); }}
                    >
                      <Text style={[s.dropdownItemText, language === lang.label && s.dropdownItemTextActive]}>{lang.label}</Text>
                      {language === lang.label && <Feather name="check" size={16} color={colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </View>

        <View style={s.formGroup}>
          <Text style={s.label}>Name</Text>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>

        <View style={s.formGroup}>
          <Text style={s.label}>Email</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Send Button */}
        <View style={s.sendButtonContainer}>
          <TouchableOpacity style={s.sendButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="send" size={28} color="#fff" style={{ transform: [{ rotate: '-45deg' }], marginLeft: 4, marginBottom: 4 }} />
          </TouchableOpacity>
        </View>

      </View>



    </KeyboardAvoidingView>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dimmed background
  },
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.appSurfaceShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  topIconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  dashedLine: {
    width: 40,
    height: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },
  sendButtonContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  sendButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  /* Dropdown Styles */
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  dropdownItemText: { fontSize: 16, color: colors.textSecondary, fontWeight: '500' },
  dropdownItemTextActive: { fontWeight: '700', color: colors.primary },

  popoverContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 250,
    zIndex: 99,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    } : {
      elevation: 5,
      shadowColor: colors.appSurfaceShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    })
  } as any,
  popoverScroll: {
    padding: 8,
  },
});




