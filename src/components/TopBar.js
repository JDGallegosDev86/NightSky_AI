import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, radius } from '../theme'

export default function TopBar({ title, showBack = false, showSearch = true }) {
  const navigation = useNavigation()

  return (
    <View style={styles.bar}>

      {/* ── Left side: back button or empty space ── */}
      {showBack ? (
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      {/* ── Center: screen title ── */}
      {title ? <Text style={styles.title}>{title}</Text> : <View style={{ flex: 1 }} />}

      {/* ── Right side: search button or empty space ── */}
      {showSearch ? (
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.iconText}>⌕</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

    </View>
  )
}

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',       // Lay items out left to right
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 58,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(8,13,27,0.97)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textBright,
    letterSpacing: 0.3,
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
  iconText: {
    color: colors.textPrimary,
    fontSize: 17,
  },
  // Empty placeholder to keep the title centered when a button is hidden
  spacer: { width: 36 },
})