import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView,
  Switch, StyleSheet, Alert,
} from 'react-native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { colors, radius } from '../theme'

// ── Section buttons ──────────────────────────────────────
// These are the main category buttons at the top of settings.
// Each one will eventually navigate to its own sub-screen.
const SECTION_BTNS = [
  'Account',
  'Notifications',
  'Privacy (GPS)',
  'Display Options',
]

// ── Toggle settings ──────────────────────────────────────
// These are the on/off switches below the section buttons.
// Each has a unique id used to track its on/off state.
const TOGGLES = [
  { id: 'nasa', label: 'Show NASA Satellite Layer' },
  { id: 'gps',  label: 'High Accuracy GPS' },
  { id: 'auto', label: 'Auto-Submit Observations' },
]

export default function SettingsScreen() {
  // Tracks the current on/off state of each toggle
  const [toggles, setToggles] = useState({ nasa: true, gps: false, auto: false })

  // Keeps a copy of the last saved state so Cancel can revert changes
  const [saved, setSaved] = useState({ ...toggles })

  // Flips a single toggle between true and false
  const flip = (id) => setToggles((prev) => ({ ...prev, [id]: !prev[id] }))

  // Saves the current toggle states and shows a confirmation
  const apply = () => {
    setSaved({ ...toggles })
    Alert.alert('Saved', 'Your settings have been applied.')
  }

  // Reverts all toggles back to the last saved state
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
        {/* Each button will eventually open a sub-settings screen */}
        {SECTION_BTNS.map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.sectionBtn}
            activeOpacity={0.75}
            onPress={() => alert(label + ' — coming soon!')}
          >
            <Text style={styles.sectionBtnText}>{label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        {/* ── Toggle switches group ── */}
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
    flex: 1,                    // Takes up space to the left of the switch
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