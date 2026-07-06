import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import TopBar from '../components/TopBar'
import { colors, radius } from '../theme'

export default function CameraScreen() {
  const navigation = useNavigation()

  // Tracks whether we are waiting for the camera or library to open
  const [loading, setLoading] = useState(false)

  // ── Request camera permission and open camera ────────
  // Called when the user taps "Take a Photo"
  const handleTakePhoto = async () => {
    setLoading(true)
    try {
      // Request camera permission from the device
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert(
          'Camera Access Denied',
          'Please enable camera access in your device settings to take night sky photos.'
        )
        return
      }

      // Open the camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,  // Don't crop — we need the full sky
        quality: 1.0,          // Maximum quality for accurate analysis
      })

      if (!result.canceled && result.assets.length > 0) {
        // Photo taken — navigate to review screen with the photo URI
        navigation.navigate('PhotoReview', {
          photoUri:  result.assets[0].uri,
          timestamp: new Date().toISOString(),
        })
      }

    } catch (error) {
      console.log('Camera error:', error)
      Alert.alert('Camera Error', 'Could not open the camera. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Request library permission and open photo picker ─
  // Called when the user taps "Upload from Library"
  const handleChooseFromLibrary = async () => {
    setLoading(true)
    try {
      // Request photo library permission from the device
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert(
          'Photo Library Access Denied',
          'Please enable photo library access in your device settings to upload existing photos.'
        )
        return
      }

      // Open the photo library picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,  // Don't crop — we need the full image
        quality: 1.0,          // Maximum quality for accurate analysis
      })

      if (!result.canceled && result.assets.length > 0) {
        // Photo selected — navigate to review screen with the photo URI
        navigation.navigate('PhotoReview', {
          photoUri:  result.assets[0].uri,
          timestamp: new Date().toISOString(),
        })
      }

    } catch (error) {
      console.log('Library error:', error)
      Alert.alert('Library Error', 'Could not open your photo library. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Add Photo" showBack={true} showSearch={false} />

      <View style={styles.content}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📷</Text>
          <Text style={styles.headerTitle}>Capture the Night Sky</Text>
          <Text style={styles.headerDesc}>
            Take a new photo or upload an existing one from your
            library. Your photo will be analyzed by our AI to
            determine the Bortle Scale rating for that location.
          </Text>
        </View>

        {/* ── Option buttons ── */}
        <View style={styles.options}>

          {/* ── Take a new photo ── */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleTakePhoto}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.optionIconWrap}>
              <Text style={styles.optionIcon}>📸</Text>
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Take a Photo</Text>
              <Text style={styles.optionDesc}>
                Open your camera and capture the night sky right now.
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* ── Upload from library ── */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleChooseFromLibrary}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.optionIconWrap}>
              <Text style={styles.optionIcon}>🖼️</Text>
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Upload from Library</Text>
              <Text style={styles.optionDesc}>
                Choose an existing night sky photo from your device.
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

        </View>

        {/* ── Loading indicator ── */}
        {/* Shown while waiting for camera or library to open */}
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.accentViolet} />
            <Text style={styles.loadingText}>Opening...</Text>
          </View>
        )}

        {/* ── Tips card ── */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>📡 Tips for Best Results</Text>
          <View style={styles.tipsList}>
            {[
              'Take photos at least 30 minutes after sunset',
              'Point your camera straight up at the sky',
              'Try to avoid taking pictures on nights with the moon, or avoid pointing at the moon and other bright lights',
              'Use a longer exposure if your camera supports it',
              'Move away from street lights if possible',
              'Avoid downloading a photo online then reuploading it',
            ].map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

      </View>
    </View>
  )
}

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDark,
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 16,
    overflow: 'scroll',
  },
  // ── Header ──
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  headerIcon: {
    fontSize: 52,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textBright,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerDesc: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  // ── Option cards ──
  options: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  optionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: 'rgba(124,92,191,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionIcon: { fontSize: 26 },
  optionInfo: { flex: 1 },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textBright,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  optionArrow: {
    fontSize: 24,
    color: colors.textMuted,
  },
  // ── Loading ──
  loadingWrap: {
    alignItems: 'center',
    gap: 10,
    padding: 20,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  // ── Tips card ──
  tipsCard: {
    backgroundColor: 'rgba(124,92,191,0.08)',
    borderWidth: 1,
    borderColor: colors.borderBright,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentPurple,
  },
  tipsList: { gap: 8 },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentCyan,
    marginTop: 5,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
})