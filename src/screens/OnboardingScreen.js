import React, { useRef, useState } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Dimensions, useWindowDimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NightSkyLogo from '../components/NightSkyLogo'
import { colors, radius } from '../theme'

// ── Slide content ────────────────────────────────────────
const SLIDES = [
  {
    id: '1',
    icon: '🌌',
    title: 'Welcome to NightSky AI',
    description:
      'Your citizen science tool for mapping and analyzing light pollution in your community.',
  },
  {
    id: '2',
    icon: '📷',
    title: 'Capture the Night Sky',
    description:
      'Take a photo of the night sky from your location and upload it directly through the app.',
  },
  {
    id: '3',
    icon: '🗺️',
    title: 'See the Heat Map',
    description:
      'Your photo gets analyzed by our AI and plotted on a live light pollution heat map powered by NASA data.',
  },
  {
    id: '4',
    icon: '⭐',
    title: 'Understand the Bortle Scale',
    description:
      'Our AI classifies your sky using the Bortle Scale — a 9 level system measuring light pollution from darkest to brightest.',
  },
  {
    id: '5',
    icon: '📍',
    title: 'Save Your Favorite Spots',
    description:
      'Bookmark dark sky locations you love and plan your next stargazing adventure with ease.',
  },
]

export default function OnboardingScreen() {
  const navigation  = useNavigation()
  const { width }   = useWindowDimensions() // Gets screen width reactively
  const flatListRef = useRef(null)

  // Tracks which slide the user is currently on (0 indexed)
  const [currentSlide, setCurrentSlide] = useState(0)

  // ── Save timestamp when onboarding is finished ───────
  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(
        'lastOnboardingDate',
        new Date().toISOString()
      )
    } catch (error) {
      console.log('Error saving onboarding date:', error)
    }
    navigation.navigate('MapHome')
  }

  // ── Next button ──────────────────────────────────────
  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      const nextIndex = currentSlide + 1
      // Scroll FlatList to the next slide
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
      setCurrentSlide(nextIndex)
    } else {
      finishOnboarding()
    }
  }

  // ── Skip button ──────────────────────────────────────
  const handleSkip = () => finishOnboarding()

  // ── Render each slide ────────────────────────────────
  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.logoWrap}>
        <NightSkyLogo size={100} />
      </View>
      <Text style={styles.slideIcon}>{item.icon}</Text>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDesc}>{item.description}</Text>
    </View>
  )

  // ── Track which slide is visible as user swipes ──────
  const handleViewableChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index)
    }
  }).current

  return (
    <View style={styles.container}>

      {/* ── Skip button (top right, hidden on last slide) ── */}
      {currentSlide < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* ── Slides ── */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal                          // Scroll left and right
        pagingEnabled                       // Snap to each slide
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* ── Bottom controls ── */}
      <View style={styles.controls}>

        {/* Dot indicators */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started button */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

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
  skipBtn: {
    position: 'absolute',
    top: 54,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  // Each slide is exactly as wide as the screen
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 20,
  },
  logoWrap: {
    marginBottom: 10,
  },
  slideIcon: {
    fontSize: 64,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textBright,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  slideDesc: {
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  controls: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 24,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.accentPurple,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.textDim,
  },
  nextBtn: {
    width: '100%',
    backgroundColor: colors.accentViolet,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
})