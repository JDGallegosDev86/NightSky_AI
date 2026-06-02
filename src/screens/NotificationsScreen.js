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
// Used to save and load notification preferences
const NOTIFICATIONS_KEY = 'notificationPreferences'

// ── Notification toggle definitions ─────────────────────
// Each toggle has an id, label, and description.
// The id matches the key in the preferences state object.
const NOTIFICATION_TOGGLES = [
  {
    id: 'pushEnabled',
    label: 'Push Notifications',
    description: 'Master switch for all push notifications on your device.',
    icon: '🔔',
  },
  {
    id: 'emailAlerts',
    label: 'Email Alerts',
    description: 'Receive important alerts and updates via email.',
    icon: '📧',
  },
  {
    id: 'weeklySummary',
    label: 'Weekly Email Summary',
    description: 'Get a weekly digest of light pollution activity in your area.',
    icon: '📊',
  },
  {
    id: 'nearbyObservations',
    label: 'New Nearby Observations',
    description: 'Get notified when other users upload photos near your location.',
    icon: '📍',
  },
]

export default function NotificationsScreen() {
  // Tracks the on/off state of each notification toggle
  const [preferences, setPreferences] = useState({
    pushEnabled:        true,
    emailAlerts:        false,
    weeklySummary:      false,
    nearbyObservations: false,
  })

  // Keeps a copy of the last saved state so Cancel can revert
  const [saved, setSaved] = useState({ ...preferences })

  // Tracks whether we are still loading from AsyncStorage
  const [loading, setLoading] = useState(true)

  // ── Load saved preferences on screen mount ───────────
  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setPreferences(parsed)
        setSaved(parsed)
      }
    } catch (error) {
      console.log('Error loading notification preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  // ── Flip a single toggle ─────────────────────────────
  // If push notifications are turned off, all other
  // toggles are disabled since they depend on push being on.
  const flip = (id) => {
    setPreferences((prev) => {
      const updated = { ...prev, [id]: !prev[id] }

      // If turning off push notifications, disable all others too
      if (id === 'pushEnabled' && !updated.pushEnabled) {
        updated.emailAlerts        = false
        updated.weeklySummary      = false
        updated.nearbyObservations = false
      }

      return updated
    })
  }

  // ── Save preferences ─────────────────────────────────
  const handleSave = async () => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(preferences))
      setSaved({ ...preferences })
      Alert.alert('Saved', 'Your notification preferences have been updated.')
    } catch (error) {
      Alert.alert('Error', 'Could not save preferences. Please try again.')
    }
  }

  // ── Cancel changes ───────────────────────────────────
  // Reverts all toggles back to the last saved state
  const handleCancel = () => {
    setPreferences({ ...saved })
  }

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Notifications" showBack={true} showSearch={false} />

      {loading ? (
        // ── Loading state ──
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* ── Info banner ── */}
          {/* Explains what this screen does */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerIcon}>🔔</Text>
            <Text style={styles.infoBannerText}>
              Control how and when NightSky AI contacts you.
              Turning off push notifications will disable all
              device alerts.
            </Text>
          </View>

          {/* ── Notification toggles ── */}
          <View style={styles.toggleGroup}>
            {NOTIFICATION_TOGGLES.map(({ id, label, description, icon }, i) => {

              // All toggles except the master switch are disabled
              // if push notifications are turned off
              const isDisabled = id !== 'pushEnabled' && !preferences.pushEnabled

              return (
                <View key={id}>
                  <View style={[
                    styles.toggleRow,
                    isDisabled && styles.toggleRowDisabled,
                  ]}>

                    {/* Left side: icon and text */}
                    <View style={styles.toggleIcon}>
                      <Text style={styles.toggleIconText}>{icon}</Text>
                    </View>

                    <View style={styles.toggleInfo}>
                      <Text style={[
                        styles.toggleLabel,
                        isDisabled && styles.toggleLabelDisabled,
                      ]}>
                        {label}
                      </Text>
                      <Text style={styles.toggleDesc}>{description}</Text>
                    </View>

                    {/* Right side: switch */}
                    <Switch
                      value={preferences[id]}
                      onValueChange={() => flip(id)}
                      disabled={isDisabled}
                      trackColor={{ false: colors.textDim, true: colors.accentViolet }}
                      thumbColor="#fff"
                    />

                  </View>

                  {/* Divider between rows except after the last one */}
                  {i < NOTIFICATION_TOGGLES.length - 1 && (
                    <View style={styles.rowDivider} />
                  )}
                </View>
              )
            })}
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
  // ── Info banner at the top ──
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(124,92,191,0.08)',
    borderWidth: 1,
    borderColor: colors.borderBright,
    borderRadius: radius.md,
    padding: 14,
  },
  infoBannerIcon: { fontSize: 20 },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  // ── Toggle group card ──
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
  // Dimmed appearance when a toggle is disabled
  toggleRowDisabled: {
    opacity: 0.4,
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
  toggleInfo: {
    flex: 1,
    gap: 3,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textBright,
  },
  toggleLabelDisabled: {
    color: colors.textMuted,
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
  // ── Action buttons ──
  actions: {
    gap: 10,
  },
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