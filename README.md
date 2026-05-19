# Agri-Tech

The application simplifies the life of farmers by offering features such as a farm dashboard, crop monitoring, weather updates, and access to expert advice. With modules for resource purchase, community forums, and data analytics, the app creates a full ecosystem for agricultural productivity. The backend is developed using the MVC pattern for scalability and maintainability. Admins manage system content and user activities, while farmers benefit from personalized features like real-time alerts, field tracking, and resource planning.
Each user type — farmers and admins — has a dedicated interface to streamline their workflows and responsibilities. The system stores and processes large volumes of agricultural data, helping users make evidence-based decisions. Security and role-based access ensure safe usage and data protection. Overall, the platform aims to digitally transform farming operations


**Status:** planning
**Domain:** Sustainability & Green Tech
**Progress:** 0%

---
<<<<<<< HEAD

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#️-teknologi-yang-digunakan)
- [Arsitektur Sistem](#️-arsitektur-sistem)
- [Struktur Folder](#-struktur-folder)
- [Instalasi](#-instalasi--menjalankan)
- [Environment Variables](#️-konfigurasi-environment)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#️-database-schema)
- [Tim Pengembang](#-tim-pengembang)

---

## 🌱 Tentang Proyek

AgriTech adalah aplikasi web full-stack yang dirancang untuk **mentransformasi operasi pertanian secara digital**. Platform ini menjawab tantangan nyata yang dihadapi petani Indonesia dalam mengakses informasi pertanian yang tepat waktu dan berbasis data.

### Problem Statement

Pertanian tetap menjadi tulang punggung banyak perekonomian, namun petani terus menghadapi:

- Kurangnya informasi real-time (cuaca, harga pasar, kondisi tanaman)
- Penggunaan sumber daya yang tidak efisien
- Sistem yang terfragmentasi dan sulit digunakan
- Tidak ada platform terpusat untuk komunikasi antar petani dan ahli

### Solusi

AgriTech mengintegrasikan semua kebutuhan pertanian dalam **satu platform digital** yang mudah digunakan, membantu petani membuat keputusan berbasis data untuk meningkatkan produktivitas dan pendapatan.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🔐 **Autentikasi** | Register, login dengan JWT, role-based access (farmer & admin) |
| 📊 **Dashboard** | Overview farm, stat cards, alert tanaman sakit, pie chart |
| 🏡 **Farm Management** | CRUD farm lengkap |
| 🌱 **Crop Monitoring** | Monitor kesehatan tanaman real-time dengan alert otomatis |
| 🌦️ **Cuaca Real-time** | Integrasi OpenWeatherMap — auto-detect & search kota |
| 💡 **Rekomendasi** | Panduan pupuk & irigasi berdasarkan fase pertumbuhan tanaman |
| 📊 **Harga Pasar** | Pantau harga komoditas pertanian dengan grafik tren |
| 🛒 **Pembelian Sumber Daya** | Beli pupuk, pestisida, benih, dan alat tani |
| 💬 **Forum Komunitas** | Diskusi dan berbagi pengalaman antar petani |
| 🧑‍🌾 **Saran Ahli** | Konsultasi pertanian dengan admin/ahli |
| ⚙️ **Admin Panel** | Kelola pengguna dan pantau statistik sistem |

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React.js** (v18) + **Vite**
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client
- **Bootstrap 5** — Responsive UI
- **Recharts** — Visualisasi data

### Backend
- **Node.js** + **Express.js**
- **Mongoose** — ODM untuk MongoDB
- **JWT** — Autentikasi stateless
- **Bcryptjs** — Hash password

### Database & API
- **MongoDB** — NoSQL database
- **OpenWeatherMap API** — Data cuaca real-time

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────┐
│           CLIENT (React + Vite)              │
│  Login │ Dashboard │ Farms │ Crops │ ...     │
└──────────────────┬──────────────────────────┘
                   │ HTTP Axios
                   ▼
┌─────────────────────────────────────────────┐
│         SERVER (Node.js + Express)           │
│   Routes → Controllers → Models → MongoDB   │
│   Middleware: JWT Auth + Role Check          │
└──────────────┬──────────────────────────────┘
               │
     ┌─────────┴──────────┐
     ▼                    ▼
MongoDB Atlas      OpenWeatherMap API
```

Pola arsitektur: **MVC (Model-View-Controller)**

---

## 📁 Struktur Folder

```
agritech/
├── client/                         # Frontend React + Vite
│   └── src/
│       ├── components/
│       │   └── Navbar.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Farm.jsx
│       │   ├── Crop.jsx
│       │   ├── Recommendations.jsx
│       │   ├── MarketPrice.jsx
│       │   ├── Market.jsx
│       │   ├── Forum.jsx
│       │   ├── ExpertAdvice.jsx
│       │   └── Admin.jsx
│       ├── services/api.js
│       ├── App.jsx
│       └── index.css
│
└── server/                         # Backend Node.js + Express
    ├── controllers/
    │   ├── authController.js
    │   ├── farmController.js
    │   ├── cropController.js
    │   ├── dashboardController.js
    │   ├── weatherController.js
    │   ├── forumController.js
    │   ├── productController.js
    │   ├── expertController.js
    │   └── adminController.js
    ├── models/
    │   ├── User.js
    │   ├── Farm.js
    │   ├── Crop.js
    │   ├── Forum.js
    │   ├── Product.js
    │   ├── Order.js
    │   └── Expert.js
    ├── routes/
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── roleMiddleware.js
    └── index.js
```

---

## 🚀 Instalasi & Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) lokal atau [MongoDB Atlas](https://www.mongodb.com/atlas)
- API Key [OpenWeatherMap](https://openweathermap.org/api) (gratis)

### Step 1 — Konfigurasi `.env`

Buat file `.env` di folder `server/`:

```env
MONGO_URI=mongodb://localhost:27017/agritech
JWT_SECRET=your_secret_key_here
PORT=5000
WEATHER_API_KEY=your_openweathermap_api_key
```

### Step 2 — Jalankan Backend

```bash
cd server
npm install
npx nodemon index.js
```

```
🚀 Server running on port 5000
✅ MongoDB Connected
```

### Step 3 — Jalankan Frontend

```bash
cd client
npm install
npm run dev
```

Buka browser: **http://localhost:5173**

### Step 4 — Buat Akun Admin (Opsional)

Jalankan di `mongosh` untuk upgrade role menjadi admin:

```javascript
use agritech
db.users.updateOne(
  { email: "email_anda@gmail.com" },
  { $set: { role: "admin" } }
)
```

---

## ⚙️ Konfigurasi Environment

| Variable | Deskripsi | Contoh |
|---|---|---|
| `MONGO_URI` | URL koneksi MongoDB | `mongodb://localhost:27017/agritech` |
| `JWT_SECRET` | Secret key untuk JWT | `agritech_secret_2024` |
| `PORT` | Port server backend | `5000` |
| `WEATHER_API_KEY` | API key OpenWeatherMap | `abc123xyz` |

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/v1`

> 🔒 Protected = butuh `Authorization: Bearer <token>`
> 👑 Admin = butuh role admin

### Auth
| Method | Endpoint | Akses |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |

### Farm & Crop
| Method | Endpoint | Akses |
|---|---|---|
| GET/POST | `/farms` | 🔒 |
| PUT/DELETE | `/farms/:id` | 🔒 |
| GET/POST | `/crops` | 🔒 |
| PUT/DELETE | `/crops/:id` | 🔒 |

### Fitur Lainnya
| Method | Endpoint | Akses |
|---|---|---|
| GET | `/dashboard` | 🔒 |
| GET | `/weather?city=Medan` | 🔒 |
| GET/POST | `/forum` | 🔒 |
| GET/POST | `/expert` | 🔒 |
| PUT | `/expert/:id/answer` | 👑 |
| GET | `/products` | 🔒 |
| POST | `/products/order` | 🔒 |

### Admin

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/admin/stats` | 👑 |
| GET | `/admin/users` | 👑 |
| PATCH | `/admin/users/:id/role` | 👑 |
| DELETE | `/admin/users/:id` | 👑 |

---

## 🗄️ Database Schema

### Collections

| Collection | Field Utama |
|---|---|
| `users` | name, email, password (bcrypt), role, timestamps |
| `farms` | userId (ref), name, location, size, timestamps |
| `crops` | farmId (ref), name, stage, healthStatus, plantingDate |
| `forums` | userId, title, content, category, replies[] |
| `products` | name, category, price, unit, stock |
| `orders` | userId, items[], totalPrice, status, address |
| `experts` | userId, question, category, answer, answeredBy, status |

### Relasi

```
users  ──(1:N)──▶  farms
farms  ──(1:N)──▶  crops
users  ──(1:N)──▶  forums
users  ──(1:N)──▶  orders
users  ──(1:N)──▶  experts
```

---

## Author
Yuna

---

## 📦 Deliverables

- [x] Source code (ZIP)
- [x] Dokumentasi proyek (Word)
- [x] Phase-wise template (Word)

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk petani Indonesia</p>
  <strong>AgriTech</strong> — Platform Smart Farming | MERN Stack Capstone Project
  <br/>
  Sustainability & Green Tech
</div>
=======
*Synced from Zaby LMS Capstone Workspace*
>>>>>>> 07dd2451c97cdde2d7ef4dc870ee77811776dbc9
