import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import theme from '../../constants/theme'
import Header from '../../components/profile/header'

export default function Profile() {
  // Estados para los campos del perfil
  const [profileData, setProfileData] = useState({
    name: 'Mariana',
    email: 'mariana@example.com',
    password: '••••••••'
  })
  
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false
  })
  
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  // Función para alternar modo edición
  const toggleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  // Función para guardar cambios
  const saveField = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
    setIsEditing(prev => ({
      ...prev,
      [field]: false
    }))
  }

  // Función para cambiar contraseña
  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden')
      return
    }
    if (passwordData.new.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    Alert.alert('Éxito', 'Contraseña cambiada correctamente')
    setPasswordData({ current: '', new: '', confirm: '' })
    setShowChangePassword(false)
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => {
          // Aquí iría la lógica para cerrar sesión
          console.log('Cerrando sesión...')
        }}
      ]
    )
  }

  // Componente para campo editable
  const EditableField = ({ label, value, field, secureTextEntry = false }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => toggleEdit(field)}
        >
          <Text style={styles.editButtonText}>
            {isEditing[field] ? 'Cancelar' : 'Editar'}
          </Text>
          <Ionicons 
            name={isEditing[field] ? 'close' : 'pencil'} 
            size={16} 
            color={theme.COLORS.primary} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
      
      {isEditing[field] ? (
        <View style={styles.editingContainer}>
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, [field]: text }))}
            secureTextEntry={secureTextEntry}
            placeholder={`Ingresa tu ${label.toLowerCase()}`}
          />
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => saveField(field, profileData[field])}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrapper}>
          <Header />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.contentShadow} />
          
          <View style={styles.profileWrapper}>
            {/* Campos del perfil */}
            <EditableField 
              label="Nombre" 
              value={profileData.name} 
              field="name" 
            />
            
            <EditableField 
              label="Correo" 
              value={profileData.email} 
              field="email" 
            />
            
            <EditableField 
              label="Contraseña" 
              value={profileData.password} 
              field="password" 
              secureTextEntry={true}
            />

            {/* Sección cambiar contraseña */}
            <View style={styles.changePasswordSection}>
              <TouchableOpacity 
                style={styles.changePasswordButton}
                onPress={() => setShowChangePassword(!showChangePassword)}
              >
                <Text style={styles.changePasswordText}>Cambiar Contraseña</Text>
                <Ionicons 
                  name={showChangePassword ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={theme.COLORS.secondary} 
                />
              </TouchableOpacity>
              
              {showChangePassword && (
                <View style={styles.passwordChangeForm}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Contraseña actual"
                    secureTextEntry
                    value={passwordData.current}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, current: text }))}
                  />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Nueva contraseña"
                    secureTextEntry
                    value={passwordData.new}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, new: text }))}
                  />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirmar nueva contraseña"
                    secureTextEntry
                    value={passwordData.confirm}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirm: text }))}
                  />
                  <TouchableOpacity 
                    style={styles.confirmPasswordButton}
                    onPress={handleChangePassword}
                  >
                    <Text style={styles.confirmPasswordText}>Confirmar Cambio</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Botón cerrar sesión */}
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color={theme.COLORS.white} />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: theme.COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.COLORS.primary + '20',
    borderRadius: 40, 
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 20,
    marginHorizontal: 10,
    position: 'relative',
    overflow: 'hidden',
    marginTop: 10
  },
  contentShadow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: theme.COLORS.lightGray,
    borderRadius: 40,
    zIndex: -1
  },
  profileWrapper: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10
  },
  fieldContainer: {
    marginBottom: 25,
    backgroundColor: theme.COLORS.white,
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.dark,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editButtonText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    fontWeight: '600',
    marginRight: 5,
  },
  divider: {
    height: 1,
    backgroundColor: theme.COLORS.lightGray,
    marginBottom: 15,
  },
  fieldValue: {
    fontSize: 16,
    color: theme.COLORS.dark,
    fontWeight: '500',
  },
  editingContainer: {
    gap: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: theme.COLORS.white,
  },
  saveButton: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  changePasswordSection: {
    marginBottom: 25,
    backgroundColor: theme.COLORS.white,
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  changePasswordButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changePasswordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.secondary,
  },
  passwordChangeForm: {
    marginTop: 15,
    gap: 12,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: theme.COLORS.white,
  },
  confirmPasswordButton: {
    backgroundColor: theme.COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  confirmPasswordText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: theme.COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutText: {
    color: theme.COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
})