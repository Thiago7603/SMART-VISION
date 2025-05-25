import CustomTabIcon from '../components/tabs/CustomTabIcon'
import theme from './../../constants/theme'
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.COLORS.white,
          height: 65,
          justifyContent: 'center',
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              focused={focused}
              label="Inicio"
              IconComponent={AntDesign}
              iconName="home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              focused={focused}
              label="Dashboard"
              IconComponent={Entypo}
              iconName="bar-graph"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              focused={focused}
              label="Perfil"
              IconComponent={Ionicons}
              iconName="person-circle"
            />
          ),
        }}
      />
    </Tabs>
  )
}