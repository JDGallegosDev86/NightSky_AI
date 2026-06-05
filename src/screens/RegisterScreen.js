import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Switch, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, radius } from '../theme'
import NightSkyLogo from '../components/NightSkyLogo'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RegisterScreen() {
  const navigation = useNavigation()

  // Track what the user types into each field
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  // Tracks whether the user agreed to share their GPS location
  const [gpsConsent, setGpsConsent]   = useState(false)

  // ── Check if onboarding should be shown ─────────────────
// Same logic as LoginScreen — new users should always
// see onboarding after registering for the first time.
const handleContinue = async () => {
  try {
    // TEMPORARY: Clear onboarding date so we can test it
    // Remove this line once onboarding is confirmed working
    await AsyncStorage.removeItem('lastOnboardingDate')

    const lastDate = await AsyncStorage.getItem('lastOnboardingDate')

    if (!lastDate) {
      // First time user — always show onboarding after registering
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Handles keyboard differently on iOS vs Android
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled" // Lets users tap buttons without dismissing keyboard first
      >

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
            autoCapitalize="none"           // Don't auto-capitalize emails
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry                 // Hides password characters
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.textMuted}
            value={confirmPass}
            onChangeText={setConfirmPass}
            secureTextEntry                 // Hides password characters
          />
        </View>

        {/* ── GPS consent toggle ── */}
        {/* Asks the user if they want to share their location data */}
        <View style={styles.gpsRow}>
          <Text style={styles.gpsText}>
            Do you want to share GPS location data?
          </Text>
          <Switch
            value={gpsConsent}
            onValueChange={setGpsConsent}   // Flips true/false when tapped
            trackColor={{ false: colors.textDim, true: colors.accentViolet }}
            thumbColor="#fff"
          />
        </View>

        {/* ── Action buttons ── */}
        <View style={styles.actions}>

          {/* Main continue button — TODO: hook up real registration API */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Continue</Text>
          </TouchableOpacity>

          {/* Divider line with 'or' text */}
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
    justifyContent: 'flex-end', // Push content toward the bottom like the wireframe
    padding: 24,
    paddingBottom: 40,
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
  logoWrap: {
  alignItems: 'center',
  marginBottom: 44,
},
  // GPS consent row — toggle sits on the right, text on the left
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
  gpsText: {
    flex: 1,                    // Takes up all space except the toggle
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
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