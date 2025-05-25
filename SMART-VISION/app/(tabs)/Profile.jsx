import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../constants/theme';
import Header from '../components/profile/header';
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { app } from './../../infra/Firebase/Firebaseconfig';

export default function Profile() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = auth.currentUser;

  // Estados para los campos del perfil
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: '••••••••'
  });
  
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false
  });
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(true);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          // Obtener datos adicionales de Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          setProfileData({
            name: userDoc.exists() ? userDoc.data().name : 'Usuario',
            email: user.email || '',
            password: '••••••••'
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert('Error', 'No se pudieron cargar los datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, db]);

  // Función para alternar modo edición
  const toggleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Función para guardar cambios en el nombre
  const saveName = async () => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      await updateDoc(doc(db, 'users', user.uid), {
        name: profileData.name
      });
      
      setIsEditing(prev => ({ ...prev, name: false }));
      Alert.alert('Éxito', 'Nombre actualizado correctamente');
    } catch (error) {
      console.error("Error updating name:", error);
      Alert.alert('Error', 'No se pudo actualizar el nombre');
    }
  };

  // Función para guardar cambios en el email
  const saveEmail = async () => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      await updateEmail(user, profileData.email);
      setIsEditing(prev => ({ ...prev, email: false }));
      Alert.alert('Éxito', 'Correo electrónico actualizado correctamente');
    } catch (error) {
      console.error("Error updating email:", error);
      Alert.alert('Error', 'No se pudo actualizar el correo electrónico');
      // Revertir el cambio en el estado si falla
      setProfileData(prev => ({ ...prev, email: user?.email || '' }));
    }
  };

  // Función para cambiar contraseña
  const handleChangePassword = async () => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      if (passwordData.new !== passwordData.confirm) {
        throw new Error('Las contraseñas no coinciden');
      }
      if (passwordData.new.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Reautenticar al usuario
      const credential = EmailAuthProvider.credential(
        user.email || '',
        passwordData.current
      );
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.new);
      
      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
      setPasswordData({ current: '', new: '', confirm: '' });
      setShowChangePassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      let errorMessage = 'Error al cambiar la contraseña';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'La contraseña actual es incorrecta';
      } else if (error.message.includes('coinciden')) {
        errorMessage = 'Las contraseñas no coinciden';
      } else if (error.message.includes('6 caracteres')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // La redirección debería manejarse con el observer de autenticación
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  // Componente para campo editable
  const EditableField = ({ label, value, field, secureTextEntry = false, onSave }) => (
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
            autoCapitalize={field === 'name' ? 'words' : 'none'}
            keyboardType={field === 'email' ? 'email-address' : 'default'}
          />
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={onSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrapper}>
          <Header name={profileData.name} />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.contentShadow} />
          
          <View style={styles.profileWrapper}>
            {/* Campos del perfil */}
            <EditableField 
              label="Nombre" 
              value={profileData.name} 
              field="name"
              onSave={saveName}
            />
            
            <EditableField 
              label="Correo" 
              value={profileData.email} 
              field="email"
              onSave={saveEmail}
            />
            
            <EditableField 
              label="Contraseña" 
              value={profileData.password} 
              field="password" 
              secureTextEntry={true}
              onSave={() => setShowChangePassword(true)}
            />

            {/* Sección cambiar contraseña */}
            {showChangePassword && (
              <View style={styles.changePasswordSection}>
                <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
                
                <View style={styles.passwordChangeForm}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Contraseña actual"
                    secureTextEntry
                    value={passwordData.current}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, current: text }))}
                    autoCapitalize="none"
                  />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Nueva contraseña"
                    secureTextEntry
                    value={passwordData.new}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, new: text }))}
                    autoCapitalize="none"
                  />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirmar nueva contraseña"
                    secureTextEntry
                    value={passwordData.confirm}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirm: text }))}
                    autoCapitalize="none"
                  />
                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={[styles.passwordButton, styles.cancelButton]}
                      onPress={() => {
                        setShowChangePassword(false);
                        setPasswordData({ current: '', new: '', confirm: '' });
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.passwordButton, styles.confirmButton]}
                      onPress={handleChangePassword}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={theme.COLORS.white} />
                      ) : (
                        <Text style={styles.confirmButtonText}>Confirmar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Botón cerrar sesión */}
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={loading}
            >
              <Ionicons name="log-out-outline" size={24} color={theme.COLORS.white} />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.dark,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  passwordButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: theme.COLORS.lightGray,
  },
  confirmButton: {
    backgroundColor: theme.COLORS.secondary,
  },
  cancelButtonText: {
    color: theme.COLORS.dark,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: theme.COLORS.white,
    fontWeight: 'bold',
  },
})