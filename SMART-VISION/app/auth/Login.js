import { useRouter } from 'expo-router'
import React, { useState, useRef } from 'react'
import { Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import theme from './../../constants/theme'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GradientButton from '../components/auth/GradientButton'
import GradientText from '../components/auth/GradientText'
import GradientTitle from '../components/auth/GradientTitle'
import HeroImage from '../components/auth/HeroImage'

// Importaciones de Firebase
import { handleLogin, handleForgotPassword } from '../../core/auth/authService';
import { getAuthInstance } from './../../infra/Firebase/firebaseAuth';

export default function Login() {
  const router = useRouter();
  const auth = getAuthInstance();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef(null);

  const onSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await handleLogin(email, password);
      router.replace('/(tabs)/Home');
    } catch (error) {
      let message = 'Ocurrió un error al iniciar sesión';
      switch (error.code) {
        case 'auth/empty-fields':
          message = 'Por favor, completa todos los campos';
          break;
        case 'auth/invalid-email':
          message = 'El correo electrónico no es válido';
          break;
        case 'auth/user-disabled':
          message = 'Esta cuenta ha sido deshabilitada';
          break;
        case 'auth/user-not-found':
          message = 'No existe una cuenta con este correo';
          break;
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta';
          break;
        case 'auth/too-many-requests':
          message = 'Demasiados intentos. Intenta más tarde';
          break;
        default:
          console.error('Error de inicio:', error);
      }
      setIsLoading(false);
      setError(message);
      Alert.alert('Error', message);
    }
  };

  const onSendResetEmail = async () => {
    try {
      await handleForgotPassword(forgotPasswordEmail);
      Alert.alert(
        'Correo enviado',
        `Se envió un enlace a ${forgotPasswordEmail}`,
        [{ text: 'OK', onPress: () => setForgotPasswordModal(false) }]
      );
      setForgotPasswordEmail('');
    } catch (error) {
      let msg = 'No se pudo enviar el correo';
      if (error.code === 'auth/user-not-found') {
        msg = 'No existe una cuenta con este correo';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Correo no válido';
      } else if (error.code === 'auth/empty-email') {
        msg = 'Ingresa tu correo electrónico';
      }
      Alert.alert('Error', msg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <GradientTitle text="SMART VISION" />
        <HeroImage />

        <View style={styles.card}>
          <Text style={styles.title}>Inicia Sesión</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Email */}
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu Correo"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={passwordInputRef}
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              secureTextEntry={!showPassword}
              returnKeyType="done"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              onSubmitEditing={onSignIn}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword} onPress={() => setForgotPasswordModal(true)}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <GradientButton text="Iniciar Sesión" onPress={onSignIn} loading={isLoading} />

          {/* Register */}
          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/Register')}>
              <GradientText text="Crear Cuenta" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal */}
        <Modal
          visible={forgotPasswordModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setForgotPasswordModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Recuperar Contraseña</Text>
              <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu correo registrado"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={forgotPasswordEmail}
                  onChangeText={setForgotPasswordEmail}
                />
              </View>
              <GradientButton text="Enviar Enlace" onPress={onSendResetEmail} style={styles.modalButton} />
              <TouchableOpacity style={styles.modalCancel} onPress={() => setForgotPasswordModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.COLORS.lightGray },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 100,
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
  errorText: {
    color: theme.COLORS.error,
    textAlign: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    paddingVertical: 5,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 8 },
  eyeIcon: { padding: 5 },
  forgotPassword: { alignSelf: 'flex-start', marginBottom: 20 },
  forgotPasswordText: {
    color: theme.COLORS.primary,
    fontSize: theme.SIZES.sm,
    fontWeight: '900',
  },
  createAccountContainer: { flexDirection: 'row', justifyContent: 'center' },
  createAccountText: {
    color: theme.COLORS.black,
    fontSize: theme.SIZES.md,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: { marginTop: 10 },
  modalCancel: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: theme.COLORS.primary,
    fontWeight: 'bold',
  },
});
