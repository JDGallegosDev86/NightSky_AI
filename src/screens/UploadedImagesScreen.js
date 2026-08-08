import React, { useState, useCallback } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, FlatList, Dimensions, Image, ActivityIndicator,
} from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { colors, radius } from '../theme'
import { getMyUploads, getImageUrl } from '../services/uploadService'

// ── Grid column count ────────────────────────────────────
const NUM_COLUMNS = 4

// Get screen width to calculate grid item size
const { width } = Dimensions.get('window')

// Each grid item takes up 1/4 of the screen minus padding
const ITEM_SIZE = (width - 28 - (NUM_COLUMNS - 1) * 4) / NUM_COLUMNS

export default function UploadedImagesScreen() {
  const navigation = useNavigation()

  // Holds the list of uploaded images fetched from the backend
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  // Refetches uploads every time this screen comes into focus,
  // so a newly uploaded photo shows up immediately after upload
  // without needing to force-close and reopen the app.
  useFocusEffect(
    useCallback(() => {
      let isActive = true

      async function loadUploads() {
        try {
          setLoading(true)
          const data = await getMyUploads()

          if (isActive) {
            setImages(data)
          }
        } catch (error) {
          console.log('Failed to load uploads:', error)
        } finally {
          if (isActive) setLoading(false)
        }
      }

      loadUploads()

      return () => { isActive = false }
    }, [])
  )

  // ── Render each grid item ────────────────────────────
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigation.navigate('ImageDetail', { image: item })}
      activeOpacity={0.75}
    >
      {item.image_url ? (
        // Real uploaded image, served from the backend's /uploads static route
        <Image
          source={{ uri: getImageUrl(item.image_url) }}
          style={styles.gridImage}
        />
      ) : (
        // Fallback placeholder if an image URL is somehow missing
        <View style={styles.gridPlaceholder}>
          <Text style={styles.gridPlaceholderIcon}>🌄</Text>
        </View>
      )}

      {/* Bortle result below the thumbnail */}
      <Text style={styles.gridItemTitle} numberOfLines={1}>
        {item.bortle_prediction ? `Bortle ${item.bortle_prediction}` : 'Processing...'}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>

      {/* ── Top bar with back button ── */}
      <TopBar title="Uploaded Images" showBack={true} showSearch={true} />

      <View style={styles.content}>

        {/* ── Large image icon header (matches wireframe) ── */}
        <View style={styles.headerIconWrap}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🖼️</Text>
          </View>
        </View>

        {/* ── Image grid ── */}
        {loading ? (
          // ── Loading state ──
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={colors.accentViolet} />
          </View>
        ) : images.length === 0 ? (
          // ── Empty state ──
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📷</Text>
            <Text style={styles.emptyTitle}>No Images Yet</Text>
            <Text style={styles.emptyText}>
              Upload your first night sky photo using the button below.
            </Text>
          </View>
        ) : (
          // ── Grid of uploaded images ──
          <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            numColumns={NUM_COLUMNS}            
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        )}

      </View>

      {/* ── Bottom action buttons  ── */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={() => alert('Filter Options — coming soon!')}
        >
          <Text style={styles.actionBtnText}>Filter Options</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SavedLocations')}
        >
          <Text style={styles.actionBtnText}>Saved Locations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnPrimary]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PhotoReview')}
        >
          <Text style={styles.actionBtnPrimaryText}>Upload Image</Text>
        </TouchableOpacity>
      </View>

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
  content: {
    flex: 1,
  },
  // ── Header icon  ──
  headerIconWrap: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: { fontSize: 36 },
  // ── Image grid ──
  grid: {
    padding: 14,
    gap: 4,
  },
  gridRow: {
    gap: 4,
    marginBottom: 4,
  },
  // Each grid item is a square thumbnail with a title below
  gridItem: {
    width: ITEM_SIZE,
    gap: 4,
  },
  gridImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: radius.sm,
  },
  gridPlaceholder: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridPlaceholderIcon: { fontSize: 20 },
  gridItemTitle: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
  // ── Empty state ──
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
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
  // ── Bottom action buttons ──
  bottomActions: {
    padding: 14,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.spaceDark,
  },
  actionBtn: {
    padding: 14,
    backgroundColor: colors.spaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textBright,
  },
  // Upload button is highlighted in purple
  actionBtnPrimary: {
    backgroundColor: colors.accentViolet,
    borderColor: colors.accentViolet,
  },
  actionBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
})