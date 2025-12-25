<![CDATA[<div align="center">

# 📋 LAPORAN TEKNIS LENGKAP
## Proyek Website GamerZone TopUp

---

**Versi Dokumen:** 2.0  
**Tanggal Penyusunan:** 25 Desember 2024  
**Tim Pengembang:** GamerZone Development Team

</div>

---

## 📑 Daftar Isi

| No | Bagian |
|----|--------|
| 1 | [Ringkasan Teknologi](#-1-ringkasan-teknologi-yang-digunakan) |
| 2 | [Detail Stack Frontend](#-2-detail-stack-frontend) |
| 3 | [Detail Stack Backend](#-3-detail-stack-backend) |
| 4 | [Arsitektur Folder & Struktur Proyek](#-4-arsitektur-folder--struktur-proyek) |
| 5 | [Logika Sisi Backend (Node.js/Express)](#-5-logika-sisi-backend-nodejsexpress) |
| 6 | [Logika Sisi Frontend (React/Vite)](#-6-logika-sisi-frontend-reactvite) |
| 7 | [Alur Integrasi End-to-End](#-7-alur-integrasi-end-to-end) |
| 8 | [API Eksternal yang Digunakan](#-8-api-eksternal-yang-digunakan) |
| 9 | [Kesimpulan](#-9-kesimpulan) |

---

# 🛠 1. Ringkasan Teknologi yang Digunakan

## 1.1 Overview Tech Stack

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         GAMERZONE TOPUP TECH STACK                            ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────┐    ║
║   │                        🎨 FRONTEND LAYER                            │    ║
║   │                                                                     │    ║
║   │   React 18  •  Vite 5  •  Tailwind CSS  •  Framer Motion          │    ║
║   │   Three.js  •  React Router  •  Axios  •  Lucide Icons            │    ║
║   │                                                                     │    ║
║   └─────────────────────────────────────────────────────────────────────┘    ║
║                                    ▼                                          ║
║   ┌─────────────────────────────────────────────────────────────────────┐    ║
║   │                        ⚙️ BACKEND LAYER                             │    ║
║   │                                                                     │    ║
║   │   Node.js  •  Express.js  •  gRPC  •  Mongoose                    │    ║
║   │   Firebase  •  Fuse.js  •  UUID  •  Dotenv                        │    ║
║   │                                                                     │    ║
║   └─────────────────────────────────────────────────────────────────────┘    ║
║                                    ▼                                          ║
║   ┌─────────────────────────────────────────────────────────────────────┐    ║
║   │                        💾 DATABASE LAYER                            │    ║
║   │                                                                     │    ║
║   │   MongoDB  •  MongoDB Memory Server (Fallback)  •  JSON Files     │    ║
║   │                                                                     │    ║
║   └─────────────────────────────────────────────────────────────────────┘    ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

## 1.2 Statistik Proyek

| Metrik | Frontend | Backend | Total |
|--------|----------|---------|-------|
| **Dependencies** | 13 | 12 | **25** |
| **Dev Dependencies** | 10 | 0 | **10** |
| **Total Packages** | 23 | 12 | **35** |

---

# 🎨 2. Detail Stack Frontend

## 2.1 Core Libraries (Dependencies)

### ⚛️ React Ecosystem

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **react** | ^18.2.0 | Library utama untuk membangun user interface berbasis komponen | Fondasi seluruh aplikasi frontend |
| **react-dom** | ^18.2.0 | Package untuk merender React ke DOM browser | Mounting aplikasi ke `<div id="root">` |
| **react-router-dom** | ^6.20.0 | Library routing untuk Single Page Application (SPA) | Navigasi antar halaman: Home, Games, TopUp, Admin, dll. |
| **react-query** | ^3.39.3 | Library untuk data fetching, caching, dan state management server | Caching data API untuk performa optimal |

### 🌐 HTTP & Data

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **axios** | ^1.6.0 | HTTP client berbasis Promise untuk browser dan Node.js | Komunikasi dengan backend API (`GET`, `POST`, `PUT`, `DELETE`) |
| **@supabase/supabase-js** | ^2.39.0 | Client SDK untuk Supabase (Backend-as-a-Service) | Integrasi dengan layanan Supabase (opsional/alternative auth) |

### 🎬 3D Graphics & Animation

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **three** | ^0.160.0 | Library JavaScript untuk membuat grafik 3D di browser | Render animasi 3D di halaman Hero |
| **@react-three/fiber** | ^8.16.0 | React renderer untuk Three.js | Integrasi Three.js dengan komponen React |
| **@react-three/drei** | ^9.105.0 | Kumpulan helper dan abstraksi untuk React Three Fiber | Mempermudah pembuatan scene 3D (lighting, controls, dll.) |
| **framer-motion** | ^11.0.0 | Library animasi untuk React dengan API deklaratif | Animasi transisi halaman, hover effects, dan micro-interactions |

### 🎥 Media & Utilities

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **react-player** | ^2.16.0 | Komponen React untuk memutar video dari berbagai sumber | Menampilkan video trailer game |
| **lucide-react** | ^0.360.0 | Icon library modern berbasis React | Ikon UI di seluruh aplikasi (menu, tombol, status) |
| **classnames** | ^2.5.1 | Utility untuk menggabungkan CSS class names secara kondisional | Dynamic styling berdasarkan state komponen |

## 2.2 Development Tools (Dev Dependencies)

### 🔧 Build & Bundle

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **vite** | ^5.2.0 | Build tool generasi baru dengan Hot Module Replacement (HMR) super cepat | Development server & production bundling |
| **@vitejs/plugin-react** | ^4.2.1 | Plugin Vite untuk dukungan React (Fast Refresh) | Integrasi React dengan Vite |

### 🎨 Styling

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **tailwindcss** | ^3.4.1 | Utility-first CSS framework | Styling seluruh komponen UI |
| **postcss** | ^8.4.38 | Tool untuk transformasi CSS dengan JavaScript plugins | Processing Tailwind CSS |
| **autoprefixer** | ^10.4.19 | PostCSS plugin untuk menambahkan vendor prefixes secara otomatis | Kompatibilitas cross-browser |

### 🔍 Code Quality

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **eslint** | ^8.57.0 | Linter JavaScript untuk menemukan dan memperbaiki masalah kode | Menjaga kualitas dan konsistensi kode |
| **eslint-plugin-react** | ^7.34.1 | Plugin ESLint khusus untuk React | Rules spesifik untuk komponen React |
| **eslint-plugin-react-hooks** | ^4.6.0 | Plugin ESLint untuk memvalidasi React Hooks | Memastikan penggunaan hooks yang benar |
| **eslint-plugin-react-refresh** | ^0.4.6 | Plugin ESLint untuk React Refresh/Fast Refresh | Kompatibilitas dengan Vite |

### 📦 Type Definitions

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **@types/react** | ^18.2.66 | TypeScript definitions untuk React | IntelliSense dan autocomplete di IDE |
| **@types/react-dom** | ^18.2.22 | TypeScript definitions untuk React DOM | IntelliSense untuk ReactDOM API |

## 2.3 Konfigurasi Tailwind CSS

```javascript
// tailwind.config.js
{
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 🎨 PALET WARNA CYBERPUNK
        'cyber-black': '#0B0C15',    // Background utama
        'cyber-dark': '#12131E',     // Background sekunder
        'cyber-gray': '#1A1B2E',     // Card background
        'cyber-slate': '#252640',    // Border & divider
        'cyber-cyan': '#00FFFF',     // Accent primary
        'cyber-blue': '#00BFFF',     // Accent secondary
        'cyber-purple': '#BC13FE',   // Highlight
        'cyber-magenta': '#FF00FF',  // Gradient accent
        'cyber-violet': '#8B5CF6',   // Button hover
        'cyber-gold': '#FFD700',     // Premium/VIP
        'cyber-green': '#00FF88',    // Success status
        'cyber-white': '#FFFFFF',    // Text primary
        'cyber-muted': '#8F90A6',    // Text secondary
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],     // Body text
        orbitron: ['Orbitron', 'sans-serif'],           // Heading futuristik
      },
    },
  },
}
```

---

# ⚙ 3. Detail Stack Backend

## 3.1 Core Libraries (Dependencies)

### 🖥 Server Framework

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **express** | ^4.18.2 | Framework web minimalis dan fleksibel untuk Node.js | HTTP API server pada port 3002 |
| **body-parser** | ^1.20.2 | Middleware untuk parsing request body | Parsing JSON data dari request POST/PUT |
| **cors** | ^2.8.5 | Middleware untuk mengaktifkan Cross-Origin Resource Sharing | Mengizinkan request dari frontend (localhost:5173) |
| **dotenv** | ^16.4.0 | Memuat environment variables dari file `.env` | Konfigurasi API keys dan koneksi database |

### 💾 Database

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **mongoose** | ^8.0.0 | ODM (Object Document Mapper) untuk MongoDB | Definisi skema dan operasi database untuk Game, User, News |
| **mongodb-memory-server** | ^11.0.1 | In-memory MongoDB server untuk development/testing | Fallback otomatis jika MongoDB lokal tidak tersedia |

### 📡 Real-time Communication (gRPC)

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **@grpc/grpc-js** | ^1.10.0 | Implementasi gRPC pure JavaScript | Server gRPC untuk fitur Chat real-time (port 50051) |
| **@grpc/proto-loader** | ^0.7.10 | Loader untuk file Protocol Buffer (.proto) | Load definisi service dari `chat.proto` |
| **google-protobuf** | ^3.21.2 | Library Protocol Buffers untuk serialisasi data | Serialisasi message chat |

### 🔌 External Services & Utilities

| Library | Versi | Deskripsi | Penggunaan dalam Proyek |
|---------|-------|-----------|-------------------------|
| **firebase** | ^10.0.0 | SDK Firebase untuk autentikasi dan layanan lainnya | Integrasi Firebase (authentication, optional) |
| **axios** | ^1.6.0 | HTTP client untuk melakukan request ke API eksternal | Fetch berita dari GameSpot API |
| **fuse.js** | ^7.0.0 | Library fuzzy-search yang ringan | Fitur pencarian game dengan toleransi typo |
| **uuid** | ^9.0.1 | Generator UUID (Universally Unique Identifier) | Generate ID unik untuk transaksi dan entitas lainnya |

## 3.2 Arsitektur Server

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   server.js (Orchestrator)                                                 │
│   ┌──────────────────────────────────────────────────────────────────┐    │
│   │                                                                  │    │
│   │   ┌─────────────────┐           ┌─────────────────┐             │    │
│   │   │   gateway.js    │           │    index.js     │             │    │
│   │   │   (Express)     │           │    (gRPC)       │             │    │
│   │   │                 │           │                 │             │    │
│   │   │   Port: 3002    │           │   Port: 50051   │             │    │
│   │   │                 │           │                 │             │    │
│   │   │   • REST API    │           │   • Chat        │             │    │
│   │   │   • Admin CRUD  │           │   • Real-time   │             │    │
│   │   │   • Transaksi   │           │   • Streaming   │             │    │
│   │   │                 │           │                 │             │    │
│   │   └────────┬────────┘           └────────┬────────┘             │    │
│   │            │                             │                       │    │
│   │            ▼                             ▼                       │    │
│   │   ┌─────────────────────────────────────────────────────┐       │    │
│   │   │              config/db.js                           │       │    │
│   │   │                                                     │       │    │
│   │   │   MongoDB ─────▶ Fallback ─────▶ In-Memory Server  │       │    │
│   │   │                                                     │       │    │
│   │   └─────────────────────────────────────────────────────┘       │    │
│   │                                                                  │    │
│   └──────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 🏗 4. Arsitektur Folder & Struktur Proyek

## 4.1 Struktur Direktori Lengkap

```
📦 all code/
│
├── 📂 backend/                          # SERVER-SIDE
│   │
│   ├── 📂 config/
│   │   └── 📄 db.js                     # Koneksi MongoDB + fallback logic
│   │
│   ├── 📂 controllers/
│   │   ├── 📄 GamesController.js        # Katalog game publik (GameSpot)
│   │   ├── 📄 LocalGamesController.js   # CRUD Game & Transaksi lokal
│   │   ├── 📄 NewsController.js         # Fetch berita dari API eksternal
│   │   ├── 📄 SystemController.js       # Status sistem
│   │   ├── 📄 TransactionController.js  # Logika transaksi
│   │   └── 📄 ... (lainnya)
│   │
│   ├── 📂 data/
│   │   ├── 📄 games.json                # Penyimpanan game (JSON fallback)
│   │   └── 📄 transactions.json         # Penyimpanan transaksi (JSON fallback)
│   │
│   ├── 📂 models/
│   │   ├── 📄 Game.js                   # Skema Mongoose: Game/TopUp
│   │   ├── 📄 News.js                   # Skema Mongoose: Berita
│   │   └── 📄 User.js                   # Skema Mongoose: User
│   │
│   ├── 📄 chat.proto                    # Protocol Buffer definition untuk gRPC
│   ├── 📄 gateway.js                    # Express HTTP Server (Port 3002)
│   ├── 📄 index.js                      # gRPC Server (Port 50051)
│   ├── 📄 server.js                     # Entry point & orchestrator
│   ├── 📄 package.json                  # Dependencies backend
│   └── 📄 .env                          # Environment variables
│
└── 📂 frontend/                         # CLIENT-SIDE
    │
    ├── 📂 src/
    │   │
    │   ├── 📂 components/               # Komponen UI Reusable
    │   │   ├── 📄 Navbar.jsx            # Navigation bar
    │   │   ├── 📄 Footer.jsx            # Footer website
    │   │   ├── 📄 GameCard.jsx          # Card produk game
    │   │   ├── 📄 ChatWidget.jsx        # Widget chat floating
    │   │   ├── 📄 PaymentSection.jsx    # Form pembayaran
    │   │   ├── 📄 Hero3D.jsx            # Hero section dengan 3D
    │   │   ├── 📄 StarField.jsx         # Background animasi bintang
    │   │   ├── 📄 LoadingScreen.jsx     # Loading screen
    │   │   └── 📄 ... (20+ komponen)
    │   │
    │   ├── 📂 context/                  # State Management (React Context)
    │   │   ├── 📄 DataContext.jsx       # ⭐ Single Source of Truth
    │   │   ├── 📄 AuthContext.jsx       # Autentikasi user
    │   │   ├── 📄 ChatContext.jsx       # State chat real-time
    │   │   └── 📄 ToastContext.jsx      # Notifikasi toast
    │   │
    │   ├── 📂 pages/                    # Halaman Aplikasi
    │   │   ├── 📄 Home.jsx              # Halaman beranda
    │   │   ├── 📄 GamesPage.jsx         # Katalog game
    │   │   ├── 📄 GameDetailsPage.jsx   # Detail produk
    │   │   ├── 📄 TopUpPage.jsx         # ⭐ Halaman top-up
    │   │   ├── 📄 SuccessPage.jsx       # Konfirmasi sukses
    │   │   ├── 📄 NewsPage.jsx          # Berita gaming
    │   │   ├── 📄 LoginPage.jsx         # Login user/admin
    │   │   ├── 📄 AdminDashboardPage.jsx# ⭐ Dashboard admin
    │   │   └── 📄 TransactionPage.jsx   # Riwayat transaksi
    │   │
    │   ├── 📄 App.jsx                   # Root component & routing
    │   ├── 📄 main.jsx                  # Entry point React
    │   └── 📄 index.css                 # Global styles + Tailwind
    │
    ├── 📄 index.html                    # HTML template
    ├── 📄 vite.config.js                # Konfigurasi Vite
    ├── 📄 tailwind.config.js            # Konfigurasi Tailwind CSS
    ├── 📄 postcss.config.js             # Konfigurasi PostCSS
    ├── 📄 package.json                  # Dependencies frontend
    └── 📄 .env                          # Environment variables (VITE_API_URL)
```

---

# ⚙ 5. Logika Sisi Backend (Node.js/Express)

## 5.1 Daftar Lengkap API Endpoints

### 📌 Game Management (Admin)

| Method | Endpoint | Controller | Deskripsi |
|--------|----------|------------|-----------|
| `GET` | `/api/admin/games` | `LocalGamesController.getLocalGames` | Ambil semua game |
| `POST` | `/api/admin/games` | `LocalGamesController.createGame` | Tambah game baru |
| `PUT` | `/api/admin/games/:id` | `LocalGamesController.updateGame` | Update game |
| `DELETE` | `/api/admin/games/:id` | `LocalGamesController.deleteGame` | Hapus game |

### 📌 Transaction Management

| Method | Endpoint | Controller | Deskripsi |
|--------|----------|------------|-----------|
| `GET` | `/api/admin/transactions` | `LocalGamesController.getTransactions` | Ambil semua transaksi |
| `POST` | `/api/v1/transaction/create` | `LocalGamesController.createTransaction` | Buat transaksi baru |
| `PUT` | `/api/admin/transactions/:id/status` | `LocalGamesController.updateTransactionStatus` | Update status |

### 📌 Public APIs

| Method | Endpoint | Controller | Deskripsi |
|--------|----------|------------|-----------|
| `GET` | `/api/catalog` | `GamesController.getGamesByGenre` | Katalog game publik |
| `GET` | `/api/catalog/game/:id` | `GamesController.getGameById` | Detail game |
| `GET` | `/api/news` | `NewsController.getGameNews` | Berita dari GameSpot |
| `GET` | `/api/admin/status` | `SystemController.getSystemStatus` | Status sistem |
| `GET` | `/api/ping` | (inline) | Health check |

### 📌 Chat (gRPC via HTTP Gateway)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/chat/send` | Kirim pesan chat |
| `GET` | `/api/chat/join` | Join chat room (SSE stream) |

## 5.2 Skema Database Detail

### 📦 Game Schema

```javascript
const gameSchema = new mongoose.Schema({
  // INFORMASI DASAR
  title:       { type: String, required: true },
  description: { type: String, required: true },
  genre:       { type: String, required: true },
  image:       { type: String, required: true },
  platform:    { type: String, default: 'PC' },
  
  // TIPE & HARGA
  gameType: {
    type: String,
    enum: ['GAME', 'TOPUP'],
    default: 'TOPUP',
    required: true
  },
  price: { type: Number, default: 0 },
  
  // OPSI TOP-UP
  topUpOptions: [{
    label: { type: String, required: true },  // "100 Diamonds"
    value: { type: String, required: true },  // "100_diam"
    price: { type: Number, required: true }   // 15000
  }],
  
  // STATUS
  status: { type: String, default: 'Active' },
  originalId: { type: String }
}, { timestamps: true });
```

### 📦 Transaction Schema (Implicit)

```javascript
const transactionSchema = {
  id:            String,    // "TRX-1703512345678"
  userId:        String,    // "user123" atau "guest"
  username:      String,    // "JohnDoe"
  avatar:        String,    // DiceBear URL
  game:          String,    // "Mobile Legends"
  gameType:      String,    // "TOPUP"
  item:          String,    // "100 Diamonds"
  amount:        Number,    // 15000
  status:        String,    // "Success"
  date:          String,    // "2024-12-25"
  timestamp:     String,    // ISO format
  paymentMethod: String     // "DANA"
};
```

---

# 🎨 6. Logika Sisi Frontend (React/Vite)

## 6.1 State Management: DataContext.jsx

```javascript
// DataContext.jsx - Single Source of Truth

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // ═══════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════
  const [games, setGames] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // ═══════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════
  const addGame = async (newGame) => { ... };
  const updateGame = async (id, data) => { ... };
  const deleteGame = async (id) => { ... };
  const addTransaction = async (trx) => { ... };
  const updateTransactionStatus = async (id, status) => { ... };
  
  // ═══════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════
  const getStats = () => {
    const totalIncome = transactions
      .filter(t => t.status === 'Success')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalTransactions: transactions.length };
  };
  
  const generateAvatar = (username) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(username)}`;
  };

  return (
    <DataContext.Provider value={{
      games, addGame, updateGame, deleteGame,
      transactions, addTransaction, updateTransactionStatus,
      getStats, generateAvatar
    }}>
      {children}
    </DataContext.Provider>
  );
};
```

## 6.2 Fitur-Fitur Utama

| Fitur | File | Deskripsi |
|-------|------|-----------|
| **Pemilihan Nominal** | `TopUpPage.jsx` | Radio button dinamis dari `topUpOptions` |
| **Simulasi Pembayaran** | `TopUpPage.jsx` | Validasi → Create Transaction → Redirect Success |
| **Avatar Otomatis** | `DataContext.jsx` | DiceBear API dengan seed username |
| **Admin Dashboard** | `AdminDashboardPage.jsx` | CRUD produk + monitor transaksi |
| **Real-time Stats** | `LiveStats.jsx` | Total pendapatan & jumlah transaksi |
| **Chat Widget** | `ChatWidget.jsx` | gRPC streaming via SSE |

---

# 🔄 7. Alur Integrasi End-to-End

## 7.1 Diagram Alur Pembelian

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ALUR PEMBELIAN END-TO-END                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   👤 USER                   🖥️ FRONTEND                ⚙️ BACKEND          │
│                                                                             │
│   [1] Pilih Game ─────────▶ TopUpPage.jsx                                  │
│                                   │                                         │
│   [2] Pilih Nominal ──────▶ selectedDenom state                            │
│                                   │                                         │
│   [3] Isi User ID ────────▶ userId state                                   │
│                                   │                                         │
│   [4] Pilih Payment ──────▶ paymentMethod state                            │
│                                   │                                         │
│   [5] Klik BAYAR ─────────▶ handlePay()                                    │
│                                   │                                         │
│                                   ▼                                         │
│                            DataContext                                      │
│                            addTransaction()                                 │
│                                   │                                         │
│                                   ▼                                         │
│                            POST /api/v1/ ────────────▶ LocalGamesController │
│                            transaction/create                  │            │
│                                   │                            ▼            │
│                                   │                     writeData()         │
│                                   │                            │            │
│                                   │                            ▼            │
│                                   │               💾 transactions.json      │
│                                   │                            │            │
│                                   ◀────────────────────────────┘            │
│                                   │                                         │
│   [6] Redirect ◀──────────▶ /success                                       │
│                                                                             │
│   ════════════════════════════════════════════════════════════════════     │
│                                                                             │
│   👨‍💼 ADMIN                                                                 │
│                                                                             │
│   [7] Buka Dashboard ─────▶ AdminDashboardPage.jsx                         │
│                                   │                                         │
│                                   ▼                                         │
│                            useData().transactions                           │
│                                   │                                         │
│   [8] Lihat Transaksi ◀───▶ Tabel dengan Avatar DiceBear                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 🌐 8. API Eksternal yang Digunakan

## 8.1 DiceBear Avatar API

| Aspek | Detail |
|-------|--------|
| **URL** | `https://api.dicebear.com/7.x/pixel-art/svg` |
| **Method** | GET |
| **Parameter** | `seed` (string) - Menentukan avatar yang dihasilkan |
| **Response** | SVG Image |
| **Contoh** | `https://api.dicebear.com/7.x/pixel-art/svg?seed=JohnDoe` |

**Keunggulan:**
- ✅ Deterministik (username sama = avatar sama)
- ✅ Tidak perlu menyimpan gambar
- ✅ Gratis tanpa limit

## 8.2 GameSpot News API

| Aspek | Detail |
|-------|--------|
| **URL** | `https://www.gamespot.com/api/articles/` |
| **Method** | GET |
| **Auth** | API Key via query parameter |
| **Response** | JSON dengan daftar artikel |
| **Digunakan di** | `NewsController.js` |

## 8.3 Firebase (Optional)

| Aspek | Detail |
|-------|--------|
| **SDK** | `firebase ^10.0.0` |
| **Layanan** | Authentication, Realtime Database (opsional) |
| **Status** | Tersedia sebagai alternatif autentikasi |

## 8.4 CounterAPI — Statistik Transaksi Publik

CounterAPI digunakan untuk menghitung dan menampilkan **jumlah total transaksi** yang telah berhasil diproses oleh sistem secara publik. API ini bersifat persistensi di cloud sehingga counter tidak reset meski server restart.

### Informasi API

| Aspek | Detail |
|-------|--------|
| **Base URL** | `https://api.counterapi.dev/v1/` |
| **Namespace** | `gamerzone_official` |
| **Counter Name** | `topup-counter` |
| **Method** | GET (baca), GET dengan `/up` (increment) |
| **Response** | JSON `{ "count": <number> }` |

### Endpoint yang Digunakan

| Endpoint | Fungsi | Digunakan di |
|----------|--------|--------------|
| `GET /v1/gamerzone_official/topup-counter/` | Mengambil nilai counter saat ini | `LiveStats.jsx`, `AdminOverview.jsx` |
| `GET /v1/gamerzone_official/topup-counter/up` | Menambah counter +1 | `TopUpPage.jsx` (saat pembayaran sukses) |

### Implementasi dalam Kode

#### 1️⃣ Fetch Counter (LiveStats.jsx)

```javascript
// Mengambil jumlah transaksi untuk ditampilkan
useEffect(() => {
  fetch('https://api.counterapi.dev/v1/gamerzone_official/topup-counter/')
    .then(res => res.json())
    .then(data => {
      if (data && typeof data.count === 'number') {
        setCount(data.count);
      }
    })
    .catch(err => {
      // Fallback ke localStorage jika API gagal
      const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      setCount(localTransactions.length > 0 ? localTransactions.length : 1250);
    });
}, []);
```

#### 2️⃣ Increment Counter (TopUpPage.jsx)

```javascript
// Fire-and-forget increment setelah transaksi berhasil
fetch('https://api.counterapi.dev/v1/gamerzone_official/topup-counter/up')
  .then(res => res.json())
  .then(data => console.log('CounterAPI Increment:', data))
  .catch(err => console.error('CounterAPI Error:', err));
```

### Diagram Integrasi CounterAPI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COUNTERAPI INTEGRATION FLOW                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   👤 USER                                                                   │
│      │                                                                      │
│      ▼                                                                      │
│   [TopUpPage.jsx]                                                          │
│      │                                                                      │
│      │ ─── Klik "BAYAR" ──▶ handlePay()                                    │
│      │                           │                                          │
│      │                           ▼                                          │
│      │                    addTransaction() ✅                               │
│      │                           │                                          │
│      │                           ▼                                          │
│      │            ┌───────────────────────────────┐                        │
│      │            │  🌐 CounterAPI                │                        │
│      │            │  GET .../topup-counter/up     │                        │
│      │            │  Response: { count: 1251 }    │                        │
│      │            └───────────────────────────────┘                        │
│      │                                                                      │
│   ════════════════════════════════════════════════════════════════════     │
│                                                                             │
│   🌍 PUBLIC VIEW (LiveStats.jsx)                                           │
│      │                                                                      │
│      ▼                                                                      │
│   ┌───────────────────────────────┐                                        │
│   │  🌐 CounterAPI                │                                        │
│   │  GET .../topup-counter/       │                                        │
│   │  Response: { count: 1251 }    │                                        │
│   └───────────────────────────────┘                                        │
│      │                                                                      │
│      ▼                                                                      │
│   ┌───────────────────────────────────────────┐                            │
│   │  "1,251 Transactions Successfully        │                            │
│   │   Processed!"                            │                            │
│   └───────────────────────────────────────────┘                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Keunggulan CounterAPI

| Fitur | Penjelasan |
|-------|------------|
| ✅ **Gratis** | Tidak memerlukan API key atau registrasi |
| ✅ **Persisten** | Data tersimpan di cloud, tidak hilang saat restart server |
| ✅ **Publik** | Counter dapat dilihat oleh siapa saja dengan URL yang sama |
| ✅ **Fire-and-Forget** | Increment tidak memblokir alur utama transaksi |
| ✅ **Fallback Ready** | Jika API gagal, frontend fallback ke localStorage |

---

# ✨ 9. Kesimpulan

<div align="center">

## 📊 Ringkasan Teknologi GamerZone TopUp

</div>

### Total Teknologi yang Digunakan

| Kategori | Jumlah | Daftar Utama |
|----------|--------|--------------|
| **Frontend Core** | 4 | React, Vite, Tailwind CSS, React Router |
| **UI/Animation** | 4 | Framer Motion, Three.js, Lucide, Classnames |
| **Backend Core** | 4 | Express, Mongoose, gRPC, Dotenv |
| **Database** | 2 | MongoDB, MongoDB Memory Server |
| **External APIs** | 4 | DiceBear, GameSpot, Firebase, **CounterAPI** |
| **Dev Tools** | 4 | ESLint, PostCSS, Autoprefixer, TypeScript Defs |

### Keunggulan Arsitektur

| Fitur | Implementasi |
|-------|--------------|
| **🔄 Real-time Sync** | DataContext sebagai Single Source of Truth |
| **💾 Dual Persistence** | MongoDB + JSON File fallback |
| **🔥 Hot Reload** | Vite dengan Fast Refresh |
| **🎨 Design System** | Tailwind dengan custom cyber colors |
| **📱 Responsive** | Mobile-first dengan Tailwind utilities |
| **🚀 Performance** | React Query caching + optimistic updates |

---

<div align="center">

*Dokumen ini disiapkan untuk keperluan evaluasi teknis dan presentasi proyek akhir.*

**© 2024 GamerZone Development Team**

---

**📞 Kontak Tim:**  
Frontend Developer | Backend Developer | UI/UX Designer

</div>
]]>
