import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView,
  Switch, StyleSheet, Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { colors, radius } from '../theme'

// ── Section buttons ──────────────────────────────────────
// Each button navigates to its own sub-settings screen.
// The screen property tells us where to navigate.
// null means that screen is not built yet.
const SECTION_BTNS = [
  { label: 'Account',          screen: 'Profile' },
  { label: 'Notifications',    screen: 'Notifications' },
  { label: 'Privacy',    screen: 'Privacy' },
  { label: 'Display Options',  screen: null },
]

// ── Toggle settings ──────────────────────────────────────
// Quick on/off switches for common app preferences.
// Each has a unique id used to track its on/off state.
const TOGGLES = [
  { id: 'nasa', label: 'Show NASA Satellite Layer' },
  { id: 'gps',  label: 'High Accuracy GPS' },
  { id: 'auto', label: 'Auto-Submit Observations' },
]

export default function SettingsScreen() {
  const navigation = useNavigation()

  // Tracks the current on/off state of each toggle
  const [toggles, setToggles] = useState({
    nasa: true,
    gps:  false,
    auto: false,
  })

  // Keeps a copy of the last saved state so Cancel can revert
  const [saved, setSaved] = useState({ ...toggles })

  // ── Flip a single toggle ─────────────────────────────
  const flip = (id) => setToggles((prev) => ({ ...prev, [id]: !prev[id] }))

  // ── Apply — saves current toggle states ─────────────
  const apply = () => {
    setSaved({ ...toggles })
    Alert.alert('Saved', 'Your settings have been applied.')
  }

  // ── Cancel — reverts to last saved state ─────────────
  const cancel = () => setToggles({ ...saved })

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Settings" showBack={true} showSearch={true} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── Gear icon header ── */}
        <View style={styles.gearWrap}>
          <View style={styles.gearCircle}>
            <Text style={styles.gearIcon}>⚙️</Text>
          </View>
        </View>

        {/* ── Section buttons ── */}
        {/* Each button navigates to its own sub-screen */}
        {SECTION_BTNS.map(({ label, screen }) => (
          <TouchableOpacity
            key={label}
            style={styles.sectionBtn}
            activeOpacity={0.75}
            onPress={() => {
              if (screen) {
                // Navigate to the screen if it exists
                navigation.navigate(screen)
              } else {
                // Show coming soon if screen not built yet
                alert(label + ' — coming soon!')
              }
            }}
          >
            <Text style={styles.sectionBtnText}>{label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        {/* ── Toggle switches group ── */}
        {/* Quick access toggles for common preferences */}
        <View style={styles.toggleGroup}>
          {TOGGLES.map(({ id, label }, i) => (
            <View
              key={id}
              style={[
                styles.toggleRow,
                // Add a bottom border between rows but not after the last one
                i < TOGGLES.length - 1 && styles.toggleRowBorder,
              ]}
            >
              <Text style={styles.toggleLabel}>{label}</Text>
              <Switch
                value={toggles[id]}
                onValueChange={() => flip(id)}
                trackColor={{ false: colors.textDim, true: colors.accentViolet }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        {/* ── Apply and Cancel buttons ── */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={apply}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Apply</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOutline}
            onPress={cancel}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOutlineText}>Cancel Changes</Text>
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
    paddingBottom: 32,
  },
  // Centered gear icon at the top of the screen
  gearWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gearCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.borderBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearIcon: { fontSize: 28 },
  // Section buttons navigate to sub-screens
  sectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: 8,
  },
  sectionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textBright,
    letterSpacing: 0.3,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
  },
  // The toggle group is a single card with all toggles inside
  toggleGroup: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  // Thin line between toggle rows
  toggleRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  actions: {
    gap: 10,
    marginTop: 24,
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
