import { useTheme } from '../theme/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import { AppBackground } from '../components/ui/AppBackground';

import { typography } from '../theme/typography';
import { ToolsService, Friend, BillData } from '../services/ToolsService';
import { BackButton } from '../components/ui/BackButton';

export const SplitBillScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [bill, setBill] = React.useState<BillData | null>(null);
  React.useEffect(() => { ToolsService.getFriends().then(setFriends); ToolsService.getBillData().then(setBill); }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Top Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="layers" size={20} color={colors.iconDark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="documents-outline" size={20} color={colors.iconDark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={[typography.h1, styles.title]}>Split the Bill</Text>

        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>💸</Text>
          </View>
          <View style={styles.amountDetails}>
            <Text style={styles.subtitle}>Bill Balance</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Text style={styles.amountText}>{bill?.amount || '$0'}</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, textDecorationLine: 'line-through' }}>{bill?.originalAmount || '$0'}</Text>
            </View>
          </View>
          <View style={styles.billMeta}>
            <Text style={styles.dateText}>{bill?.date || ''}</Text>
            <View style={styles.merchantContainer}>
              {/* Stand-in for merchant logo */}
              <View style={styles.merchantLogo}>
                <Text style={{ fontSize: 10 }}>☕</Text>
              </View>
              <Text style={styles.merchantText}>{bill?.merchant || ''}</Text>
            </View>
          </View>
        </View>

        {/* Action Grid */}
        <View style={styles.actionGrid}>
          {[
            { name: 'Receipt', icon: 'file-text' },
            { name: 'Copy', icon: 'link-2' },
            { name: 'Share', icon: 'share-2' },
            { name: 'Repoint', icon: 'target' },
          ].map((action, idx) => (
            <View key={idx} style={styles.actionItem}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name={action.icon as any} size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.actionText}>{action.name}</Text>
            </View>
          ))}
          <View style={styles.actionItem}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
              <Feather name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.actionText}>Add</Text>
          </View>
        </View>

        {/* Friends Selection */}
        <Text style={[typography.h3, styles.sectionTitle]}>Your Friends</Text>
        <Text style={styles.sectionSubtitle}>Choose friends to share the bill</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.activeTab}>
            <Feather name="users" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.activeTabText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.inactiveTabText}>% Percentages</Text>
          </TouchableOpacity>
        </View>

        {/* Friends Grid */}
        <View style={styles.friendsGrid}>
          {friends.map((friend) => (
            <View key={friend.id} style={styles.friendItem}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: friend.image }} style={styles.friendAvatar} />
                {friend.selected && (
                  <View style={styles.selectedBadge}>
                    <Feather name="check" size={12} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text style={styles.friendName}>{friend.name}</Text>
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Split In</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cardBackground, // Very light green/gray per design
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 24,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: 24,
  },
  amountCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  emoji: {
    fontSize: 28,
  },
  amountDetails: {
    flex: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  billMeta: {
    alignItems: 'flex-end',
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  merchantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  merchantLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  merchantText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cardBackground, // Dark background for buttons
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 4,
    marginBottom: 24,
  },
  activeTab: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  inactiveTab: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveTabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  friendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 40,
  },
  friendItem: {
    alignItems: 'center',
    width: 64, // fixed width for consistent grid
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  friendAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 100, // accommodate tab bar
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
});




