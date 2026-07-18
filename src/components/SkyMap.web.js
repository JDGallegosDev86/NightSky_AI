import React from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// ── NASA GIBS Black Marble tile layer ────────────────────
// This is a free, keyless WMTS endpoint — no API token needed
// to display the night-lights basemap itself. The Earthdata
// token is only needed for the pixel-level radiance lookups
// already used in the backend's /predict endpoint.
//
// NOTE: If tiles don't render, double check the layer name and
// tilematrixset against NASA's current GIBS capabilities doc:
// https://nasa-gibs.github.io/gibs-api-docs/
const BLACK_MARBLE_URL =
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

      {/* All pins render identically — no uploader identity attached */}
      {pins.map((pin) => (
        <CircleMarker
          key={pin.id}
          center={[pin.latitude, pin.longitude]}
          radius={7}
          pathOptions={{
            color: '#8b5cf6',
            fillColor: '#8b5cf6',
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            Bortle {pin.bortle_prediction ?? '?'}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}