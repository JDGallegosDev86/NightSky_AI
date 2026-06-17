import { uploadPhoto } from '../services/uploadService'
import React, { useState } from 'react'
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import TopBar from '../components/TopBar'
import { colors, radius } from '../theme'

export default function PhotoReviewScreen() {
  const navigation = useNavigation()
  const route = useRoute()

  // ── Route params ─────────────────────────────────────
  // These are passed in when navigating to this screen.
  // photoUri   — the local file path of the captured photo
  // latitude   — GPS latitude where the photo was taken
  // longitude  — GPS longitude where the photo was taken
  // timestamp  — when the photo was taken
  const {
    photoUri   = null,
    latitude   = null,
    longitude  = null,
    timestamp  = new Date().toISOString(),
  } = route.params || {}

  // Tracks whether the upload is in progress
  const [uploading, setUploading] = useState(false)

  // ── Format coordinates for display ──────────────────
  // Converts decimal coordinates to a readable format
  // e.g. 40.7128 → "40.7128° N"
  const formatCoord = (value, posLabel, negLabel) => {
    if (value === null) return 'Unavailable'
    const direction = value >= 0 ? posLabel : negLabel
    return `${Math.abs(value).toFixed(6)}° ${direction}`
  }

  // ── Format the timestamp for display ────────────────
  // Converts ISO string to a readable date and time
  const formatTimestamp = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      month:  'short',
      day:    'numeric',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    })
  }

  // ── Handle upload confirmation ───────────────────────
  // Called when user taps the Confirm & Upload button.
  // TODO: Replace the placeholder with your real API call
  // to upload the photo and GPS data to your backend.
  const handleConfirm = async () => {
    if (!photoUri) {
  Alert.alert(
    'No Photo Selected',
    'Please take or select a photo before uploading.'
  )
  return
}
    setUploading(true)
    try {
      // ─────────────────────────────────────────────────
      // TODO: Replace this with your real upload logic.
      // Example:
      //   const formData = new FormData()
      //   formData.append('photo', { uri: photoUri, type: 'image/jpeg', name: 'photo.jpg' })
      //   formData.append('latitude', latitude)
      //   formData.append('longitude', longitude)
      //   formData.append('timestamp', timestamp)
      //   await fetch('https://your-api.com/upload', { method: 'POST', body: formData })
      // ─────────────────────────────────────────────────

      // Simulated upload delay for now
      const result = await uploadPhoto(photoUri, latitude, longitude, timestamp)

if (!result.message) {
  throw new Error(result.detail || 'Upload failed')
}

      // Show success message
      Alert.alert(
        'Upload Successful!',
        'Your photo has been submitted. The Bortle Scale AI will analyze it shortly and update the heat map.',
        [
          {
            text: 'View Map',
            onPress: () => navigation.navigate('MapHome'),
          },
        ]
      )
    } catch (error) {
      Alert.alert(
        'Upload Failed',
        'Something went wrong. Please check your connection and try again.',
        [{ text: 'OK' }]
      )
    } finally {
      setUploading(false)
    }
  }

  // ── Handle retake ────────────────────────────────────
  // Goes back to the previous screen so the user can
  // take a new photo
  const handleRetake = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Review Photo" showBack={true} showSearch={false} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── Photo preview ── */}
        <View style={styles.photoCard}>
          {photoUri ? (
            // Show the actual photo if we have a URI
            <Image
              source={{ uri: photoUri }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            // Placeholder shown in development when no photo is passed
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderIcon}>📷</Text>
              <Text style={styles.photoPlaceholderText}>
                Photo preview will appear here
              </Text>
            </View>
          )}
        </View>

        {/* ── GPS Location card ── */}
        <View style={styles.infoCard}>

          {/* Card header */}
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderIcon}>📍</Text>
            <Text style={styles.infoHeaderText}>GPS Location</Text>
          </View>

          {/* Latitude row */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Latitude</Text>
            <Text style={styles.infoValue}>
              {formatCoord(latitude, 'N', 'S')}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.infoDivider} />

          {/* Longitude row */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Longitude</Text>
            <Text style={styles.infoValue}>
              {formatCoord(longitude, 'E', 'W')}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.infoDivider} />

          {/* Timestamp row */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Captured</Text>
            <Text style={styles.infoValue}>{formatTimestamp(timestamp)}</Text>
          </View>

        </View>

        {/* ── Bortle prediction notice ── */}
        {/* Explains to the user that AI analysis happens after upload */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>🤖</Text>
          <View style={styles.noticeTextWrap}>
            <Text style={styles.noticeTitle}>Bortle Scale Analysis</Text>
            <Text style={styles.noticeText}>
              Your Bortle Scale rating will be calculated by our AI after your
              photo is uploaded and analyzed. Results will appear on the heat map.
            </Text>
          </View>
        </View>

        {/* ── Action buttons ── */}
        <View style={styles.actions}>

          {/* Confirm and upload button */}
          <TouchableOpacity
            style={[styles.btnPrimary, uploading && styles.btnDisabled]}
            onPress={handleConfirm}
            disabled={uploading}
            activeOpacity={0.85}
          >
            {uploading ? (
              // Show a spinner while uploading
              <View style={styles.uploadingRow}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.btnPrimaryText}>Uploading...</Text>
              </View>
            ) : (
              <Text style={styles.btnPrimaryText}>Confirm & Upload</Text>
            )}
          </TouchableOpacity>

          {/* Retake button — goes back to camera */}
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={handleRetake}
            disabled={uploading}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOutlineText}>Retake Photo</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
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
  // ── Photo preview card ──
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
  // Placeholder shown when no photo URI is available
  photoPlaceholder: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  photoPlaceholderIcon: { fontSize: 48 },
  photoPlaceholderText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  // ── GPS info card ──
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
  infoHeaderIcon: { fontSize: 16 },
  infoHeaderText: {
    fontSize: 12,
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
  // ── Bortle notice card ──
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
  actions: {
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: colors.accentViolet,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
  },
  // Dimmed style when the upload is in progress
  btnDisabled: {
    opacity: 0.6,
  },
  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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