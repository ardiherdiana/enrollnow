# Alur Penggunaan Sistem Evaluasi Mahasiswa

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Setup Awal](#setup-awal)
3. [Login ke Sistem](#login-ke-sistem)
4. [Dashboard](#dashboard)
5. [Manajemen Mahasiswa](#manajemen-mahasiswa)
6. [Manajemen Mata Kuliah](#manajemen-mata-kuliah)
7. [Manajemen Periode](#manajemen-periode)
8. [Manajemen Enrollment](#manajemen-enrollment)
9. [Manajemen Nilai](#manajemen-nilai)
10. [Tips dan Best Practices](#tips-dan-best-practices)

---

## Pendahuluan

Sistem Evaluasi Mahasiswa adalah aplikasi web berbasis Laravel dan React untuk mengelola data mahasiswa, mata kuliah, periode akademik, enrollment, dan nilai. Sistem ini dirancang untuk memudahkan administrasi akademik di perguruan tinggi.

### Fitur Utama

- ✅ Dashboard dengan statistik lengkap
- ✅ Manajemen Mahasiswa (CRUD)
- ✅ Manajemen Mata Kuliah (CRUD)
- ✅ Manajemen Periode Akademik (CRUD)
- ✅ Manajemen Enrollment (CRUD)
- ✅ Manajemen Nilai dengan perhitungan otomatis
- ✅ Pencarian dan filter data
- ✅ Pagination untuk data besar

---

## Setup Awal

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
```

### 3. Setup Database

Buat database MySQL dengan nama `evaluation`, atau gunakan migration yang sudah tersedia:

```bash
php artisan migrate:fresh --seed
```

### 4. Start Development Server

```bash
# Terminal 1 - Laravel Server
php artisan serve

# Terminal 2 - Vite Dev Server
npm run dev
```

### 5. Akses Aplikasi

Buka browser dan akses: `http://localhost:8000`

---

## Login ke Sistem

### Langkah-langkah Login

1. **Buka Aplikasi**
   - Akses `http://localhost:8000`
   - Sistem akan otomatis mengarahkan ke halaman login

2. **Masukkan Credentials**
   - **Email:** `admin@horizon.ac.id`
   - **Password:** `password`

3. **Klik Tombol "Log in"**
   - Setelah login berhasil, Anda akan diarahkan ke Dashboard

### Informasi Credentials

Lihat [CREDENTIALS.md](./CREDENTIALS.md) untuk informasi lengkap tentang credentials default dan cara membuat user baru.

---

## Dashboard

### Overview

Dashboard menampilkan ringkasan statistik sistem dan data terbaru:

- **Total Mahasiswa** - Jumlah semua mahasiswa terdaftar
- **Mahasiswa Aktif** - Jumlah mahasiswa dengan status aktif
- **Total Mata Kuliah** - Jumlah semua mata kuliah
- **Mata Kuliah Aktif** - Jumlah mata kuliah dengan status aktif
- **Total Periode** - Jumlah periode akademik
- **Periode Aktif** - Jumlah periode yang sedang berjalan
- **Total Enrollment** - Jumlah pendaftaran mahasiswa ke mata kuliah
- **Total Nilai** - Jumlah data nilai yang sudah diinput

### Data Terbaru

Dashboard juga menampilkan:
- **5 Mahasiswa Terbaru** - Daftar mahasiswa yang baru ditambahkan
- **5 Mata Kuliah Terbaru** - Daftar mata kuliah yang baru ditambahkan
- **Periode Aktif** - Daftar periode akademik yang sedang berjalan

### Navigasi

Dari dashboard, Anda dapat mengakses semua modul melalui sidebar:
- Dashboard
- Mahasiswa
- Mata Kuliah
- Periode
- Enrollment
- Nilai

---

## Manajemen Mahasiswa

### Alur Lengkap CRUD Mahasiswa

#### 1. Melihat Daftar Mahasiswa

**Langkah:**
1. Klik menu **"Mahasiswa"** di sidebar
2. Halaman akan menampilkan daftar semua mahasiswa
3. Gunakan **search box** untuk mencari mahasiswa berdasarkan nama atau student ID
4. Gunakan **filter status** untuk menyaring mahasiswa aktif/non-aktif
5. Gunakan **pagination** untuk navigasi halaman jika data banyak

**Fitur:**
- Search: Pencarian real-time berdasarkan nama atau student ID
- Filter: Filter berdasarkan status (Aktif/Non-Aktif/Semua)
- Pagination: Navigasi halaman untuk data besar
- Aksi: Tombol untuk View, Edit, dan Delete

#### 2. Menambah Mahasiswa Baru

**Langkah:**
1. Di halaman daftar mahasiswa, klik tombol **"Tambah Mahasiswa"** (ikon +)
2. Isi form dengan data berikut:
   - **Student ID** (wajib) - ID unik mahasiswa
   - **Nama** (wajib) - Nama lengkap mahasiswa
   - **Email** (wajib) - Email mahasiswa
   - **Phone** (opsional) - Nomor telepon
   - **Tanggal Lahir** (opsional) - Tanggal lahir
   - **Alamat** (opsional) - Alamat lengkap
   - **Status** (wajib) - Pilih Aktif atau Non-Aktif
3. Klik tombol **"Simpan"**
4. Sistem akan menyimpan data dan mengarahkan ke halaman daftar

**Validasi:**
- Student ID harus unik
- Email harus valid dan unik
- Nama harus diisi

#### 3. Melihat Detail Mahasiswa

**Langkah:**
1. Di halaman daftar, klik tombol **"View"** (ikon mata) pada mahasiswa yang ingin dilihat
2. Halaman detail akan menampilkan:
   - Informasi lengkap mahasiswa
   - Daftar enrollment (mata kuliah yang diambil)
   - Daftar nilai (jika ada)

#### 4. Mengedit Data Mahasiswa

**Langkah:**
1. Di halaman daftar, klik tombol **"Edit"** (ikon pensil) pada mahasiswa yang ingin diedit
2. Form akan terisi dengan data yang sudah ada
3. Ubah data yang diperlukan
4. Klik tombol **"Update"**
5. Sistem akan menyimpan perubahan dan mengarahkan ke halaman daftar

#### 5. Menghapus Mahasiswa

**Langkah:**
1. Di halaman daftar, klik tombol **"Delete"** (ikon trash) pada mahasiswa yang ingin dihapus
2. Konfirmasi penghapusan di popup
3. Sistem akan menghapus data mahasiswa

**Peringatan:**
- Hapus mahasiswa akan menghapus semua enrollment dan nilai terkait
- Pastikan data yang dihapus sudah tidak diperlukan

---

## Manajemen Mata Kuliah

### Alur Lengkap CRUD Mata Kuliah

#### 1. Melihat Daftar Mata Kuliah

**Langkah:**
1. Klik menu **"Mata Kuliah"** di sidebar
2. Halaman akan menampilkan daftar semua mata kuliah
3. Gunakan **search box** untuk mencari mata kuliah berdasarkan nama atau kode
4. Gunakan **filter** untuk menyaring berdasarkan:
   - Status (Aktif/Non-Aktif/Semua)
   - Tipe (Teori/Praktikum/Semua)

**Fitur:**
- Search: Pencarian berdasarkan nama atau kode mata kuliah
- Filter: Filter berdasarkan status dan tipe
- Aksi: Tombol untuk View, Edit, dan Delete

#### 2. Menambah Mata Kuliah Baru

**Langkah:**
1. Klik tombol **"Tambah Mata Kuliah"**
2. Isi form dengan data berikut:
   - **Kode** (wajib) - Kode unik mata kuliah (contoh: CS101)
   - **Nama** (wajib) - Nama mata kuliah
   - **SKS** (wajib) - Jumlah SKS (Satuan Kredit Semester)
   - **Tipe** (wajib) - Pilih Teori atau Praktikum
   - **Status** (wajib) - Pilih Aktif atau Non-Aktif
3. Klik tombol **"Simpan"**

**Validasi:**
- Kode harus unik
- SKS harus berupa angka positif

#### 3. Melihat Detail Mata Kuliah

**Langkah:**
1. Klik tombol **"View"** pada mata kuliah yang ingin dilihat
2. Halaman detail menampilkan:
   - Informasi lengkap mata kuliah
   - Daftar mahasiswa yang mengambil mata kuliah ini
   - Statistik enrollment

#### 4. Mengedit Mata Kuliah

**Langkah:**
1. Klik tombol **"Edit"** pada mata kuliah yang ingin diedit
2. Ubah data yang diperlukan
3. Klik tombol **"Update"**

#### 5. Menghapus Mata Kuliah

**Langkah:**
1. Klik tombol **"Delete"** pada mata kuliah yang ingin dihapus
2. Konfirmasi penghapusan
3. Sistem akan menghapus data mata kuliah

**Peringatan:**
- Hapus mata kuliah akan menghapus semua enrollment dan nilai terkait

---

## Manajemen Periode

### Alur Lengkap CRUD Periode

#### 1. Melihat Daftar Periode

**Langkah:**
1. Klik menu **"Periode"** di sidebar
2. Halaman menampilkan daftar semua periode akademik
3. Setiap periode menampilkan:
   - Nama periode
   - Tahun akademik
   - Semester
   - Tanggal mulai dan selesai
   - Status

#### 2. Menambah Periode Baru

**Langkah:**
1. Klik tombol **"Tambah Periode"**
2. Isi form dengan data berikut:
   - **Nama** (wajib) - Nama periode (contoh: Semester Ganjil 2024/2025)
   - **Tahun Akademik** (wajib) - Tahun akademik (contoh: 2024/2025)
   - **Semester** (wajib) - Pilih Ganjil atau Genap
   - **Tanggal Mulai** (wajib) - Tanggal mulai periode
   - **Tanggal Selesai** (wajib) - Tanggal selesai periode
   - **Status** (wajib) - Pilih Aktif atau Non-Aktif
3. Klik tombol **"Simpan"**

**Tips:**
- Pastikan tanggal selesai lebih besar dari tanggal mulai
- Hanya satu periode yang sebaiknya berstatus Aktif pada satu waktu

#### 3. Melihat Detail Periode

**Langkah:**
1. Klik tombol **"View"** pada periode yang ingin dilihat
2. Halaman detail menampilkan:
   - Informasi lengkap periode
   - Daftar enrollment pada periode ini
   - Statistik enrollment

#### 4. Mengedit Periode

**Langkah:**
1. Klik tombol **"Edit"** pada periode yang ingin diedit
2. Ubah data yang diperlukan
3. Klik tombol **"Update"**

#### 5. Menghapus Periode

**Langkah:**
1. Klik tombol **"Delete"** pada periode yang ingin dihapus
2. Konfirmasi penghapusan
3. Sistem akan menghapus data periode

**Peringatan:**
- Hapus periode akan menghapus semua enrollment dan nilai terkait

---

## Manajemen Enrollment

### Alur Lengkap CRUD Enrollment

#### 1. Melihat Daftar Enrollment

**Langkah:**
1. Klik menu **"Enrollment"** di sidebar
2. Halaman menampilkan daftar semua enrollment
3. Setiap enrollment menampilkan:
   - Nama mahasiswa
   - Mata kuliah
   - Periode
   - Status enrollment
   - Nilai (jika sudah ada)

**Fitur:**
- Tampilan tabel dengan informasi lengkap
- Tombol aksi untuk View, Edit, dan Delete

#### 2. Menambah Enrollment Baru

**Langkah:**
1. Klik tombol **"Tambah Enrollment"**
2. Isi form dengan data berikut:
   - **Mahasiswa** (wajib) - Pilih mahasiswa dari dropdown
   - **Mata Kuliah** (wajib) - Pilih mata kuliah dari dropdown
   - **Periode** (wajib) - Pilih periode dari dropdown
   - **Status** (wajib) - Pilih Aktif atau Non-Aktif
3. Klik tombol **"Simpan"**

**Validasi:**
- Kombinasi mahasiswa + mata kuliah + periode harus unik
- Mahasiswa, mata kuliah, dan periode harus memiliki status Aktif

**Tips:**
- Pastikan mahasiswa, mata kuliah, dan periode sudah dibuat sebelumnya
- Enrollment harus dibuat sebelum input nilai

#### 3. Melihat Detail Enrollment

**Langkah:**
1. Klik tombol **"View"** pada enrollment yang ingin dilihat
2. Halaman detail menampilkan:
   - Informasi lengkap enrollment
   - Data mahasiswa
   - Data mata kuliah
   - Data periode
   - Nilai (jika sudah ada)

#### 4. Mengedit Enrollment

**Langkah:**
1. Klik tombol **"Edit"** pada enrollment yang ingin diedit
2. Ubah data yang diperlukan
3. Klik tombol **"Update"**

#### 5. Menghapus Enrollment

**Langkah:**
1. Klik tombol **"Delete"** pada enrollment yang ingin dihapus
2. Konfirmasi penghapusan
3. Sistem akan menghapus data enrollment

**Peringatan:**
- Hapus enrollment akan menghapus nilai terkait

---

## Manajemen Nilai

### Alur Lengkap CRUD Nilai

#### 1. Melihat Daftar Nilai

**Langkah:**
1. Klik menu **"Nilai"** di sidebar
2. Halaman menampilkan daftar semua nilai
3. Setiap nilai menampilkan:
   - Nama mahasiswa
   - Mata kuliah
   - Periode
   - Class Standing (CS)
   - Periodical Exam (PE)
   - Nilai Periode (otomatis dihitung)
   - Grade Letter (A, A-, B+, B, B-, C+, C, D)

**Fitur:**
- Tampilan tabel dengan informasi lengkap
- Grade letter dengan warna (hijau untuk lulus, merah untuk tidak lulus)
- Tombol aksi untuk View, Edit, dan Delete

#### 2. Menambah Nilai Baru

**Langkah:**
1. Klik tombol **"Tambah Nilai"**
2. Isi form dengan data berikut:
   - **Enrollment** (wajib) - Pilih enrollment dari dropdown
   - **Class Standing** (wajib) - Nilai kehadiran, tugas, dll (0-100)
   - **Periodical Exam** (wajib) - Nilai ujian (0-100)
3. Klik tombol **"Simpan"**

**Perhitungan Otomatis:**
- **Nilai Periode** akan otomatis dihitung:
  ```
  Period Grade = (Class Standing × 60%) + (Periodical Exam × 40%)
  ```
- **Grade Letter** akan otomatis ditentukan berdasarkan nilai periode

**Validasi:**
- Enrollment harus sudah ada
- Class Standing dan Periodical Exam harus antara 0-100
- Satu enrollment hanya bisa memiliki satu nilai

**Tips:**
- Pastikan enrollment sudah dibuat sebelumnya
- Input nilai dengan teliti karena akan mempengaruhi perhitungan

#### 3. Melihat Detail Nilai

**Langkah:**
1. Klik tombol **"View"** pada nilai yang ingin dilihat
2. Halaman detail menampilkan:
   - Informasi lengkap nilai
   - Data enrollment
   - Data mahasiswa
   - Data mata kuliah
   - Data periode
   - Class Standing
   - Periodical Exam
   - Nilai Periode (dihitung otomatis)
   - Grade Letter
   - Grade Point

#### 4. Mengedit Nilai

**Langkah:**
1. Klik tombol **"Edit"** pada nilai yang ingin diedit
2. Ubah nilai Class Standing atau Periodical Exam
3. Klik tombol **"Update"**
4. Nilai Periode akan otomatis dihitung ulang

#### 5. Menghapus Nilai

**Langkah:**
1. Klik tombol **"Delete"** pada nilai yang ingin dihapus
2. Konfirmasi penghapusan
3. Sistem akan menghapus data nilai

---

## Tips dan Best Practices

### Urutan Input Data yang Disarankan

Untuk memudahkan penggunaan sistem, disarankan mengikuti urutan berikut:

1. **Setup Periode Akademik**
   - Buat periode akademik terlebih dahulu
   - Pastikan periode yang akan digunakan berstatus Aktif

2. **Setup Mata Kuliah**
   - Buat semua mata kuliah yang akan digunakan
   - Pastikan mata kuliah berstatus Aktif

3. **Setup Mahasiswa**
   - Input data mahasiswa
   - Pastikan mahasiswa berstatus Aktif

4. **Setup Enrollment**
   - Daftarkan mahasiswa ke mata kuliah pada periode tertentu
   - Pastikan enrollment berstatus Aktif

5. **Input Nilai**
   - Input nilai setelah enrollment dibuat
   - Sistem akan otomatis menghitung nilai periode dan grade letter

### Best Practices

1. **Konsistensi Data**
   - Gunakan format yang konsisten untuk Student ID dan Kode Mata Kuliah
   - Pastikan semua data penting sudah diisi sebelum membuat enrollment

2. **Status Management**
   - Non-aktifkan data yang sudah tidak digunakan daripada menghapusnya
   - Hanya satu periode yang sebaiknya berstatus Aktif pada satu waktu

3. **Validasi**
   - Selalu periksa validasi form sebelum submit
   - Pastikan data yang diinput sudah benar

4. **Backup Data**
   - Lakukan backup database secara berkala
   - Jangan menghapus data penting tanpa backup

5. **Keamanan**
   - Ganti password default setelah pertama kali login
   - Jangan share credentials dengan orang lain
   - Logout setelah selesai menggunakan sistem

### Formula Perhitungan Nilai

#### Nilai Periode
```
Period Grade = (Class Standing × 60%) + (Periodical Exam × 40%)
```

#### Grade Point Scale
- **A (4.00):** 90.00 - 100.00
- **A- (3.75):** 85.00 - 89.99
- **B+ (3.50):** 80.00 - 84.99
- **B (3.00):** 70.00 - 79.99
- **B- (2.75):** 65.00 - 69.99
- **C+ (2.50):** 60.00 - 64.99
- **C (2.00):** 50.00 - 59.99
- **D (1.00):** 0.00 - 49.99

### Troubleshooting

#### Tidak bisa login
- Pastikan seeder sudah dijalankan
- Cek credentials di [CREDENTIALS.md](./CREDENTIALS.md)
- Pastikan email sudah terverifikasi

#### Data tidak muncul
- Cek apakah data sudah diinput dengan benar
- Gunakan filter untuk menyaring data
- Pastikan status data adalah Aktif

#### Error saat input nilai
- Pastikan enrollment sudah dibuat
- Pastikan nilai antara 0-100
- Pastikan format input sudah benar

#### Error saat membuat enrollment
- Pastikan mahasiswa, mata kuliah, dan periode sudah dibuat
- Pastikan kombinasi mahasiswa + mata kuliah + periode unik
- Pastikan semua data berstatus Aktif

---

## Dukungan

Untuk pertanyaan atau masalah lebih lanjut:

1. Lihat dokumentasi lainnya di folder `docs`
2. Cek [CREDENTIALS.md](./CREDENTIALS.md) untuk masalah login
3. Cek [README.md](./README.md) untuk setup awal
4. Hubungi administrator sistem

---

**Selamat menggunakan Sistem Evaluasi Mahasiswa!** 🎓

