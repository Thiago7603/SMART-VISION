import theme from '@/constants/theme';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';

import GradientTitle from '@/components/auth/GradientTitle';
import HeroImage from '@/components/auth/HeroImage';
import GradientButton from '@/components/auth/GradientButton';
import GradientText from '@/components/auth/GradientText';

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    
    return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <GradientTitle text="SMART VISION" />
        <HeroImage />

        <View style={styles.card}>
          
            <Text style={styles.title}>Inicia Sesion</Text>

            {/* EMAIL */}
            <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#999" style={styles.icon} />
                <TextInput 
                    style={styles.input}
                    placeholder="Ingresa tu Correo"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* CONTRASEÑA */}
            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#999" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu contraseña"
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)} 
                    style={styles.eyeIcon}
                >
                    <Icon
                        name={showPassword ? "eye" : "eye-slash"}
                        size={20}
                        color="#999"
                    />
                </TouchableOpacity>
            </View>

            {/* OLVIDE CONTRASEÑA */}
            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* BOTON INICIAR SESION */}
            <GradientButton text="Iniciar Sesion" onPress={() => router.push('/Home')} />

            {/* BOTON REGISTRAR */}
            <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/Register')}>
                    <GradientText text='Crear Cuenta' />
                </TouchableOpacity>
            </View>
      
        </View>
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
  card: {
    width: '100%',
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.SIZES.md,
    padding: theme.SIZES.lg,
    ...theme.SHADOWS.default,
    marginTop: theme.SIZES.lg,
  },
  title: {
    fontSize: theme.SIZES.xxl,
    textAlign: 'center',
    fontWeight: '900',
    marginBottom: 10,
    color: theme.COLORS.black,    
  },
  inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        paddingVertical: 5
    },
    icon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        paddingVertical: 8
    },
    eyeIcon: {
        padding: 5,
    },
    forgotPassword: {
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: theme.COLORS.primary,
        fontSize: theme.SIZES.sm,
        fontWeight: '900',
    },
    createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  createAccountText: {
    color: theme.COLORS.black,
    fontSize: theme.SIZES.md,
    fontWeight: '900'
  },
});