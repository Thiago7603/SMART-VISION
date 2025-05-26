export class ProfileCore {
  static validateEmail(email) {
    if (!email.includes('@')) {
      throw new Error('Email no válido');
    }
  }

  static validateName(name) {
    if (name.length < 3) {
      throw new Error('Nombre muy corto');
    }
  }

  static async updateProfile(data) {
    // Simulación de guardado (luego se conecta a Firebase)
    console.log("Guardando:", data);
    return true;
  }
}