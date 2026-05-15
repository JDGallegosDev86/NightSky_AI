import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import BottomNav from '../components/BottomNav'
import { colors, radius } from '../theme'

export default function MapHomeScreen() {
  // Tracks what the user types in the search bar
  const [search, setSearch] = useState('')

  return (
    <View style={styles.container}>

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Light Pollution Heat Map</Text>
        {/* Dev tools button — can be removed in production */}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,           // Extra top padding for iPhone status bar
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
    borderRadius: radius.full,  // Fully rounded pill shape
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
  // The map takes up all remaining space between the search bar and bottom nav
  mapViewport: {
    flex: 1,
    backgroundColor: colors.spaceDark,
    alignItems: 'center',
    justifyContent: 'center',
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
})