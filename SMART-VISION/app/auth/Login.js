import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import theme from './../../constants/theme'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GradientButton from './../../components/auth/GradientButton'
import GradientText from './../../components/auth/GradientText'
import GradientTitle from './../../components/auth/GradientTitle'
import HeroImage from './../../components/auth/HeroImage'

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const onSignIn= () => {
    if (!email || !password) {
      alert('Por favor, completa todos los campos');
      return;
    }

    setError('');

    //const userExists = mockUsers.find(user => 
      //user.email === email && user.password === password
    //);

    //if (userExists) {
    //   router.replace('/(tabs)/Home');
    // } else {
    //   setError('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
    // }

    //signInWithEmailAndPassword(auth, email, password)
      //.then((userCredential) => {
        // Signed in 
        //const user = userCredential.user;
        // ...
        router.replace('/(tabs)/Home');
        //console.log(user);
    //})
    //.catch((error) => {
      //const errorCode = error.code;
      //const errorMessage = error.message;
    //});
  }

  const handleForgotPassword = () => {
    if (!forgotPasswordEmail) {
      alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    // Simulación de envío de correo (en tu caso real usarías Firebase)
    alert('Correo enviado',
      `Se ha enviado un enlace de recuperación a ${forgotPasswordEmail}`,
      [{ text: 'OK', onPress: () => setForgotPasswordModal(false) }]
    );
    /*
    sendPasswordResetEmail(auth, forgotPasswordEmail)
      .then(() => {
        Alert.alert(
          'Correo enviado',
          `Se ha enviado un enlace de recuperación a ${forgotPasswordEmail}`,
          [{ text: 'OK', onPress: () => setForgotPasswordModal(false) }]
        );
      })
      .catch((error) => {
        Alert.alert('Error', 'No se pudo enviar el correo. Verifica la dirección.');
      });
    */
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
                />
            </View>

            {/* CONTRASEÑA */}
            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#999" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu contraseña"
                    secureTextEntry={!showPassword}
                    returnKeyType='done'
                    onChangeText={(text) => {
                      setPassword(text);
                      setError(''); 
                    }}
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
            <GradientButton text="Iniciar Sesion" onPress={onSignIn} />

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