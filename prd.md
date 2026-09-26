# SYSTEM INSTRUCTION & PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Project Name:** Website SI NARA (Sistem Informasi dan Narasi Anak)
**Tech Stack:** React.js (JavaScript, React Compiler, ESLint), Supabase (Auth, Postgres Database, Storage), Tailwind CSS (Recommended for Responsive UI).

---

## 1. PROJECT OVERVIEW & GOAL
Membangun platform jurnalistik interaktif "SI NARA" untuk siswa SD Kelas VI. Website ini memfasilitasi alur belajar jurnalistik, wawancara, pembuatan naskah, peer-review, hingga publikasi berita yang dimoderasi oleh Guru.

---

## 2. TECHNICAL SPECIFICATIONS & DATABASE (SUPABASE)

### A. Authentication & Roles
1. Gunakan Supabase Email & Password Auth biasa (TANPA OAuth/Google Sign-In).
2. Buat tabel `profiles` terhubung dengan `auth.users`:
   - `id` (uuid, primary key)
   - `email` (string)
   - `role` (enum: 'siswa', 'guru')
   - `full_name` (string)
   - `progress_level` (integer / jsonb - untuk melacak status modul yang sudah diselesaikan)

### B. Main Tables Schema
1. `materials_progress`: Menampung status centang 6 Bahan Ajar per siswa.
2. `quiz_attempts`: Menampung hasil Kuis Fakta & Opini (Must hit 100% score to pass).
3. `reports / drafts`:
   - `id` (uuid)
   - `student_id` (foreign key to profiles)
   - `title` (string)
   - `category` (Agrowisata, UMKM, Pertanian, dll.)
   - `interviews_data` (jsonb - menyimpan pertanyaan & jawaban ADIKSIMBA dinamis)
   - `outline_data` (jsonb - Head, Lead, Body, Ekor)
   - `content` (text - naskah utuh)
   - `image_url` (string - dari Supabase Storage)
   - `status` (enum: 'Draft', 'Dalam Review', 'Revisi', 'Approved')
4. `peer_reviews`:
   - `id` (uuid)
   - `draft_id` (foreign key to drafts)
   - `reviewer_id` (foreign key to profiles)
   - `comment` (text)
5. `gallery_comments`:
   - `id` (uuid)
   - `article_id` (foreign key to drafts)
   - `user_id` (foreign key to profiles)
   - `comment` (text)

---

## 3. DETAILED MODULE REQUIREMENTS & USER FLOW

### Modul 1: Beranda & Modul 2: Pojok Literasi (Sistem Penguncian/Prerequisite)
1. **Bahan Ajar (6 Materi):** Siswa membaca 6 materi (Struktur Teks, PUEBI, Teknik Wawancara, Foto Jurnalistik, Mengenal Desa, Fakta & Opini). Diubah indikator C2/C3 menjadi kotak centang (*checkbox*).
2. **Kuis Fakta & Opini:** 6 soal. Harus LULUS 100% (semua benar) untuk lanjut.
3. **Detektif ADIKSIMBA:** Menampilkan analisis teks berita sampel. 
4. **Locking Rule:** Modul 3 (Ruang Redaksi) BISA DIBUKA HANYA JIKA: 6 Bahan Ajar dicentang + Kuis 100% benar.

### Modul 3: Ruang Redaksi
1. **Katalog Ide Liputan:** Opsi pilihan kategori & custom topic.
2. **Lembar Kerja Reporter:** 
   - Form data narasumber.
   - Form Pertanyaan ADIKSIMBA (5W+1H) **DINAMIS** (Siswa bisa menambah field input pertanyaan lebih dari 1 per poin ADIKSIMBA).
3. **Outline Builder Berita:** Form penulisan Head, Lead, Body, Ekor disertai **Tooltip/Info Box Edukatif** pada tiap section.

### Modul 4: Studio Editor
Wajib memiliki **4 Sub-fitur Utama**:
1. **Editor Naskah Berita:** Menggabungkan naskah otomatis dari Outline Builder. Dilengkapi Upload Foto Liputan dan Tombol "Simpan Draf".
2. **Draf Karya Bersama:** Menampilkan daftar karya WIP (*Work In Progress*) dari seluruh siswa agar bisa saling dibaca sebelum direview.
3. **Peer Review:** Tempat siswa/guru memberikan ulasan dan komentar pada draf siswa lain.
4. **Status Draft Dashboard:** Menampilkan status secara real-time:
   - 🔴 Revisi
   - 🟡 Dalam Review
   - 🟢 Disetujui (Approved)
5. **Auto-Checklist Berita (Sistem mirip Kompasiana):**
   Otomatis ter-centang hijau jika kriteria berikut terpenuhi secara otomatis oleh sistem:
   - [x] *Lead menjawab 5W+1H* (Terdeteksi jika form lead diisi)
   - [x] *Ada kutipan narasumber* (Terdeteksi jika ada karakter tanda petik `"` di dalam teks body)
   - [x] *Foto dilampirkan* (Terdeteksi jika `image_url` terisi)
   *(Catatan: Poin 'Judul Menarik' & 'Fakta Terverifikasi' dihapus sesuai revisi brief)*[cite: 1].

### Modul 5: Galeri Jurnalistik
1. Hanya menampilkan naskah berita yang berstatus **`Approved`** oleh Guru.
2. Memiliki **Kolom Komentar** di bawah tiap artikel berita.
3. **DILARANG** menampilkan tombol Like, Share Instagram, maupun Unduh PDF[cite: 1].

---

## 4. DESIGN & UX GUIDELINES
- **Theme:** Child-friendly (Anak SD Kelas VI). Ceria, responsif (Smartphone & Desktop).
- **Color Palette:** Mengacu pada Logo SI NARA (Hijau, Kuning, Oranye/Merah)[cite: 1].
- **Clean UI:** HAPUS SEMUA elemen, icon, widget, atau layout yang berbau media sosial Instagram[cite: 1].

---

## 5. STRICT DON'TS (PANTANGAN UTAMA)
- DILARANG memakai Google OAuth/Sign-in[cite: 1].
- DILARANG memasukkan widget/layout Instagram[cite: 1].
- DILARANG mempublikasikan berita secara otomatis ke Galeri tanpa status `Approved` dari Guru[cite: 1].
- DILARANG melegalkan bypassing lock (fitur Ruang Redaksi harus terkunci jika Pojok Literasi belum tuntas)[cite: 1].
- DILARANG membatasi input pertanyaan ADIKSIMBA cuma 1 per item[cite: 1].
- DILARANG menggunakan struktur 3 sub-fitur lama pada Studio Editor (Harus 4 sub-fitur)[cite: 1].