import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import theme from '../../constants/theme'
import ExerciseList from './../../components/Home/ExerciseList'
import Header from './../../components/Home/Header'

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Contenido principal con scroll que ahora incluye el header */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header ahora dentro del ScrollView */}
        <View style={styles.headerWrapper}>
          <Header />
        </View>
        
        {/* Contenedor del contenido con efecto 3D */}
        <View style={styles.contentContainer}>
          {/* Sombra detrás del contenedor para efecto 3D */}
          <View style={styles.contentShadow} />
          
          {/* Lista de ejercicios con bordes circulares */}
          <View style={styles.exerciseListWrapper}>
            <ExerciseList />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: theme.COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.COLORS.primary + '20',
    borderRadius: 40, 
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 20,
    marginHorizontal: 10,
    position: 'relative',
    overflow: 'hidden',
    marginTop: 10 // Espacio entre el header y el contenido
  },
  contentShadow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: theme.COLORS.lightGray,
    borderRadius: 40,
    zIndex: -1
  },
  exerciseListWrapper: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 10
  }
})