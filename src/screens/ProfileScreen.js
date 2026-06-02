import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert,
} from 'react-native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { colors, radius } from '../theme'

export default function ProfileScreen() {
  // ── Public profile fields ────────────────────────────
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio]                 = useState('')
  const [email, setEmail]             = useState('user@example.com')

  // ── Password change fields ───────────────────────────
  const [currentPassword, setCurrentPassword]   = useState('')
  const [newPassword, setNewPassword]           = useState('')
  const [confirmPassword, setConfirmPassword]   = useState('')

  // Controls whether the password section is expanded
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  // ── Save profile changes ─────────────────────────────
  // TODO: Replace alert with real API call to save profile
  const handleSaveProfile = () => {
    Alert.alert('Profile Saved', 'Your profile has been updated.')
  }

  // ── Save new password ────────────────────────────────
  // Basic validation before sending to backend
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all password fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirm password do not match.')
      return
    }
    if (newPassword.length < 8) {
      Alert.alert('Too Short', 'Password must be at least 8 characters.')
      return
    }
    // TODO: Replace alert with real API call to change password
    Alert.alert('Password Changed', 'Your password has been updated successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowPasswordSection(false)
  }

  // ── Delete account ───────────────────────────────────
  // Shows a double confirmation before deleting
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'All your data including uploaded images and saved locations will be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete My Account',
                  style: 'destructive',
                  // TODO: Replace with real API call to delete account
                  onPress: () => Alert.alert('Account Deleted', 'Your account has been deleted.'),
                },
              ]
            )
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Profile" showBack={true} showSearch={false} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── Profile photo placeholder ── */}
        {/* TODO: Hook up real image picker for profile photo */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* ── Public info section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Public Info</Text>

          <View style={styles.card}>
            {/* Display name */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Display Name</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Enter your name"
                placeholderTextColor={colors.textMuted}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.fieldDivider} />

            {/* Bio */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput
                style={[styles.fieldInput, styles.fieldInputMultiline]}
                placeholder="Tell us about yourself"
                placeholderTextColor={colors.textMuted}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        {/* ── Private info section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Info</Text>

          <View style={styles.card}>
            {/* Email — read only for now */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldValueText}>{email}</Text>
            </View>
          </View>
        </View>

        {/* ── Save profile button ── */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleSaveProfile}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Save Profile</Text>
        </TouchableOpacity>

        {/* ── Change password section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Security</Text>

          {/* Toggle to expand/collapse the password fields */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => setShowPasswordSection(!showPasswordSection)}
            activeOpacity={0.75}
          >
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Change Password</Text>
              <Text style={styles.chevron}>
                {showPasswordSection ? '↑' : '↓'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Password fields — only shown when expanded */}
          {showPasswordSection && (
            <View style={styles.passwordFields}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                placeholderTextColor={colors.textMuted}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor={colors.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleChangePassword}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Danger zone ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.btnDanger}
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <Text style={styles.btnDangerText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

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
  scroll: {
    padding: 14,
    paddingBottom: 40,
    gap: 14,
  },
  // ── Avatar ──
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.spaceCard,
    borderWidth: 2,
    borderColor: colors.borderBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { fontSize: 40 },
  changePhotoBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderBright,
    backgroundColor: 'rgba(124,92,191,0.08)',
  },
  changePhotoText: {
    color: colors.accentPurple,
    fontSize: 13,
    fontWeight: '600',
  },
  // ── Sections ──
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
    paddingLeft: 4,
  },
  // ── Info card ──
  card: {
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    width: 100,
    flexShrink: 0,
  },
  fieldInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textBright,
    textAlign: 'right',
  },
  fieldInputMultiline: {
    textAlign: 'right',
    textAlignVertical: 'top',
    minHeight: 60,
  },
  fieldValueText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'right',
  },
  fieldDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 16,
  },
  // ── Password fields ──
  passwordFields: {
    gap: 10,
    marginTop: 4,
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
  // ── Buttons ──
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
  btnDanger: {
    backgroundColor: 'rgba(220,38,38,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.25)',
    borderRadius: radius.md,
    padding: 15,
    alignItems: 'center',
  },
  btnDangerText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
})