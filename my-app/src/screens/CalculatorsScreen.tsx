import { colors } from '../theme/colors';
const isDark = true;
import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform,
  Modal, TouchableWithoutFeedback
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { AppHeader } from '../components/ui/AppHeader';

// Standardized input template mimicking the screenshot logic
const InputField = ({ label, value, prefix = "", onChangeText, keyboardType = "numeric" }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={s.inputContainer}>
      <Text style={s.inputLabel}>{label}</Text>
      <View style={[s.inputWrapper, isFocused && s.inputWrapperFocused]}>
        {prefix ? <Text style={s.inputPrefix}>{prefix}</Text> : null}
        <TextInput
          style={[s.inputBox, prefix ? { paddingLeft: 4 } : {}, Platform.OS === 'web' ? { outline: 'none', outlineStyle: 'none' } as any : {}]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

// Interactive dropdown component mimicking the native select behavior
const SelectField = ({ label, value, options, onSelect }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  // For a popover, we wrap the entire input in a relative view with zIndex
  return (
    <View style={[{ zIndex: isOpen ? 10 : 1, marginBottom: 20 }]}>
      <Text style={s.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[s.inputWrapper, { paddingHorizontal: 16 }]}
        activeOpacity={0.8}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[s.inputBox, { flex: 1, paddingTop: 14 }]}>{value || 'Select option'}</Text>
        <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={colors.textTertiary} />
      </TouchableOpacity>

      {isOpen && (
        <>
          {/* Invisible backdrop to catch clicks outside the popover */}
          {Platform.OS === 'web' ? (
            <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
              <View style={[StyleSheet.absoluteFill, { position: 'fixed', zIndex: 9, width: '100vw', height: '100vh', top: 0, left: 0 }] as any} />
            </TouchableWithoutFeedback>
          ) : (
            <Modal visible transparent animationType="none">
              <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
                <View style={[StyleSheet.absoluteFill, { zIndex: 9 }]} />
              </TouchableWithoutFeedback>
            </Modal>
          )}

          {/* The Popover itself */}
          <View style={s.popoverContainer}>
            <ScrollView style={s.popoverScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
              {options.map((opt: string) => (
                <TouchableOpacity
                  key={opt}
                  style={[s.dropdownItem, { paddingVertical: 12, borderBottomWidth: 0 }]}
                  onPress={() => { onSelect(opt); setIsOpen(false); }}
                >
                  <Text style={[s.dropdownItemText, value === opt && s.dropdownItemTextActive]}>{opt}</Text>
                  {value === opt && <Feather name="check" size={16} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

export const CalculatorsScreen = () => {
  const { colors, isDark } = useTheme();

  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('Position Size');

  // --- Form States ---
  // Position Size
  const [accountBalance, setAccountBalance] = useState('10000');
  const [riskPercentage, setRiskPercentage] = useState('1');
  const [stopLoss, setStopLoss] = useState('20');
  const [entryPrice, setEntryPrice] = useState('1.1');

  // Pip Value
  const [pipCurrency, setPipCurrency] = useState('EUR/USD');
  const [pipLotSize, setPipLotSize] = useState('1');

  // Profit
  const [profitCurrency, setProfitCurrency] = useState('EUR/USD');
  const [profitDirection, setProfitDirection] = useState('buy'); // 'buy' or 'sell'
  const [profitLotSize, setProfitLotSize] = useState('1');
  const [profitEntryPrice, setProfitEntryPrice] = useState('1.085');
  const [profitExitPrice, setProfitExitPrice] = useState('1.095');

  // Margin
  const [marginCurrency, setMarginCurrency] = useState('EUR/USD');
  const [marginLeverage, setMarginLeverage] = useState('1:100');
  const [marginLotSize, setMarginLotSize] = useState('1');

  // TABS definition tracking their respective icons
  const TABS = [
    { id: 'Position Size', icon: 'pie-chart' },
    { id: 'Pip Value', icon: 'activity' },
    { id: 'Profit', icon: 'dollar-sign' },
    { id: 'Margin', icon: 'percent' }
  ];

  const CURRENCY_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD'];
  const LEVERAGE_OPTIONS = ['1:10', '1:30', '1:50', '1:100', '1:200', '1:500'];

  return (
    <View style={s.container}>
      <AppHeader title="Trading Calculators" showBack={true} />
      <AppBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={s.pad}>

            {/* Custom Horizontal Scrollable Tabs */}
            <View style={s.tabsWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsContent}>
                {TABS.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      style={[s.tabPill, isActive && s.tabPillActive]}
                      onPress={() => setActiveTab(tab.id)}
                      activeOpacity={0.8}
                    >
                      <Feather
                        name={tab.icon as any}
                        size={16}
                        color={isActive ? '#fff' : colors.textSecondary}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[s.tabText, isActive && s.tabTextActive]}>{tab.id}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Primary Form Card */}
            <View style={[s.card, { ...(Platform.OS === 'android' ? { elevation: 50 } : { zIndex: 50 }) }]}>

              <View style={s.cardHeader}>
                <View style={[s.iconBox,
                activeTab === 'Profit' ? { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' } :
                  activeTab === 'Margin' ? { backgroundColor: 'rgba(168, 85, 247, 0.15)', borderColor: '#A855F7' } :
                    activeTab === 'Pip Value' ? { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' } : {}
                ]}>
                  <Feather
                    name={TABS.find(t => t.id === activeTab)?.icon as any}
                    size={20}
                    color="#3B82F6"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>{activeTab}{activeTab !== 'Position Size' ? ' Calculator' : ''}</Text>
                  <Text style={s.cardSubtitle}>
                    {activeTab === 'Position Size' ? 'Calculate optimal lot size based on risk' :
                      activeTab === 'Pip Value' ? 'Calculate value per pip in your account currency' :
                        activeTab === 'Profit' ? 'Estimate potential profit or loss for a trade' :
                          'Calculate required margin to open a position'}
                  </Text>
                </View>
              </View>

              {/* Dynamic Forms based on activeTab */}
              {activeTab === 'Position Size' && (
                <>
                  <InputField label="ACCOUNT BALANCE" value={accountBalance} prefix="$" onChangeText={setAccountBalance} />
                  <InputField label="RISK PERCENTAGE (%)" value={riskPercentage} prefix="%" onChangeText={setRiskPercentage} />
                  <InputField label="STOP LOSS (PIPS)" value={stopLoss} prefix="📉" onChangeText={setStopLoss} />
                  <InputField label="ENTRY PRICE (OPTIONAL)" value={entryPrice} prefix="📈" onChangeText={setEntryPrice} />

                  <TouchableOpacity style={s.calcBtn} activeOpacity={0.9}>
                    <Text style={s.calcBtnText}>Calculate Position</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeTab === 'Pip Value' && (
                <>
                  <SelectField label="CURRENCY PAIR" value={pipCurrency} options={CURRENCY_PAIRS} onSelect={setPipCurrency} />
                  <InputField label="LOT SIZE" value={pipLotSize} onChangeText={setPipLotSize} />

                  <TouchableOpacity style={[s.calcBtn, { backgroundColor: '#3B82F6' }]} activeOpacity={0.9}>
                    <Text style={s.calcBtnText}>Calculate</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeTab === 'Profit' && (
                <>
                  <SelectField label="CURRENCY PAIR" value={profitCurrency} options={CURRENCY_PAIRS} onSelect={setProfitCurrency} />

                  <View style={s.inputContainer}>
                    <Text style={s.inputLabel}>DIRECTION</Text>
                    <View style={s.directionToggle}>
                      <TouchableOpacity
                        style={[s.dirBtn, profitDirection === 'buy' && s.dirBtnBuy]}
                        onPress={() => setProfitDirection('buy')}
                      >
                        <Text style={[s.dirBtnText, profitDirection === 'buy' && s.dirBtnTextActive]}>Buy / Long</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.dirBtn, profitDirection === 'sell' && s.dirBtnSell]}
                        onPress={() => setProfitDirection('sell')}
                      >
                        <Text style={[s.dirBtnText, profitDirection === 'sell' && s.dirBtnTextActive]}>Sell / Short</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <InputField label="LOT SIZE" value={profitLotSize} onChangeText={setProfitLotSize} />

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <InputField label="ENTRY PRICE" value={profitEntryPrice} onChangeText={setProfitEntryPrice} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <InputField label="EXIT PRICE" value={profitExitPrice} onChangeText={setProfitExitPrice} />
                    </View>
                  </View>

                  <TouchableOpacity style={[s.calcBtn, { backgroundColor: '#10B981' }]} activeOpacity={0.9}>
                    <Text style={s.calcBtnText}>Calculate Profit</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeTab === 'Margin' && (
                <>
                  <SelectField label="CURRENCY PAIR" value={marginCurrency} options={CURRENCY_PAIRS} onSelect={setMarginCurrency} />
                  <SelectField label="LEVERAGE" value={marginLeverage} options={LEVERAGE_OPTIONS} onSelect={setMarginLeverage} />
                  <InputField label="LOT SIZE" value={marginLotSize} onChangeText={setMarginLotSize} />

                  <TouchableOpacity style={[s.calcBtn, { backgroundColor: '#A855F7' }]} activeOpacity={0.9}>
                    <Text style={s.calcBtnText}>Calculate Margin</Text>
                  </TouchableOpacity>
                </>
              )}

            </View>

            {/* Results Placeholder Box (Mapped from Web Right Side) */}
            <View style={s.resultsBox}>
              <View style={s.resultsIconCircle}>
                <MaterialCommunityIcons name="calculator-variant-outline" size={40} color={colors.textTertiary} />
              </View>
              <Text style={s.resultsText}>Enter parameters to calculate results</Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ────────────────────── STYLES ──────────────────────
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  pad: { paddingHorizontal: 16 },

  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1, flexShrink: 1 },

  tabsWrapper: { marginBottom: 24, marginHorizontal: -16 },
  tabsContent: { paddingHorizontal: 16, gap: 12 },
  tabPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 999, backgroundColor: 'transparent' },
  tabPillActive: { backgroundColor: colors.warning },
  tabText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  tabTextActive: { color: '#fff' },

  card: { backgroundColor: colors.cardBackground, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: colors.border, elevation: 4, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, marginBottom: 24 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.warning },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: colors.textSecondary, letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(20,28,50,0.6)', borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 16, height: 52 },
  inputWrapperFocused: {
    borderColor: colors.primary,
    ...(Platform.OS === 'web' ? { boxShadow: `0 0 0 3px ${colors.primary}30` } : { elevation: 4, shadowColor: colors.primary, shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } })
  } as any,
  inputPrefix: { fontSize: 15, fontWeight: '600', color: colors.textSecondary, marginRight: 8 },
  inputBox: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.textPrimary, height: '100%' },

  directionToggle: { flexDirection: 'row', backgroundColor: 'rgba(20,28,50,0.6)', borderWidth: 1, borderColor: colors.border, borderRadius: 16, height: 52, padding: 4 },
  dirBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  dirBtnBuy: { backgroundColor: '#10B981', elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  dirBtnSell: { backgroundColor: '#EF4444', elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  dirBtnText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  dirBtnTextActive: { color: '#fff' },

  calcBtn: { backgroundColor: colors.warning, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 12 },
  calcBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  resultsBox: { backgroundColor: 'rgba(20,28,50,0.6)', borderRadius: 32, padding: 40, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', minHeight: 280, elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8 },
  resultsIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  resultsText: { fontSize: 14, color: colors.textTertiary, fontWeight: '600', textAlign: 'center' },

  // Dropdown / Popover Styles
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  dropdownItemText: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  dropdownItemTextActive: { fontWeight: '800', color: colors.primary },

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
  }
});

const s = getStyles(colors, isDark);




