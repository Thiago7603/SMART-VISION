import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, Text, ActivityIndicator, View } from 'react-native'
import theme from '../../constants/theme'
import ExerciseDetail from '../components/Home/ExerciseDetail'
import { useLocalSearchParams } from 'expo-router'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { app } from './../../infra/Firebase/Firebaseconfig'

export default function ExerciseDetailScreen() {
  const { id, name, category, description, videoUrl } = useLocalSearchParams()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const db = getFirestore(app)
        const exerciseRef = doc(db, 'exercises', id.toString())
        const exerciseDoc = await getDoc(exerciseRef)

        if (exerciseDoc.exists()) {
          setExercise({
            id: exerciseDoc.id,
            ...exerciseDoc.data()
          })
        } else {
          setError('Ejercicio no encontrado')
        }
      } catch (err) {
        console.error("Error fetching exercise details:", err)
        setError('Error al cargar los detalles del ejercicio')
      } finally {
        setLoading(false)
      }
    }

    // Si ya tenemos datos básicos, los usamos mientras cargamos los completos
    if (id && name && category) {
      setExercise({
        id,
        name,
        category,
        description: description || '',
        videoUrl: videoUrl || ''
      })
    }

    // Obtenemos los detalles completos desde Firebase
    fetchExerciseDetails()
  }, [id, name, category, description, videoUrl])

  if (loading && !exercise) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.primary }}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.white} />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.primary }}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {exercise && (
            <ExerciseDetail 
              id={exercise.id}
              name={exercise.name}
              category={exercise.category}
              description={exercise.description}
              videoUrl={exercise.videoUrl}
            />
          )}
        </View>
      </SafeAreaView>
    )
  }

  if (!exercise) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.primary }}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar la información del ejercicio</Text>
        </View>
      </SafeAreaView>
    )
  }

  try {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.primary }}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <ExerciseDetail 
          id={exercise.id}
          name={exercise.name}
          category={exercise.category}
          description={exercise.description}
          videoUrl={exercise.videoUrl}
          // Agrega aquí cualquier otra prop que necesite tu componente ExerciseDetail
        />
      </SafeAreaView>
    )
  } catch (error) {
    console.error("Error rendering ExerciseDetail:", error)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.primary, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>
          Ocurrió un error al cargar la pantalla de detalles.
        </Text>
        <Text style={{ color: 'white', fontSize: 14, marginTop: 10, textAlign: 'center' }}>
          Error: {error.message}
        </Text>
        {exercise && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Mostrando información básica:</Text>
            <Text style={{ color: 'white', textAlign: 'center' }}>{exercise.name}</Text>
            <Text style={{ color: 'white', textAlign: 'center' }}>{exercise.category}</Text>
          </View>
        )}
      </SafeAreaView>
    )
  }
}

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.primary
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.COLORS.primary
  },
  errorText: {
    color: theme.COLORS.white,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  }
}