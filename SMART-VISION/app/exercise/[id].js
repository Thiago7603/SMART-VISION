import React from 'react'
import { SafeAreaView, StatusBar, Text } from 'react-native'
import theme from '../../constants/theme'

import ExerciseDetail from '../../components/Home/ExerciseDetail'

export default function ExerciseDetailScreen() {
  try {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.primary }}>
        <StatusBar style="light" translucent
        backgroundColor="transparent" />
        <ExerciseDetail />
      </SafeAreaView>
    )
  } catch (error) {
    // Fallback para mostrar el error en pantalla en lugar de una pantalla negra
    console.error("Error rendering ExerciseDetail:", error);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.primary, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>
          Ocurrió un error al cargar la pantalla de detalles.
        </Text>
        <Text style={{ color: 'white', fontSize: 14, marginTop: 10, textAlign: 'center' }}>
          Error: {error.message}
        </Text>
      </SafeAreaView>
    )
  }
}