import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DescriptionCard from './../components/Landing/DescriptionCard';
import GradientTitle from './../components/Landing/GradientTitle';
import HeroImage from './../components/Landing/HeroImage';
import GradientButton from './../components/Landing/GradientButton';

export default function Landing() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <GradientTitle text={'SMART VISION'} />
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
    alignItems: 'center',
  },
  contentContainer: {
    margingTop: 20,
    paddingTop: 5,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
});