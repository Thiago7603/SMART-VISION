import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import theme from './../../constants/theme'
import GradientText from './GradientText'

const { width: screenWidth } = Dimensions.get('window')
const CARD_WIDTH = screenWidth * 0.39
const CARD_MARGIN = 15

export default function ExerciseList() {
  const router = useRouter()

  const exerciseData = [
    {
      category: 'Tren Superior',
      exercises: [
        { id: 1, name: 'Flexiones', icon: require('@/assets/images/upper1.png') },
        { id: 2, name: 'Dominadas', icon: require('@/assets/images/upper1.png') },
        { id: 3, name: 'Press Banca', icon: require('@/assets/images/upper1.png') },
      ]
    },
    {
      category: 'Tren Inferior',
      exercises: [
        { id: 4, name: 'Sentadillas', icon: require('@/assets/images/lower1.png') },
        { id: 5, name: 'Peso Muerto', icon: require('@/assets/images/lower1.png') },
        { id: 6, name: 'Zancadas', icon: require('@/assets/images/lower1.png') },
      ]
    },
    {
      category: 'Zona Media',
      exercises: [
        { id: 7, name: 'Plancha', icon: require('@/assets/images/core1.png') },
        { id: 8, name: 'Abdominales', icon: require('@/assets/images/core1.png') },
        { id: 9, name: 'Russian Twist', icon: require('@/assets/images/core1.png') },
      ]
    }
  ]

  const handlePress = (exerciseId) => {
    router.push({
      pathname: "/exercise/[id]",
      params: { id: exerciseId }
    });
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
                onPress={() => handlePress(exercise.id)}
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
                      source={exercise.icon} 
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
  }
})