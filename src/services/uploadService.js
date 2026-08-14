import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const API_BASE_URL = "https://nightsky-ai-api.onrender.com";

export async function uploadPhoto(
  photoUri,
  latitude,
  longitude,
  timestamp,
  sharePublicly
) {
  const token = await AsyncStorage.getItem('jwtToken')

  console.log('JWT TOKEN DURING UPLOAD:', token ? 'Token found' : 'Token missing')

  if (!token) {
    throw new Error('No JWT token found. Please log in again.')
  }

  const formData = new FormData()

  // ── Platform-aware photo attachment ───────────────
  // Web requires converting the photo URI into a Blob.
  // Native Android and iOS can send the URI object directly.
  if (Platform.OS === 'web') {
    const photoResponse = await fetch(photoUri)
    const photoBlob = await photoResponse.blob()

    formData.append('photo', photoBlob, 'nightsky_photo.jpg')
  } else {
    formData.append('photo', {
      uri: photoUri,
      name: 'nightsky_photo.jpg',
      type: 'image/jpeg',
    })
  }

  // ── Add photo metadata ────────────────────────────
  formData.append('latitude', String(latitude ?? ''))
  formData.append('longitude', String(longitude ?? ''))
  formData.append(
    'timestamp',
    timestamp ?? new Date().toISOString()
  )
  formData.append('sharePublicly', String(sharePublicly ?? false))

  const response = await fetch(`${API_BASE_URL}/upload-photo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Photo upload failed')
  }

  return data
}
// Fetches the logged-in user's uploaded photos from the backend.
export async function getMyUploads() {
  const token = await AsyncStorage.getItem('jwtToken')

  const response = await fetch(`${API_BASE_URL}/my-uploads`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch uploads: ${response.status}`)
  }

  return response.json()
}

// Builds the full image URL from the relative path the backend returns.
export function getImageUrl(relativePath) {
  return `${API_BASE_URL}${relativePath}`
}

// Fetches all publicly-shared uploads for the heat map.
// No auth required — this is intentionally public data with no user identity attached.
export async function getPublicUploads() {
  const response = await fetch(`${API_BASE_URL}/public-uploads`)

  if (!response.ok) {
    throw new Error(`Failed to fetch public uploads: ${response.status}`)
  }

  return response.json()
}

// Deletes an uploaded photo — removes it from disk and the database.
export async function deleteUpload(uploadId) {
  const token = await AsyncStorage.getItem('jwtToken')

  const response = await fetch(`${API_BASE_URL}/uploads/${uploadId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || `Failed to delete upload: ${response.status}`)
  }

  return response.json()
}