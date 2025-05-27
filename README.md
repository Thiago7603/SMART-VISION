# 🧠 Smart Vision

*Smart Vision* es una aplicación móvil desarrollada con *React Native (Expo)* que utiliza tecnologías de *visión por computadora* y *realidad aumentada* para ofrecer una experiencia de entrenamiento físico inteligente y segura.

## 🚀 Descripción General

Smart Vision permite a los usuarios:

- Iniciar sesión o registrarse de forma segura.
- Visualizar ejercicios con instrucciones detalladas.
- Entrenar usando una guía visual con *ARCore*.
- Corregir su postura en tiempo real gracias a *MediaPipe*.
- Consultar estadísticas personalizadas de su desempeño.
- Gestionar su perfil y progreso.

Esta app busca *reducir el riesgo de lesiones* y *mejorar la técnica* del usuario durante la actividad física.

---

## ⚙ Tecnologías Utilizadas

- *Frontend*: [React Native (Expo)](https://expo.dev/)
- *Autenticación y Base de Datos*: [Firebase](https://firebase.google.com/)
- *Visión por Computadora*: [MediaPipe](https://mediapipe.dev/)
- *Realidad Aumentada*: [ARCore](https://developers.google.com/ar)

---

## 🧱 Arquitectura por Capas

El proyecto está estructurado siguiendo una *arquitectura limpia (Clean Architecture)* basada en tres capas principales:

### 1. **Presentación (app/)**

Contiene toda la lógica de interfaz de usuario:

- Pantallas (Landing, Login, Register, Home, Dashboard, Profile)
- Navegación
- Componentes visuales

### 2. **Dominio (core/)**

Incluye:

- Casos de uso (ej. iniciar sesión, registrar ejercicio, obtener estadísticas)
- Modelos de datos
- Validaciones de negocio

### 3. **Infraestructura (infra/)**

Abstracción de tecnologías externas:

- firebase/: Autenticación, Firestore, almacenamiento de usuarios.
- mediapipe/: Detección y corrección de posturas.
- arcore/: Visualización en realidad aumentada.

---

## 🖧 Arquitectura del Sistema

La arquitectura del sistema define cómo se conectan los diferentes componentes tecnológicos que conforman la solución:

- *Dispositivo móvil (cliente):* Ejecuta la app desarrollada en React Native.
- *Firebase (backend como servicio):* Proporciona autenticación, base de datos y almacenamiento.
- *MediaPipe (visión por computadora):* Permite detectar y corregir la postura del usuario en tiempo real.
- *ARCore (realidad aumentada):* Brinda experiencias inmersivas de entrenamiento guiado.

En conjunto, se trata de una arquitectura basada en *cliente móvil + servicios en la nube*, con integración de capacidades avanzadas de visión artificial y AR.

---

## 🛠 Estructura de Carpetas (resumen)

`bash
## 📁 Estructura del Proyecto

La organización del proyecto sigue una arquitectura limpia (Clean Architecture) con separación por capas:

bash
📦SmartVision
├── app/             # Pantallas (Presentación)
├── assets/          # Imágenes, íconos, fuentes
├── components/      # Componentes reutilizables (botones, tarjetas, etc.)
├── constants/       # Constantes de estilo, rutas, textos, etc.
├── core/            # Lógica de negocio, modelos, casos de uso
├── infra/           # Infraestructura (Firebase, MediaPipe, ARCore)
├── .vscode/         # Configuración del entorno de desarrollo
├── .expo/           # Datos internos del entorno Expo
├── app.json         # Configuración principal de Expo
├── package.json     # Dependencias y scripts del proyecto
├── tsconfig.json    # Configuración de TypeScript
└── README.md        # Documentación del proyecto
`

---

🧰 Instalación y Configuración
✅ Requisitos Previos
Node.js >= 16

Expo CLI (npm install -g expo-cli)

PostgreSQL (local o en la nube)

Dispositivo físico Android compatible con ARCore

Editor como VS Code

---

🧠 Tecnologías Clave Adicionales
PostgreSQL: Utilizado como base de datos principal para almacenar usuarios, rutinas, progresos y métricas.

MediaPipe: Se usa para procesar video en tiempo real y detectar la postura del usuario durante el ejercicio.

ARCore: Se encarga de renderizar objetos virtuales sobre el entorno físico del usuario y guiar ejercicios con realidad aumentada.

---

git clone https://github.com/Thiago76/smart-vision.git
cd smart-vision

---

## Get started

1. Install dependencies

   bash
   npm install
   

2. Configura las variables de entorno

Crea un archivo .env en la raíz del proyecto con tus credenciales y rutas a la base de datos:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_vision
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña


3.Configura ips en los archivos Register / Login / api.js

baseURL: 'http://1xx.xx.xx.x:4000/api',

const response = await axios.post('http://1xx.xx.xx.x:4000/api/auth/login'
const response = await axios.post('http://1xx.xx.xx.x:4000/api/auth/register'

4. Iniciar Base de Datos

cd backend
node Server.js

Mensaje a recibir: Servidor corriendo en http://localhost:4000

5. Start the app

   bash
   npx expo start
   ```
