import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = 'http://127.0.0.1:8000'

export async function uploadPhoto(photoUri, latitude, longitude, timestamp) {
  const token = await AsyncStorage.getItem('jwtToken')

  const formData = new FormData()

  formData.append('photo', {
    uri: photoUri,
    name: 'night_sky_photo.jpg',
    type: 'image/jpeg',
  })

  formData.append('latitude', String(latitude ?? ''))
  formData.append('longitude', String(longitude ?? ''))
  formData.append('timestamp', timestamp ?? new Date().toISOString())

  const response = await fetch(`${API_BASE_URL}/upload-photo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  return response.json()
}