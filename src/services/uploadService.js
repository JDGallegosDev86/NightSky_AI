import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const API_BASE_URL = 'http://192.168.1.229:8000'

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