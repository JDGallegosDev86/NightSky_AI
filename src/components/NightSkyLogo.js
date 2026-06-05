import React from 'react'
import { Image } from 'react-native'

export default function NightSkyLogo({ size = 110 }) {
  return (
    <Image
      source={require('../assets/logo.png')} // ← pulls from src/assets/logo.png
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  )
}