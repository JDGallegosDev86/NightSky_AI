import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, radius } from '../theme'

export default function LoginScreen() {
  const navigation = useNavigation()

  // Track what the user types into each field
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Handles keyboard differently on iOS vs Android
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled" // Lets users tap buttons without dismissing keyboard first
      >

        {/* ── Logo placeholder — replace with <NightSkyLogo /> when ready ── */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoPlaceholderText}>NightSky AI</Text>
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
            onChangeText={setEmail}         // Updates email state as user types
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
        </View>

        {/* ── Action buttons ── */}
        <View style={styles.actions}>

          {/* Main continue button — navigates to the map */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('MapHome')}
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

          {/* Register button — navigates to the Register screen */}
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOutlineText}>Register now</Text>
          </TouchableOpacity>

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
  // Placeholder box where the logo will go
  logoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'center',
    marginBottom: 44,
  },
  logoPlaceholderText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
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