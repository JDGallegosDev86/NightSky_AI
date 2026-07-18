import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = "http://192.168.1.229:8000"

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  return response.json()
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  console.log("LOGIN DATA:", data)

  if (data.access_token) {
    await AsyncStorage.setItem("jwtToken", data.access_token)
    console.log("JWT SAVED:", data.access_token)
  }

  return data
}

export async function logoutUser() {
  await AsyncStorage.removeItem("jwtToken")
}