// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplitBillScreen } from '../screens/SplitBillScreen';
import { IncomeTrackerScreen } from '../screens/IncomeTrackerScreen';
import { ActiveDashboardScreen } from '../screens/ActiveDashboardScreen';
import { AccountDetailsScreen } from '../screens/AccountDetailsScreen';
import { CredentialsScreen } from '../screens/CredentialsScreen';
import { AccountMetricsScreen } from '../screens/AccountMetricsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { TradersScreen } from '../screens/TradersScreen';
import { AcademyScreen } from '../screens/AcademyScreen';
import { BillingScreen } from '../screens/BillingScreen';
import { CalculatorsScreen } from '../screens/CalculatorsScreen';
import { CertificatesScreen } from '../screens/CertificatesScreen';
import { DownloadsScreen } from '../screens/DownloadsScreen';
import { EconomicCalendarScreen } from '../screens/EconomicCalendarScreen';
import { EquitySimulatorScreen } from '../screens/EquitySimulatorScreen';
import { HelpdeskTicketsScreen } from '../screens/HelpdeskTicketsScreen';
import { LiveChatModal } from '../screens/LiveChatModal';
import { SymbolsTicketsScreen } from '../screens/SymbolsTicketsScreen';
import { TickerScreen } from '../screens/TickerScreen';
import { TimezoneConverterScreen } from '../screens/TimezoneConverterScreen';
import { TradersAnalysisScreen } from '../screens/TradersAnalysisScreen';
import { MentorAppScreen } from '../screens/MentorAppScreen';
import { PartnershipDealsScreen } from '../screens/PartnershipDealsScreen';
import { PerformanceCoachingScreen } from '../screens/PerformanceCoachingScreen';
import { SocialMediaScreen } from '../screens/SocialMediaScreen';
import { NewChallengeScreen } from '../screens/NewChallengeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { CreateAccountScreen } from '../screens/CreateAccountScreen';
import { OTPVerificationScreen } from '../screens/OTPVerificationScreen';
import { TradingJournalScreen } from '../screens/TradingJournalScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';

import { createNavigationContainerRef } from '@react-navigation/native';
import { BottomNav } from './BottomNav';

export const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator();

export const ScrollContext = React.createContext<{
  scrollY: import('react-native').Animated.Value;
}>({
  scrollY: new (require('react-native').Animated.Value)(0),
});

const MainStack = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Optional: provides a native sliding feel
      }}
    >
      <Stack.Screen
        name="ActiveDashboard"
        component={ActiveDashboardScreen}
      />
      <Stack.Screen
        name="IncomeTracker"
        component={IncomeTrackerScreen}
      />
      <Stack.Screen
        name="SplitBill"
        component={SplitBillScreen}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
      />
      <Stack.Screen
        name="Credentials"
        component={CredentialsScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AccountMetrics"
        component={AccountMetricsScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="Traders"
        component={TradersScreen}
      />
      <Stack.Screen
        name="Academy"
        component={AcademyScreen}
      />
      <Stack.Screen
        name="Billing"
        component={BillingScreen}
      />
      <Stack.Screen
        name="Certificates"
        component={CertificatesScreen}
      />
      <Stack.Screen
        name="Downloads"
        component={DownloadsScreen}
      />
      <Stack.Screen
        name="SocialMedia"
        component={SocialMediaScreen}
      />
      <Stack.Screen
        name="EconomicCalendar"
        component={EconomicCalendarScreen}
      />
      <Stack.Screen
        name="PartnershipDeals"
        component={PartnershipDealsScreen}
      />
      <Stack.Screen
        name="EquitySimulator"
        component={EquitySimulatorScreen}
      />
      <Stack.Screen
        name="Calculators"
        component={CalculatorsScreen}
      />
      <Stack.Screen
        name="MentorApp"
        component={MentorAppScreen}
      />
      <Stack.Screen
        name="PerformanceCoaching"
        component={PerformanceCoachingScreen}
      />
      <Stack.Screen
        name="HelpdeskTickets"
        component={HelpdeskTicketsScreen}
      />
      <Stack.Screen
        name="SymbolsTickets"
        component={SymbolsTicketsScreen}
      />
      <Stack.Screen
        name="Ticker"
        component={TickerScreen}
      />
      <Stack.Screen
        name="TimezoneConverter"
        component={TimezoneConverterScreen}
      />
      <Stack.Screen
        name="TradersAnalysis"
        component={TradersAnalysisScreen}
      />
      <Stack.Screen
        name="LiveChatModal"
        component={LiveChatModal}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewChallenge"
        component={NewChallengeScreen}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
      />
      <Stack.Screen
        name="TradingJournal"
        component={TradingJournalScreen}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const [currentRoute, setCurrentRoute] = React.useState('Login');
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <ScrollContext.Provider value={{ scrollY }}>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={(state) => {
          if (state && state.routes[state.index]) {
            setCurrentRoute(state.routes[state.index].name);
          }
        }}
      >
        <View style={{ flex: 1, position: 'relative' }}>
          <MainStack />
          {!['Login', 'ForgotPassword', 'OTPVerification', 'CreateAccount'].includes(currentRoute) && (
            <BottomNav currentRoute={currentRoute} scrollY={scrollY} />
          )}
        </View>
      </NavigationContainer>
    </ScrollContext.Provider>
  );
};

