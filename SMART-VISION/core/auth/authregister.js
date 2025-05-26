import { registerWithEmail } from './../../infra/Firebase/Authrepository';

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function checkPassword(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
}

export const createAccount = {
  checkPassword: (password, confirmPassword) => {
    const strength = checkPassword(password);
    const errors = {
      passwordError: '',
      confirmPasswordError: ''
    };

    if (strength < 4) {
      errors.passwordError = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.';
    }

    if (confirmPassword && password !== confirmPassword) {
      errors.confirmPasswordError = 'Las contraseñas no coinciden.';
    }

    return { strength, error: errors };
  },

  registerUser: async ({ fullName, email, password, confirmPassword, gender }) => {
    if (!fullName || !email || !password || !confirmPassword || !gender) {
      return { success: false, message: 'Por favor, completa todos los campos.' };
    }

    if (!validateEmail(email)) {
      return { success: false, message: 'Correo electrónico inválido.' };
    }

    if (checkPassword(password) < 4) {
      return { success: false, message: 'Contraseña débil.' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Las contraseñas no coinciden.' };
    }

    try {
      await registerWithEmail(fullName, email, password, gender);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Error al crear cuenta.' };
    }
  }
};
