# Dokumentasi Evaluation System

## Daftar Dokumentasi

- [CREDENTIALS.md](./CREDENTIALS.md) - Informasi login dan credentials
- [ALUR_PENGGUNAAN.md](./ALUR_PENGGUNAAN.md) - Panduan lengkap alur penggunaan sistem

## Quick Start

### 1. Install Dependencies

```bash
composer install
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
php artisan key:generate
```

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

### 3. Run Migrations & Seeders

```bash
php artisan migrate --seed
```

Perintah ini akan:
- Membuat database `evaluation` secara otomatis (jika belum ada)
- Menjalankan semua migrasi untuk membuat tabel
- Menjalankan seeder untuk mengisi data awal

### 4. Start Development Server

Terminal 1 (Laravel):
```bash
php artisan serve
```

Terminal 2 (Vite):
```bash
npm run dev
```

### 5. Login

Buka browser dan akses `http://localhost:8000`

**Default Credentials:**
- **Admin:** `admin@horizon.ac.id` / `password`
- **User:** `ardi.herdiana@horizon.ac.id` / `password`

Lihat [CREDENTIALS.md](./CREDENTIALS.md) untuk informasi lengkap tentang credentials.

## Fitur Sistem

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

## Struktur Database

- `users` - Data user/admin dengan role-based access
- `students` - Data mahasiswa
- `subjects` - Data mata kuliah
- `periods` - Data periode akademik (P1, P2)
- `enrollments` - Data pendaftaran mahasiswa ke mata kuliah
- `grades` - Data nilai mahasiswa per periode

## Formula Perhitungan Nilai

### Nilai Periode
```
Period Grade = (Class Standing × 60%) + (Periodical Exam × 40%)
```

### Nilai Akhir (Final Grade)
```
Final Grade = (P1 × 50%) + (P2 × 50%)
```

### Grade Point Scale
- A (4.00): 90.00 - 100.00
- A- (3.75): 85.00 - 89.99
- B+ (3.50): 80.00 - 84.99
- B (3.00): 70.00 - 79.99
- B- (2.75): 65.00 - 69.99
- C+ (2.50): 60.00 - 64.99
- C (2.00): 50.00 - 59.99
- D (1.00): 0.00 - 49.99

## Support

Untuk pertanyaan atau masalah, silakan buat issue di repository atau hubungi administrator.

