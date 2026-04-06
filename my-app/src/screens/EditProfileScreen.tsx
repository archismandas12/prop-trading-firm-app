import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { DashboardService, UserProfile } from '../services/DashboardService';
import { AppHeader } from '../components/ui/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';
export const EditProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await DashboardService.getUserProfile();
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhone(data.phone === 'Not set' ? '' : data.phone);
        setCountry(data.country === 'Not set' ? '' : data.country);
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
    Alert.alert('Profile Updated', 'Your changes have been saved successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (loading || !profile) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <AppHeader title="Edit Profile" showBack={true} />
      <AppBackground />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={s.pad}>

            {/* Greeting */}
            <View style={s.greetingBlock}>
              <View style={s.nameRow}>
                <Feather name="user" size={24} color={colors.textPrimary} />
                <Text style={s.greetingTitle}>Hello, {profile.firstName}</Text>
              </View>

              {/* Action buttons: Cancel + Refresh */}
              <View style={s.actionRow}>
                <TouchableOpacity style={s.actionButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                  <Feather name="x" size={14} color={colors.textPrimary} />
                  <Text style={s.actionButtonText}>Cancel Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.actionButton} activeOpacity={0.7}>
                  <Feather name="refresh-cw" size={14} color={colors.textPrimary} />
                  <Text style={s.actionButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tabs (visual only — in edit mode, only Personal Info is editable) */}
            <View style={s.tabRow}>
              <LinearGradient
                colors={['#60A5FA', '#3B82F6', '#60A5FA']}
                start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                style={[s.tabItem, s.tabItemActive]}
              >
                <Text style={[s.tabText, s.tabTextActive]}>Personal Info</Text>
              </LinearGradient>
              <View style={s.tabItem}>
                <Text style={s.tabText}>Security & Login</Text>
              </View>
              <View style={s.tabItem}>
                <Text style={s.tabText}>Activity Log</Text>
              </View>
            </View>

            {/* Basic Information Card (editable) */}
            <View style={s.card}>
              <View style={s.cardHeader}>
                <Text style={s.cardTitle}>Basic Information</Text>
                <View style={s.idBadge}>
                  <Text style={s.idBadgeText}>ID: {profile.id.substring(0, 8)}...</Text>
                </View>
              </View>

              {/* First Name */}
              <View style={s.fieldRow}>
                <Text style={s.fieldLabel}>First Name</Text>
                <Input
                  style={s.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              {/* Last Name */}
              <View style={s.fieldRow}>
                <Text style={s.fieldLabel}>Last Name</Text>
                <Input
                  style={s.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              {/* Status (read-only) */}
              <View style={[s.fieldRow, { alignItems: 'center' }]}>
                <Text style={s.fieldLabel}>Status</Text>
                <Badge label={profile.status} type={profile.status === 'Active' ? 'success' : 'danger'} size="sm" />
              </View>

              {/* Member Since (read-only) */}
              <View style={[s.fieldRow, s.lastFieldRow]}>
                <Text style={s.fieldLabel}>Member Since</Text>
                <Text style={s.fieldValueReadonly}>{profile.memberSince}</Text>
              </View>
            </View>

            {/* Account Summary Card (read-only) */}
            <View style={s.card}>
              <View style={s.cardHeader}>
                <Text style={s.cardTitle}>Account Summary</Text>
              </View>

              <View style={[s.fieldRow, { alignItems: 'center' }]}>
                <Text style={s.fieldLabel}>Account Status</Text>
                <Badge label={profile.status} type={profile.status === 'Active' ? 'success' : 'danger'} size="sm" />
              </View>
              <View style={s.fieldRow}>
                <Text style={s.fieldLabel}>Yo Pips Points</Text>
                <Text style={[s.fieldValueReadonly, { color: colors.primary }]}>{profile.points}</Text>
              </View>
              <View style={[s.fieldRow, s.lastFieldRow]}>
                <Text style={s.fieldLabel}>Connected Accounts</Text>
                <Text style={[s.fieldValueReadonly, { color: colors.warning }]}>{profile.connectedAccounts}</Text>
              </View>
            </View>

            {/* Contact & Location Card (editable) */}
            <View style={s.card}>
              <View style={s.cardHeader}>
                <Text style={s.cardTitle}>Contact & Location</Text>
              </View>

              {/* Email read-only */}
              <View style={s.fieldRow}>
                <View style={s.iconLabel}>
                  <Feather name="mail" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={s.fieldLabel}>Email</Text>
                </View>
                <Text style={s.fieldValueReadonly}>{profile.email}</Text>
              </View>

              {/* Phone editable */}
              <View style={s.fieldRow}>
                <View style={s.iconLabel}>
                  <Feather name="phone" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={s.fieldLabel}>Phone</Text>
                </View>
                <Input
                  style={s.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone"
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              {/* Country editable */}
              <View style={[s.fieldRow, s.lastFieldRow]}>
                <View style={s.iconLabel}>
                  <Feather name="map-pin" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={s.fieldLabel}>Country</Text>
                </View>
                <Input
                  style={s.input}
                  value={country}
                  onChangeText={setCountry}
                  placeholder="Enter country"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              {/* Save / Cancel buttons */}
              <View style={s.saveRow}>
                <TouchableOpacity style={s.cancelBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                  <Text style={s.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.8} disabled={saving}>
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={s.saveBtnText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cardBackground },
  scroll: { flex: 1 },
  pad: { paddingHorizontal: 16 },

  // Header nav
  headerNav: { paddingHorizontal: 16, paddingVertical: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1 },

  // Greeting
  greetingBlock: { marginTop: 12, marginBottom: 24 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  greetingTitle: { ...typography.h2, color: colors.textPrimary },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border,
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8,
  },
  actionButtonText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },

  // Tab row (visual)
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 20, gap: 24 },
  tabItem: { paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { paddingHorizontal: 26, borderWidth: 0, borderRadius: 999 },
  tabText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  tabTextActive: { color: '#000000', fontWeight: '800' },

  // Cards
  card: {
    backgroundColor: colors.cardBackground, borderRadius: 12, borderWidth: 1,
    borderColor: colors.border, padding: 16, marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  idBadge: { backgroundColor: colors.divider, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  idBadgeText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  // Field rows
  fieldRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  lastFieldRow: { borderBottomWidth: 0 },
  fieldLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500', flex: 1 },
  fieldValueReadonly: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, textAlign: 'right' },
  iconLabel: { flexDirection: 'row', alignItems: 'center', flex: 1 },

  // Input
  input: {
    flex: 1.2, borderWidth: 1, borderColor: colors.border, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, fontSize: 13,
    color: colors.textPrimary, backgroundColor: colors.cardBackground, textAlign: 'right',
  },

  // Save/cancel buttons
  saveRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20 },
  cancelBtn: {
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBackground,
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  saveBtn: {
    paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8,
    backgroundColor: colors.textPrimary,
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});




