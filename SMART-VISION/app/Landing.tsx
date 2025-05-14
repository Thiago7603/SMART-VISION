import React from 'react'
import { View, StyleSheet } from 'react-native'

import DescriptionCard from '@/components/Landing/DescriptionCard'
import GradientButton from '@/components/Landing/GradientButton'
import GradientTitle from '@/components/Landing/GradientTitle'
import HeroImage from '@/components/Landing/HeroImage'
import { useRouter } from 'expo-router'

export default function Landing() {
    const router = useRouter();

  return (
    <View style={styles.container}>
      <GradientTitle text='SMART VISION' />
      <View style={styles.contentContainer}>
        <HeroImage />
        <DescriptionCard />
      </View>
      <GradientButton text='COMENZAR' onPress={() => router.push('./auth/Login')} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    contentContainer: {
        marginTop: 25,
        paddingTop: 5,
        padding: 20,
        alignItems: 'center',
        width: '100%',
    }
})