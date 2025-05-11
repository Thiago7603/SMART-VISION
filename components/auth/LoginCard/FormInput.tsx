import theme from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const renderInput = (
    label: string,
    iconName: keyof typeof MaterialIcons.glyphMap,
    valueKey: keyof typeof formData,
    secureTextEntry = false
  ) => {
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
    <View style={styles.formContainer}>
      {renderInput('Correo electrónico', 'email', 'email')}
      {renderInput('Contraseña', 'lock', 'password', true)}

    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
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
  button: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.SIZES.lg,
    fontFamily: theme.FONT.medium,
  },
});
