import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from './../../constants/theme';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormHeader from './../../components/auth/FormHeader';
import GradientButton from './../../components/auth/GradientButton';
import GradientTitle from './../../components/auth/GradientTitle';

// Importaciones de Firebase corregidas
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './../../infra/Firebase/Firebaseconfig';

export default function Register() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const genders = ['Hombre', 'Mujer', 'Otro Tipo'];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    return strength;
  }

  useEffect(() => {
    if (password) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);

      if (strength < 4) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, un número y un carácter especial.');
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordStrength(0);
      setPasswordError('');
    }

    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
    } else {
      setConfirmPasswordError('');
    }
  }, [password, confirmPassword]);

  const OnCreateAccount = async () => {
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validaciones
    if (!fullName || !email || !password || !confirmPassword || !gender) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Correo electrónico inválido.');
      return;
    }

    if (passwordStrength < 4) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un carácter especial.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crear documento del usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        gender,
        email,
        createdAt: new Date(),
        uid: user.uid // Agregar el UID para referencia
      });

      console.log('Usuario creado exitosamente:', user.uid);
      Alert.alert('Éxito', 'Cuenta creada exitosamente', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/Home')
        }
      ]);

    } catch (error) {
      console.error('Error al crear usuario:', error);
      
      // Manejar errores específicos de Firebase
      let errorMessage = 'Error desconocido';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está registrado.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet.';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    }
  }

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return '#e0e0e0';
      case 1: return '#ff5252'; // Rojo (débil)
      case 2: return '#ffab40'; // Naranja (regular)
      case 3: return '#ffd600'; // Amarillo (buena)
      case 4: return '#4caf50'; // Verde (fuerte)
      default: return '#e0e0e0';
    }
  };

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 0: return '';
      case 1: return 'Débil';
      case 2: return 'Regular';
      case 3: return 'Buena';
      case 4: return 'Fuerte';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={true}>
          
          <GradientTitle text='SMART VISION' />
          <View style={styles.card}>
            <FormHeader />

            {/* NOMBRE COMPLETO */}
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre completo"
                  value={fullName}
                  onChangeText={setFullName}
                  />
            </View>

            {/* GÉNERO (MODAL) */}
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setGenderModalVisible(true)}
            >
              <Icon name="venus-mars" size={20} color="#999" style={styles.icon} />
              <Text style={[styles.genderText, !gender && { color: '#999' }]}>
                {gender || 'Selecciona tu género'}
              </Text>
            </TouchableOpacity>

            {/* EMAIL */}
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                  }}
                />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* CONTRASEÑA */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  value={password}
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
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
            {/* Indicador de fortaleza de contraseña */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarContainer}>
                  {[1, 2, 3, 4].map((i) => (
                    <View 
                      key={i}
                      style={[
                        styles.strengthBar,
                        { 
                          backgroundColor: i <= passwordStrength ? getStrengthColor() : '#e0e0e0',
                          width: `${100/4 - 2}%`
                        }
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                  {getStrengthText()}
                </Text>
              </View>
            )}
            
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* CONFIRMAR CONTRASEÑA */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={setConfirmPassword}
                />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={showConfirmPassword ? "eye" : "eye-slash"}
                      size={20}
                      color="#999"
                      />
                  </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

            <GradientButton 
              onPress={OnCreateAccount}
              text="REGISTRARME"
            />

            {/* MODAL DE GÉNERO */}
            <Modal
              visible={genderModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setGenderModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  {genders.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.modalOption}
                      onPress={() => {
                        setGender(item);
                        setGenderModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalOptionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity 
                    style={styles.modalCancel}
                    onPress={() => setGenderModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          </View>
        
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
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 15,
      paddingVertical: 5,
  },
  icon: {
      marginRight: 10,
  },
  input: {
      flex: 1,
      paddingVertical: 8,
  },
  eyeIcon: {
      padding: 5,
  },
  genderText: {
      flex: 1,
      paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 0,
    overflow: 'hidden',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCancel: {
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  modalCancelText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 40,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  strengthBarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});