import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { DashboardService, ActiveAccount } from '../services/DashboardService';
import { Input } from '../components/ui/Input'; // Ensure Input is imported

export const CredentialsScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation<any>();
  const [activeAccount, setActiveAccount] = useState<ActiveAccount | null>(null);
  const [showMasterPass, setShowMasterPass] = useState(false);
  const [masterPass, setMasterPass] = useState("yzd2rgMx@1");
  const [readOnlyPass, setReadOnlyPass] = useState("•••••••••••");

  const [changingPassType, setChangingPassType] = useState<'master' | 'readonly' | null>(null);
  const [newPassInput, setNewPassInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    DashboardService.getActiveAccount().then(setActiveAccount);
  }, []);

  const server = "Flexy Markets";

  const handleStartChange = (type: 'master' | 'readonly') => {
    setSuccessMsg('');
    setNewPassInput('');
    setChangingPassType(type);
  };

  const handleCancelChange = () => {
    setChangingPassType(null);
    setNewPassInput('');
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-2).toUpperCase();
  };

  const handleConfirmChange = () => {
    const finalPass = newPassInput.trim() || generatePassword();

    if (changingPassType === 'master') {
      setMasterPass(finalPass);
    } else {
      setReadOnlyPass(finalPass);
    }

    setSuccessMsg(`Password changed successfully! New password: ${finalPass}`);
    setChangingPassType(null);
    setNewPassInput('');
  };

  return (
    <KeyboardAvoidingView
      style={s.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <View style={s.backdrop} />
      </TouchableWithoutFeedback>

      <View style={s.modalContainer}>
        {/* Grabber */}
        <View style={s.grabber} />

        {/* Header */}
        <View style={s.headerRow}>
          <Text style={s.title}>Credentials</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={s.closeBtn}>
            <Feather name="x" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {successMsg ? (
            <View style={s.successBanner}>
              <View style={s.successIconWrap}>
                <Feather name="check" size={14} color="#FFF" />
              </View>
              <Text style={s.successText}>{successMsg}</Text>
            </View>
          ) : null}

          {/* Credentials Form */}
          <View style={s.formContainer}>
            {/* Login ID */}
            <View style={s.modernCard}>
              <View style={{ flex: 1 }}>
                <Text style={s.cardLabel}>LOGIN ID</Text>
                <Text style={s.cardValue}>{activeAccount?.id || "Loading..."}</Text>
              </View>
              <TouchableOpacity style={s.iconCircleBtn} activeOpacity={0.7}>
                <Feather name="copy" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            {/* Master Password */}
            <View style={s.modernCard}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={s.cardLabel}>MASTER PASSWORD</Text>
                  <Feather name="info" size={12} color={colors.textSecondary} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Text style={[s.cardValue, { letterSpacing: showMasterPass ? 0 : 2, marginTop: 0 }]}>
                    {showMasterPass ? masterPass : "••••••••••"}
                  </Text>
                  <TouchableOpacity onPress={() => setShowMasterPass(!showMasterPass)} activeOpacity={0.7} style={{ padding: 4 }}>
                    <Feather name={showMasterPass ? "eye" : "eye-off"} size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.actionGroup}>
                <TouchableOpacity style={s.iconCircleBtn} activeOpacity={0.7}>
                  <Feather name="copy" size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity style={s.primaryActionBtn} activeOpacity={0.8} onPress={() => handleStartChange('master')}>
                  <Text style={s.primaryActionText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Master Password Change Form */}
            {changingPassType === 'master' && (
              <View style={s.changeFormContainer}>
                <Text style={s.changeSubtext}>Enter a new password or leave empty to auto-generate:</Text>
                <View style={s.changeFormRow}>
                  <View style={{ flex: 1 }}>
                    <Input
                      value={newPassInput}
                      onChangeText={setNewPassInput}
                      placeholder="New password (optional)"
                      style={s.inlineInput}
                    />
                  </View>
                  <TouchableOpacity style={s.confirmBtn} activeOpacity={0.8} onPress={handleConfirmChange}>
                    <Feather name="check" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7} onPress={handleCancelChange}>
                    <Feather name="x" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Read-only Password */}
            <View style={s.modernCard}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={s.cardLabel}>READ-ONLY PASSWORD</Text>
                  <Feather name="info" size={12} color={colors.textSecondary} />
                </View>
                <Text style={[s.cardValue, { letterSpacing: 2 }]}>{readOnlyPass}</Text>
              </View>
              <View style={s.actionGroup}>
                <TouchableOpacity style={s.iconCircleBtn} activeOpacity={0.7}>
                  <Feather name="copy" size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity style={s.primaryActionBtn} activeOpacity={0.8} onPress={() => handleStartChange('readonly')}>
                  <Text style={s.primaryActionText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Read-only Password Change Form */}
            {changingPassType === 'readonly' && (
              <View style={s.changeFormContainer}>
                <Text style={s.changeSubtext}>Enter a new password or leave empty to auto-generate:</Text>
                <View style={s.changeFormRow}>
                  <View style={{ flex: 1 }}>
                    <Input
                      value={newPassInput}
                      onChangeText={setNewPassInput}
                      placeholder="New password (optional)"
                      style={s.inlineInput}
                    />
                  </View>
                  <TouchableOpacity style={s.confirmBtn} activeOpacity={0.8} onPress={handleConfirmChange}>
                    <Feather name="check" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7} onPress={handleCancelChange}>
                    <Feather name="x" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Server */}
            <View style={s.modernCard}>
              <View style={{ flex: 1 }}>
                <Text style={s.cardLabel}>SERVER</Text>
                <Text style={s.cardValue}>{server}</Text>
              </View>
              <TouchableOpacity style={s.iconCircleBtn} activeOpacity={0.7}>
                <Feather name="copy" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Platform Downloads */}
          <View style={s.platformSection}>
            <Text style={s.sectionTitle}>Platform Downloads</Text>

            <TouchableOpacity style={s.platformCard} activeOpacity={0.7}>
              <View style={[s.platformIconWrap, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
                <MaterialCommunityIcons name="android" size={20} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.platformTitleText}>Android</Text>
                <Text style={s.platformDescText}>Download via Play Store</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={s.platformCard} activeOpacity={0.7}>
              <View style={[s.platformIconWrap, { backgroundColor: 'rgba(148,163,184,0.1)' }]}>
                <MaterialCommunityIcons name="apple" size={20} color="#0F172A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.platformTitleText}>iOS</Text>
                <Text style={s.platformDescText}>Download via App Store</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={s.platformCard} activeOpacity={0.7}>
              <View style={[s.platformIconWrap, { backgroundColor: 'rgba(2,132,199,0.15)' }]}>
                <MaterialCommunityIcons name="microsoft-windows" size={20} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.platformTitleText}>Windows</Text>
                <Text style={s.platformDescText}>Download desktop client</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={s.platformCard} activeOpacity={0.7}>
              <View style={[s.platformIconWrap, { backgroundColor: 'rgba(148,163,184,0.1)' }]}>
                <MaterialCommunityIcons name="apple-keyboard-command" size={20} color={colors.textTertiary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.platformTitleText}>MacOS</Text>
                <Text style={s.platformDescText}>Download DMG package</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={s.platformCard} activeOpacity={0.7}>
              <View style={[s.platformIconWrap, { backgroundColor: 'rgba(139,92,246,0.15)' }]}>
                <Feather name="globe" size={20} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.platformTitleText}>Web Terminal</Text>
                <Text style={s.platformDescText}>Trade directly in browser</Text>
              </View>
              <Feather name="external-link" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Increased to account for floating bottom nav
    shadowColor: colors.appSurfaceShadow,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 24,
    width: '100%',
    maxHeight: '92%',
  },
  grabber: {
    width: 48,
    height: 5,
    backgroundColor: 'rgba(148,163,184,0.3)',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(148,163,184,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    marginBottom: 8,
  },
  modernCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: 'rgba(59, 130, 246, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 6,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: 'rgba(239, 203, 115, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  changeFormContainer: {
    backgroundColor: 'rgba(20,28,50,0.5)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    marginTop: -4,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.15)',
    borderStyle: 'dashed',
  },
  changeSubtext: {
    fontSize: 13,
    color: colors.appTextSecondary,
    marginBottom: 12,
    fontWeight: '500',
  },
  changeFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineInput: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.15)',
    borderRadius: 12,
    height: 44,
  },
  confirmBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelBtn: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(148,163,184,0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    gap: 12,
  },
  successIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  platformSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
    shadowColor: colors.appSurfaceShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  platformIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  platformTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  platformDescText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
});




