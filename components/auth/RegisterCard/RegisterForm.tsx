import theme from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    genero: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [modalVisible, setModalVisible] = useState(false);
  
  const genderOptions = ["Hombre", "Mujer", "Otro tipo de trastorno"];

  const renderInput = (
    label: string,
    iconName: keyof typeof MaterialIcons.glyphMap,
    valueKey: keyof typeof formData,
    secureTextEntry = false
  ) => {
    
    if (valueKey === 'genero') {
      return (
        <View style={styles.inputContainer}>
          <MaterialIcons name={iconName} size={20} color={theme.COLORS.gray} style={styles.icon} />
          <TouchableOpacity 
            style={styles.pickerTouchable}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[
              styles.pickerText, 
              !formData.genero && { color: theme.COLORS.gray }
            ]}>
              {formData.genero || "Género"}
            </Text>
          </TouchableOpacity>
          <MaterialIcons 
            name="arrow-drop-down" 
            size={24} 
            color={theme.COLORS.gray} 
          />
        </View>
      );
    }
    
    return (
      <View style={styles.inputContainer}>
        <MaterialIcons name={iconName} size={20} color={theme.COLORS.gray} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={label}
          placeholderTextColor={theme.COLORS.gray}
          value={formData[valueKey]}
          onChangeText={(text) => setFormData({ ...formData, [valueKey]: text })}
          secureTextEntry={secureTextEntry}
        />
      </View>
    );
  };

  return (
    <>
      {renderInput('Nombre completo', 'person', 'nombre')}
      {renderInput('Género', 'wc', 'genero')}
      {renderInput('Correo electrónico', 'email', 'email')}
      {renderInput('Contraseña', 'lock', 'password', true)}
      {renderInput('Confirmar contraseña', 'lock-outline', 'confirmPassword', true)}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona tu género</Text>
            
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => {
                  setFormData({ ...formData, genero: option });
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.gray,
    marginBottom: 20,
    height: 45, 
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: theme.SIZES.md,
    fontFamily: theme.FONT.regular,
    color: theme.COLORS.black,
    paddingVertical: 0, 
  },
  pickerTouchable: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: theme.SIZES.md,
    fontFamily: theme.FONT.regular,
    color: theme.COLORS.black,
    paddingVertical: 0, 
    lineHeight: 20, 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: theme.SIZES.lg,
    fontFamily: theme.FONT.medium,
    marginBottom: 20,
  },
  optionButton: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
  },
  optionText: {
    fontSize: theme.SIZES.md,
    fontFamily: theme.FONT.regular,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    width: '100%',
  },
  cancelText: {
    color: theme.COLORS.gray,
    fontSize: theme.SIZES.md,
    fontFamily: theme.FONT.medium,
    textAlign: 'center',
  },
});