import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from './../../constants/theme';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormHeader from '../components/auth/FormHeader';
import GradientButton from '../components/auth/GradientButton';
import GradientTitle from '../components/auth/GradientTitle';

import { createAccount } from '../../core/auth/authregister';

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const genders = ['Hombre', 'Mujer', 'Otro Tipo'];

  useEffect(() => {
    const validatePassword = async () => {
      const { strength, error } = await createAccount.checkPassword(password, confirmPassword);
      setPasswordStrength(strength);
      setPasswordError(error.passwordError);
      setConfirmPasswordError(error.confirmPasswordError);
    };

    validatePassword();
  }, [password, confirmPassword]);

  const handleRegister = async () => {
    const result = await createAccount.registerUser({
      fullName,
      email,
      password,
      confirmPassword,
      gender
    });

    if (!result.success) {
      Alert.alert('Error', result.message);
      return;
    }

    Alert.alert('Éxito', 'Cuenta creada exitosamente', [
      { text: 'OK', onPress: () => router.replace('/(tabs)/Home') }
    ]);
  };

  const getStrengthColor = () => {
    const colors = ['#e0e0e0', '#ff5252', '#ffab40', '#ffd600', '#4caf50'];
    return colors[passwordStrength] || '#e0e0e0';
  };

  const getStrengthText = () => {
    const levels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    return levels[passwordStrength];
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <GradientTitle text='SMART VISION' />
        <View style={styles.card}>
          <FormHeader />

          {/* Nombre */}
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Género */}
          <TouchableOpacity style={styles.inputContainer} onPress={() => setGenderModalVisible(true)}>
            <Icon name="venus-mars" size={20} color="#999" style={styles.icon} />
            <Text style={[styles.genderText, !gender && { color: '#999' }]}>
              {gender || 'Selecciona tu género'}
            </Text>
          </TouchableOpacity>

          {/* Email */}
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

          {/* Contraseña */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarContainer}>
                {[1, 2, 3, 4].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBar,
                      { backgroundColor: i <= passwordStrength ? getStrengthColor() : '#e0e0e0' }
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.strengthText, { color: getStrengthColor() }]}>{getStrengthText()}</Text>
            </View>
          )}
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Confirmar contraseña */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Icon name={showConfirmPassword ? 'eye' : 'eye-slash'} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          <GradientButton onPress={handleRegister} text="REGISTRARME" />

          {/* Modal Género */}
          <Modal visible={genderModalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                {genders.map((item) => (
                  <TouchableOpacity key={item} style={styles.modalOption} onPress={() => {
                    setGender(item);
                    setGenderModalVisible(false);
                  }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAwareScrollView>
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