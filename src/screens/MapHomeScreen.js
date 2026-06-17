import React, { useState } from 'react'
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, ScrollView, Animated,
} from 'react-native'
import BottomNav from '../components/BottomNav'
import { BORTLE_LEVELS } from '../data/bortleData'
import { colors, radius } from '../theme'

export default function MapHomeScreen() {
  // Tracks what the user types in the search bar
  const [search, setSearch] = useState('')

  // Controls whether the Bortle legend is expanded or collapsed
  const [legendVisible, setLegendVisible] = useState(false)

  return (
    <View style={styles.container}>

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Light Pollution Heat Map</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.iconBtnText}>{'</>'}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search a location..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* ── Map viewport ── */}
      {/*
        TODO: Replace this entire View with your map component.
        Example using react-native-maps:

        import MapView, { Heatmap } from 'react-native-maps'

        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 39.5,
            longitude: -98.35,
            latitudeDelta: 20,
            longitudeDelta: 20,
          }}
        >
          <Heatmap points={heatmapData} />
        </MapView>
      */}
      <View style={styles.mapViewport}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🗺️</Text>
          <Text style={styles.placeholderTitle}>Map goes here</Text>
          <Text style={styles.placeholderSub}>
            Install react-native-maps and replace this{'\n'}
            placeholder with your MapView component.
          </Text>
        </View>

        {/* ── Floating Bortle Legend ── */}
        {/* Sits in the bottom right corner of the map */}
        <View style={styles.legendContainer}>

          {/* ── Expanded legend card ── */}
          {/* Only visible when the ? button has been tapped */}
          {legendVisible && (
            <View style={styles.legendCard}>

              {/* Legend header */}
              <View style={styles.legendHeader}>
                <Text style={styles.legendTitle}>Bortle Scale</Text>
                <Text style={styles.legendSubtitle}>Light Pollution Index</Text>
              </View>

              {/* Scrollable list of all 9 Bortle levels */}
              <ScrollView
                style={styles.legendScroll}
                showsVerticalScrollIndicator={false}
              >
                {BORTLE_LEVELS.map(({ level, name, color }) => (
                  <View key={level} style={styles.legendRow}>

                    {/* Colored dot indicator */}
                    <View style={[styles.legendDot, {
                      backgroundColor: color,
                      shadowColor: color,
                    }]} />

                    {/* Level number and name */}
                    <View style={styles.legendInfo}>
                      <Text style={styles.legendLevel}>Level {level}</Text>
                      <Text style={styles.legendName}>{name}</Text>
                    </View>

                  </View>
                ))}
              </ScrollView>

              {/* Scale bar showing dark to bright gradient */}
              <View style={styles.scaleBarWrap}>
                <Text style={styles.scaleBarLabel}>Dark</Text>
                <View style={styles.scaleBar}>
                  {BORTLE_LEVELS.map(({ level, color }) => (
                    <View
                      key={level}
                      style={[styles.scaleBarSegment, { backgroundColor: color }]}
                    />
                  ))}
                </View>
                <Text style={styles.scaleBarLabel}>Bright</Text>
              </View>

            </View>
          )}

          {/* ── Floating ? toggle button ── */}
          {/* Tapping this shows or hides the legend */}
          <TouchableOpacity
            style={[
              styles.legendBtn,
              legendVisible && styles.legendBtnActive,
            ]}
            onPress={() => setLegendVisible(!legendVisible)}
            activeOpacity={0.85}
          >
            <Text style={styles.legendBtnText}>
              {legendVisible ? '✕' : '?'}
            </Text>
          </TouchableOpacity>

        </View>

      </View>

      {/* ── Bottom navigation bar ── */}
      <BottomNav />

    </View>
  )
}

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDark,
  },
  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 12,
    backgroundColor: 'rgba(8,13,27,0.97)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textBright,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  // ── Search bar ──
  searchWrap: {
    padding: 10,
    backgroundColor: 'rgba(8,13,27,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  searchIcon: {
    fontSize: 16,
    color: colors.textMuted,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  // ── Map viewport ──
  // Takes up all remaining space between search and bottom nav
  mapViewport: {
    flex: 1,
    backgroundColor: colors.spaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',   // Needed so the legend can be positioned absolutely
  },
  placeholder: {
    alignItems: 'center',
    gap: 12,
    padding: 32,
  },
  placeholderIcon: { fontSize: 48 },
  placeholderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholderSub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  // ── Floating legend container ──
  // Positioned in the bottom right corner of the map
  legendContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  // ── Expanded legend card ──
  legendCard: {
    backgroundColor: 'rgba(11, 16, 32, 0.97)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    width: 200,
    maxHeight: 340,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  legendHeader: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textBright,
    letterSpacing: 0.3,
  },
  legendSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  legendScroll: {
    maxHeight: 220,
  },
  // Each row in the legend
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  // Colored dot matching the heat map color
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  legendInfo: { flex: 1 },
  legendLevel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  legendName: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 15,
  },
  // ── Gradient scale bar at the bottom of the legend ──
  // Shows a visual dark → bright color progression
  scaleBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  scaleBarLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  scaleBar: {
    flex: 1,
    flexDirection: 'row',
    height: 8,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  // Each segment of the scale bar is one Bortle level color
  scaleBarSegment: {
    flex: 1,
    height: '100%',
  },
  // ── Floating ? button ──
  legendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentViolet,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentViolet,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  // Active state when legend is open — shows X instead of ?
  legendBtnActive: {
    backgroundColor: colors.textDim,
  },
  legendBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
})