import React from 'react'
import {
  View, Text, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { BORTLE_LEVELS } from '../data/bortleData'
import { colors, radius } from '../theme'

export default function ResultsScreen() {
  const navigation = useNavigation()
  const route      = useRoute()

  // ── Route params from PhotoReviewScreen ─────────────
  const {
    bortleLevel = null,
    confidence  = null,
    photoUri    = null,
    latitude    = null,
    longitude   = null,
  } = route.params || {}

  // ── Get the full Bortle level data ───────────────────
  // Looks up the level name, color, and description from
  // our bortleData.js file using the returned level number
  const bortleData = BORTLE_LEVELS.find((b) => b.level === bortleLevel)

  // ── Format coordinates for display ──────────────────
  const formatLat = (lat) => {
    if (!lat) return 'Unavailable'
    return `${Math.abs(lat).toFixed(6)}° ${lat >= 0 ? 'N' : 'S'}`
  }

  const formatLng = (lng) => {
    if (!lng) return 'Unavailable'
    return `${Math.abs(lng).toFixed(6)}° ${lng >= 0 ? 'E' : 'W'}`
  }

  // ── Confidence label ─────────────────────────────────
  // Converts the confidence percentage to a human readable label
  const getConfidenceLabel = (conf) => {
    if (conf >= 80) return 'High'
    if (conf >= 50) return 'Moderate'
    return 'Low'
  }

  // ── Confidence color ─────────────────────────────────
  const getConfidenceColor = (conf) => {
    if (conf >= 80) return '#22c55e'   // Green for high confidence
    if (conf >= 50) return '#facc15'   // Yellow for moderate
    return '#ef4444'                    // Red for low confidence
  }

  return (
    <View style={styles.container}>

      {/* ── Top bar ── */}
      <TopBar title="Analysis Results" showBack={false} showSearch={false} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── Main result card ── */}
        {bortleData ? (
          <View style={styles.resultCard}>

            {/* ── Bortle level badge ── */}
            <View style={[styles.levelBadge, {
              backgroundColor: bortleData.color + '22',
              borderColor:     bortleData.color + '55',
            }]}>
              <View style={[styles.levelDot, { backgroundColor: bortleData.color }]} />
              <Text style={[styles.levelBadgeText, { color: bortleData.color }]}>
                Bortle Level {bortleData.level}
              </Text>
            </View>

            {/* ── Level name ── */}
            <Text style={styles.levelName}>{bortleData.name}</Text>

            {/* ── Description ── */}
            <Text style={styles.levelDesc}>{bortleData.description}</Text>

          </View>
        ) : (
          // Shown if no result came back from the backend
          <View style={styles.resultCard}>
            <Text style={styles.errorText}>
              Could not determine Bortle level. Please try again.
            </Text>
          </View>
        )}

        {/* ── Confidence card ── */}
        {confidence !== null && (
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderIcon}>🤖</Text>
              <Text style={styles.infoHeaderText}>AI Confidence</Text>
            </View>

            <View style={styles.confidenceRow}>

              {/* Confidence percentage */}
              <Text style={[styles.confidenceValue, {
                color: getConfidenceColor(confidence)
              }]}>
                {confidence}%
              </Text>

              {/* Confidence label */}
              <View style={[styles.confidenceLabel, {
                backgroundColor: getConfidenceColor(confidence) + '22',
                borderColor:     getConfidenceColor(confidence) + '55',
              }]}>
                <Text style={[styles.confidenceLabelText, {
                  color: getConfidenceColor(confidence),
                }]}>
                  {getConfidenceLabel(confidence)} Confidence
                </Text>
              </View>

            </View>

            {/* Confidence explanation */}
            <Text style={styles.confidenceDesc}>
              {confidence >= 80
                ? 'All four of our measurements — sky brightness, star count, color, and contrast — agree closely with each other.'
                : confidence >= 50
                ? 'Most of our measurements agree, but one or two came back a bit different — often because of clouds, a bright nearby light, or a long-exposure shot.'
                : 'Our measurements disagreed more than usual. This can happen with tricky lighting conditions — try a photo with less foreground light or a clearer sky if you can.'}
            </Text>

          </View>
        )}

        {/* ── Location card ── */}
        {(latitude || longitude) && (
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderIcon}>📍</Text>
              <Text style={styles.infoHeaderText}>Location</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Latitude</Text>
              <Text style={styles.infoValue}>{formatLat(latitude)}</Text>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Longitude</Text>
              <Text style={styles.infoValue}>{formatLng(longitude)}</Text>
            </View>

          </View>
        )}

        {/* ── What this means card ── */}
        {bortleData && (
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderIcon}>⭐</Text>
              <Text style={styles.infoHeaderText}>Sky Characteristics</Text>
            </View>

            {bortleData.chars.map((char, i) => (
              <View
                key={i}
                style={[
                  styles.charRow,
                  i < bortleData.chars.length - 1 && styles.charRowBorder,
                ]}
              >
                <View style={styles.charBullet} />
                <Text style={styles.charText}>{char}</Text>
              </View>
            ))}

          </View>
        )}

        {/* ── Contribution notice ── */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>🗺️</Text>
          <View style={styles.noticeTextWrap}>
            <Text style={styles.noticeTitle}>Added to the Heat Map</Text>
            <Text style={styles.noticeText}>
              Your observation has been submitted and will appear
              on the NightSky AI light pollution heat map to help
              your community.
            </Text>
          </View>
        </View>

        {/* ── Action buttons ── */}
        <View style={styles.actions}>

          {/* View the map */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('MapHome')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>View Heat Map</Text>
          </TouchableOpacity>

          {/* Upload another photo */}
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation.navigate('Camera')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOutlineText}>Upload Another Photo</Text>
          </TouchableOpacity>

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
    paddingBottom: 40,
  },
  // ── Main result card ──
  resultCard: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 22,
    gap: 14,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  levelName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textBright,
    letterSpacing: 0.3,
  },
  levelDesc: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    padding: 20,
  },
  // ── Info cards ──
  infoCard: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoHeaderIcon: { fontSize: 15 },
  infoHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  // ── Confidence ──
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  confidenceValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  confidenceLabel: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  confidenceLabelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  confidenceDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
    padding: 14,
  },
  // ── Location rows ──
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: colors.accentCyan,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  // ── Characteristics ──
  charRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    padding: 13,
  },
  charRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  charBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentCyan,
    marginTop: 5,
    flexShrink: 0,
  },
  charText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  // ── Notice card ──
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(124,92,191,0.08)',
    borderWidth: 1,
    borderColor: colors.borderBright,
    borderRadius: radius.lg,
    padding: 16,
  },
  noticeIcon: { fontSize: 24 },
  noticeTextWrap: { flex: 1 },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentPurple,
    marginBottom: 6,
  },
  noticeText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  // ── Action buttons ──
  actions: { gap: 10 },
  btnPrimary: {
    backgroundColor: colors.accentViolet,
    borderRadius: radius.md,
    padding: 15,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnOutline: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
})