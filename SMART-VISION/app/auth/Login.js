import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import theme from './../../constants/theme'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GradientButton from '../components/auth/GradientButton'
import GradientText from '../components/auth/GradientText'
import GradientTitle from '../components/auth/GradientTitle'
import HeroImage from '../components/auth/HeroImage'

// Importaciones de Firebase
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { app } from './../../infra/Firebase/Firebaseconfig'

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = React.useRef(null);

  // Obtener la instancia de autenticación de Firebase
  const auth = getAuth(app);

  const onSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Si el inicio de sesión es exitoso, el observador de onAuthStateChanged
      // en tu App.tsx manejará la redirección
      router.replace('/(tabs)/Home');
    } catch (error) {
      setIsLoading(false);
      let errorMessage = 'Ocurrió un error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico no es válido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo electrónico';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde o restablece tu contraseña';
          break;
        default:
          console.error('Error en inicio de sesión:', error);
      }
      
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      Alert.alert(
        'Correo enviado',
        `Se ha enviado un enlace de recuperación a ${forgotPasswordEmail}`,
        [{ text: 'OK', onPress: () => setForgotPasswordModal(false) }]
      );
      setForgotPasswordEmail('');
    } catch (error) {
      let errorMessage = 'No se pudo enviar el correo de recuperación';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido';
      }
      
      Alert.alert('Error', errorMessage);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView 
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraHeight={120}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={true}>
  
          <GradientTitle text="SMART VISION" />
          <HeroImage />

          <View style={styles.card}>
          
            <Text style={styles.title}>Inicia Sesion</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* EMAIL */}
            <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#999" style={styles.icon} />
                <TextInput 
                    style={styles.input}
                    placeholder="Ingresa tu Correo"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType='next'
                    onChangeText={(text) => {
                      setEmail(text);
                      setError(''); 
                    }}
                    onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                />
                
            </View>

            {/* CONTRASEÑA */}
            <View style={styles.inputContainer}>
                <TextInput
                    ref={passwordInputRef}
                    style={styles.input}
                    placeholder="Ingresa tu contraseña"
                    secureTextEntry={!showPassword}
                    returnKeyType='done'
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError(''); 
                    }}
                    onSubmitEditing={onSignIn}
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
            <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => setForgotPasswordModal(true)}
            >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* BOTON INICIAR SESION */}
            <GradientButton 
              text="Iniciar Sesion" 
              onPress={onSignIn} 
              loading={isLoading}
            />

            {/* BOTON REGISTRAR */}
            <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/Register')}>
                    <GradientText text='Crear Cuenta' />
                </TouchableOpacity>
            </View>
      
        </View>

        {/* MODAL PARA OLVIDÉ CONTRASEÑA */}
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
                  onChangeText={setForgotPasswordEmail}
                  value={forgotPasswordEmail}
                />
              </View>

              <GradientButton 
                text="Enviar Enlace" 
                onPress={handleForgotPassword}
                style={styles.modalButton}
              />

              <TouchableOpacity 
                style={styles.modalCancel}
                onPress={() => setForgotPasswordModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
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
  modalButton: {
    marginTop: 10,
  },
  modalCancel: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: theme.COLORS.primary,
    fontWeight: 'bold',
  },
})