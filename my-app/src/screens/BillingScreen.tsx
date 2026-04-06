import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Modal, TouchableWithoutFeedback, Platform, Keyboard, KeyboardAvoidingView
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppHeader } from '../components/ui/AppHeader';
import { AppBackground } from '../components/ui/AppBackground';
import { CustomToggle } from '../components/ui/CustomToggle';
import { BillingService, AccountSizeOption, PriceComparison, Invoice, PayoutRecord, BillingOverview, GraphData, PlanRules } from '../services/BillingService';
import { typography } from '../theme/typography';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { BackButton } from '../components/ui/BackButton';
import { LinearGradient } from 'expo-linear-gradient';
export const BillingScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [invoiceEnabled, setInvoiceEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  const [profitGenerated, setProfitGenerated] = useState('10000');
  const [accountSize, setAccountSize] = useState('$50,000');
  const [sizes, setSizes] = useState<AccountSizeOption[]>([]);
  const [priceData, setPriceData] = useState<PriceComparison | null>(null);
  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [graphData, setGraphData] = React.useState<GraphData | null>(null);
  const [planRules, setPlanRules] = React.useState<PlanRules | null>(null);
  React.useEffect(() => { BillingService.getGraphData().then(setGraphData); BillingService.getPlanRules().then(setPlanRules); BillingService.getAccountSizes().then(setSizes); BillingService.getOverview().then(setOverview); BillingService.getInvoices().then(setInvoices); BillingService.getPayouts().then(setPayouts); }, []);
  React.useEffect(() => { BillingService.getPricing(accountSize).then(setPriceData); }, [accountSize]);
  const [isAccountSizeOpen, setIsAccountSizeOpen] = useState(false);

  // Request Payout Modal State
  const [isPayoutModalVisible, setIsPayoutModalVisible] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutSpeed, setPayoutSpeed] = useState<'standard' | 'flash'>('standard');
  const [payoutMethod, setPayoutMethod] = useState<'crypto' | 'bank'>('crypto');

  const profitVal = parseFloat(profitGenerated.replace(/,/g, '') || '0');
  const splitRatio = (overview?.profitSplit || 80) / 100;
  const yourShare = profitVal * splitRatio;
  const firmShare = profitVal * (1 - splitRatio);

  const ACCOUNT_SIZES = sizes.map(s => s.value);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title="Billing & Payouts" showBack={true} />
      <AppBackground />

      <View style={{ flex: 1, backgroundColor: 'transparent', borderTopLeftRadius: 36, borderTopRightRadius: 36, overflow: 'hidden' }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}>
          <View style={s.pad}>

            {/* Toolbar & Search */}
            <View style={s.toolbarLayout}>
              <View style={s.actionRow}>
                <TouchableOpacity style={s.actionButton} activeOpacity={0.7}>
                  <Feather name="refresh-cw" size={14} color={colors.textPrimary} />
                  <Text style={s.actionButtonText}>Refresh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.actionButton} activeOpacity={0.7}>
                  <Feather name="download" size={14} color={colors.textPrimary} />
                  <Text style={s.actionButtonText}>Export</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.actionButton} activeOpacity={0.7}>
                  <Feather name="help-circle" size={14} color={colors.textPrimary} />
                  <Text style={s.actionButtonText}>Support</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Secondary Tab Navigation */}
            <View style={s.tabRow}>
              {['Overview', 'Transaction History', 'Settings'].map(tab => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    activeOpacity={0.8}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={['#60A5FA', '#3B82F6', '#60A5FA']}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                        style={[s.tabItem, s.tabItemActive]}
                      >
                        <Text style={[s.tabText, s.tabTextActive]}>{tab}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={s.tabItem}>
                        <Text style={s.tabText}>{tab}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>

            {activeTab === 'Overview' && (
              <View>
                {activeTab === 'Overview' && (
                  /* ---------------- SECTION 1 ---------------- */
                  <>
                    <View style={s.mainGrid}>

                      {/* Total Payouts Graph Shell */}
                      <View style={[s.card, { flex: 2 }]}>
                        <View style={s.cardHeader}>
                          <View>
                            <Text style={s.cardTitle}>Total Payouts</Text>
                            <Text style={s.cardSub}>Cumulative earnings over time</Text>
                          </View>
                          <TouchableOpacity style={s.textBtnAction}>
                            <Feather name="file-text" size={14} color={colors.textSecondary} />
                            <Text style={s.textBtnText}>Tax Documents</Text>
                          </TouchableOpacity>
                        </View>

                        {/* Mock Graph Layout */}
                        <View style={s.graphContainer}>
                          <View style={s.yAxis}>
                            <Text style={s.graphLabel}>{graphData?.yLabels?.[0] || '$4k'}</Text>
                            <Text style={s.graphLabel}>{graphData?.yLabels?.[1] || '$3k'}</Text>
                            <Text style={s.graphLabel}>{graphData?.yLabels?.[2] || '$2k'}</Text>
                            <Text style={s.graphLabel}>{graphData?.yLabels?.[3] || '$1k'}</Text>
                            <Text style={s.graphLabel}>$0</Text>
                          </View>
                          <View style={s.graphContent}>
                            <View style={s.graphGridLine} />
                            <View style={s.graphGridLine} />
                            <View style={s.graphGridLine} />
                            <View style={s.graphGridLine} />
                            <View style={[s.graphGridLine, { borderTopColor: colors.textPrimary }]} />
                            <View style={s.xAxis}>
                              <Text style={s.graphLabel}>Start</Text>
                              <Text style={s.graphLabel}>Now</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      {/* Wallet Balance Card */}
                      <View style={[s.card, { paddingVertical: 24 }]}>
                        <Text style={[s.cardTitle, { fontSize: 18, color: colors.primary }]}>Wallet Balance</Text>
                        <View style={{ marginTop: 24 }}>
                          <View style={[s.keyValRow, { paddingVertical: 14 }]}>
                            <Text style={[s.keyText, { fontSize: 14, color: colors.textSecondary }]}>Available:</Text>
                            <Text style={[s.valTextDark, { fontSize: 18, color: colors.textPrimary, fontWeight: '900' }]}>{overview?.totalPaidOut || '$2,050'}</Text>
                          </View>
                          <View style={[s.keyValRow, { paddingVertical: 14 }]}>
                            <Text style={[s.keyText, { fontSize: 13, color: colors.textSecondary }]}>Pending:</Text>
                            <Text style={[s.valText, { fontSize: 14, color: colors.textPrimary, fontWeight: '700' }]}>{overview?.pendingPayout || '$450'}</Text>
                          </View>
                          <View style={[s.keyValRow, { paddingVertical: 14 }]}>
                            <Text style={[s.keyText, { fontSize: 13, color: colors.textSecondary }]}>Min Payout:</Text>
                            <Text style={[s.valText, { fontSize: 14, color: colors.textPrimary, fontWeight: '700' }]}>{overview?.totalPaidOut ? '$50.00' : '$50.00'}</Text>
                          </View>
                          <View style={[s.keyValRow, s.lastRow, { paddingVertical: 14, paddingBottom: 24 }]}>
                            <Text style={[s.keyText, { fontSize: 13, color: colors.textSecondary }]}>Status:</Text>
                            <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
                              <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>ACTIVE</Text>
                            </View>
                          </View>

                          <TouchableOpacity
                            style={s.requestPayoutBtn}
                            activeOpacity={0.8}
                            onPress={() => setIsPayoutModalVisible(true)}
                          >
                            <Text style={s.requestPayoutBtnText}>Request Payout</Text>
                            <Feather name="arrow-up-right" size={18} color="#4FD1C5" style={{ marginLeft: 8 }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* ---------------- SECTION 2 ---------------- */}
                    <View style={s.mainGrid}>
                      {/* Payment Methods */}
                      <View style={s.card}>
                        <View style={s.cardHeader}>
                          <Text style={s.cardTitle}>Payment Methods</Text>
                          <TouchableOpacity style={s.textBtnAction}>
                            <Feather name="plus" size={14} color={colors.textSecondary} />
                            <Text style={s.textBtnText}>Add</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={s.listItem}>
                          <View style={s.listIconBox}>
                            <Feather name="credit-card" size={16} color={colors.textSecondary} />
                          </View>
                          <View style={s.listBody}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Text style={s.listTitle}>Visa •••• 4242</Text>
                              <View style={s.tinyBadgeDark}><Text style={s.tinyBadgeText}>DEFAULT</Text></View>
                            </View>
                            <Text style={s.listSub}>Expires 12/25</Text>
                          </View>
                        </View>

                        <View style={[s.listItem, s.lastRow]}>
                          <View style={s.listIconBox}>
                            <MaterialCommunityIcons name="wallet-outline" size={16} color={colors.textSecondary} />
                          </View>
                          <View style={s.listBody}>
                            <Text style={s.listTitle}>USDT Wallet</Text>
                            <Text style={s.listSub}>0x123...abc</Text>
                          </View>
                        </View>
                      </View>

                      {/* Billing Settings */}
                      <View style={s.card}>
                        <Text style={s.cardTitle}>Billing Settings</Text>
                        <View style={{ marginTop: 16 }}>
                          <View style={s.keyValRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Text style={s.keyText}>Billing Address</Text>
                              <Feather name="info" size={12} color={colors.textTertiary} />
                            </View>
                            <Text style={s.valText}>123 Trading St, New York</Text>
                          </View>
                          <View style={s.keyValRow}>
                            <Text style={s.keyText}>Country</Text>
                            <Text style={s.valText}>USA</Text>
                          </View>
                          <View style={s.keyValRow}>
                            <Text style={s.keyText}>ZIP Code</Text>
                            <Text style={s.valText}>10001</Text>
                          </View>
                          <View style={s.keyValRow}>
                            <Text style={s.keyText}>Currency</Text>
                            <Text style={s.valText}>USD</Text>
                          </View>
                          <View style={[s.keyValRow, s.lastRow, { alignItems: 'center' }]}>
                            <Text style={s.keyText}>Invoice Email</Text>
                            <CustomToggle
                              value={invoiceEnabled}
                              onValueChange={setInvoiceEnabled}
                            />
                          </View>

                          <View style={{ alignItems: 'center', marginTop: 12 }}>
                            <TouchableOpacity>
                              <Text style={s.editLink}>Edit Settings</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* ---------------- SECTION 3: Calculator ---------------- */}
                    <View style={[s.card, { marginTop: 16 }]}>
                      <Text style={s.cardTitle}>Profit Split Calculator</Text>

                      <View style={s.calcContainer}>
                        <View style={s.calcInputRow}>
                          <Text style={s.calcLabel}>Total Profit Generated</Text>
                          <Text style={s.calcHighlightAmount}>${profitVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                        </View>
                        <View style={[s.inputBox, { paddingVertical: Platform.OS === 'ios' ? 16 : 8 }]}>
                          <Text style={s.inputPrefix}>$</Text>
                          <Input
                            style={[s.textInputCore, { flex: 1 }]}
                            value={profitGenerated}
                            onChangeText={setProfitGenerated}
                            keyboardType="numeric"
                          />
                        </View>

                        <View style={s.sliderArea}>
                          <Text style={s.calcLabel}>Adjust Profit</Text>
                          {/* Mock Slider UI */}
                          <View style={s.sliderTrack}>
                            <View style={s.sliderFill} />
                            <View style={s.sliderThumb} />
                          </View>
                          <View style={s.sliderLabels}>
                            <Text style={s.graphLabel}>$0</Text>
                            <Text style={s.graphLabel}>{accountSize || '$50,000'}</Text>
                            <Text style={s.graphLabel}>{`${((parseInt(String(accountSize || '$50,000').replace(/[$,]/g, ''))) * 2 || 100000).toLocaleString()}`}</Text>
                          </View>
                        </View>

                        <View style={s.splitDivider} />

                        <View style={s.splitResults}>
                          <View style={s.keyValRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Text style={s.keyText}>{`Your Share (${overview?.profitSplit || 80}%)`}</Text>
                              <Feather name="info" size={12} color={colors.textTertiary} />
                            </View>
                            <Text style={[s.valTextDark, { color: colors.warning }]}>${yourShare.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                          </View>
                          <View style={s.keyValRow}>
                            <Text style={s.keyText}>{`Firm Share (${100 - (overview?.profitSplit || 80)}%)`}</Text>
                            <Text style={s.valTextDark}>${firmShare.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                          </View>
                          <View style={[s.keyValRow, s.lastRow]}>
                            <Text style={s.keyText}>Split Ratio</Text>
                            <View style={s.tinyBadgeDark}><Text style={s.tinyBadgeText}>80/20</Text></View>
                          </View>

                          {/* Mock split bar */}
                          <View style={s.visualSplitBar}>
                            <View style={[s.splitPart, { flex: 8, backgroundColor: colors.primary }]} />
                            <View style={[s.splitPart, { flex: 2, backgroundColor: 'rgba(148,163,184,0.06)' }]} />
                          </View>
                        </View>

                      </View>
                    </View>

                    {/* ---------------- SECTION 4: Data Tables ---------------- */}
                    <View style={s.mainGrid}>
                      <View style={[s.card, { ...(Platform.OS === 'android' ? { elevation: isAccountSizeOpen ? 50 : 6 } : { zIndex: isAccountSizeOpen ? 50 : 1 }) }]}>
                        <Text style={s.cardTitle}>Price Comparison</Text>
                        <View style={{ marginTop: 16, zIndex: isAccountSizeOpen ? 10 : 1 }}>
                          {/* Select Input + Popover Wrapper */}
                          <View style={{ zIndex: isAccountSizeOpen ? 10 : 1 }}>
                            <Text style={s.keyText}>Select Account Size</Text>
                            <TouchableOpacity
                              style={[s.inputBox, { marginTop: 8, marginBottom: 0, justifyContent: 'space-between', paddingVertical: 16 }]}
                              activeOpacity={0.8}
                              onPress={() => { Keyboard.dismiss(); setIsAccountSizeOpen(!isAccountSizeOpen); }}
                            >
                              <Text style={s.textInputCore}>{accountSize}</Text>
                              <Feather name={isAccountSizeOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.textSecondary} />
                            </TouchableOpacity>

                            {/* Account Size Popover */}
                            {isAccountSizeOpen && (
                              <>
                                {Platform.OS === 'web' ? (
                                  <TouchableWithoutFeedback onPress={() => setIsAccountSizeOpen(false)}>
                                    <View style={[StyleSheet.absoluteFill, { position: 'fixed', zIndex: 9, width: '100vw', height: '100vh', top: 0, left: 0 }] as any} />
                                  </TouchableWithoutFeedback>
                                ) : (
                                  <Modal visible transparent animationType="none">
                                    <TouchableWithoutFeedback onPress={() => setIsAccountSizeOpen(false)}>
                                      <View style={[StyleSheet.absoluteFill, { zIndex: 9 }]} />
                                    </TouchableWithoutFeedback>
                                    <View style={s.dropdownModalWrap}>
                                      <TouchableWithoutFeedback onPress={() => setIsAccountSizeOpen(false)}>
                                        <View style={s.dropdownBackdrop} />
                                      </TouchableWithoutFeedback>
                                      <View style={s.dropdownContainer}>
                                        <View style={s.dropdownHeader}>
                                          <Text style={s.dropdownTitle}>Select Account Size</Text>
                                          <TouchableOpacity onPress={() => setIsAccountSizeOpen(false)} style={s.dropdownClose}>
                                            <Feather name="x" size={20} color={colors.textSecondary} />
                                          </TouchableOpacity>
                                        </View>
                                        <ScrollView style={s.dropdownScroll}>
                                          {ACCOUNT_SIZES.map(size => (
                                            <TouchableOpacity
                                              key={size}
                                              style={s.dropdownItem}
                                              onPress={() => { setAccountSize(size); setIsAccountSizeOpen(false); }}
                                            >
                                              <Text style={[s.dropdownItemText, accountSize === size && s.dropdownItemTextActive]}>{size}</Text>
                                              {accountSize === size && <Feather name="check" size={18} color={colors.primary} />}
                                            </TouchableOpacity>
                                          ))}
                                        </ScrollView>
                                      </View>
                                    </View>
                                  </Modal>
                                )}
                              </>
                            )}
                          </View>

                          <View style={{ marginTop: 8 }}>
                            <View style={s.keyValRow}>
                              <Text style={s.keyText}>Avg. Market Rate</Text>
                              <Text style={[s.valText, { textDecorationLine: 'line-through' }]}>{priceData?.market || ''}</Text>
                            </View>
                            <View style={s.keyValRow}>
                              <Text style={s.keyText}>Yo Pips Price</Text>
                              <Text style={[s.valTextDark, { color: colors.warning }]}>{priceData?.yo || ''}</Text>
                            </View>
                            <View style={[s.keyValRow, s.lastRow]}>
                              <Text style={s.keyText}>You Save</Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={[s.valTextDark, { color: colors.warning }]}>{priceData?.save || ''}</Text>
                                {priceData?.percent ? <Badge label={priceData.percent} type="success" size="sm" /> : null}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Compare Plans (Mobile Adapted) */}
                      <View style={s.card}>
                        <Text style={s.cardTitle}>Compare Plans</Text>

                        <View style={s.planColumn}>
                          <View style={s.planColHeader}>
                            <Text style={s.planName}>Evolution</Text>
                          </View>
                          <View style={s.planDataRow}><Text style={s.keyText}>Profit Split</Text><Text style={s.planDataValGreen}>{planRules?.profitSplit || '80%'}</Text></View>
                          <View style={s.planDataRow}><Text style={s.keyText}>Max Drawdown</Text><Text style={s.planDataVal}>{planRules?.maxDrawdown || '10% (EOD)'}</Text></View>
                          <View style={s.planDataRow}><Text style={s.keyText}>Daily Loss</Text><Text style={s.planDataVal}>{planRules?.dailyLoss || '5%'}</Text></View>
                        </View>

                        <View style={s.planColumn}>
                          <View style={s.planColHeader}>
                            <Text style={s.planName}>Express</Text>
                          </View>
                          <View style={s.planDataRow}><Text style={s.keyText}>Profit Split</Text><Text style={s.planDataVal}>80%</Text></View>
                          <View style={s.planDataRow}><Text style={s.keyText}>First Payout</Text><Text style={s.planDataValGreen}>3 Days</Text></View>
                          <View style={s.planDataRow}><Text style={s.keyText}>Time Limit</Text><Text style={s.planDataValBlue}>Unlimited</Text></View>
                        </View>

                      </View>
                    </View>

                  </>
                )}


              </View>
            )}

            {activeTab === 'Transaction History' && (
              <View style={[s.card, { paddingHorizontal: 0, paddingVertical: 0, overflow: 'hidden' }]}>
                {/* Card Header */}
                <View style={[s.cardHeader, { padding: 20, marginBottom: 0, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                  <Text style={s.cardTitle}>Transaction History</Text>
                </View>

                {/* Mobile Actions Toolbar */}
                <View style={s.thMobileToolbar}>
                  <View style={s.thSearchBox}>
                    <Feather name="search" size={14} color={colors.textTertiary} />
                    <Input
                      style={s.thSearchInput}
                      placeholder="Search..."
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>
                  <TouchableOpacity style={s.thMobileExportBtn}>
                    <Feather name="download" size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Empty State Body (Native Mobile Layout) */}
                <View style={s.thEmptyBody}>
                  <View style={s.thEmptyIconCircle}>
                    <Feather name="inbox" size={32} color={colors.textTertiary} />
                  </View>
                  <Text style={s.thEmptyText}>No transactions found</Text>
                  <Text style={s.thEmptySubtext}>When you request a payout, it will appear here.</Text>
                </View>

                {/* Table Footer */}
                <View style={[s.thFooter, { padding: 20 }]}>
                  <Text style={s.thFooterText}>Showing 0 results</Text>
                  <View style={s.thPagination}>
                    <Text style={s.thPageLinkDisabled}>Previous</Text>
                    <Text style={s.thPageLinkDisabled}>Next</Text>
                  </View>
                </View>

              </View>
            )}

            {/* Footer */}
            <View style={s.footer}>
              <View style={s.footerLinksRow}>
                <Text style={s.footerLink}>Cookie settings</Text>
                <Text style={s.footerLink}>Privacy policy</Text>
                <Text style={s.footerLink}>Terms & Conditions</Text>
              </View>
              <Text style={s.footerDesc}>
                Yo Pips provides simulated trading services. All accounts are demo accounts with virtual funds. Performance on simulated accounts does not guarantee real-world results. Payouts are based on simulated profit performance.
              </Text>
              <Text style={s.footerCopyright}>2026 © Copyright - YoPips.com</Text>
            </View>

          </View>
        </ScrollView>

        {/* --- Request Payout Modal --- */}
        <Modal
          visible={isPayoutModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsPayoutModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={s.modalBackdrop}
          >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={s.modalContainer}>
                <View style={s.modalHeader}>
                  <Text style={s.modalTitle}>Request Payout</Text>
                  <Text style={s.modalSubtitle}>Withdraw funds from your wallet</Text>
                </View>

                <ScrollView style={s.modalScroll} showsVerticalScrollIndicator={false}>
                  {/* Amount Section */}
                  <View style={s.modalSection}>
                    <Text style={s.modalLabel}>AMOUNT</Text>
                    <View style={s.amountInputContainer}>
                      <Text style={s.currencyPrefix}>$</Text>
                      <Input
                        style={s.amountInput}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        value={payoutAmount}
                        onChangeText={setPayoutAmount}
                        containerStyle={{ borderWidth: 0, height: '100%', flex: 1, backgroundColor: 'transparent', paddingHorizontal: 0 }}
                        placeholderTextColor="#94A3B8"
                      />
                      <TouchableOpacity onPress={() => setPayoutAmount('2050')}>
                        <Text style={s.maxBtnText}>MAX</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={s.availableText}>Available: $2,050.00</Text>
                  </View>

                  {/* Speed Section */}
                  <View style={s.modalSection}>
                    <Text style={s.modalLabel}>SPEED</Text>

                    <TouchableOpacity
                      style={[s.speedOption, payoutSpeed === 'standard' && s.speedOptionActive]}
                      activeOpacity={0.7}
                      onPress={() => setPayoutSpeed('standard')}
                    >
                      <View style={[s.radioCircle, payoutSpeed === 'standard' && s.radioCircleActive]}>
                        {payoutSpeed === 'standard' && <View style={s.radioInner} />}
                      </View>
                      <Text style={[s.speedText, payoutSpeed === 'standard' && s.speedTextActive]}>Standard / Same-Day</Text>
                      <View style={s.freeBadge}>
                        <Text style={s.freeBadgeText}>FREE</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[s.speedOption, payoutSpeed === 'flash' && s.speedOptionActive]}
                      activeOpacity={0.7}
                      onPress={() => setPayoutSpeed('flash')}
                    >
                      <View style={[s.radioCircle, payoutSpeed === 'flash' && s.radioCircleActive]}>
                        {payoutSpeed === 'flash' && <View style={s.radioInner} />}
                      </View>
                      <Feather name="zap" size={16} color={payoutSpeed === 'flash' ? colors.primary : colors.textSecondary} style={{ marginRight: 8 }} />
                      <Text style={[s.speedText, payoutSpeed === 'flash' && s.speedTextActive, { flex: 1 }]}>Flash Payout</Text>
                      <Text style={s.feeText}>2% Fee</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Method Section */}
                  <View style={[s.modalSection, { marginBottom: 32 }]}>
                    <Text style={s.modalLabel}>METHOD</Text>
                    <View style={s.methodRow}>
                      <TouchableOpacity
                        style={[s.methodBtn, payoutMethod === 'crypto' && s.methodBtnActive]}
                        activeOpacity={0.7}
                        onPress={() => setPayoutMethod('crypto')}
                      >
                        <Feather name="anchor" size={18} color={payoutMethod === 'crypto' ? colors.primary : colors.textSecondary} />
                        <Text style={[s.methodBtnText, payoutMethod === 'crypto' && s.methodBtnTextActive]}>Crypto</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[s.methodBtn, payoutMethod === 'bank' && s.methodBtnActive]}
                        activeOpacity={0.7}
                        onPress={() => setPayoutMethod('bank')}
                      >
                        <Feather name="credit-card" size={18} color={payoutMethod === 'bank' ? colors.primary : colors.textSecondary} />
                        <Text style={[s.methodBtnText, payoutMethod === 'bank' && s.methodBtnTextActive]}>Bank</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={s.modalActions}>
                    <TouchableOpacity
                      style={s.cancelBtn}
                      onPress={() => setIsPayoutModalVisible(false)}
                    >
                      <Text style={s.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.confirmBtn}>
                      <Text style={s.confirmBtnText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  pad: { paddingHorizontal: 16 },

  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 24 },

  toolbarLayout: { marginBottom: 24 },
  actionRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.cardBackground, borderWidth: 2, borderColor: colors.border, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  actionButtonText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  tabRow: { flexDirection: 'row', marginBottom: 24, gap: 16 },
  tabItem: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 999, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.cardBackground, elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  tabItemActive: { paddingHorizontal: 26, borderWidth: 0, elevation: 4 },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  tabTextActive: { color: '#000000', fontWeight: '800' },

  mainGrid: { gap: 20, marginBottom: 20 },
  card: { backgroundColor: colors.cardBackground, borderRadius: 32, borderWidth: 1, borderColor: colors.border, padding: 24, elevation: 6, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  cardSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4, fontWeight: '500' },
  textBtnAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  textBtnText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },

  keyValRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.divider },
  lastRow: { borderBottomWidth: 0, paddingBottom: 0 },
  keyText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  valText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', textAlign: 'right', flex: 1 },
  valTextDark: { fontSize: 14, color: colors.textPrimary, fontWeight: '800', textAlign: 'right' },

  graphContainer: { flexDirection: 'row', height: 180, marginTop: 16 },
  yAxis: { justifyContent: 'space-between', paddingRight: 12, paddingBottom: 24 },
  graphLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  graphContent: { flex: 1, justifyContent: 'space-between' },
  graphGridLine: { borderTopWidth: 1, borderTopColor: colors.divider, width: '100%', height: 0 },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8 },

  darkCTA: { backgroundColor: colors.warning, borderRadius: 999, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 16, marginTop: 24, elevation: 4 },
  darkCTAText: { color: colors.textPrimary, fontSize: 14, fontWeight: '800' },

  tinyBadgeDark: { backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  tinyBadgeText: { color: colors.warning, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

  listItem: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.divider },
  listIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center' },
  listBody: { flex: 1 },
  listTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  listSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },

  editLink: { fontSize: 14, color: colors.primary, fontWeight: '800', textDecorationLine: 'underline' },

  calcContainer: { marginTop: 20 },
  calcInputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calcLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  calcHighlightAmount: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderWidth: 1.5, borderColor: 'rgba(59, 130, 246, 0.3)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16 },
  inputPrefix: { fontSize: 15, color: colors.primary, marginRight: 8, fontWeight: '700' },
  textInputCore: { fontSize: 15, color: colors.textPrimary, fontWeight: '700' },

  sliderArea: { marginTop: 32 },
  sliderTrack: { height: 8, backgroundColor: 'rgba(148,163,184,0.06)', borderRadius: 4, marginVertical: 16, justifyContent: 'center' },
  sliderFill: { position: 'absolute', left: 0, width: '10%', height: 8, backgroundColor: colors.warning, borderRadius: 4 },
  sliderThumb: { position: 'absolute', left: '10%', width: 20, height: 20, borderRadius: 10, backgroundColor: colors.warning, marginLeft: -10, borderWidth: 3, borderColor: '#fff', elevation: 2 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },

  splitDivider: { height: 1, backgroundColor: colors.border, marginVertical: 24 },
  splitResults: {},
  visualSplitBar: { flexDirection: 'row', height: 16, borderRadius: 999, overflow: 'hidden', marginTop: 24 },
  splitPart: { height: '100%' },

  planColumn: { marginTop: 24, borderWidth: 2, borderColor: colors.border, borderRadius: 24, padding: 20 },
  planColHeader: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.divider },
  planName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  planDataRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  planDataVal: { fontSize: 14, color: colors.textPrimary, fontWeight: '700' },
  planDataValGreen: { fontSize: 14, color: colors.warning, fontWeight: '700' },
  planDataValBlue: { fontSize: 14, color: colors.info, fontWeight: '700' },

  thMobileToolbar: { flexDirection: 'row', gap: 12, padding: 20, borderBottomWidth: 1, borderBottomColor: colors.divider },
  thSearchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(20,28,50,0.6)', borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 16, height: 44 },
  thSearchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.textPrimary },
  thMobileExportBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.cardBackground },

  thEmptyBody: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.divider, backgroundColor: colors.cardBackground },
  thEmptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.warning, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  thEmptyText: { fontSize: 18, color: colors.textPrimary, fontWeight: '800', marginBottom: 8 },
  thEmptySubtext: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32, fontWeight: '500' },

  thFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.cardBackground, padding: 20 },
  thFooterText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  thPagination: { flexDirection: 'row', gap: 16 },
  thPageLinkDisabled: { fontSize: 13, color: colors.textTertiary, fontWeight: '700' },

  footer: { marginTop: 32, paddingVertical: 24, alignItems: 'center' },
  footerLinksRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  footerLink: { fontSize: 12, color: colors.textSecondary, fontWeight: '700' },
  footerDesc: { fontSize: 11, color: colors.textTertiary, textAlign: 'center', lineHeight: 18, marginBottom: 16, paddingHorizontal: 16 },
  footerCopyright: { fontSize: 12, color: colors.textTertiary, fontWeight: '500' },

  // Dropdown Styles
  dropdownModalWrap: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  dropdownBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  dropdownContainer: { width: '100%', maxWidth: 480, backgroundColor: colors.cardBackground, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '60%', paddingBottom: Platform.OS === 'ios' ? 40 : 20, elevation: 20, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 10 },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  dropdownTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  dropdownClose: { padding: 4 },
  dropdownScroll: { padding: 16 },
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
  },

  // Custom Wallet Balance Styles
  requestPayoutBtn: {
    backgroundColor: '#FF8A65',
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    marginTop: 24,
    ...Platform.select({
      ios: { shadowColor: '#FF8A65', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
      web: { boxShadow: '0 4px 8px rgba(255, 138, 101, 0.3)' }
    })
  },
  requestPayoutBtnText: { color: colors.textPrimary, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  // --- Modal Styles ---
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContainer: { width: '100%', maxWidth: 320, backgroundColor: colors.cardBackground, borderRadius: 20, padding: 20, maxHeight: '90%', ...Platform.select({ ios: { shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 }, android: { elevation: 10 }, web: { boxShadow: '0 10px 25px rgba(0,0,0,0.2)' } }) },
  modalHeader: { marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  modalSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4, fontWeight: '500' },
  modalScroll: { flexGrow: 0 },
  modalSection: { marginBottom: 16 },
  modalLabel: { fontSize: 11, fontWeight: '900', color: colors.textSecondary, letterSpacing: 1, marginBottom: 10 },

  amountInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, height: 48, backgroundColor: colors.cardBackground },
  currencyPrefix: { fontSize: 16, color: colors.primary, fontWeight: '600', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 16, color: colors.textPrimary, fontWeight: '800' },
  maxBtnText: { color: colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  availableText: { fontSize: 11, color: colors.textTertiary, alignSelf: 'flex-end', marginTop: 6, fontWeight: '500' },

  speedOption: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBackground, marginBottom: 8 },
  speedOptionActive: { borderColor: colors.primary, backgroundColor: colors.cardBackground },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  radioCircleActive: { borderColor: colors.primary, borderWidth: 2 },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  speedText: { fontSize: 14, color: colors.textPrimary, fontWeight: '600', flex: 1 },
  speedTextActive: { color: colors.textPrimary, fontWeight: '800' },
  freeBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  freeBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '900' },
  feeText: { fontSize: 12, color: colors.textSecondary, fontWeight: '800' },

  methodRow: { flexDirection: 'row', gap: 10 },
  methodBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 8, backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border, gap: 6 },
  methodBtnActive: { backgroundColor: colors.cardBackground, borderColor: colors.border },
  methodBtnText: { fontSize: 13, color: colors.textSecondary, fontWeight: '800' },
  methodBtnTextActive: { color: colors.primary, fontWeight: '900' },

  modalActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  cancelBtn: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  cancelBtnText: { color: colors.textSecondary, fontSize: 14, fontWeight: '800' },
  confirmBtn: { flex: 1.2, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  confirmBtnText: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
});




