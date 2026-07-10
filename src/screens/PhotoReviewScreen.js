import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as Location from 'expo-location'
import TopBar from '../components/TopBar'
import { colors, radius } from '../theme'
import { uploadPhoto } from '../services/uploadService'

export default function PhotoReviewScreen() {
  const navigation = useNavigation()
  const route = useRoute()

  // ── Route params ─────────────────────────────────────
  // photoUri and timestamp passed in from camera feature
  const {
    photoUri = null,
    timestamp = new Date().toISOString(),
  } = route.params || {}

  // ── GPS state ────────────────────────────────────────
  // Stores the real GPS coordinates fetched from the device
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  // Tracks whether we are currently fetching GPS coordinates
  const [fetchingGps, setFetchingGps] = useState(true)

  // Tracks GPS permission status
  const [gpsPermission, setGpsPermission] = useState(null)

  // ── Public sharing toggle ────────────────────────────
  // Controls whether the GPS location is shared publicly
  // with other users on the heat map
  const [sharePublicly, setSharePublicly] = useState(true)

  // ── Upload state ─────────────────────────────────────
  const [uploading, setUploading] = useState(false)

  // ── Fetch GPS coordinates on screen load ─────────────
  // Automatically gets the device's current location
  // when the screen first appears.
  useEffect(() => {
    fetchLocation()
  }, [])

  const fetchLocation = async () => {
    setFetchingGps(true)

    try {
      // Check if we already have permission
      const {
        status: existingStatus,
      } = await Location.getForegroundPermissionsAsync()

      let finalStatus = existingStatus

      // If not granted yet, request it now
      if (existingStatus !== 'granted') {
        const {
          status,
        } = await Location.requestForegroundPermissionsAsync()

        finalStatus = status
      }

      setGpsPermission(finalStatus)

      if (finalStatus !== 'granted') {
        // Permission denied — can still upload without GPS
        Alert.alert(
          'Location Access Denied',
          'Your photo will be uploaded without GPS coordinates. You can enable location access in your device settings.'
        )
        return
      }

      // Permission granted — get current position
      // accuracy: Balanced gives a good mix of speed and precision
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude)
    } catch (error) {
      console.log('Error fetching location:', error)

      Alert.alert(
        'Location Error',
        'Could not get your GPS coordinates. Your photo can still be uploaded without location data.'
      )
    } finally {
      setFetchingGps(false)
    }
  }

  // ── Format coordinates for display ──────────────────
  const formatLat = (lat) => {
    if (lat === null) {
      return 'Unavailable'
    }

    return `${Math.abs(lat).toFixed(6)}° ${lat >= 0 ? 'N' : 'S'}`
  }

  const formatLng = (lng) => {
    if (lng === null) {
      return 'Unavailable'
    }

    return `${Math.abs(lng).toFixed(6)}° ${lng >= 0 ? 'E' : 'W'}`
  }

  // ── Format timestamp for display ────────────────────
  const formatTimestamp = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // ── Handle upload confirmation ──────────────────────
  const handleConfirm = async () => {
    if (!photoUri) {
      Alert.alert(
        'No Photo Selected',
        'Please capture or select a photo before uploading.'
      )
      return
    }

    setUploading(true)

    try {
      // uploadPhoto handles FormData, the JWT token,
      // platform differences, and the backend request.
      const data = await uploadPhoto(
        photoUri,
        latitude,
        longitude,
        timestamp,
        sharePublicly
      )

      // Navigate to results screen with the analysis data
      navigation.navigate('Results', {
        bortleLevel: data.bortle_level,
        confidence: data.confidence,
        sqmEstimate: data.sqm_estimate,
        analysis: data.analysis,
        pipeline: data.pipeline,
        uploadId: data.upload_id,
        photoUri,
        latitude,
        longitude,
        timestamp,
        sharePublicly,
      })
    } catch (error) {
      console.log('Upload error:', error)

      Alert.alert(
        'Upload Failed',
        error.message || 'The photo could not be uploaded.',
        [{ text: 'OK' }]
      )
    } finally {
      setUploading(false)
    }
  }

  // ── Return to the camera screen ─────────────────────
  const handleRetake = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      {/* ── Top bar ── */}
      <TopBar
        title="Review Photo"
        showBack={true}
        showSearch={false}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ── Photo preview ── */}
        <View style={styles.photoCard}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
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
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderIcon}>📍</Text>

            <Text style={styles.infoHeaderText}>
              GPS Location
            </Text>

            {/* Show a spinner while GPS is being fetched */}
            {fetchingGps && (
              <ActivityIndicator
                size="small"
                color={colors.accentCyan}
                style={styles.gpsSpinner}
              />
            )}
          </View>

          {/* Latitude */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Latitude</Text>

            <Text style={styles.infoValue}>
              {fetchingGps
                ? 'Fetching...'
                : formatLat(latitude)}
            </Text>
          </View>

          <View style={styles.infoDivider} />

          {/* Longitude */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Longitude</Text>

            <Text style={styles.infoValue}>
              {fetchingGps
                ? 'Fetching...'
                : formatLng(longitude)}
            </Text>
          </View>

          <View style={styles.infoDivider} />

          {/* Timestamp */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Captured</Text>

            <Text style={styles.infoValue}>
              {formatTimestamp(timestamp)}
            </Text>
          </View>
        </View>

        {/* ── Public GPS sharing toggle ── */}
        {/* Lets the user decide if their location is visible
            to other users on the community heat map */}
        <View style={styles.shareCard}>
          <View style={styles.shareTextWrap}>
            <Text style={styles.shareTitle}>
              Share Location Publicly
            </Text>

            <Text style={styles.shareDesc}>
              Allow your GPS coordinates to appear on the community
              heat map so other users can see observations in your area.
            </Text>
          </View>

          <Switch
            value={sharePublicly}
            onValueChange={setSharePublicly}
            trackColor={{
              false: colors.textDim,
              true: colors.accentViolet,
            }}
            thumbColor="#fff"
          />
        </View>

        {/* ── Bortle notice ── */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>🤖</Text>

          <View style={styles.noticeTextWrap}>
            <Text style={styles.noticeTitle}>
              Bortle Scale Analysis
            </Text>

            <Text style={styles.noticeText}>
              Your Bortle Scale rating will be calculated by our AI
              after your photo is uploaded and analyzed. Results will
              appear on the heat map.
            </Text>
          </View>
        </View>

        {/* ── Action buttons ── */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.btnPrimary,
              uploading && styles.btnDisabled,
            ]}
            onPress={handleConfirm}
            disabled={uploading}
            activeOpacity={0.85}
          >
            {uploading ? (
              <View style={styles.uploadingRow}>
                <ActivityIndicator
                  color="#fff"
                  size="small"
                />

                <Text style={styles.btnPrimaryText}>
                  Uploading...
                </Text>
              </View>
            ) : (
              <Text style={styles.btnPrimaryText}>
                Confirm & Upload
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOutline}
            onPress={handleRetake}
            disabled={uploading}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOutlineText}>
              Retake Photo
            </Text>
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
  photoPlaceholderIcon: {
    fontSize: 48,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // ── Info card ──
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
  infoHeaderIcon: {
    fontSize: 16,
  },
  infoHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  gpsSpinner: {
    marginLeft: 'auto',
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

  // ── Public sharing toggle card ──
  shareCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  shareTextWrap: {
    flex: 1,
  },
  shareTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textBright,
    marginBottom: 6,
  },
  shareDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
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
  noticeIcon: {
    fontSize: 24,
  },
  noticeTextWrap: {
    flex: 1,
  },
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