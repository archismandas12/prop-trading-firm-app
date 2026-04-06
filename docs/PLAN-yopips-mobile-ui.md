# PLAN-yopips-mobile-ui

## Overview

Implement the exact UI/UX design from the provided reference image into the YoPips prop firm mobile app using React Native. The design features a premium dark theme with vibrant green accents, custom charting (Earning Dynamics/Income Tracker), and specific financial app layouts.

## Project Type

**MOBILE** (React Native / Expo) - Primary Agent: `mobile-developer`

## Success Criteria

1. Pixel-perfect implementation of the 3 main screens (Dashboard, Split Bill, Income Tracker).
2. Smooth, performant micro-animations for interactive elements.
3. Proper component-driven architecture for scalability.
4. Pass UX, Accessibility, and Mobile audits (Phase X).

## Tech Stack

- **Framework**: React Native (Expo) - Tested via `expo start --web` within an iPhone container UI.
- **Styling**: React Native StyleSheet (for strict visual control) or NativeWind.
- **Charts**: `react-native-svg` (d3-shape) for exact curves, or `react-native-chart-kit`.
- **Icons/Fonts**: Expo Vector Icons (Feather/Ionicons), custom modern typography (e.g., Inter/Outfit) to match design.

## File Structure

```text
/src
  /components
    /charts
      EarningDynamicsChart.tsx
      IncomeTrackerBarChart.tsx
    /cards
      BalanceCard.tsx
      NewsCard.tsx
      SplitBillCard.tsx
    /ui
      CustomButton.tsx
      Header.tsx
      BottomTabBar.tsx
  /screens
    DashboardScreen.tsx
    SplitBillScreen.tsx
    IncomeTrackerScreen.tsx
  /theme
    colors.ts
    typography.ts
```

## Task Breakdown

### Task 1: Setup Theme and Base Components

- **Task ID**: `TASK-1-THEME`
- **Agent**: `mobile-developer`
- **Skills**: `mobile-design`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: Reference images, UI specs.
- **OUTPUT**: `colors.ts`, `typography.ts`, `CustomButton.tsx`, `Header.tsx`, `BottomTabBar.tsx`
- **VERIFY**: Verify green gradients, dark background hex codes, and typography match.

### Task 2: Implement Dashboard Screen

- **Task ID**: `TASK-2-DASHBOARD`
- **Agent**: `mobile-developer`
- **Skills**: `mobile-design`
- **Priority**: P1
- **Dependencies**: `TASK-1-THEME`
- **OUTPUT**: `DashboardScreen.tsx`, `BalanceCard.tsx`, `EarningDynamicsChart.tsx`, `NewsCard.tsx`
- **VERIFY**: Ensure the earning dynamics chart renders perfectly and top profile header is accurate.

### Task 3: Implement Split Bill Screen

- **Task ID**: `TASK-3-SPLIT-BILL`
- **Agent**: `mobile-developer`
- **Skills**: `mobile-design`
- **Priority**: P1
- **Dependencies**: `TASK-1-THEME`
- **OUTPUT**: `SplitBillScreen.tsx`, `FriendAvatarList.tsx`, icon grids and percentage tabs.
- **VERIFY**: Check horizontal scroll behavior and action button styles.

### Task 4: Implement Income Tracker Screen

- **Task ID**: `TASK-4-INCOME`
- **Agent**: `mobile-developer`
- **Skills**: `mobile-design`
- **Priority**: P1
- **Dependencies**: `TASK-2-DASHBOARD`
- **OUTPUT**: `IncomeTrackerScreen.tsx`, `IncomeTrackerBarChart.tsx`
- **VERIFY**: Verify split visual hierarchy of 43% / 15% layouts and large bar charts.

### Task 5: Navigation Integration

- **Task ID**: `TASK-5-NAV`
- **Agent**: `mobile-developer`
- **Skills**: `mobile-design`
- **Priority**: P2
- **Dependencies**: `TASK-2-DASHBOARD`, `TASK-3-SPLIT-BILL`, `TASK-4-INCOME`
- **OUTPUT**: `AppNavigator.tsx` configured with bottom tabs and stack navigation.

## 🔴 Phase X: Verification (PENDING)

- [ ] Accessibility: Touch targets are at least 44x44.
- [ ] UX/Design: Custom styling applied (no default generic styles).
- [ ] No purple/violet hex codes (Purple ban rule).
- [ ] `npm run lint` & `tsc` pass.
- [ ] App launches seamlessly in Expo.
