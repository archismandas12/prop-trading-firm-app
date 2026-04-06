import { colors } from '../theme/colors';
const isDark = true;
import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Platform, ActivityIndicator, Alert,
  Animated, Pressable
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppHeader } from '../components/ui/AppHeader';
import { AppBackground } from '../components/ui/AppBackground';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChallengeService,
  ChallengePlan, ChallengeModel, CurrencyOption,
  AccountSize, TradingPlatform, PaymentMethod, PromoCodeResult
} from '../services/ChallengeService';

export const NewChallengeScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();

  // ─── Data from service ───
  const [plans, setPlans] = useState<ChallengePlan[]>([]);
  const [models, setModels] = useState<ChallengeModel[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [accountSizes, setAccountSizes] = useState<AccountSize[]>([]);
  const [platforms, setPlatforms] = useState<TradingPlatform[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // ─── User selections ───
  const [selectedPlan, setSelectedPlan] = useState<ChallengePlan | null>(null);
  const [selectedModel, setSelectedModel] = useState<ChallengeModel | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedSize, setSelectedSize] = useState<AccountSize | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<TradingPlatform | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState<PromoCodeResult | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  // ─── UI state ───
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ─── Initial data load ───
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    const [planData, currData, platData, pmData] = await Promise.all([
      ChallengeService.getPlans(),
      ChallengeService.getCurrencies(),
      ChallengeService.getPlatforms(),
      ChallengeService.getPaymentMethods(),
    ]);
    setPlans(planData);
    setCurrencies(currData);
    setPlatforms(platData);
    setPaymentMethods(pmData);
    if (planData.length > 0) setSelectedPlan(planData[0]);
    if (platData.length > 0) setSelectedPlatform(platData[0]);
    if (pmData.length > 0) setSelectedPayment(pmData[0]);
    setLoading(false);
  };

  // ─── When plan changes, reload models + sizes ───
  useEffect(() => {
    if (!selectedPlan) return;
    (async () => {
      const [modelData, sizeData] = await Promise.all([
        ChallengeService.getModels(selectedPlan.id),
        ChallengeService.getAccountSizes(selectedPlan.id, selectedCurrency),
      ]);
      setModels(modelData);
      setAccountSizes(sizeData);
      setSelectedModel(null);
      setSelectedSize(null);
    })();
  }, [selectedPlan]);

  // ─── When currency changes, reload sizes ───
  useEffect(() => {
    if (!selectedPlan) return;
    (async () => {
      const sizeData = await ChallengeService.getAccountSizes(selectedPlan.id, selectedCurrency);
      setAccountSizes(sizeData);
      setSelectedSize(null);
    })();
  }, [selectedCurrency]);

  // ─── Derived values ───
  const basePrice = selectedSize?.price || 0;
  const discount = promoResult?.valid ? promoResult.discount : 0;
  const discountAmount = (basePrice * discount) / 100;
  const total = basePrice - discountAmount;
  const currencySymbol = currencies.find(c => c.code === selectedCurrency)?.symbol || '$';

  // ─── Handlers ───
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    const result = await ChallengeService.applyPromoCode(promoCode.trim());
    setPromoResult(result);
    setPromoLoading(false);
  };

  const handleSubmitOrder = async () => {
    if (!selectedPlan || !selectedModel || !selectedSize || !selectedPlatform || !selectedPayment) {
      Alert.alert('Incomplete', 'Please complete all steps before submitting.');
      return;
    }
    setSubmitting(true);
    const result = await ChallengeService.submitOrder({
      planId: selectedPlan.id,
      modelId: selectedModel.id,
      currency: selectedCurrency,
      accountSizeId: selectedSize.id,
      platformId: selectedPlatform.id,
      paymentMethodId: selectedPayment.id,
      promoCode: promoCode || undefined,
    });
    setSubmitting(false);
    if (result.success) {
      Alert.alert('Success!', `Order ${result.orderId} placed successfully.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const formatBalance = (val: number) => val >= 1000 ? `$${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K` : `$${val}`;

  if (loading) {
    return (
      <View style={s.container}>
        <AppHeader title="New Challenge" showBack={true} />
        <AppBackground />
        <View style={s.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.textSecondary, marginTop: 12 }}>Loading challenge options...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <AppHeader title="Configure Challenge" subtitle="Select your parameters to begin your evaluation" showBack={true} />

      <View style={{ flex: 1, backgroundColor: colors.background, overflow: 'hidden' }}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={s.pad}>

            {/* ──────── 1. ACCOUNT SIZE ──────── */}
            {selectedPlan && accountSizes.length > 0 && (
              <View style={s.sectionContainer}>
                <View style={s.sectionHeader}>
                  <View style={s.sectionTitleRow}>
                    <Feather name="dollar-sign" size={16} color={colors.primary} />
                    <Text style={s.sectionTitleText}>Account Size</Text>
                  </View>
                  <View style={s.currencyToggle}>
                    {currencies.map(cur => {
                      const isActive = selectedCurrency === cur.code;
                      return (
                        <TouchableOpacity
                          key={cur.id}
                          style={[s.currencyBtn, isActive && s.currencyBtnActive]}
                          onPress={() => setSelectedCurrency(cur.code)}
                          activeOpacity={0.8}
                        >
                          <Text style={[s.currencyBtnText, isActive && s.currencyBtnTextActive]}>{cur.code}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={s.sizeGrid}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 12 }}>
                    {accountSizes.map(size => {
                      const isSelected = selectedSize?.id === size.id;
                      return (
                        <TouchableOpacity
                          key={size.id}
                          style={[s.sizePill, isSelected && s.sizePillActive]}
                          onPress={() => setSelectedSize(size)}
                          activeOpacity={0.8}
                        >
                          <Text style={[s.sizeBalance, isSelected && s.sizeBalanceActive]}>
                            {currencySymbol}{size.balance >= 1000 ? `${size.balance / 1000}k` : size.balance}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            )}

            {/* ──────── 2. CHALLENGE TYPE (PLAN) ──────── */}
            <View style={s.sectionContainer}>
              <View style={s.sectionHeader}>
                <View style={s.sectionTitleRow}>
                  <Feather name="target" size={16} color={colors.primary} />
                  <Text style={s.sectionTitleText}>Challenge Type</Text>
                </View>
              </View>
              <View style={s.cardsCol}>
                {plans.map((plan, idx) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  const isFlexible = plan.name.toLowerCase().includes('swing'); // Fake badge logic based on mockup
                  return (
                    <HoverableRadioCard
                      key={plan.id}
                      isSelected={isSelected}
                      onPress={() => setSelectedPlan(plan)}
                      inactiveStyle={s.radioCard}
                      activeStyle={s.radioCardActive}
                      colors={colors}
                    >
                      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 8, flexDirection: 'row', gap: 8 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
                        <Text style={[s.radioCardTitle, isSelected && s.radioCardTitleActive, { marginBottom: 0 }]}>{plan.name}</Text>
                      </View>

                      <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                        {isFlexible && (
                          <View style={s.flexibleBadge}>
                            <Text style={s.flexibleBadgeText}>FLEXIBLE</Text>
                          </View>
                        )}
                      </View>
                    </HoverableRadioCard>
                  );
                })}
              </View>
            </View>

            {/* ──────── 3. PLATFORM ──────── */}
            {selectedSize && platforms.length > 0 && (
              <View style={s.sectionContainer}>
                <View style={s.sectionHeader}>
                  <View style={s.sectionTitleRow}>
                    <Feather name="grid" size={16} color={colors.primary} />
                    <Text style={s.sectionTitleText}>Platform</Text>
                  </View>
                </View>
                <View style={s.cardsCol}>
                  {platforms.map(plat => {
                    const isSelected = selectedPlatform?.id === plat.id;
                    return (
                      <HoverableRadioCard
                        key={plat.id}
                        isSelected={isSelected}
                        onPress={() => setSelectedPlatform(plat)}
                        inactiveStyle={s.radioCard}
                        activeStyle={s.radioCardActive}
                        colors={colors}
                      >
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 8, flexDirection: 'row', gap: 8 }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
                          <Text style={[s.radioCardTitle, isSelected && s.radioCardTitleActive, { marginBottom: 0 }]}>{plat.name}</Text>
                        </View>
                      </HoverableRadioCard>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ──────── 4. BROKER MODEL ──────── */}
            {selectedSize && models.length > 0 && (
              <View style={s.sectionContainer}>
                <View style={s.sectionHeader}>
                  <View style={s.sectionTitleRow}>
                    <Feather name="activity" size={16} color={colors.primary} />
                    <Text style={s.sectionTitleText}>Broker Model</Text>
                  </View>
                </View>
                <View style={s.cardsCol}>
                  {models.map(model => {
                    const isSelected = selectedModel?.id === model.id;
                    return (
                      <HoverableRadioCard
                        key={model.id}
                        isSelected={isSelected}
                        onPress={() => setSelectedModel(model)}
                        inactiveStyle={s.radioCard}
                        activeStyle={s.radioCardActive}
                        colors={colors}
                      >
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 8, flexDirection: 'row', gap: 8 }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
                          <Text style={[s.radioCardTitle, isSelected && s.radioCardTitleActive, { marginBottom: 0 }]}>{model.name}</Text>
                        </View>
                      </HoverableRadioCard>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ──────── 5. PAYMENT METHOD ──────── */}
            {selectedSize && paymentMethods.length > 0 && (
              <View style={s.sectionContainer}>
                <View style={s.sectionHeader}>
                  <View style={s.sectionTitleRow}>
                    <Feather name="credit-card" size={16} color={colors.primary} />
                    <Text style={s.sectionTitleText}>Payment Method</Text>
                  </View>
                </View>
                <View style={s.cardsCol}>
                  {paymentMethods.map(pm => {
                    const isSelected = selectedPayment?.id === pm.id;
                    return (
                      <HoverableRadioCard
                        key={pm.id}
                        isSelected={isSelected}
                        onPress={() => setSelectedPayment(pm)}
                        inactiveStyle={s.radioCard}
                        activeStyle={s.radioCardActive}
                        colors={colors}
                      >
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 8, flexDirection: 'row', gap: 8 }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
                          <Feather
                            name={pm.id === 'crypto' ? 'globe' : pm.id === 'card' ? 'credit-card' : 'briefcase'}
                            size={18} color={isSelected ? '#3B82F6' : colors.textPrimary}
                          />
                          <Text style={[s.radioCardTitle, isSelected && s.radioCardTitleActive, { marginBottom: 0 }]}>{pm.name}</Text>
                        </View>
                      </HoverableRadioCard>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ──────── 6. OBJECTIVES GRID ──────── */}
            {selectedPlan && (
              <View style={s.sectionContainer}>
                <View style={s.sectionHeader}>
                  <View style={s.sectionTitleRow}>
                    <Feather name="target" size={16} color={colors.primary} />
                    <Text style={s.sectionTitleText}>{selectedPlan.name} Objectives</Text>
                  </View>
                </View>

                <View style={s.objHeaderRow}>
                  <View style={s.objCol1}><Text style={s.objHeaderText}>RULE OVERVIEW</Text></View>
                  <View style={s.objCol2}><Text style={s.objHeaderText}>STEP 1</Text></View>
                  <View style={s.objCol2}><Text style={s.objHeaderText}>STEP 2</Text></View>
                </View>

                {[
                  { label: 'Trading Period', v1: 'Unlimited', v2: 'Unlimited' },
                  { label: 'Minimum Trading Days', v1: '0 Days', v2: '0 Days' },
                  { label: 'Maximum Daily Loss', v1: '5%', v2: '5%' },
                  { label: 'Maximum Overall Loss', v1: '12%', v2: '12%' },
                  { label: 'Profit Target', v1: '7%', v2: '4%' },
                  { label: 'Holding', v1: 'Weekend/Overnight allowed', v2: 'Weekend/Overnight allowed' },
                ].map((row, i, arr) => (
                  <View key={i} style={[s.objRow, i === arr.length - 1 && s.objRowLast]}>
                    <View style={s.objCol1}><Text style={s.objLabel}>{row.label}</Text></View>
                    <View style={s.objCol2}><Text style={s.objValue}>{row.v1}</Text></View>
                    <View style={s.objCol2}><Text style={s.objValue}>{row.v2}</Text></View>
                  </View>
                ))}
              </View>
            )}

            {/* ──────── ORDER SUMMARY ──────── */}
            {selectedSize && (
              <View style={s.summaryCard}>
                <Text style={s.summaryTitle}>ORDER SUMMARY</Text>

                <View style={s.summaryPriceRow}>
                  <Text style={s.summaryPrice}>{currencySymbol}{basePrice}</Text>
                  <Text style={s.summaryPriceStrike}>{currencySymbol}{Math.round(basePrice * 1.3)}</Text>
                </View>
                <Text style={s.summaryOnce}>One-time refundable fee</Text>

                <View style={s.summaryDivider} />

                <View style={s.summaryList}>
                  <View style={s.summaryRow}>
                    <Text style={s.summaryLabel}>Plan Selected</Text>
                    <Text style={s.summaryValue}>{selectedPlan?.name || '—'}</Text>
                  </View>
                  <View style={s.summaryRow}>
                    <Text style={s.summaryLabel}>Account Size</Text>
                    <Text style={s.summaryValue}>{currencySymbol}{selectedSize.balance.toLocaleString()}</Text>
                  </View>
                  <View style={s.summaryRow}>
                    <Text style={s.summaryLabel}>Platform</Text>
                    <Text style={s.summaryValue}>{selectedPlatform?.name || '—'}</Text>
                  </View>
                </View>

                {/* Promo Code area matching mockup */}
                <View style={s.promoRow}>
                  <TextInput
                    style={[s.promoInput, Platform.OS === 'web' ? { outline: 'none' } as any : {}]}
                    placeholder="Discount Code"
                    placeholderTextColor="#9ca3af"
                    value={promoCode}
                    onChangeText={(t) => { setPromoCode(t); setPromoResult(null); }}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    style={s.promoApplyBtn}
                    onPress={handleApplyPromo}
                    activeOpacity={0.8}
                    disabled={promoLoading}
                  >
                    {promoLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={s.promoApplyText}>APPLY</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {promoResult && (
                  <Text style={[s.promoMessage, { color: promoResult.valid ? colors.success : colors.danger }]}>
                    {promoResult.message}
                  </Text>
                )}
                {discount > 0 && (
                  <View style={[s.summaryRow, { marginTop: 12 }]}>
                    <Text style={[s.summaryLabel, { color: colors.success }]}>Discount ({discount}%)</Text>
                    <Text style={[s.summaryValue, { color: colors.success }]}>-{currencySymbol}{discountAmount.toFixed(2)}</Text>
                  </View>
                )}

                {/* Submit / CTA */}
                <TouchableOpacity
                  style={[s.submitBtnContainer, submitting && { opacity: 0.6 }]}
                  onPress={handleSubmitOrder}
                  activeOpacity={0.9}
                  disabled={submitting}
                >
                  <View style={s.submitBtnGradient}>
                    {submitting ? (
                      <ActivityIndicator size="small" color="#000000" />
                    ) : (
                      <>
                        <Text style={s.submitBtnText}>COMPLETE ORDER</Text>
                        <Feather name="arrow-right" size={18} color="#000000" />
                      </>
                    )}
                  </View>
                </TouchableOpacity>

                <View style={s.secureRow}>
                  <Feather name="shield" size={14} color="#10b981" />
                  <Text style={s.secureText}>SECURE CHECKOUT POWERED BY COINPAYMENTS</Text>
                </View>
              </View>
            )}

          </View>
        </ScrollView>
      </View>
    </View>
  );
};

// ────────────────────── DIRECT INLINE STYLES FOR EXACT PRECISION ──────────────────────
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  pad: { paddingHorizontal: 24, paddingVertical: 16 },

  headerNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  backRow: { position: 'absolute', left: 24, flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 10 },
  headerNavText: { fontSize: 28, color: colors.textPrimary, fontWeight: '800', letterSpacing: -1 },

  pageSubtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 32, lineHeight: 24 },

  stepLabel: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 16, marginTop: 12 },

  // ─── NEW REDESIGN STYLES ───
  sectionContainer: {
    backgroundColor: colors.cardBackground, // Raised card surface
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
      android: { elevation: 2 },
      web: { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' } as any,
    })
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitleText: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },

  // Currency Toggle
  currencyToggle: {
    flexDirection: 'row', backgroundColor: colors.background, borderRadius: 999, padding: 4
  },
  currencyBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  currencyBtnActive: { backgroundColor: colors.cardBackground, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 1 },
  currencyBtnText: { fontSize: 12, fontWeight: '700', color: colors.textTertiary },
  currencyBtnTextActive: { color: colors.textPrimary },

  // Size Grid
  sizeGrid: { flexDirection: 'row' },
  sizePill: {
    backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24, minWidth: 90, alignItems: 'center',
  },
  sizePillActive: { borderColor: colors.primary, backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  sizeBalance: { fontSize: 16, fontWeight: '700', color: colors.textSecondary },
  sizeBalanceActive: { color: colors.textPrimary, fontWeight: '800' },

  // Radio Cards
  cardsCol: { gap: 16 },
  radioCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20
  },
  radioCardActive: { borderColor: colors.primary, backgroundColor: colors.cardBackground },
  radioCardTitle: { fontSize: 15, fontWeight: '800', color: colors.textSecondary, marginBottom: 6 },
  radioCardTitleActive: { color: colors.textPrimary },
  radioCardDesc: { fontSize: 13, color: colors.textTertiary, lineHeight: 18 },

  flexibleBadge: { backgroundColor: colors.primary, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 8, alignSelf: 'flex-end', position: 'absolute', top: -30, right: -10 },
  flexibleBadgeText: { fontSize: 10, fontWeight: '900', color: colors.textInverse, letterSpacing: 0.5 },

  checkCircleActive: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  emptyCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border },

  // ─── Order Summary (Matching Mockup) ───
  summaryCard: {
    backgroundColor: colors.cardBackground, borderRadius: 20, padding: 28,
    borderWidth: 1, borderColor: colors.border, marginTop: 16,
    ...Platform.select({
      ios: { shadowColor: 'rgba(0, 0, 0, 0.06)', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 1, shadowRadius: 32 },
      android: { elevation: 4 },
      web: { boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.06)' } as any,
    })
  },
  summaryTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary, letterSpacing: 1, marginBottom: 20 },

  summaryPriceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 6 },
  summaryPrice: { fontSize: 48, fontWeight: '900', color: colors.textPrimary, letterSpacing: -2, lineHeight: 48 },
  summaryPriceStrike: { fontSize: 20, fontWeight: '600', color: colors.textTertiary, textDecorationLine: 'line-through', paddingBottom: 6 },
  summaryOnce: { fontSize: 13, color: colors.textSecondary, marginBottom: 24, fontWeight: '500' },

  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: 20 },
  summaryList: { gap: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  summaryValue: { fontSize: 13, color: colors.textPrimary, fontWeight: '800' },

  promoLabel: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 16, marginTop: 24 },
  promoRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  promoInput: {
    flex: 1, backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 14, fontWeight: '500', color: colors.textPrimary,
  },
  promoApplyBtn: { backgroundColor: colors.textTertiary, borderRadius: 12, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center', height: 48 },
  promoApplyText: { color: colors.textPrimary, fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  promoMessage: { fontSize: 13, fontWeight: '500', marginTop: 8 },

  submitBtnContainer: { marginTop: 32, borderRadius: 12, overflow: 'hidden' },
  submitBtnGradient: {
    backgroundColor: colors.primary,
    paddingVertical: 18, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  submitBtnText: { color: colors.textInverse, fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },

  secureRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 20 },
  secureText: { fontSize: 10, color: colors.textSecondary, fontWeight: '700', letterSpacing: 0.5 },

  // Objectives Grid
  objHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 4 },
  objCol1: { flex: 2, paddingRight: 8 },
  objCol2: { flex: 1.5, alignItems: 'flex-start' },
  objHeaderText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, letterSpacing: 0.5 },
  objRow: { flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center' },
  objRowLast: { borderBottomWidth: 0, paddingBottom: 4 },
  objLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  objValue: { fontSize: 11, color: colors.textPrimary, fontWeight: '800' },
});

const s = getStyles(colors, isDark);

// ────────────────────── CUSTOM HOVERABLE RADIO CARD ──────────────────────
const HoverableRadioCard = ({ isSelected, onPress, children, inactiveStyle, activeStyle, colors }: any) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const hoverValue = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => { Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 20 }).start(); };
  const handlePressOut = () => { Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start(); };

  const handleHoverIn = () => { Animated.timing(hoverValue, { toValue: 1, duration: 200, useNativeDriver: false }).start(); };
  const handleHoverOut = () => { Animated.timing(hoverValue, { toValue: 0, duration: 200, useNativeDriver: false }).start(); };

  const interpolatedBorder = hoverValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary]
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      // @ts-ignore - React Native Web specific props
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={{ marginVertical: 4 }}
    >
      <Animated.View style={[
        inactiveStyle,
        isSelected && activeStyle,
        { transform: [{ scale }] },
        !isSelected && { borderColor: interpolatedBorder }
      ]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
