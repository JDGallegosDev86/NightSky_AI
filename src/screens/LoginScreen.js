import { loginUser } from '../services/authServices'
import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NightSkyLogo from '../components/NightSkyLogo'
import { colors, radius } from '../theme'

export default function LoginScreen() {
  const navigation = useNavigation()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  // ── Check if onboarding should be shown ─────────────────
  // Clears the saved date temporarily so we can test onboarding.
  // Remove the removeItem line once onboarding is confirmed working.
  const handleContinue = async () => {
  try {
    const result = await loginUser(email, password)

    if (result.access_token) {
      await AsyncStorage.setItem('jwtToken', result.access_token)

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
    } else {
      alert(result.detail || 'Login failed')
    }
  } catch (error) {
    console.log(error)
    alert('Could not connect to backend')
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
        <Text style={styles.sectionLabel}>Sign in</Text>

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
        </View>

        {/* ── Action buttons ── */}
        <View style={styles.actions}>

          {/* Continue — runs the onboarding check */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Continue</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register */}
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOutlineText}>Register now</Text>
          </TouchableOpacity>

          {/* Google — TODO: hook up real Google auth */}
          <TouchableOpacity style={styles.btnOutline} activeOpacity={0.8}>
            <Text style={styles.btnOutlineText}>🇬 Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple — TODO: hook up real Apple auth */}
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
    marginBottom: 16,
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
  actions: {
    gap: 10,
  },
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