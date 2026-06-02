import React, { useState, useEffect } from 'react'
import {
  View, Text, Switch, TouchableOpacity,
  ScrollView, StyleSheet, Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { colors, radius } from '../theme'

// ── AsyncStorage key ─────────────────────────────────────
const PRIVACY_KEY = 'privacyPreferences'

export default function PrivacyScreen() {
  // ── Privacy preference toggles ───────────────────────
  const [gpsSharing, setGpsSharing]       = useState(false)
  const [dataCollection, setDataCollection] = useState(true)
  const [saved, setSaved]                 = useState({ gpsSharing: false, dataCollection: true })
  const [loading, setLoading]             = useState(true)

  // ── Load saved privacy preferences on mount ──────────
  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(PRIVACY_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setGpsSharing(parsed.gpsSharing ?? false)
        setDataCollection(parsed.dataCollection ?? true)
        setSaved(parsed)
      }
    } catch (error) {
      console.log('Error loading privacy preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  // ── Save privacy preferences ─────────────────────────
  const handleSave = async () => {
    try {
      const prefs = { gpsSharing, dataCollection }
      await AsyncStorage.setItem(PRIVACY_KEY, JSON.stringify(prefs))
      setSaved(prefs)
      Alert.alert('Saved', 'Your privacy preferences have been updated.')
    } catch (error) {
      Alert.alert('Error', 'Could not save preferences. Please try again.')
    }
  }

  // ── Cancel changes ───────────────────────────────────
  const handleCancel = () => {
    setGpsSharing(saved.gpsSharing)
    setDataCollection(saved.dataCollection)
  }

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Privacy" showBack={true} showSearch={false} />

      {loading ? (
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* ── Privacy policy placeholder card ── */}
          {/* TODO: Replace the placeholder text with your real privacy policy */}
          <View style={styles.policyCard}>
            <View style={styles.policyHeader}>
              <Text style={styles.policyHeaderIcon}>🔒</Text>
              <Text style={styles.policyHeaderText}>Privacy Policy</Text>
            </View>

            {/* Placeholder notice */}
            <View style={styles.placeholderNotice}>
              <Text style={styles.placeholderIcon}>📝</Text>
              <Text style={styles.placeholderTitle}>Coming Soon</Text>
              <Text style={styles.placeholderText}>
                Our full privacy policy is being drafted by the NightSky AI
                team. It will outline exactly how we collect, store, and use
                your data — including photos, GPS coordinates, and account
                information.{'\n\n'}
                We are committed to protecting your privacy and will never
                sell your personal data to third parties.
              </Text>
            </View>

            {/* Last updated notice */}
            <View style={styles.lastUpdated}>
              <Text style={styles.lastUpdatedText}>
                Last updated: Coming soon
              </Text>
            </View>
          </View>

          {/* ── Data sharing preferences ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your Data Preferences</Text>

            <View style={styles.toggleGroup}>

              {/* GPS sharing toggle */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleIcon}>
                  <Text style={styles.toggleIconText}>📍</Text>
                </View>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Share GPS Location</Text>
                  <Text style={styles.toggleDesc}>
                    Allow NightSky AI to use your location for heat map contributions.
                  </Text>
                </View>
                <Switch
                  value={gpsSharing}
                  onValueChange={setGpsSharing}
                  trackColor={{ false: colors.textDim, true: colors.accentViolet }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.rowDivider} />

              {/* Anonymous data collection toggle */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleIcon}>
                  <Text style={styles.toggleIconText}>📊</Text>
                </View>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Anonymous Data Collection</Text>
                  <Text style={styles.toggleDesc}>
                    Help improve NightSky AI by sharing anonymous usage data.
                  </Text>
                </View>
                <Switch
                  value={dataCollection}
                  onValueChange={setDataCollection}
                  trackColor={{ false: colors.textDim, true: colors.accentViolet }}
                  thumbColor="#fff"
                />
              </View>

            </View>
          </View>

          {/* ── Data rights section ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your Rights</Text>

            <View style={styles.rightsCard}>
              {[
                { icon: '👁️', text: 'You can request a copy of all data we hold about you.' },
                { icon: '✏️', text: 'You can update or correct your personal information at any time.' },
                { icon: '🗑️', text: 'You can delete your account and all associated data from your Profile screen.' },
                { icon: '📧', text: 'For privacy concerns contact us at EXAMPLE@NIGHTSKYAI.COM' },
              ].map(({ icon, text }, i) => (
                <View key={i} style={[
                  styles.rightRow,
                  i < 3 && styles.rightRowBorder,
                ]}>
                  <Text style={styles.rightIcon}>{icon}</Text>
                  <Text style={styles.rightText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Save and Cancel buttons ── */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>Save Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnOutline}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.btnOutlineText}>Cancel Changes</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      )}

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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  scroll: {
    padding: 14,
    gap: 14,
    paddingBottom: 40,
  },
  // ── Policy card ──
  policyCard: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  policyHeaderIcon: { fontSize: 18 },
  policyHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  // Placeholder shown until real policy is written
  placeholderNotice: {
    alignItems: 'center',
    padding: 24,
    gap: 10,
  },
  placeholderIcon: { fontSize: 36 },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textBright,
  },
  placeholderText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 22,
    textAlign: 'center',
  },
  lastUpdated: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  lastUpdatedText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  // ── Sections ──
  section: { gap: 8 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
    paddingLeft: 4,
  },
  // ── Toggle group ──
  toggleGroup: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(124,92,191,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  toggleIconText: { fontSize: 17 },
  toggleInfo: { flex: 1, gap: 3 },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textBright,
  },
  toggleDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  // ── Rights card ──
  rightsCard: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
  },
  rightRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rightIcon: { fontSize: 16 },
  rightText: {
    flex: 1,
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