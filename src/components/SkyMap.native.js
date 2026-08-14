import React from 'react'
import MapView, { UrlTile, Marker, Callout } from 'react-native-maps'
import { View, Text, Image, StyleSheet } from 'react-native'
import { BORTLE_LEVELS } from '../data/bortleData'
import { getImageUrl } from '../services/uploadService'

// ── NASA GIBS Black Marble tile layer ────────────────────
const BLACK_MARBLE_URL_TEMPLATE =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi' +
  '?TIME=default' +
  '&layer=VIIRS_Black_Marble' +
  '&tilematrixset=GoogleMapsCompatible_Level8' +
  '&Service=WMTS&Request=GetTile&Version=1.0.0' +
  '&Format=image/png' +
  '&TileMatrix={z}&TileRow={y}&TileCol={x}'

// Fallback color for pins with no Bortle result yet (analysis pending/failed)
const FALLBACK_COLOR = '#8b5cf6'

// Looks up the exact color used in the Bortle legend for a given level,
// so pins always match what the legend shows — single source of truth.
function getBortleColor(bortleLevel) {
  const levelNum = parseInt(bortleLevel, 10)
  const match = BORTLE_LEVELS.find((b) => b.level === levelNum)
  return match ? match.color : FALLBACK_COLOR
}

function getBortleName(bortleLevel) {
  const levelNum = parseInt(bortleLevel, 10)
  const match = BORTLE_LEVELS.find((b) => b.level === levelNum)
  return match ? match.name : 'Unrated'
}

// pins: array of { id, latitude, longitude, bortle_prediction, timestamp, image_url }
export default function SkyMap({ pins = [] }) {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: 39.5,
        longitude: -98.35,
        latitudeDelta: 20,
        longitudeDelta: 20,
      }}
    >
      <UrlTile
        urlTemplate={BLACK_MARBLE_URL_TEMPLATE}
        maximumZ={8}
        flipY={false}
      />

      {pins.map((pin) => {
        const color = getBortleColor(pin.bortle_prediction)
        const name = getBortleName(pin.bortle_prediction)

        return (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            pinColor={color}
          >
            <Callout>
              <View style={styles.callout}>
                {pin.image_url && (
                  <Image
                    source={{ uri: getImageUrl(pin.image_url) }}
                    style={styles.calloutImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={[styles.calloutTitle, { color }]}>
                  Bortle {pin.bortle_prediction ?? '?'} — {name}
                </Text>
                {pin.timestamp && (
                  <Text style={styles.calloutDate}>
                    {new Date(pin.timestamp).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </Callout>
          </Marker>
        )
      })}
    </MapView>
  )
}

const styles = StyleSheet.create({
  callout: {
    width: 160,
    padding: 4,
  },
  calloutImage: {
    width: '100%',
    height: 100,
    borderRadius: 6,
    marginBottom: 6,
  },
  calloutTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  calloutDate: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
})