# Dokumentasi Evaluation System

## Daftar Dokumentasi

- [CREDENTIALS.md](./CREDENTIALS.md) - Informasi login dan credentials
- [ALUR_PENGGUNAAN.md](./ALUR_PENGGUNAAN.md) - Panduan lengkap alur penggunaan sistem
- [SETUP_MYSQL.md](../SETUP_MYSQL.md) - Panduan setup database MySQL
- [README_DATABASE.md](../README_DATABASE.md) - Dokumentasi database

## Quick Start

### 1. Setup Database

Lihat [SETUP_MYSQL.md](../SETUP_MYSQL.md) untuk panduan lengkap setup MySQL.

### 2. Install Dependencies

```bash
composer install
npm install
```

### 3. Setup Environment

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
```

### 4. Run Migrations & Seeders

```bash
php artisan migrate:fresh --seed
```

### 5. Start Development Server

```bash
php artisan serve
npm run dev
```

### 6. Login

Buka browser dan akses `http://localhost:8000`

**Default Credentials:**
- Email: `admin@horizon.ac.id`
- Password: `password`

Lihat [CREDENTIALS.md](./CREDENTIALS.md) untuk informasi lengkap tentang credentials.

## Fitur Sistem

- ✅ Manajemen Mahasiswa (CRUD)
- ✅ Manajemen Mata Kuliah (CRUD)
- ✅ Manajemen Periode Akademik (CRUD)
- ✅ Manajemen Enrollment (CRUD)
- ✅ Manajemen Nilai (CRUD)
- ✅ Perhitungan Nilai Otomatis
- ✅ Dashboard dengan Statistik
- ✅ Filter dan Pencarian
- ✅ Pagination

## Struktur Database

- `users` - Data user/admin
- `students` - Data mahasiswa
- `subjects` - Data mata kuliah
- `periods` - Data periode akademik
- `enrollments` - Data pendaftaran mahasiswa ke mata kuliah
- `grades` - Data nilai mahasiswa

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

