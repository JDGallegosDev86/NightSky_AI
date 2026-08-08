import React from 'react'
import MapView, { UrlTile, Marker, Callout } from 'react-native-maps'
import { View, Text, StyleSheet } from 'react-native'

// ── NASA GIBS Black Marble tile layer ────────────────────
// Same free, keyless WMTS endpoint used in the web version.
// NOTE: If tiles don't render, double check the layer name and
// tilematrixset against NASA's current GIBS capabilities doc:
// https://nasa-gibs.github.io/gibs-api-docs/
const BLACK_MARBLE_URL_TEMPLATE =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi' +
  '?TIME=default' +
  '&layer=VIIRS_Black_Marble' +
  '&tilematrixset=GoogleMapsCompatible_Level8' +
  '&Service=WMTS&Request=GetTile&Version=1.0.0' +
  '&Format=image/png' +
  '&TileMatrix={z}&TileRow={y}&TileCol={x}'

// pins: array of { id, latitude, longitude, bortle_prediction, timestamp }
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

      {/* All pins render identically — no uploader identity attached */}
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
          pinColor="#8b5cf6"
        >
          <Callout>
            <View style={styles.callout}>
              <Text>Bortle {pin.bortle_prediction ?? '?'}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  )
}

const styles = StyleSheet.create({
  callout: {
    padding: 6,
  },
})