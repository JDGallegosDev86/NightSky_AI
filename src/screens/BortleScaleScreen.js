import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { BORTLE_LEVELS } from '../data/bortleData' // All 9 level definitions
import { colors, radius } from '../theme'

export default function BortleScaleScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="What Is A Bortle Scale?" showBack={true} showSearch={true} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── Intro card ── */}
        {/* Gives the user a quick explanation of what the Bortle Scale is */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>About the Bortle Scale</Text>
          <Text style={styles.introText}>
            The Bortle scale is a nine-level numeric scale that measures the
            night sky brightness of a location. Developed by John E. Bortle in
            2001, it quantifies the observability of celestial objects and the
            interference caused by light pollution. Level 1 is the darkest sky
            on Earth — level 9 is inner city sky.
          </Text>
        </View>

        {/* ── Level list ── */}
        {/* Loops through all 9 levels from bortleData.js and renders a row for each */}
        {BORTLE_LEVELS.map(({ level, name, color }) => (
          <TouchableOpacity
            key={level}
            style={styles.levelRow}
            // Passes the level number to BortleLevelScreen so it knows which level to show
            onPress={() => navigation.navigate('BortleLevel', { level })}
            activeOpacity={0.75}
          >
            {/* Color dot — the color represents sky quality (green = dark, red = bright) */}
            <View style={[styles.dot, { backgroundColor: color, shadowColor: color }]} />

            <View style={styles.rowInfo}>
              <Text style={styles.rowName}>Level {level} — {name}</Text>
            </View>

            {/* Arrow indicating it's tappable */}
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>

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
  scroll: {
    padding: 14,
    gap: 8,
    paddingBottom: 24,
  },
  introCard: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 22,
    marginBottom: 6,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textBright,
    marginBottom: 10,
  },
  introText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 15,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  // Colored dot that glows slightly using shadow
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,               // Android shadow
  },
  rowInfo: { flex: 1 },
  rowName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textBright,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
  },
})