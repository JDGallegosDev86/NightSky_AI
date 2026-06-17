import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Switch, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NightSkyLogo from '../components/NightSkyLogo'
import { colors, radius } from '../theme'

export default function RegisterScreen() {
  const navigation = useNavigation()

  // Track what the user types into each field
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  // Tracks whether the user agreed to share their GPS location
  const [gpsConsent, setGpsConsent]   = useState(false)

  // Tracks whether GPS permission was actually granted by the device
  const [gpsGranted, setGpsGranted]   = useState(false)

  // ── Handle GPS consent toggle ────────────────────────
  // When the user turns on the GPS toggle, we immediately
  // request location permission from the device.
  // If they deny it, we turn the toggle back off.
  const handleGpsToggle = async () => {
    if (gpsConsent) {
      // User is turning GPS OFF — just update the toggle
      setGpsConsent(false)
      setGpsGranted(false)
      return
    }

    // User is turning GPS ON — request device permission
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status === 'granted') {
        // Permission granted — turn toggle on
        setGpsConsent(true)
        setGpsGranted(true)
        Alert.alert(
          'Location Access Granted',
          'NightSky AI can now use your GPS location for photo uploads and heat map contributions.'
        )
      } else {
        // Permission denied — keep toggle off and explain why
        setGpsConsent(false)
        setGpsGranted(false)
        Alert.alert(
          'Location Access Denied',
          'You can enable location access later in your device settings or from the Privacy screen in the app.'
        )
      }
    } catch (error) {
      console.log('Error requesting location permission:', error)
      setGpsConsent(false)
    }
  }

  // ── Check if onboarding should be shown ─────────────
  // New users always see onboarding after registering.
  const handleContinue = async () => {
    try {
      // TEMPORARY: forces onboarding to show every time for testing
      // Remove this line when done testing
      await AsyncStorage.removeItem('lastOnboardingDate')

      const lastDate = await AsyncStorage.getItem('lastOnboardingDate')

      if (!lastDate) {
        navigation.navigate('Onboarding')
        return
      }

      const daysSince = (new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24)

      if (daysSince >= 60) {
        navigation.navigate('Onboarding')
      } else {
        navigation.navigate('MapHome')
      }
    } catch (error) {
      navigation.navigate('MapHome')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Logo ── */}
        <View style={styles.logoWrap}>
          <NightSkyLogo size={120} />
        </View>

        {/* ── Section label ── */}
        <Text style={styles.sectionLabel}>Register</Text>

        {/* ── Input fields ── */}
        <View style={styles.fields}>
          <TextInput
            style={styles.input}
            placeholder="email@domain.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.textMuted}
            value={confirmPass}
            onChangeText={setConfirmPass}
            secureTextEntry
          />
        </View>

        {/* ── GPS consent toggle ── */}
        {/* Tapping this triggers a real device permission request */}
        <View style={styles.gpsRow}>
          <View style={styles.gpsTextWrap}>
            <Text style={styles.gpsText}>
              Share GPS Location Data
            </Text>
            {/* Show granted/denied status below the label */}
            <Text style={styles.gpsStatus}>
              {gpsGranted
                ? '✓ Location access granted'
                : 'Tap to request location access'}
            </Text>
          </View>
          <Switch
            value={gpsConsent}
            onValueChange={handleGpsToggle}
            trackColor={{ false: colors.textDim, true: colors.accentViolet }}
            thumbColor="#fff"
          />
        </View>

        {/* ── Action buttons ── */}
        <View style={styles.actions}>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google sign in — TODO: hook up real Google auth */}
          <TouchableOpacity style={styles.btnOutline} activeOpacity={0.8}>
            <Text style={styles.btnOutlineText}>🇬 Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple sign in — TODO: hook up real Apple auth */}
          <TouchableOpacity style={styles.btnOutline} activeOpacity={0.8}>
            <Text style={styles.btnOutlineText}> Continue with Apple</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDark,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 40,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 44,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: 20,
  },
  fields: {
    gap: 10,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 15,
    color: colors.textBright,
  },
  // GPS consent row
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  gpsTextWrap: {
    flex: 1,
    gap: 4,
  },
  gpsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textBright,
  },
  // Shows granted/denied status below the GPS label
  gpsStatus: {
    fontSize: 12,
    color: colors.textMuted,
  },
  actions: { gap: 10 },
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
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 12,
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