# Evaluation System - ENROLLNOW

Sistem evaluasi mahasiswa berbasis Laravel dengan React (Inertia.js) untuk manajemen data mahasiswa, mata kuliah, periode akademik, enrollment, dan nilai.

## 🚀 Quick Start

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8.0
- NPM atau Yarn

### Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd evaluation
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install Node Dependencies**
   ```bash
   npm install
   ```

4. **Setup Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure Database**
   
   Edit file `.env` dan sesuaikan konfigurasi database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=evaluation
   DB_USERNAME=root
   DB_PASSWORD=your_password
   
   APP_NAME=Enrollnow
   ```

   **Catatan:** Database akan dibuat otomatis saat menjalankan migrasi, jadi tidak perlu membuat database secara manual.

6. **Run Migrations & Seeders**
   ```bash
   php artisan migrate --seed
   ```
   
   Perintah ini akan:
   - Membuat database `evaluation` secara otomatis (jika belum ada)
   - Menjalankan semua migrasi untuk membuat tabel
   - Menjalankan seeder untuk mengisi data awal

7. **Start Development Server**
   
   Terminal 1 (Laravel):
   ```bash
   php artisan serve
   ```
   
   Terminal 2 (Vite):
   ```bash
   npm run dev
   ```

8. **Akses Aplikasi**
   
   Buka browser dan akses: `http://localhost:8000`

## 🔐 Default Credentials

Setelah menjalankan seeder, gunakan credentials berikut untuk login:

### Admin User
- **Email:** `admin@horizon.ac.id`
- **Password:** `password`
- **Role:** Administrator (akses penuh)

### Regular User
- **Email:** `ardi.herdiana@horizon.ac.id`
- **Password:** `password`
- **Role:** User (akses terbatas)

Lihat [docs/CREDENTIALS.md](docs/CREDENTIALS.md) untuk informasi lengkap.

## 📋 Fitur Sistem

### Admin Features
- ✅ Dashboard dengan statistik lengkap dan grafik
- ✅ Manajemen Mahasiswa (CRUD)
- ✅ Manajemen Mata Kuliah (CRUD)
- ✅ Manajemen Periode Akademik (CRUD)
- ✅ Manajemen Enrollment (CRUD)
- ✅ Manajemen Nilai (CRUD)
- ✅ Perhitungan Nilai Otomatis
- ✅ Filter dan Pencarian
- ✅ Pagination

### User Features (Mahasiswa)
- ✅ Dashboard dengan statistik pribadi
- ✅ Lihat dan Edit Profil
- ✅ Pilih Mata Kuliah (Enrollment)
- ✅ Lihat Enrollment Saya
- ✅ Lihat Nilai Saya
- ✅ Distribusi Grade

## 🗄️ Struktur Database

- `users` - Data user/admin dengan role-based access
- `students` - Data mahasiswa
- `subjects` - Data mata kuliah
- `periods` - Data periode akademik (P1, P2)
- `enrollments` - Data pendaftaran mahasiswa ke mata kuliah
- `grades` - Data nilai mahasiswa per periode

## 📊 Formula Perhitungan Nilai

### Nilai Periode
```
Period Grade = (Class Standing × 60%) + (Periodical Exam × 40%)
```

### Nilai Akhir (Final Grade)
```
Final Grade = (P1 × 50%) + (P2 × 50%)
```

### Grade Point Scale
- **A (4.00):** 90.00 - 100.00
- **A- (3.75):** 85.00 - 89.99
- **B+ (3.50):** 80.00 - 84.99
- **B (3.00):** 70.00 - 79.99
- **B- (2.75):** 65.00 - 69.99
- **C+ (2.50):** 60.00 - 64.99
- **C (2.00):** 50.00 - 59.99
- **D (1.00):** 0.00 - 49.99

## 🛠️ Tech Stack

- **Backend:** Laravel 12.x
- **Frontend:** React 18 + TypeScript
- **UI Framework:** Inertia.js
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Charts:** Recharts
- **Database:** MySQL
- **Authentication:** Laravel Fortify

## 📚 Dokumentasi

- [CREDENTIALS.md](docs/CREDENTIALS.md) - Informasi login dan credentials
- [ALUR_PENGGUNAAN.md](docs/ALUR_PENGGUNAAN.md) - Panduan lengkap alur penggunaan sistem

## 🔧 Development Commands

```bash
# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Build for production
npm run build

# Run tests
php artisan test
```

## 🎨 Customization

### Mengubah Warna Tema
Edit file `resources/css/app.css` untuk mengubah warna primary theme.

### Mengubah Logo
Ganti file `public/enrollnow.png` dengan logo Anda.

## ⚠️ Troubleshooting

### Database tidak dibuat otomatis
Pastikan user MySQL memiliki permission untuk membuat database, atau buat database secara manual:
```sql
CREATE DATABASE evaluation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Error saat migrasi
```bash
php artisan migrate:fresh --seed
```

### Cache issues
```bash
php artisan optimize:clear
```

## 📝 License

Proprietary - All rights reserved

## 👥 Support

Untuk pertanyaan atau masalah, silakan hubungi administrator atau buat issue di repository.

