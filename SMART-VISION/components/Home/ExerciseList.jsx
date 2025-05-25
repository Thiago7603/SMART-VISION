import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import theme from './../../constants/theme'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { app } from './../../infra/Firebase/Firebaseconfig'
import GradientText from './GradientText'

const { width: screenWidth } = Dimensions.get('window')
const CARD_WIDTH = screenWidth * 0.39
const CARD_MARGIN = 15

/**
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} icon
 * @property {string} [description]
 * @property {string} [videoUrl]
 */

/**
 * @typedef {Object} ExerciseCategory
 * @property {string} category
 * @property {Exercise[]} exercises
 */

export default function ExerciseList() {
  const router = useRouter()
  const [exerciseData, setExerciseData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const db = getFirestore(app)
        const exercisesCollection = collection(db, 'exercises')
        const querySnapshot = await getDocs(exercisesCollection)
        
        const exercises = []
        querySnapshot.forEach((doc) => {
          exercises.push({
            id: doc.id,
            ...doc.data()
          })
        })

        // Agrupar ejercicios por categoría
        const groupedExercises = groupByCategory(exercises)
        setExerciseData(groupedExercises)
      } catch (err) {
        console.error("Error fetching exercises: ", err)
        setError('Error al cargar los ejercicios')
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  const groupByCategory = (exercises) => {
    const categories = [...new Set(exercises.map(ex => ex.category))]
    
    return categories.map(category => ({
      category,
      exercises: exercises.filter(ex => ex.category === category)
    }))
  }

  const handlePress = (exercise) => {
    router.push({
      pathname: "/exercise/[id]",
      params: { 
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        description: exercise.description || '',
        videoUrl: exercise.videoUrl || ''
      }
    })
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.COLORS.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {exerciseData.map((section, index) => (
        <View key={index} style={styles.section}>
          <GradientText text={section.category} style={styles.sectionTitle}/>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
            style={styles.horizontalContainer}
            snapToInterval={CARD_WIDTH + CARD_MARGIN}
            decelerationRate="fast"
          >
            {section.exercises.map((exercise) => (
              <TouchableOpacity 
                key={exercise.id} 
                onPress={() => handlePress(exercise)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[theme.COLORS.primary + '30', theme.COLORS.secondary + '30']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.exerciseCard}
                >
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: exercise.icon }} 
                      style={styles.exerciseIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.COLORS.background
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: theme.SIZES.lg,
    fontFamily: theme.FONT.bold,
    marginBottom: 15,
    paddingLeft: 5
  },
  horizontalContainer: {
    marginHorizontal: -5
  },
  horizontalScroll: {
    paddingHorizontal: 8
  },
  exerciseCard: {
    width: CARD_WIDTH,
    borderRadius: 14,
    padding: 15,
    marginRight: CARD_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.COLORS.primary + '20'
  },
  imageContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: theme.COLORS.white + '90',
    borderRadius: 45,
    padding: 10
  },
  exerciseIcon: {
    width: '100%',
    height: '100%',
  },
  exerciseName: {
    fontSize: theme.SIZES.lg,
    fontFamily: theme.FONT.semiBold,
    color: theme.COLORS.white,
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: theme.COLORS.black + '80',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.background
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.background,
    padding: 20
  },
  errorText: {
    color: theme.COLORS.error,
    fontSize: theme.SIZES.md,
    textAlign: 'center'
  }
})