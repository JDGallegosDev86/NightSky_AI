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
      </Stack.Navigator>
    </NavigationContainer>
  )
}