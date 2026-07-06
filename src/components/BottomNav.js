import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { colors, radius } from '../theme'

export default function BottomNav() {
  const navigation = useNavigation()
  const route = useRoute() // Used to know which screen is currently active

  return (
    <View style={styles.nav}>

      {/* ── Left tab: Sky Map ── */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('MapHome')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabIcon, route.name === 'MapHome' && styles.tabIconActive]}>
          🌙
        </Text>
        <Text style={[styles.tabLabel, route.name === 'MapHome' && styles.tabLabelActive]}>
          Sky Map
        </Text>
      </TouchableOpacity>

      {/* ── Center tab: Camera upload button ── */}
      <TouchableOpacity
        style={styles.centerBtn}
        onPress={() => navigation.navigate('Camera')}
        activeOpacity={0.8}
      >
        <Text style={styles.centerIcon}>📷</Text>
      </TouchableOpacity>

      {/* ── Right tab: Menu ── */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Menu')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabIcon, route.name === 'Menu' && styles.tabIconActive]}>
          ☰
        </Text>
        <Text style={[styles.tabLabel, route.name === 'Menu' && styles.tabLabelActive]}>
          Menu
        </Text>
      </TouchableOpacity>

    </View>
  )
}

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',         // Lay tabs out left to right
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 28,            // Extra padding for iPhone home bar
    paddingTop: 12,
    backgroundColor: 'rgba(6,10,22,0.97)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.4,                 // Dimmed when not active
  },
  tabIconActive: {
    opacity: 1,                   // Full brightness when active
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: colors.accentPurple,   // Purple highlight when active
  },
  // ── Center upload button (circular, glowing purple) ──
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,             // Perfect circle
    backgroundColor: colors.accentViolet,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentViolet,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,                 // Android shadow
  },
  centerIcon: {
    fontSize: 22,
  },
})