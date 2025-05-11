import theme from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import GradientTitle from '@/components/auth/GradientTitle';
import HeroImage from '@/components/auth/HeroImage';
import CardTitle from '@/components/auth/LoginCard/CardTitle';
import ForgotPasswordLink from '@/components/auth/LoginCard/ForgotPasswordLink';
import FormInput from '@/components/auth/LoginCard/FormInput';
import GradientButton from '@/components/auth/LoginCard/GradientButton';
import LoginCard from '@/components/auth/LoginCard/LoginCard';
import RegisterLink from '@/components/auth/LoginCard/RegisterLink';

export default function Login() {
const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <GradientTitle text="SMART VISION" />
        <HeroImage />
        <LoginCard>
          <CardTitle text="Inicia Sesión" />
          <FormInput />
          <ForgotPasswordLink onPress={() => console.log('Olvidé la contraseña')}/>
          <GradientButton text="INICIAR" onPress={() => router.replace('/(tabs)/Home')}/>
          <RegisterLink onPress={() => router.push('/auth/Register')}/>
        </LoginCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.lightGray,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
