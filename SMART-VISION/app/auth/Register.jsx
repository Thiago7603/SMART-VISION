import theme from '@/constants/theme';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, TextInput, TouchableOpacity, Modal, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import GradientTitle from '@/components/auth/GradientTitle';
import GradientButton from '@/components/auth/GradientButton';
import FormHeader from '../../components/auth/FormHeader';

import { useRouter } from 'expo-router';

export default function Register() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [gender, setGender] = useState('');
    const [genderModalVisible, setGenderModalVisible] = useState(false);

    const genders = ['Hombre', 'Mujer', 'Otro Tipo'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <GradientTitle text='SMART VISION' />
            <View style={styles.card}>
                <FormHeader/>

                {/* NOMBRE COMPLETO */}
                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#999" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre completo"
                    />
                </View>

                {/* NOMBRE DE USUARIO */}
                <View style={styles.inputContainer}>
                    <Icon name="at" size={20} color="#999" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de usuario"
                        autoCapitalize="none"
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
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* CONTRASEÑA */}
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#999" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
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

                {/* CONFIRMAR CONTRASEÑA */}
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#999" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar contraseña"
                        secureTextEntry={!showConfirmPassword}
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

                <GradientButton 
                    onPress={() => router.replace('/(tabs)/Home')} 
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
  // Estilos del modal
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
});