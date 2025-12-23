# Setup Database MySQL

## Cara Setup Database MySQL untuk Evaluation System

### 1. Buat Database Secara Manual (Recommended)

Jalankan perintah berikut di MySQL:

```sql
CREATE DATABASE IF NOT EXISTS `evaluation` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

Atau gunakan file SQL yang sudah disediakan:
```bash
mysql -u root -p < database/create_database.sql
```

### 2. Konfigurasi .env

Copy file `.env.example` ke `.env`:
```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=evaluation
DB_USERNAME=root
DB_PASSWORD=your_password_here
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Jalankan Migrations

```bash
php artisan migrate:fresh --seed
```

Atau jika database sudah ada dan ingin migrate saja:
```bash
php artisan migrate --seed
```

### 5. Verifikasi

Pastikan semua tabel sudah dibuat:
- users
- students
- subjects
- periods
- enrollments
- grades
- cache
- jobs
- sessions
- password_reset_tokens

## Troubleshooting

### Error: Access denied for user
- Pastikan username dan password di `.env` benar
- Pastikan user MySQL memiliki privilege untuk membuat database

### Error: Database doesn't exist
- Buat database secara manual terlebih dahulu (lihat langkah 1)
- Atau pastikan user memiliki privilege CREATE DATABASE

### Error: Table already exists
- Gunakan `php artisan migrate:fresh` untuk reset database
- Atau gunakan `php artisan migrate:refresh` untuk rollback dan migrate ulang

