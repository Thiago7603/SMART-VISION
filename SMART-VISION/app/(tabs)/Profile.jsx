import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ProfileDesign = ({ 
  name, 
  email, 
  onNameChange, 
  onEmailChange,
  onSave,
  onLogout,
  isEditing
}) => (
  <View style={styles.container}>
    {/* Nombre */}
    <View style={styles.field}>
      <Text style={styles.label}>Nombre</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={onNameChange}
        />
      ) : (
        <Text style={styles.value}>{name}</Text>
      )}
    </View>

    {/* Email */}
    <View style={styles.field}>
      <Text style={styles.label}>Email</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={onEmailChange}
          keyboardType="email-address"
        />
      ) : (
        <Text style={styles.value}>{email}</Text>
      )}
    </View>

    {/* Botones */}
    <TouchableOpacity style={styles.button} onPress={onSave}>
      <Text style={styles.buttonText}>{isEditing ? 'GUARDAR' : 'EDITAR'}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 20 },
  field: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  value: { fontSize: 16 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 10 
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  logoutText: { color: 'white', fontWeight: 'bold' }
});