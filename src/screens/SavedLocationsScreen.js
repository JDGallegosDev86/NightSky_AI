import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { colors, radius } from '../theme'

// ── AsyncStorage key ─────────────────────────────────────
// This is the key used to store and retrieve saved locations.
// Keeping it as a constant avoids typos across files.
export const SAVED_LOCATIONS_KEY = 'savedLocations'

export default function SavedLocationsScreen() {
  // Holds the list of saved locations loaded from AsyncStorage
  const [locations, setLocations] = useState([])

  // Tracks whether we are still loading data from storage
  const [loading, setLoading] = useState(true)

  // ── Load saved locations on screen mount ─────────────
  // useEffect runs once when the screen first loads.
  // It reads the saved locations from AsyncStorage.
  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      const stored = await AsyncStorage.getItem(SAVED_LOCATIONS_KEY)
      if (stored) {
        // Parse the JSON string back into an array
        setLocations(JSON.parse(stored))
      }
    } catch (error) {
      console.log('Error loading saved locations:', error)
    } finally {
      setLoading(false)
    }
  }

  // ── Remove a location ────────────────────────────────
  // Shows a confirmation alert before deleting.
  // Filters out the location by its id and saves the
  // updated list back to AsyncStorage.
  const handleRemove = (id) => {
    Alert.alert(
      'Remove Location',
      'Are you sure you want to remove this saved location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              // Filter out the location with the matching id
              const updated = locations.filter((loc) => loc.id !== id)
              setLocations(updated)
              // Save the updated list back to AsyncStorage
              await AsyncStorage.setItem(
                SAVED_LOCATIONS_KEY,
                JSON.stringify(updated)
              )
            } catch (error) {
              console.log('Error removing location:', error)
            }
          },
        },
      ]
    )
  }

  // ── Format the saved date for display ────────────────
  // Converts an ISO date string to a readable format
  // e.g. "2026-04-15T10:30:00.000Z" → "Apr 15, 2026"
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Saved Locations" showBack={true} showSearch={true} />

      {loading ? (
        // ── Loading state ──
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>

      ) : locations.length === 0 ? (
        // ── Empty state — shown when no locations are saved ──
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyTitle}>No Saved Locations</Text>
          <Text style={styles.emptyText}>
            Tap the star icon on the map to save your favorite dark sky spots.
          </Text>
        </View>

      ) : (
        // ── Location list ──
        <ScrollView contentContainerStyle={styles.list}>
          {locations.map((loc) => (
            <View key={loc.id} style={styles.locationCard}>

              {/* ── Left side: icon and location info ── */}
              <View style={styles.locationLeft}>
                <View style={styles.locationIcon}>
                  <Text style={styles.locationIconText}>📍</Text>
                </View>
                <View style={styles.locationInfo}>
                  {/* Location name */}
                  <Text style={styles.locationName}>{loc.name}</Text>
                  {/* GPS coordinates */}
                  <Text style={styles.locationCoords}>
                    {loc.latitude.toFixed(4)}°, {loc.longitude.toFixed(4)}°
                  </Text>
                  {/* Date it was saved */}
                  <Text style={styles.locationDate}>
                    Saved {formatDate(loc.savedAt)}
                  </Text>
                </View>
              </View>

              {/* ── Right side: remove button ── */}
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(loc.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>

            </View>
          ))}
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
  // Used for both loading and empty states
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textBright,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    padding: 14,
    gap: 10,
    paddingBottom: 24,
  },
  // Each saved location is a card with info on the left and remove on the right
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    gap: 12,
  },
  locationLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(124,92,191,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIconText: { fontSize: 18 },
  locationInfo: { flex: 1 },
  locationName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textBright,
    marginBottom: 3,
  },
  locationCoords: {
    fontSize: 12,
    color: colors.accentCyan,
    fontWeight: '500',
    marginBottom: 2,
  },
  locationDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  // Small X button to remove the location
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(220,38,38,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
})