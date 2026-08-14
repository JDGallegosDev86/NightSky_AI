import React from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { BORTLE_LEVELS } from '../data/bortleData'
import { getImageUrl } from '../services/uploadService'

// ── NASA GIBS Black Marble tile layer ────────────────────
const BLACK_MARBLE_URL =
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
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      style={{ width: '100%', height: '100%' }}
      worldCopyJump
    >
      <TileLayer
        url={BLACK_MARBLE_URL}
        attribution="Imagery courtesy of NASA GIBS / Black Marble"
        maxZoom={8}
      />

      {pins.map((pin) => {
        const color = getBortleColor(pin.bortle_prediction)
        const name = getBortleName(pin.bortle_prediction)

        return (
          <CircleMarker
            key={pin.id}
            center={[pin.latitude, pin.longitude]}
            radius={8}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ width: 180 }}>
                {pin.image_url && (
                  <img
                    src={getImageUrl(pin.image_url)}
                    alt="Night sky upload"
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 6,
                      marginBottom: 6,
                    }}
                  />
                )}
                <div style={{ fontWeight: 700, color: color }}>
                  Bortle {pin.bortle_prediction ?? '?'} — {name}
                </div>
                {pin.timestamp && (
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    {new Date(pin.timestamp).toLocaleDateString()}
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}