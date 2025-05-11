import theme from '@/constants/theme';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import GradientTitle from '@/components/auth/GradientTitle';
import FormHeader from '@/components/auth/RegisterCard/FormHeader';
import GradientButton from '@/components/auth/RegisterCard/GradientButton';
import RegisterCard from '@/components/auth/RegisterCard/RegisterCard';
import RegisterForm from '@/components/auth/RegisterCard/RegisterForm';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <GradientTitle text='SMART VISION' />
        <RegisterCard>
          <FormHeader />
          <RegisterForm />
          <GradientButton 
            onPress={() => router.replace('/(tabs)/Home')} 
            text="REGISTRARME"
          />
        </RegisterCard>
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
