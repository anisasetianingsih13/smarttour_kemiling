# PROJECT AUDIT REPORT

## Ringkasan
- **Total Fitur Selesai**: 2 (CRUD Wisata di Backend, Kerangka UI Flutter)
- **Total Fitur Parsial**: 3 (Dashboard CMS, Kelola Wisata di CMS, Autentikasi CMS)
- **Total Fitur Belum Dibuat / Hilang**: 5 (API Gateway, Servis Autentikasi Backend, Servis Rekomendasi Riil, Integrasi API Flutter, Lokasi GPS Flutter)

---

## Analisis Struktur Project

### 1. Folder `cms/` (Next.js Frontend)
- **`app/`**:
  - `login/page.tsx`: Halaman login admin. Menggunakan Axios untuk memanggil `/auth/login` di port gateway `3003`.
  - `dashboard/layout.tsx`: Layout dashboard admin. Memproteksi halaman secara sederhana via client-side check `localStorage.getItem('cms_token')` dan me-redirect ke `/login` jika token tidak ada.
  - `dashboard/page.tsx`: Halaman utama dashboard. Menampilkan ringkasan statistik (Total Wisata, Wisata Indoor, Wisata Outdoor) dengan status **statis / hardcoded `-`**. Belum ada pemanggilan API backend.
  - `dashboard/wisata/page.tsx`: Halaman tabel data wisata. Berfungsi untuk menampilkan data, mengarahkan ke halaman edit/tambah, dan menghapus data wisata.
  - `dashboard/wisata/tambah/page.tsx`: Form tambah wisata. Mengirimkan payload ke `POST /tourism` di port `3003`.
  - `dashboard/wisata/[id]/edit/page.tsx`: Form edit wisata. Mengambil data dari `GET /tourism/:id` dan memperbarui data via `PATCH /tourism/:id`.
- **`components/`**:
  - `Sidebar.tsx`: Komponen menu navigasi sidebar (Dashboard, Data Wisata) dan tombol Logout (menghapus `cms_token` lalu redirect ke `/login`).
- **`lib/`**:
  - `api.ts`: Konfigurasi instance Axios dengan `baseURL` ke `process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3003'`. Memiliki request interceptor untuk menyisipkan Bearer token dan response interceptor untuk redirect ke `/login` jika menerima status `401`.

### 2. Folder `api/` (NestJS Backend Services)
- **`tourism-service/`**:
  - **`src/main.ts`**: Menjalankan server pada port yang dikonfigurasi melalui environment variable `PORT` (port `3001` di `.env`). Menambahkan global prefix `/api`.
  - **`src/prisma.service.ts`**: Menangani inisialisasi koneksi Prisma Client.
  - **`src/tourism/`**: Modul utama untuk CRUD objek wisata Kemiling.
    - `tourism.controller.ts`: Menyediakan endpoint HTTP `POST`, `GET`, `GET :id`, `PATCH :id`, dan `DELETE :id`.
    - `tourism.service.ts`: Logika CRUD terhubung ke model `TourismPlace` database PostgreSQL menggunakan Prisma Client. Dilengkapi normalisasi nama filter untuk pengecekan keunikan nama.
    - `dto/`: Berisi DTO untuk validasi payload data masuk (`create-tourism.dto.ts` dan `update-tourism.dto.ts`).
  - **`src/common/utils/`**:
    - `conflict-tourism.util.ts`: Normalisasi string nama wisata (lowercase, trim, hilangkan spasi) untuk mendeteksi duplikasi nama wisata.
    - `not-exist-tourism.util.ts`: Memvalidasi keberadaan data wisata berdasarkan ID. Jika tidak ada, melempar error `NotFoundException` (404).
  - **`prisma/`**:
    - `schema.prisma`: Berisi konfigurasi model database tunggal `TourismPlace`.
- **`recommendation-service/`**:
  - Proyek boilerplate NestJS bawaan yang berjalan di port `3002`. Belum memiliki logika bisnis, model database, service, maupun controller fungsional selain default controller bawaan.

### 3. Folder `user/` (Flutter Mobile Client)
- **`lib/main.dart`**: Memuat theme berwarna soft green dan memanggil halaman utama `HomeScreen`.
- **`lib/screens/home_screen.dart`**: Tampilan UI aplikasi mobile. Terdiri dari Landing Page (dengan tombol "Gunakan Lokasi Saya") dan List Page (menampilkan kartu tempat wisata dengan scrolling area).
- **`lib/models/tourism_place.dart`**: Definisi model data wisata di sisi client.
- **`lib/data/dummy_data.dart`**: Kumpulan 8 data tempat wisata lokal (seperti Bukit Sakura, Kopi Ketje, dll) yang digunakan secara lokal di aplikasi.
- **`lib/services/`**:
  - `api_service.dart`: **File kosong (0 bytes)**.
  - `location_service.dart`: **File kosong (0 bytes)**.

---

## Identifikasi Fitur & Status Implementasi

### 1. Authentication / Login & Logout (Admin CMS)
- **File Lokasi**:
  - Frontend: [login/page.tsx](file:///e:/PBS/smarttour_kemiling/cms/app/login/page.tsx), [Sidebar.tsx](file:///e:/PBS/smarttour_kemiling/cms/components/Sidebar.tsx) (fungsi `handleLogout`), [api.ts](file:///e:/PBS/smarttour_kemiling/cms/lib/api.ts) (interceptor token & 401 redirect).
  - Backend: **Tidak Ada**.
- **Alur Kerja**:
  - Admin memasukkan username dan password di halaman `/login`.
  - Frontend mengirim POST request ke `/auth/login`. Jika sukses, token disimpan di `localStorage` sebagai `cms_token` dan pengguna diarahkan ke `/dashboard`.
  - Setiap request dari frontend menyertakan header `Authorization: Bearer <token>`. Jika mendapati status `401 Unauthorized`, token dihapus dan pengguna diredirect kembali ke `/login`.
- **Status**: ⚠️ **PARTIAL** (Hanya ada UI dan penanganan sesi sederhana di frontend, namun servis backend `/auth/login` sama sekali belum ada).

### 2. Role Management
- **File Lokasi**: **Tidak Ada**.
- **Status**: ❌ **NOT IMPLEMENTED**

### 3. Dashboard Admin CMS
- **File Lokasi**: [dashboard/page.tsx](file:///e:/PBS/smarttour_kemiling/cms/app/dashboard/page.tsx)
- **Alur Kerja**: Menampilkan ringkasan statistik objek wisata di daerah Kemiling.
- **Status**: ⚠️ **PARTIAL** (Tampilan antarmuka visual sudah ada, tetapi data statistik seperti jumlah total wisata, tipe indoor, dan tipe outdoor masih bernilai **statis / hardcoded `-`** karena belum terhubung ke API backend).

### 4. CRUD Manajemen Wisata (Tourism Management)
- **File Lokasi**:
  - Frontend CMS: [wisata/page.tsx](file:///e:/PBS/smarttour_kemiling/cms/app/dashboard/wisata/page.tsx), [tambah/page.tsx](file:///e:/PBS/smarttour_kemiling/cms/app/dashboard/wisata/tambah/page.tsx), [[id]/edit/page.tsx](file:///e:/PBS/smarttour_kemiling/cms/app/dashboard/wisata/[id]/edit/page.tsx).
  - Backend API: [tourism.controller.ts](file:///e:/PBS/smarttour_kemiling/api/tourism-service/src/tourism/tourism.controller.ts), [tourism.service.ts](file:///e:/PBS/smarttour_kemiling/api/tourism-service/src/tourism/tourism.service.ts).
- **Alur Kerja**:
  - **Tampilkan**: Frontend memanggil `GET /tourism` dan menampilkannya di dalam tabel.
  - **Tambah**: Form mengumpulkan nama, kategori, deskripsi, koordinat (lat/lng), tipe indoor/outdoor, rating, dan gambar, lalu mengirim `POST /tourism`. Backend melakukan validasi keunikan nama (melalui `conflictTourism` helper), dan menyimpannya ke database PostgreSQL.
  - **Edit**: Frontend memanggil `GET /tourism/:id` untuk mengisi form awal, lalu mengirim `PATCH /tourism/:id` saat disubmit.
  - **Hapus**: Menghapus baris terpilih via `DELETE /tourism/:id`.
- **Status**: ⚠️ **PARTIAL** (Secara backend REST API sudah siap dan fungsional 100% (DONE), namun integrasi frontend di CMS memiliki bug parsing data serius serta ketidakcocokan schema database yang membuat fitur ini belum bisa dipakai secara penuh).

### 5. Aplikasi User Mobile (Aplikasi Utama)
- **File Lokasi**: [home_screen.dart](file:///e:/PBS/smarttour_kemiling/user/lib/screens/home_screen.dart)
- **Alur Kerja**:
  - User membuka aplikasi, disajikan landing page dengan tombol "Gunakan Lokasi Saya".
  - Ketika tombol diklik, aplikasi langsung menampilkan daftar rekomendasi tempat wisata di daerah Kemiling dalam format Grid 2 kolom.
- **Status**: ⚠️ **PARTIAL** (UI/UX sangat indah dan sudah siap pakai, tetapi data wisata 100% menggunakan data tiruan ([dummy_data.dart](file:///e:/PBS/smarttour_kemiling/user/lib/data/dummy_data.dart)). Fitur tracking GPS lokasi user rill (`location_service.dart`) dan koneksi API server (`api_service.dart`) masih berupa file kosong tanpa kode pemrograman).

---

## API Endpoints Analysis

Seluruh endpoint di bawah ini dideklarasikan pada proyek **`api/tourism-service`** di port `3001` dengan prefix `/api`. 
*Catatan: Frontend CMS mencoba memanggil endpoint ini di port `3003` (melalui API Gateway yang diasumsikan, tetapi saat ini belum ada).*

| Method | Endpoint | Fungsi | Status Backend | Digunakan Frontend CMS? |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/tourism` | Menambahkan tempat wisata baru | ✅ OK (dengan validasi duplikat nama) | Ya, di `/dashboard/wisata/tambah` |
| `GET` | `/api/tourism` | Mengambil seluruh daftar tempat wisata | ✅ OK | Ya, di `/dashboard/wisata` |
| `GET` | `/api/tourism/:id` | Mengambil detail info satu tempat wisata | ✅ OK | Ya, di `/dashboard/wisata/[id]/edit` |
| `PATCH` | `/api/tourism/:id` | Mengupdate data tempat wisata | ✅ OK | Ya, di `/dashboard/wisata/[id]/edit` |
| `DELETE` | `/api/tourism/:id` | Menghapus data tempat wisata | ✅ OK | Ya, di `/dashboard/wisata` (tombol hapus) |

---

## Database Models Analysis

Konfigurasi database berada di [schema.prisma](file:///e:/PBS/smarttour_kemiling/api/tourism-service/prisma/schema.prisma) proyek `tourism-service`.

### 1. Model: `TourismPlace`
Menyimpan semua data tempat wisata di Kemiling.
- **`id`** (`Int`, `@id`, `@default(autoincrement())`): Primary Key.
- **`name`** (`String`, `@db.VarChar(100)`): Nama tempat wisata.
- **`nameFilter`** (`String`, `@db.VarChar(100)`): Nama yang sudah dinormalisasi (lowercase, tanpa spasi) untuk filter validasi keunikan.
- **`description`** (`String`, `@db.Text`): Penjelasan lengkap tempat wisata.
- **`isIndoor`** (`Boolean`): Status tempat wisata indoor (untuk rekomendasi saat cuaca hujan).
- **`latitude`** (`Float`): Koordinat lintang lokasi.
- **`longitude`** (`Float`): Koordinat bujur lokasi.
- **`rating`** (`Float`, `@default(0)`): Rating kepuasan pengunjung (skala 0 - 5).
- **`imageUrl`** (`String?`, `@db.VarChar(255)`): URL gambar ilustrasi tempat wisata.
- **`createdAt`** (`DateTime`, `@default(now())`): Waktu data pertama kali ditambahkan.

### 2. Relasi antar Model
- **Tidak ada relasi** karena saat ini baru terdapat **1 model saja** (`TourismPlace`) di dalam database.

---

## Authentication Analysis

- **Provider**: Belum ada provider backend yang terpasang. Frontend CMS mengirim data mentah username/password ke gateway.
- **Session Management**: Menggunakan token JWT secara sederhana di client-side melalui penyimpanan `localStorage` (`cms_token`).
- **Middleware Protection**:
  - Backend: **Tidak ada** (Semua endpoint CRUD objek wisata bebas diakses tanpa autentikasi/token).
  - Frontend CMS: Dibatasi di level komponen pembungkus [dashboard/layout.tsx](file:///e:/PBS/smarttour_kemiling/cms/app/dashboard/layout.tsx) secara client-side.
- **Halaman Butuh Login**: Semua sub-route di bawah `/dashboard/*` (Dashboard utama, daftar wisata, tambah wisata, edit wisata).
- **Role yang Tersedia**: Tidak didefinisikan secara backend maupun frontend.

---

## Bug, Risiko, & Ketidakcocokan Data (Mismatches)

### 1. ⚠️ Bug Respon API di Frontend CMS (`wisata/page.tsx` & `[id]/edit/page.tsx`)
- **Masalah**: Backend `tourism-service` mengembalikan objek berstruktur wrapper seperti:
  ```json
  {
    "success": true,
    "message": "Data wisata berhasil ditampilkan",
    "data": [...]
  }
  ```
  Tetapi di halaman [wisata/page.tsx:L28](file:///e:/PBS/smarttour_kemiling/cms/app/dashboard/wisata/page.tsx#L28), kodenya adalah:
  ```typescript
  setWisata(res.data);
  ```
  Hal ini menyebabkan state `wisata` menyimpan objek wrapper tersebut, bukan array tempat wisata. Akibatnya, `wisata.map(...)` atau `.length` di tabel akan menghasilkan error crash atau tabel selalu kosong.
- **Masalah Edit Form**: Di halaman [[id]/edit/page.tsx:L31-L42](file:///e:/PBS/smarttour_kemiling/cms/app/dashboard/wisata/[id]/edit/page.tsx#L31-L42):
  ```typescript
  const res = await api.get(`/tourism/${id}`);
  const d = res.data; // res.data adalah objek wrapper { success, data: {...} }
  setForm({ name: d.name || '', ... }); // d.name bernilai undefined!
  ```
  Ini menyebabkan seluruh field edit form terisi string kosong `""` saat memuat data, bukan data asli dari server.

### 2. 🚨 Ketidakcocokan Field `category` (Mismatches)
- **Masalah**: Form tambah dan edit di CMS menyediakan kolom pilihan **Kategori** (Kuliner, Alam, Budaya, dll) dan mengirimkannya sebagai property `category` di payload HTTP request. Begitu juga Flutter [TourismPlace model](file:///e:/PBS/smarttour_kemiling/user/lib/models/tourism_place.dart) yang mewajibkan adanya data `category`.
- **Namun**, model database [TourismPlace](file:///e:/PBS/smarttour_kemiling/api/tourism-service/prisma/schema.prisma) di Prisma dan DTO di NestJS **tidak memiliki kolom/field `category`** sama sekali!
- **Dampak**: 
  1. Jika frontend CMS mengirim payload beserta property `category` ke database melalui Prisma, Prisma client akan melempar error validasi saat runtime dan proses simpan/update akan **gagal total**.
  2. Data wisata hasil fetch dari backend tidak akan memiliki properti `category`, sehingga aplikasi Flutter tidak dapat memprosesnya karena model Dart mewajibkan field `category`.

### 3. 🚨 API Gateway & Servis Autentikasi Backend Hilang (Port 3003)
- **Masalah**: Frontend CMS dikonfigurasi untuk memanggil gateway di port `3003` dan memanggil route `/auth/login`. Gateway dan modul `/auth/login` ini **tidak ada sama sekali di dalam codebase**.
- **Dampak**: Halaman login CMS tidak akan pernah bisa meloloskan admin karena tidak ada server backend autentikasi yang merespon.

### 4. ⚠️ Konfigurasi Generator Prisma di `schema.prisma` Salah
- **Masalah**: Pada berkas [schema.prisma:L7](file:///e:/PBS/smarttour_kemiling/api/tourism-service/prisma/schema.prisma#L7), dideklarasikan:
  ```prisma
  provider = "prisma-client"
  ```
  Secara standar Prisma, provider client yang valid adalah `"prisma-client-js"`. Kesalahan ini akan menyebabkan perintah `npx prisma generate` mengalami kegagalan.

### 5. ⚠️ Konfigurasi Datasource Database di `schema.prisma` Tidak Memiliki URL
- **Masalah**: Blok datasource PostgreSQL di [schema.prisma:L12-L14](file:///e:/PBS/smarttour_kemiling/api/tourism-service/prisma/schema.prisma#L12-L14) didefinisikan sebagai:
  ```prisma
  datasource db {
    provider = "postgresql"
  }
  ```
  Tanpa menyertakan `url = env("DATABASE_URL")`. Meskipun `prisma.config.ts` mencoba mendefinisikannya, perintah Prisma CLI (seperti `prisma migrate dev`) akan error jika berkas `schema.prisma` tidak mencantumkan parameter `url` secara eksplisit pada blok datasource.

---

## Prioritas Pekerjaan Berikutnya

Berikut adalah rencana tindakan terstruktur untuk menyelesaikan proyek ini ke kondisi siap pakai:

### Tahap 1: Perbaikan Backend & Database (Sangat Mendesak)
1. **Perbaikan `schema.prisma`**:
   - Ubah generator provider client menjadi `"prisma-client-js"`.
   - Tambahkan `url = env("DATABASE_URL")` di blok `datasource db`.
   - Tambahkan kolom `category String @db.VarChar(50) @default("Lainnya")` ke model `TourismPlace` agar selaras dengan form Next.js CMS dan model Flutter.
   - Jalankan `npx prisma migrate dev` untuk memperbarui database PostgreSQL asli.
2. **Sinkronisasi DTO Backend**:
   - Tambahkan properti `category` di [create-tourism.dto.ts](file:///e:/PBS/smarttour_kemiling/api/tourism-service/src/tourism/dto/create-tourism.dto.ts) dan validasinya agar sesuai dengan schema baru.

### Tahap 2: Pembuatan Servis Autentikasi & Integrasi Port (Mendesak)
3. **Servis Autentikasi / Gateway**:
   - Pilihan A: Buat modul Autentikasi (`AuthModule`) sederhana langsung di dalam `tourism-service` agar server berjalan monolitik tanpa perlu gateway tambahan (lebih efisien & cepat). Pindahkan endpoint login di CMS dari port `3003` langsung ke `3001` (port `tourism-service`).
   - Pilihan B: Buat service gateway tersendiri di port `3003` yang melakukan routing request ke `tourism-service` (3001), `recommendation-service` (3002), dan menyediakan autentikasi terpusat.
4. **Fungsionalkan `recommendation-service` (Port 3002)**:
   - Buat logika pencarian/filter wisata berdasarkan parameter lokasi (Latitude & Longitude) dan tipe cuaca (isIndoor).

### Tahap 3: Perbaikan Bug Integrasi CMS Next.js
5. **Perbaikan Parsing Response Data**:
   - Sesuaikan pemanggilan data di tabel [wisata/page.tsx](file:///e:/PBS/smarttour_kemiling/cms/app/dashboard/wisata/page.tsx) dengan membaca array dari `res.data.data` bukan `res.data`.
   - Sesuaikan pengisian form edit di [[id]/edit/page.tsx](file:///e:/PBS/smarttour_kemiling/cms/app/dashboard/wisata/[id]/edit/page.tsx) dengan membaca detail tempat dari `res.data.data`.
6. **Hubungkan Statistik Dashboard**:
   - Ganti data statistik hardcoded `-` di halaman dashboard CMS dengan memanggil API endpoint untuk menghitung total wisata, wisata indoor, dan wisata outdoor.

### Tahap 4: Menghubungkan Flutter Mobile Client ke Backend Real
7. **Implementasi `api_service.dart`**:
   - Buat fungsi HTTP GET untuk memanggil daftar wisata langsung dari backend API (baik via Gateway port 3003 maupun langsung ke `tourism-service` port 3001).
8. **Implementasi `location_service.dart`**:
   - Tambahkan dependency seperti `geolocator` or `location` untuk mendapatkan koordinat GPS asli perangkat pengguna, lalu kirimkan parameter koordinat tersebut ke API backend untuk mendapatkan tempat wisata terdekat.
