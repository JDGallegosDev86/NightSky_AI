import React, { useState } from 'react'
import {
  View, Text, Image, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Platform,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { BORTLE_LEVELS } from '../data/bortleData'
import { deleteUpload } from '../services/uploadService'
import { colors, radius } from '../theme'

export default function ImageDetailScreen() {
  const navigation = useNavigation()
  const route      = useRoute()

  // Tracks whether a delete request is currently in flight,
  // so we can disable the button and avoid a double-tap double-delete.
  const [deleting, setDeleting] = useState(false)

  // ── Image data passed from UploadedImagesScreen ──────
  const { image } = route.params || {}

  // Safety check — if no image data was passed show an error
  if (!image) {
    return (
      <View style={styles.container}>
        <TopBar title="Image Detail" showBack={true} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Image not found.</Text>
        </View>
        <BottomNav />
      </View>
    )
  }

  // ── Get the Bortle level data for this image ─────────
  // Used to show the correct color and name for the rating
  const bortleData = BORTLE_LEVELS.find((b) => b.level === image.bortle)

  // ── Format coordinates for display ──────────────────
  const formatLat = (lat) => {
    if (lat === null || lat === undefined) return 'Unavailable'
    return `${Math.abs(lat).toFixed(6)}° ${lat >= 0 ? 'N' : 'S'}`
  }

  const formatLng = (lng) => {
    if (lng === null || lng === undefined) return 'Unavailable'
    return `${Math.abs(lng).toFixed(6)}° ${lng >= 0 ? 'E' : 'W'}`
  }

  // ── Format timestamp for display ────────────────────
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      month:   'long',
      day:     'numeric',
      year:    'numeric',
      hour:    '2-digit',
      minute:  '2-digit',
    })
  }

  // ── Handle image deletion ────────────────────────────
  // Shows a confirmation prompt, then calls the backend to delete
  // both the file on disk and the database row. Navigates back
  // to the gallery on success, which auto-refreshes via its
  // existing useFocusEffect fetch.
  //
  // React Native's Alert.alert() has no real implementation on
  // web (react-native-web), so it silently does nothing there.
  // We branch by platform: window.confirm on web, Alert.alert
  // on native (iOS/Android).
  const handleDelete = () => {
    const confirmMessage =
      'Are you sure you want to delete this uploaded image? This cannot be undone.'

    const runDelete = async () => {
      setDeleting(true)
      try {
        await deleteUpload(image.id)
        navigation.goBack()
      } catch (error) {
        console.log('Delete failed:', error)
        Alert.alert(
          'Delete Failed',
          error.message || 'Could not delete this image. Please try again.'
        )
        setDeleting(false)
      }
    }

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        runDelete()
      }
    } else {
      Alert.alert(
        'Delete Image',
        confirmMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: runDelete },
        ]
      )
    }
  }

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Image Detail" showBack={true} showSearch={false} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── Photo preview ── */}
        <View style={styles.photoCard}>
          {image.imageUri ? (
            // Show real photo when URI is available
            <Image
              source={{ uri: image.imageUri }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            // Placeholder until real photo is loaded
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderIcon}>🌌</Text>
              <Text style={styles.photoPlaceholderText}>
                {image.title || 'Uploaded Image'}
              </Text>
            </View>
          )}
        </View>

        {/* ── Bortle Scale rating card ── */}
        {bortleData && (
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderIcon}>⭐</Text>
              <Text style={styles.infoHeaderText}>Bortle Scale Rating</Text>
            </View>

            {/* Colored badge showing the Bortle level */}
            <View style={styles.bortleBadgeRow}>
              <View style={[styles.bortleBadge, {
                backgroundColor: bortleData.color + '22',
                borderColor:     bortleData.color + '55',
              }]}>
                {/* Colored dot */}
                <View style={[styles.bortleDot, { backgroundColor: bortleData.color }]} />
                <Text style={[styles.bortleBadgeText, { color: bortleData.color }]}>
                  Level {bortleData.level} — {bortleData.name}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Location info card ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderIcon}>📍</Text>
            <Text style={styles.infoHeaderText}>Location Info</Text>
          </View>

          {/* Approximate location name */}
          {/* TODO: Use a reverse geocoding API to get real city/state name */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>
              {image.locationName || 'Reverse geocoding coming soon'}
            </Text>
          </View>

          <View style={styles.infoDivider} />

          {/* Latitude */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Latitude</Text>
            <Text style={styles.infoValue}>{formatLat(image.latitude)}</Text>
          </View>

          <View style={styles.infoDivider} />

          {/* Longitude */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Longitude</Text>
            <Text style={styles.infoValue}>{formatLng(image.longitude)}</Text>
          </View>

          <View style={styles.infoDivider} />

          {/* Timestamp */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Captured</Text>
            <Text style={styles.infoValue}>{formatDate(image.timestamp)}</Text>
          </View>

        </View>

        {/* ── Additional details card ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderIcon}>📊</Text>
            <Text style={styles.infoHeaderText}>Observation Details</Text>
          </View>

          {/* Analysis status */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>AI Analysis</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {image.bortle ? '✓ Complete' : '⏳ Pending'}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          {/* Contribution status */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Heat Map</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {image.bortle ? '✓ Plotted' : '⏳ Pending'}
              </Text>
            </View>
          </View>

        </View>

        {/* ── Delete button ── */}
        <TouchableOpacity
          style={[styles.btnDanger, deleting && styles.btnDangerDisabled]}
          onPress={handleDelete}
          activeOpacity={0.8}
          disabled={deleting}
        >
          <Text style={styles.btnDangerText}>
            {deleting ? 'Deleting...' : 'Delete Image'}
          </Text>
        </TouchableOpacity>

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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  scroll: {
    padding: 14,
    gap: 14,
    paddingBottom: 40,
  },
  // ── Photo card ──
  photoCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.spaceCard,
  },
  photo: {
    width: '100%',
    height: 280,
  },
  photoPlaceholder: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  photoPlaceholderIcon: { fontSize: 56 },
  photoPlaceholderText: {
    fontSize: 14,
    color: colors.textMuted,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 12,
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
    textAlign: 'right',
    flex: 1,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  // ── Bortle badge ──
  bortleBadgeRow: {
    padding: 14,
  },
  bortleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  bortleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bortleBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  // ── Status badge ──
  statusBadge: {
    backgroundColor: 'rgba(45,212,200,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(45,212,200,0.3)',
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: colors.accentCyan,
    fontWeight: '600',
  },
  // ── Delete button ──
  btnDanger: {
    backgroundColor: 'rgba(220,38,38,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.25)',
    borderRadius: radius.md,
    padding: 15,
    alignItems: 'center',
  },
  btnDangerDisabled: {
    opacity: 0.5,
  },
  btnDangerText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
})