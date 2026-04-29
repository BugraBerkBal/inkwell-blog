# ✒️ Inkwell — Modern Blog Platformu

> Full Stack Blog Web Uygulaması | Yazılım Uzmanlığı Bitirme Projesi

![Teknoloji](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)
![Teknoloji](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)
![Teknoloji](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Teknoloji](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)

---

## 📋 Proje Hakkında

**Inkwell**, kullanıcıların yazı yazıp yayınlayabileceği, diğer yazarların içeriklerini keşfedebileceği modern bir blog platformudur. React tabanlı SPA frontend, Express.js REST API backend ve MongoDB veritabanından oluşur.

---

## 🗂️ Klasör Yapısı

```
inkwell-blog/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB bağlantısı
│   ├── controllers/
│   │   ├── authController.js  # Kayıt / Giriş / Profil
│   │   └── postController.js  # CRUD işlemleri
│   ├── middleware/
│   │   └── auth.js            # JWT doğrulama middleware'i
│   ├── models/
│   │   ├── User.js            # Kullanıcı şeması (OOP)
│   │   └── Post.js            # Yazı şeması (OOP)
│   ├── routes/
│   │   ├── auth.js            # /api/auth rotaları
│   │   └── posts.js           # /api/posts rotaları
│   ├── .env.example           # Ortam değişkenleri şablonu
│   ├── package.json
│   └── server.js              # Express uygulama giriş noktası
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # Merkezi HTTP istemcisi
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Üst navigasyon
│   │   │   ├── PostCard.jsx   # Blog yazısı kartı
│   │   │   ├── PrivateRoute.jsx # Korumalı rota
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global oturum yönetimi
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Ana sayfa (liste + filtre)
│   │   │   ├── PostDetail.jsx # Yazı detay
│   │   │   ├── CreatePost.jsx # Yeni yazı formu
│   │   │   ├── EditPost.jsx   # Yazı düzenleme
│   │   │   ├── MyPosts.jsx    # Kullanıcının yazıları
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NotFound.jsx
│   │   ├── styles/
│   │   │   └── global.css     # CSS değişkenleri & temel stiller
│   │   ├── App.jsx            # Router + Layout
│   │   └── main.jsx           # ReactDOM render
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── package.json               # Kök — iki sunucuyu birden çalıştırır
└── README.md
```

---

## ⚙️ Kurulum

### Gereksinimler

| Araç | Minimum Sürüm |
|------|---------------|
| Node.js | v18+ |
| npm | v9+ |
| MongoDB | v6+ |

### 1. MongoDB'yi Kur

**Windows:**
1. [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) adresinden Community Edition indir
2. Kurulum sihirbazını çalıştır (Install MongoDB as a Service seçeneğini işaretle)
3. MongoDB otomatik başlar — kontrol: `mongosh` komutunu çalıştır

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Projeyi İndir

```bash
# Klonla (ya da ZIP olarak indir)
git clone https://github.com/kullaniciadi/inkwell-blog.git
cd inkwell-blog
```

### 3. Backend Kurulum

```bash
cd backend

# Bağımlılıkları kur
npm install

# Ortam dosyasını oluştur
cp .env.example .env
```

`.env` dosyasını bir metin editörüyle aç ve düzenle:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogapp
JWT_SECRET=bu_satiri_guvenceli_uzun_bir_kelimeyle_degistir_min32karakter
NODE_ENV=development
```

### 4. Frontend Kurulum

```bash
cd ../frontend
npm install
```

---

## 🚀 Çalıştırma

İki terminal açarak:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → http://localhost:5000 adresinde çalışır
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:5173 adresinde çalışır
```

Tarayıcıda `http://localhost:5173` adresini aç.

---

## 🔌 API Referansı

### Auth Rotaları (`/api/auth`)

| Metot | Rota | Açıklama | Auth |
|-------|------|----------|------|
| POST | `/register` | Yeni kullanıcı kaydı | — |
| POST | `/login` | Giriş → JWT token | — |
| GET | `/me` | Oturum bilgisi | ✅ |

**Örnek — Kayıt:**
```json
POST /api/auth/register
{
  "username": "ahmet42",
  "email": "ahmet@mail.com",
  "password": "gizli123"
}
```

### Post Rotaları (`/api/posts`)

| Metot | Rota | Açıklama | Auth |
|-------|------|----------|------|
| GET | `/` | Tüm yazılar (sayfalama + filtre) | — |
| GET | `/:id` | Tek yazı | — |
| POST | `/` | Yeni yazı oluştur | ✅ |
| PUT | `/:id` | Yazı güncelle (sadece sahibi) | ✅ |
| DELETE | `/:id` | Yazı sil (sadece sahibi) | ✅ |
| GET | `/user/my-posts` | Kendi yazılarım | ✅ |

**Query Parametreleri (GET /):**
```
?page=1&limit=9&category=Teknoloji&search=javascript
```

---

## 🏗️ Mimari & Teknik Kararlar

### OOP Kullanımı
- **User Model:** `matchPassword()` instance metodu, `pre('save')` hook ile bcrypt hashing
- **Post Model:** `getReadTime()` instance metodu, `pre('save')` hook ile otomatik özet oluşturma
- **AuthController:** Tek sorumluluk ilkesiyle modüler fonksiyonlar

### Güvenlik
- Şifreler **bcryptjs** ile 10 salt round'la hashlenir
- JWT token'lar 7 gün geçerlidir, `Authorization: Bearer <token>` ile taşınır
- Sahiplik kontrolleri backend'de; kullanıcı başkasının yazısını güncelleyemez/silemez

### Frontend Mimari
- **React Context API** ile global oturum yönetimi
- **Axios interceptor** ile tüm isteklere otomatik token ekleme
- **PrivateRoute** bileşeni ile sayfa koruma
- **Debounce** ile arama kutusunda gereksiz API çağrısı engelleme

---

## 🎨 UI/UX Tasarım

- **Renk Paleti:** Krem (#FAFAF7) + Terracotta aksan (#C8563A)
- **Tipografi:** Playfair Display (başlıklar) + DM Sans (metin)
- **Tasarım Dili:** Editorial Minimal
- **Responsive:** Mobil öncelikli, 3 breakpoint
- **Animasyonlar:** Sayfa geçişlerinde `fadeInUp`, hover efektleri, navbar scroll

---

## 📦 Kullanılan Paketler

**Backend:**
| Paket | Amaç |
|-------|------|
| express | HTTP sunucusu |
| mongoose | MongoDB ODM |
| bcryptjs | Şifre hashleme |
| jsonwebtoken | JWT oluşturma/doğrulama |
| cors | Cross-Origin isteklere izin |
| dotenv | Ortam değişkenleri |
| nodemon | Geliştirme sırasında otomatik yeniden başlatma |

**Frontend:**
| Paket | Amaç |
|-------|------|
| react + react-dom | UI kütüphanesi |
| react-router-dom | SPA yönlendirme |
| axios | HTTP istemcisi |
| vite | Geliştirme sunucusu & bundler |

---

## 🛠️ Geliştirme Notları

```bash
# Backend logları izle
cd backend && npm run dev

# Frontend hot-reload
cd frontend && npm run dev

# Production build (frontend)
cd frontend && npm run build
```

---

## 👤 Geliştirici

Bu proje, yazılım uzmanlığı bitirme projesi kapsamında geliştirilmiştir.

---

*Inkwell Blog — Fikirlerinizi Dünyayla Paylaşın* ✒️
