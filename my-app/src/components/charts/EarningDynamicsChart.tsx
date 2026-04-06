import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import * as d3 from 'd3-shape';
import * as scale from 'd3-scale';
import { colors } from '../../theme/colors';

import { typography } from '../../theme/typography';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40; // 20 padding on each side
const CHART_HEIGHT = 140;

// Dummy data to simulate the curved lines in the design
const normalData = [
  { x: 0, y: 3 },
  { x: 1, y: 4.5 },
  { x: 2, y: 3.5 },
  { x: 3, y: 5 },
  { x: 4, y: 3 },
  { x: 5, y: 4.2 },
  { x: 6, y: 4.8 },
];

const actualData = [
  { x: 0, y: 3.2 },
  { x: 1, y: 3.8 },
  { x: 2, y: 4.2 },
  { x: 3, y: 3.1 },
  { x: 4, y: 4.9 },
  { x: 5, y: 3.5 },
  { x: 6, y: 4.5 },
];

export const EarningDynamicsChart = () => {
  const styles = React.useMemo(() => getStyles(colors, false), [colors]);

  const xScale = scale.scaleLinear()
    .domain([0, 6])
    .range([0, CHART_WIDTH]);

  const yScale = scale.scaleLinear()
    .domain([2, 6]) // Mapping roughly 3k to 5k
    .range([CHART_HEIGHT - 20, 20]);

  // Generators for smooth curves
  const lineGenerator = d3.line<{x: number, y: number}>()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX);

  const normalPath = lineGenerator(normalData) || '';
  const actualPath = lineGenerator(actualData) || '';

  // Generator for filled area under the curve
  const areaGenerator = d3.area<{x: number, y: number}>()
    .x(d => xScale(d.x))
    .y0(CHART_HEIGHT)
    .y1(d => yScale(d.y))
    .curve(d3.curveMonotoneX);

  const actualAreaPath = areaGenerator(actualData) || '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>Earning Dynamics</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#FFA500' }]} />
            <Text style={styles.legendText}>Normal</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.cardBackground }]} />
            <Text style={styles.legendText}>Actual</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {/* Y-Axis Labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisText}>5k</Text>
          <Text style={styles.axisText}>4k</Text>
          <Text style={styles.axisText}>3k</Text>
        </View>

        {/* The SVG Chart itself */}
        <View style={styles.svgContainer}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
                <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
              </LinearGradient>
            </Defs>

            {/* Grid Lines */}
            <Path d={`M0 ${yScale(3)} L${CHART_WIDTH} ${yScale(3)}`} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
            <Path d={`M0 ${yScale(4)} L${CHART_WIDTH} ${yScale(4)}`} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
            <Path d={`M0 ${yScale(5)} L${CHART_WIDTH} ${yScale(5)}`} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />

            {/* Filled Area for Actual */}
            <Path d={actualAreaPath} fill="url(#grad)" />

            {/* Normal Line (Orange-ish) */}
            <Path d={normalPath} fill="none" stroke="#FFA500" strokeWidth="3" />

            {/* Actual Line (Green with white dots) */}
            <Path d={actualPath} fill="none" stroke={colors.primary} strokeWidth="3" />

            {/* Data Points for Actual */}
            {actualData.map((point, index) => (
              <Circle
                key={index}
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r="4"
                fill="#FFFFFF"
                stroke={colors.primary}
                strokeWidth="2"
              />
            ))}
          </Svg>
          
          {/* Note: The floating icons (coins, bills) from the design 
              would typically be absolutely positioned Image components here */}
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
  },
  yAxis: {
    justifyContent: 'space-between',
    height: CHART_HEIGHT - 40,
    marginTop: 20,
    marginRight: 8,
  },
  axisText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  svgContainer: {
    flex: 1,
  },
});



