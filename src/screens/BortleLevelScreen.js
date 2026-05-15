import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { BORTLE_LEVELS } from '../data/bortleData' // All 9 level definitions
import { colors, radius } from '../theme'

export default function BortleLevelScreen({ route }) {
  // 'route.params.level' is the level number passed from BortleScaleScreen
  // when the user taps a level row
  const { level } = route.params

  // Find the matching level data from our bortleData.js file
  const data = BORTLE_LEVELS.find((d) => d.level === level)

  // Safety check — if somehow an invalid level is passed, show an error
  if (!data) {
    return (
      <View style={styles.container}>
        <TopBar title="Not Found" showBack={true} />
        <Text style={styles.errorText}>Level {level} not found.</Text>
        <BottomNav />
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar
        title={'Bortle Scale Level ' + data.level}
        showBack={true}
        showSearch={true}
      />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── Hero card ── */}
        {/* Shows the level badge, name, and a description paragraph */}
        <View style={styles.hero}>

          {/* Colored badge showing the level number */}
          <View style={[styles.badge, {
            backgroundColor: data.color + '22', // Color with low opacity background
            borderColor: data.color + '55',      // Color with medium opacity border
          }]}>
            {/* Small colored dot inside the badge */}
            <View style={[styles.badgeDot, { backgroundColor: data.color }]} />
            <Text style={[styles.badgeText, { color: data.color }]}>
              Level {data.level}
            </Text>
          </View>

          {/* Level name */}
          <Text style={styles.heroTitle}>{data.name}</Text>

          {/* Description paragraph */}
          <Text style={styles.heroText}>{data.description}</Text>

        </View>

        {/* ── Sky Characteristics card ── */}
        {/* Shows a list of bullet points describing the sky at this level */}
        <View style={styles.charsCard}>

          {/* Card header */}
          <Text style={styles.charsHeader}>Sky Characteristics</Text>

          {/* Loop through each characteristic and render a bullet row */}
          {data.chars.map((char, i) => (
            <View
              key={i}
              style={[
                styles.charRow,
                // Add a bottom border between rows but not after the last one
                i < data.chars.length - 1 && styles.charRowBorder,
              ]}
            >
              {/* Teal bullet point */}
              <View style={[styles.charBullet, { backgroundColor: colors.accentCyan }]} />
              <Text style={styles.charText}>{char}</Text>
            </View>
          ))}

        </View>

        {/* ── Image placeholder ── */}
        {/* TODO: Replace with a real example sky photo for each level */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderIcon}>🌌</Text>
          <Text style={styles.imagePlaceholderLabel}>Example Sky Photo</Text>
          <Text style={styles.imagePlaceholderSub}>
            Placeholder — add a real Level {data.level} image here
          </Text>
        </View>

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
    gap: 14,
    paddingBottom: 24,
  },
  // Shown if an invalid level number is passed
  errorText: {
    color: colors.textMuted,
    padding: 24,
  },
  // ── Hero card ──
  hero: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 22,
  },
  // Small pill shaped badge showing the level number
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',    // Don't stretch to full width
    paddingVertical: 5,
    paddingHorizontal: 13,
    borderRadius: radius.full,
    borderWidth: 1,
    marginBottom: 16,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textBright,
    marginBottom: 12,
  },
  heroText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  // ── Characteristics card ──
  charsCard: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  charsHeader: {
    padding: 14,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  charRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',   // Align to top in case text wraps
    gap: 11,
    padding: 13,
  },
  charRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  // Small teal dot used as a bullet point
  charBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,               // Nudge down to align with first line of text
  },
  charText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  // ── Image placeholder ──
  imagePlaceholder: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  imagePlaceholderIcon: { fontSize: 40 },
  imagePlaceholderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  imagePlaceholderSub: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
})