# Setup MySQL untuk Evaluation System

## Persyaratan
- MySQL 5.7+ atau MariaDB 10.3+
- PHP dengan extension PDO MySQL
- Composer terinstall

## Langkah-langkah Setup

### 1. Buat Database MySQL

Jalankan perintah berikut di MySQL CLI atau phpMyAdmin:

```sql
CREATE DATABASE IF NOT EXISTS `evaluation` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

Atau gunakan file SQL yang sudah disediakan:
```bash
mysql -u root -p < database/create_database.sql
```

### 2. Konfigurasi Environment

Buat file `.env` dari template (jika belum ada):
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
DB_PASSWORD=your_mysql_password
```

**Penting:** Ganti `your_mysql_password` dengan password MySQL Anda.

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Jalankan Migrations

```bash
php artisan migrate:fresh --seed
```

Perintah ini akan:
- Menghapus semua tabel yang ada (jika ada)
- Membuat semua tabel baru
- Menjalankan seeders untuk data sample

Atau jika ingin migrate tanpa reset:
```bash
php artisan migrate --seed
```

### 5. Verifikasi

Pastikan semua tabel sudah dibuat dengan benar:
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

## Login Default

Setelah seeder berjalan, Anda bisa login dengan:

- **Email:** `admin@horizon.ac.id` atau `test@example.com`
- **Password:** `password`

## Troubleshooting

### Error: SQLSTATE[HY000] [1049] Unknown database 'evaluation'
**Solusi:** Buat database terlebih dahulu (lihat langkah 1)

### Error: SQLSTATE[HY000] [1045] Access denied
**Solusi:** 
- Periksa username dan password di file `.env`
- Pastikan user MySQL memiliki akses ke database `evaluation`

### Error: SQLSTATE[42000] [1044] Access denied for user to database
**Solusi:** Berikan privilege ke user MySQL:
```sql
GRANT ALL PRIVILEGES ON evaluation.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Error: PDOException: could not find driver
**Solusi:** Install PHP MySQL extension:
```bash
# Ubuntu/Debian
sudo apt-get install php-mysql

# Windows (XAMPP/WAMP)
# Aktifkan extension=mysqli dan extension=pdo_mysql di php.ini
```

## Catatan

- Migration untuk membuat database (`2025_12_22_153213_create_evaluation_database.php`) mungkin tidak berjalan jika user tidak memiliki privilege CREATE DATABASE
- Jika migration database gagal, buat database secara manual (langkah 1)
- Semua migration tabel akan berjalan normal setelah database dibuat

