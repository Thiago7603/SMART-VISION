import React from 'react'
import { StyleSheet, View } from 'react-native'

import DescriptionCard from '@/components/landing/DescriptionCard'
import GradientButton from '@/components/landing/GradientButton'
import GradientTitle from '@/components/landing/GradientTitle'
import HeroImage from '@/components/landing/HeroImage'
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