# 🌱 Semillitas - Educational Mobile App for Kids

**Cross-platform educational app for children ages 3 to 8** that combines interactive games, positive reinforcement through coins and avatars, and personalized learning progress tracking. Built with React Native + Expo for the frontend and Node.js + Express for the backend.

> *"Children are the little seeds of the future — nurture them with the right tools, and watch them grow strong."*

---

## 📱 Screenshots

<img width="150" alt="Login screen with Google authentication" src="https://github.com/user-attachments/assets/ba7fcdf8-67ac-4aed-99db-cfcccd18df7b" />
<img width="150" alt="Child dashboard with activities" src="https://github.com/user-attachments/assets/1fb8a253-9a76-4750-ab2e-abfc92a8c017" />
<img width="150" alt="Child profile and progress view" src="https://github.com/user-attachments/assets/a3aa7e30-eb0e-415a-96de-899aad9638ca" />
<img width="150" alt="Parent dashboard with metrics" src="https://github.com/user-attachments/assets/2b92e07a-cd51-4882-8527-eebacbd9acf4" />
<img width="150" alt="Activity island selection screen" src="https://github.com/user-attachments/assets/f8cfdbb5-6ce3-469e-a347-69bc8f5081a6" />
<img width="150" alt="Educational game interface" src="https://github.com/user-attachments/assets/f31832ea-66e5-497a-8b8e-8231c2cc1278" />
<img width="150" alt="Loading screen with mascot" src="https://github.com/user-attachments/assets/541339a0-96a7-49c1-a6d1-68b5fcbb7dcb" />
<img width="150" alt="Avatar shop and customization" src="https://github.com/user-attachments/assets/0fe6cf0b-6f18-4254-9ed1-9ade13a69212" />
<img width="150" alt="Math activity gameplay" src="https://github.com/user-attachments/assets/6d29ac09-e720-4134-889b-9307751e98e5" />

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

### Infrastructure & DevOps
![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?logo=digitalocean&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_R2-F38020?logo=cloudflare&logoColor=white)
![Debian](https://img.shields.io/badge/Debian-A81D33?logo=debian&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?logo=pm2&logoColor=white)

---

## 🎯 The Problem

After the pandemic, Mexico faces a critical learning gap: **80% of 10-year-olds** struggle with literacy and math. Traditional teaching methods fail to capture the attention of children growing up in a digital world, leading to low motivation, poor retention, and widening educational inequality.

**Semillitas** ("little seeds") was created to change this. We believe children are like seeds — they need the right environment, care, and motivation to grow into strong, capable individuals. Our app turns learning into play, using:

- **AI-powered handwriting evaluation** for real-time feedback
- **Gamification mechanics** (coins, avatars, rewards) to keep children engaged
- **Parental monitoring** to track progress across multiple children
- **Interactive games** that adapt to each child's learning pace

---

## 🏗️ System Architecture

The backend runs on a **Debian 13 VM** on **Digital Ocean** with a **MySQL** database and an **Express.js** API managed by **PM2** behind an **Nginx** reverse proxy. Media assets (avatars, audio files) are served from **Cloudflare R2 Object Storage**. The React Native frontend communicates with the backend via HTTPS, with automatic JWT refresh handling through Axios interceptors.

<img width="600" height="400" alt="System architecture diagram" src="https://github.com/user-attachments/assets/abe29da4-cadb-4e49-90f6-53d0843eb979" />

---

## ✨ Features

### 🧒 For Children
- **Educational games:** Letter drawing, interactive quiz, voice recognition
- **Avatar shop:** Buy and equip avatars with earned coins
- **Coin system:** Earn rewards by completing activities
- **Visual progress:** Activity charts and streaks

### 👨‍👩‍👧 For Parents
- **Metrics dashboard:** Play time, streaks, last activity
- **Difficult letters:** Identifies which letters need reinforcement
- **QR linking:** Scan a QR code to link parent and child accounts
- **Multi-child support:** Manage several children from one account

### 🔐 Security
- **Google OAuth 2.0 authentication**
- **JWT with refresh tokens** and automatic rotation
- **Axios interceptor** that renews expired tokens seamlessly

---

## 🚀 Local Installation

### Prerequisites
- Node.js >= 18
- Expo CLI
- MySQL
- Google Cloud account (for OAuth)
- Cloudflare R2 account (for assets)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/VicHGC/Semillitas_Educational_MobileApp.git
cd Semillitas_Educational_MobileApp
```

### 2️⃣ Set up the Backend
```bash
cd Semillitas_Backend
npm install

# Create .env file and configure variables
cp .env.example .env
# Edit .env with your credentials

npm start
```

### 3️⃣ Set up the Frontend
```bash
cd Semillitas_Frontend
npm install

# Start with Expo
npx expo start
```

### Environment Variables (.env)
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=semillitas_db
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
R2_ACCESS_KEY_ID=your_r2_key
R2_SECRET_ACCESS_KEY=your_r2_secret
R2_BUCKET_NAME=semillitas-media
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
```

---

## 📱 Download the App via QR (Android only)

<img width="600" height="400" alt="QR code to download the app" src="https://github.com/user-attachments/assets/8822a6ba-a7c6-4c08-baff-6ebe725a12c1" />

---

## 📬 Contact

**Víctor Hugo Grajeda Cortés**  
[LinkedIn](https://www.linkedin.com/in/victor-hugo-grajeda-cortes-1928b0279/)  
victor.grajeda02@gmail.com

---

## 📄 License

This project is licensed under the **MIT License**.  
Current version: **v1.0.0**

[![GitHub](https://img.shields.io/badge/Repository-SemillitasApp-181717?logo=github)](https://github.com/VicHGC/Semillitas_Educational_MobileApp)
