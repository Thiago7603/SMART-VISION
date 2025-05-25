import { AntDesign } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import theme from '../../../constants/theme'
import GradientButton from './GradientButton'

const { height: screenHeight } = Dimensions.get('window')

const exerciseDetails = {
  1: {
    name: 'Flexiones',
    image: require('../../assets/images/upper1.png'),
    description: 'Las flexiones son un ejercicio básico pero muy efectivo para fortalecer el pecho, hombros y tríceps. Se realiza en posición de plancha con las manos separadas a la anchura de los hombros, bajando el cuerpo hasta casi tocar el suelo y empujando hacia arriba hasta extender los brazos.',
    muscle: 'Pecho, Hombros, Tríceps',
    difficulty: 'Intermedio',
    tips: '• Mantén la espalda recta\n• Contrae el abdomen durante el movimiento\n• Respira adecuadamente: inhala al bajar, exhala al subir'
  },
  2: {
    name: 'Dominadas',
    image: require('../../assets/images/upper1.png'),
    description: 'Las dominadas son uno de los mejores ejercicios para desarrollar la espalda y los bíceps. Consiste en colgarse de una barra y elevar el cuerpo hasta que la barbilla supere la altura de la barra usando la fuerza de la parte superior del cuerpo.',
    muscle: 'Espalda, Bíceps',
    difficulty: 'Avanzado',
    tips: '• Agarra la barra con las palmas hacia fuera\n• Mantén el core activado\n• Evita balancearte durante el movimiento'
  },
}

export default function ExerciseDetail() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const id = params?.id || "1" // Valor predeterminado en caso de que falle la obtención del parámetro
  
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      console.log("ID recibido:", id)
      // Simular una demora para dar tiempo a que los params se carguen completamente
      const timer = setTimeout(() => {
        if (id && exerciseDetails[id]) {
          setExercise(exerciseDetails[id])
        } else {
          setError("Ejercicio no encontrado")
        }
        setLoading(false)
      }, 100)
      
      return () => clearTimeout(timer)
    } catch (err) {
      console.error("Error en useEffect:", err)
      setError(err.message)
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.COLORS.white, fontSize: 18 }}>Cargando...</Text>
      </View>
    )
  }

  if (error || !exercise) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.COLORS.white, fontSize: 18 }}>
          {error || "No se encontró el ejercicio"}
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.backButton, { marginTop: 20 }]}
        >
          <AntDesign name="arrowleft" size={24} color={theme.COLORS.white} />
          <Text style={{ color: theme.COLORS.white, marginLeft: 10 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.COLORS.primary, theme.COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color={theme.COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{exercise.name}</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={exercise.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Músculos</Text>
                <Text style={styles.infoValue}>{exercise.muscle}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Dificultad</Text>
                <Text style={styles.infoValue}>{exercise.difficulty}</Text>
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>
                {exercise.description}
              </Text>
            </View>

            <View style={styles.tipsContainer}>
              <Text style={styles.sectionTitle}>Consejos</Text>
              <Text style={styles.tipsText}>
                {exercise.tips}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <GradientButton 
              text="Vizualiar Ejercicio" 
                onPress={() => router.push('/camera/camera-ar')}
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.SIZES.xl,
    fontFamily: theme.FONT.bold,
    color: theme.COLORS.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  imageContainer: {
    height: screenHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '70%',
    height: '100%',
  },
  detailsContainer: {
    backgroundColor: theme.COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
    minHeight: screenHeight * 0.55,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
    backgroundColor: theme.COLORS.lightGray,
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: theme.SIZES.sm,
    fontFamily: theme.FONT.medium,
    color: theme.COLORS.gray,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: theme.SIZES.md,
    fontFamily: theme.FONT.semiBold,
    color: theme.COLORS.black,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: theme.SIZES.lg,
    fontFamily: theme.FONT.bold,
    color: theme.COLORS.primary,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: theme.SIZES.md,
    fontFamily: theme.FONT.regular,
    color: theme.COLORS.darkGray,
    lineHeight: 22,
  },
  tipsContainer: {
    marginBottom: 30,
  },
  tipsText: {
    fontSize: theme.SIZES.md,
    fontFamily: theme.FONT.regular,
    color: theme.COLORS.darkGray,
    lineHeight: 24,
  },
})