import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, FlatList, Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { colors, radius } from '../theme'

// ── Grid column count ────────────────────────────────────
const NUM_COLUMNS = 4

// Get screen width to calculate grid item size
const { width } = Dimensions.get('window')

// Each grid item takes up 1/4 of the screen minus padding
const ITEM_SIZE = (width - 28 - (NUM_COLUMNS - 1) * 4) / NUM_COLUMNS

// ── Placeholder image data ───────────────────────────────
// TODO: Replace this with real data fetched from API.
// Each image has an id, title, GPS coords, bortle rating,
// timestamp, and a placeholder for the image URI.
const PLACEHOLDER_IMAGES = Array.from({ length: 16 }, (_, i) => ({
  id:        String(i + 1),
  title:     'Image Title',
  latitude:  40.7128 + (Math.random() - 0.5) * 2,  // Random coords near NYC for demo
  longitude: -74.0060 + (Math.random() - 0.5) * 2,
  bortle:    Math.floor(Math.random() * 9) + 1,      // Random Bortle 1-9 for demo
  timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  imageUri:  null, // TODO: Replace with real image URI from the backend
}))

export default function UploadedImagesScreen() {
  const navigation = useNavigation()

  // Holds the list of uploaded images
  // TODO: Replace with real API fetch using useEffect
  const [images] = useState(PLACEHOLDER_IMAGES)

  // ── Render each grid item ────────────────────────────
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigation.navigate('ImageDetail', { image: item })}
      activeOpacity={0.75}
    >
      {item.imageUri ? (
        // TODO: Show real image when URI is available
        // <Image source={{ uri: item.imageUri }} style={styles.gridImage} />
        null
      ) : (
        // Placeholder shown until real images are loaded
        <View style={styles.gridPlaceholder}>
          <Text style={styles.gridPlaceholderIcon}>🌄</Text>
        </View>
      )}

      {/* Image title below the thumbnail */}
      <Text style={styles.gridItemTitle} numberOfLines={1}>
        {item.title}
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
        {images.length === 0 ? (
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
            keyExtractor={(item) => item.id}
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