# 🌱 Semillitas - Aplicación Educativa Infantil

**Plataforma móvil educativa para niños de 3 a 8 años** que combina juegos interactivos, refuerzo positivo con monedas y avatares, y seguimiento personalizado del aprendizaje. Desarrollada con React Native + Expo para el frontend y Node.js + Express para el backend.

---

## 📱 Capturas de Pantalla

<img width="150" alt="login" src="https://github.com/user-attachments/assets/ba7fcdf8-67ac-4aed-99db-cfcccd18df7b" />
<img width="150" alt="dashboard" src="https://github.com/user-attachments/assets/1fb8a253-9a76-4750-ab2e-abfc92a8c017" />
<img width="150" alt="nino" src="https://github.com/user-attachments/assets/a3aa7e30-eb0e-415a-96de-899aad9638ca" />
<img width="150" alt="padre" src="https://github.com/user-attachments/assets/2b92e07a-cd51-4882-8527-eebacbd9acf4" />
<img width="150" alt="isla" src="https://github.com/user-attachments/assets/f8cfdbb5-6ce3-469e-a347-69bc8f5081a6" />
<img width="150" alt="juego" src="https://github.com/user-attachments/assets/f31832ea-66e5-497a-8b8e-8231c2cc1278" />
<img width="150" alt="load" src="https://github.com/user-attachments/assets/541339a0-96a7-49c1-a6d1-68b5fcbb7dcb" />
<img width="150" alt="skins" src="https://github.com/user-attachments/assets/0fe6cf0b-6f18-4254-9ed1-9ade13a69212" />
<img width="150" alt="matematicas" src="https://github.com/user-attachments/assets/6d29ac09-e720-4134-889b-9307751e98e5" />




---

## 🛠️ Tech Stack

### Frontend
![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-7.x-8B5CF6)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?logo=passport&logoColor=white)

### Infraestructura & DevOps
![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?logo=digitalocean&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_R2-F38020?logo=cloudflare&logoColor=white)
![Debian](https://img.shields.io/badge/Debian-A81D33?logo=debian&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?logo=pm2&logoColor=white)

---

## 🏗️ Arquitectura del Sistema


<img width="600" height="400" alt="arquitectura" src="https://github.com/user-attachments/assets/abe29da4-cadb-4e49-90f6-53d0843eb979" />

## ✨ Funcionalidades

### 🧒 Para el Niño
- **Juegos educativos:** Dibujo de letras, Quiz interactivo, Juego de voz
- **Tienda de avatares:** Compra y equipa avatares con monedas ganadas
- **Sistema de monedas:** Gana monedas al completar actividades

### 👨‍👩‍👧 Para el Padre
- **Dashboard de métricas:** Tiempo jugado, rachas, última actividad
- **Letras difíciles:** Identifica qué letras necesita reforzar el niño
- **Vinculación por QR:** Escanea un código QR para vincular padre e hijo
- **Perfiles múltiples:** Administra varios hijos desde una cuenta

### 🔐 Seguridad
- **Autenticación con Google OAuth 2.0**
- **JWT con refresh tokens** y rotación automática
- **Interceptor de Axios** que renueva tokens expirados automáticamente

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- Node.js >= 18
- Expo CLI
- MySQL
- Cuenta de Google Cloud (para OAuth)
- Cuenta de Cloudflare R2 (para assets)

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/VicHGC/Semillitas_Educational_MobileApp.git
cd Semillitas_Educational_MobileApp 

### 2️⃣ Configurar el Backend
```bash
cd Semillitas_Backend
npm install

# Crear archivo .env y configurar variables
cp .env.example .env
# Editar .env con tus credenciales

npm start




