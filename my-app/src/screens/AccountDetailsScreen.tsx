import { useTheme } from '../theme/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';

export const AccountDetailsScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title="Account Details" showBack={true} />
      <AppBackground />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View style={styles.content}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>Placeholder for detailed account metrics and breakdown.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentWrapper: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }
});
