import React, { useState } from 'react';
import { ProfileDesign } from './../../app/(tabs)/Profile'
import { ProfileCore } from './../../core/ProfileCore';
import { auth } from 'firebase/auth'; // Ajusta según tu configuración

export const ProfileInfra = () => {
  const [user, setUser] = useState({
    name: 'Juan Pérez',
    email: 'juan@example.com'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      if (isEditing) {
        // Validar antes de guardar
        ProfileCore.validateName(user.name);
        ProfileCore.validateEmail(user.email);

        // Guardar en Firebase (o donde sea)
        await ProfileCore.updateProfile(user);
        alert('Perfil actualizado!');
      }
      setIsEditing(!isEditing);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Sesión cerrada');
    } catch (error) {
      alert('Error al cerrar sesión');
    }
  };

  return (
    <ProfileDesign
      name={user.name}
      email={user.email}
      onNameChange={(text) => setUser({ ...user, name: text })}
      onEmailChange={(text) => setUser({ ...user, email: text })}
      onSave={handleSave}
      onLogout={handleLogout}
      isEditing={isEditing}
    />
  );
};