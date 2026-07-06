import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LoginScreen      from './src/screens/LoginScreen'
import RegisterScreen   from './src/screens/RegisterScreen'
import MapHomeScreen    from './src/screens/MapHomeScreen'
import MenuScreen       from './src/screens/MenuScreen'
import SettingsScreen   from './src/screens/SettingsScreen'
import BortleScaleScreen from './src/screens/BortleScaleScreen'
import BortleLevelScreen from './src/screens/BortleLevelScreen'
import OnboardingScreen from './src/screens/OnboardingScreen'
import SavedLocationsScreen from './src/screens/SavedLocationsScreen'
import PhotoReviewScreen from './src/screens/PhotoReviewScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import NotificationsScreen from './src/screens/NotificationsScreen'
import PrivacyScreen from './src/screens/PrivacyScreen'
import UploadedImagesScreen from './src/screens/UploadedImagesScreen'
import ImageDetailScreen    from './src/screens/ImageDetailScreen'
import CameraScreen from './src/screens/CameraScreen'
import ResultsScreen from './src/screens/ResultsScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login"        component={LoginScreen} />
        <Stack.Screen name="Register"     component={RegisterScreen} />
        <Stack.Screen name="MapHome"      component={MapHomeScreen} />
        <Stack.Screen name="Menu"         component={MenuScreen} />
        <Stack.Screen name="Settings"     component={SettingsScreen} />
        <Stack.Screen name="BortleScale"  component={BortleScaleScreen} />
        <Stack.Screen name="BortleLevel"  component={BortleLevelScreen} />
        <Stack.Screen name="Onboarding"   component={OnboardingScreen} />
        <Stack.Screen name="SavedLocations" component={SavedLocationsScreen} />
        <Stack.Screen name="PhotoReview"  component={PhotoReviewScreen} />
        <Stack.Screen name="Profile"      component={ProfileScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Privacy"      component={PrivacyScreen} />
        <Stack.Screen name="UploadedImages" component={UploadedImagesScreen} />
        <Stack.Screen name="ImageDetail"          component={ImageDetailScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}