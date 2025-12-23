# Credentials - Evaluation System

## Informasi Login Default

Setelah menjalankan seeder, sistem akan memiliki beberapa user default yang bisa digunakan untuk login.

### Admin User

**Email:** `admin@horizon.ac.id`  
**Password:** `password`  
**Role:** Administrator  
**Deskripsi:** User administrator dengan akses penuh ke semua fitur sistem.

### Regular User (Mahasiswa)

**Email:** `ardi.herdiana@horizon.ac.id`  
**Password:** `password`  
**Role:** User  
**Deskripsi:** User biasa (mahasiswa) dengan akses terbatas untuk melihat dan mengelola data pribadi.

## Cara Login

1. Buka aplikasi di browser: `http://localhost:8000`
2. Anda akan otomatis diarahkan ke halaman login
3. Masukkan email dan password salah satu user di atas
4. Klik tombol "Log in"

## Reset Password

Jika Anda lupa password atau ingin mengubah password, Anda bisa:

### Menggunakan Tinker

```bash
php artisan tinker
```

Kemudian jalankan:

```php
$user = App\Models\User::where('email', 'admin@horizon.ac.id')->first();
$user->password = bcrypt('password_baru');
$user->save();
```

### Menggunakan Seeder

Edit file `database/seeders/DatabaseSeeder.php` dan ubah password, kemudian jalankan:

```bash
php artisan db:seed --class=DatabaseSeeder
```

## Membuat User Baru

### Via Register (jika fitur register aktif)

1. Klik tombol "Register" di halaman login
2. Isi form registrasi
3. Submit form

### Via Tinker

```bash
php artisan tinker
```

```php
App\Models\User::create([
    'name' => 'Nama User',
    'email' => 'email@example.com',
    'password' => bcrypt('password'),
    'email_verified_at' => now(),
]);
```

### Via Seeder

Tambahkan user baru di `database/seeders/DatabaseSeeder.php`:

```php
User::firstOrCreate(
    ['email' => 'newuser@example.com'],
    [
        'name' => 'New User',
        'password' => bcrypt('password'),
        'email_verified_at' => now(),
    ]
);
```

Kemudian jalankan:

```bash
php artisan db:seed --class=DatabaseSeeder
```

## Keamanan

⚠️ **PENTING:** 
- Ganti password default setelah pertama kali login
- Jangan gunakan password default di production
- Pastikan email verification aktif untuk keamanan lebih baik
- Gunakan password yang kuat (minimal 8 karakter, kombinasi huruf, angka, dan simbol)

## Troubleshooting

### Tidak bisa login

1. Pastikan seeder sudah dijalankan:
   ```bash
   php artisan db:seed
   ```

2. Pastikan password menggunakan bcrypt:
   ```php
   bcrypt('password')
   ```

3. Cek apakah user ada di database:
   ```bash
   php artisan tinker
   ```
   ```php
   App\Models\User::all();
   ```

### Password tidak cocok

1. Reset password menggunakan tinker (lihat bagian Reset Password)
2. Pastikan menggunakan `bcrypt()` untuk hash password

## Catatan

- Semua password default adalah: `password`
- Email verification sudah diaktifkan untuk user default
- User default dibuat saat menjalankan `php artisan db:seed`

