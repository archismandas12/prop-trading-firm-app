import 'react-native-gesture-handler';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  // If we are on web, we constrain the app width to look like a mobile device
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.mobileSimulator}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
              <AppNavigator />
            </SafeAreaView>
          </SafeAreaProvider>
        </View>
      </View>
    );
  }

  // Native behavior
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 0
      }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileSimulator: {
    width: 390,
    flex: 1,
    maxHeight: 844,
    backgroundColor: '#1A1D1A',
    borderRadius: 40,
    overflow: 'hidden',
    boxShadow: '0px 10px 30px rgba(0,0,0,0.3)',
    borderWidth: 8,
    borderColor: '#333333',
  },
});
