import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { colors, radius } from '../theme'
import NightSkyLogo from '../components/NightSkyLogo'

// ── Menu items list ──────────────────────────────────────
// Each item has a label, an icon emoji, and a screen name
// to navigate to. If screen is null it means that feature
// isn't built yet and will show a "coming soon" alert.
const MENU_ITEMS = [
  { label: 'Settings',                  icon: '⚙️',  screen: 'Settings' },
  { label: 'Profile',                   icon: '👤', screen: 'Profile' },
  { label: 'Uploaded Images',           icon: '🖼️', screen: 'UploadedImages' },
  { label: 'Saved Locations',           icon: '📍',  screen: 'SavedLocations' },
  { label: 'History',                   icon: '🕑',  screen: null },
  { label: 'View Map',                  icon: '🗺️',  screen: 'MapHome' },
  { label: 'Plan Your Next Stargaze',   icon: '🔭',  screen: null },
  { label: 'What Is The Bortle Scale?', icon: '⭐',  screen: 'BortleScale' },
]

export default function MenuScreen() {
  const navigation = useNavigation()

  // Logs the user out and sends them back to the Login screen
  const handleLogout = () => navigation.navigate('Login')

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Menu" showBack={true} showSearch={true} />

      {/* ── Scrollable list of menu items ── */}
      <ScrollView contentContainerStyle={styles.list}>
        {MENU_ITEMS.map(({ label, icon, screen }) => (
          <TouchableOpacity
            key={label}
            style={styles.item}
            onPress={() =>
              // If the screen exists navigate to it, otherwise show coming soon
              screen
                ? navigation.navigate(screen)
                : alert(label + ' — coming soon!')
            }
            activeOpacity={0.75}
          >
            {/* Icon box on the left */}
            <View style={styles.itemIcon}>
              <Text style={styles.itemIconText}>{icon}</Text>
            </View>

            {/* Menu item label */}
            <Text style={styles.itemLabel}>{label}</Text>

            {/* Arrow on the right */}
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        {/* ── Logo placeholder at the bottom of the list ── */}
        <View style={styles.logoWrap}>
        <NightSkyLogo size={120} />
        </View>

      </ScrollView>

      {/* ── Logout button at the very bottom ── */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

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
  list: {
    padding: 14,
    gap: 7,
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',       // Icon, label, and arrow sit side by side
    alignItems: 'center',
    gap: 14,
    padding: 15,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  itemIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(124,92,191,0.12)', // Subtle purple tint
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIconText: { fontSize: 17 },
  itemLabel: {
    flex: 1,                    // Takes up all space between icon and arrow
    fontSize: 14,
    fontWeight: '600',
    color: colors.textBright,
    letterSpacing: 0.1,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
  },
  // Red logout button fixed at the bottom above the nav bar
  logoutBtn: {
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(220,38,38,0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(220,38,38,0.25)',
  },
  logoutText: {
    color: '#f87171',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  logoWrap: {
  alignItems: 'center',
  marginBottom: 44,
},
})