import { loginWithEmail, sendResetEmail } from '../../infra/Firebase/firebaseAuth'

export const handleLogin = async (email, password) => {
  if (!email || !password) {
    throw new Error('Por favor, completa todos los campos')
  }

  try {
    await loginWithEmail(email, password)
    return { success: true }
  } catch (error) {
    const errorCodes = {
      'auth/invalid-email': 'El formato del correo electrónico no es válido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde o restablece tu contraseña'
    }

    const errorMessage = errorCodes[error.code] || 'Ocurrió un error al iniciar sesión'
    throw new Error(errorMessage)
  }
}

export const handlePasswordReset = async (email) => {
  if (!email) {
    throw new Error('Por favor ingresa tu correo electrónico')
  }

  try {
    await sendResetEmail(email)
    return { success: true }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new Error('No existe una cuenta con este correo electrónico')
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('El formato del correo electrónico no es válido')
    } else {
      throw new Error('No se pudo enviar el correo de recuperación')
    }
  }
}
