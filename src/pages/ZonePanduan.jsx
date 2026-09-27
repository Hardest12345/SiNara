import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

export default function ZonePanduan({ role, setZone }) {
  const [activeTab, setActiveTab] = useState(role === 'guru' ? 'guru' : 'siswa');
  const [openFaq, setOpenFaq] = useState({ 0: true });

  const toggleFaq = (index) => {
    setOpenFaq((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const faqs = [
    {
      q: 'Mengapa menu Ruang Redaksi (🗺️) dan Studio Editor (✏️) saya terkunci (🔒)?',
      a: 'Menu tersebut dikunci khusus untuk Akun Siswa sampai kamu menyelesaikan 6 bahan ajar dan lulus Kuis Evaluasi di Pojok Literasi (📚). Ini bertujuan agar kamu memahami aturan penulisan jurnalistik terlebih dahulu.',
    },
    {
      q: 'Bagaimana cara mengirimkan berita agar dibaca dan disetujui Guru?',
      a: 'Setelah menulis berita lengkap di Studio Editor (✏️), klik tombol "Kirim ke Editor". Berita kamu akan masuk ke status "Dalam Review" untuk diperiksa oleh Guru.',
    },
    {
      q: 'Apa yang harus dilakukan jika naskah berita mendapatkan status Revisi (🔴)?',
      a: 'Buka Studio Editor (✏️), pilih draft berita kamu yang berstatus Revisi. Baca catatan perbaikan dari Guru, lakukan pengeditan naskah sesuai masukan, lalu klik tombol simpan/kirim ulang.',
    },
    {
      q: 'Di mana berita yang sudah disetujui (Approved) akan tampil?',
      a: 'Berita yang disetujui oleh Guru/Editor akan otomatis dipublikasikan di Galeri Jurnalistik (🗞️). Seluruh siswa dan guru dapat membaca, memberikan komentar, dan berinteraksi di sana.',
    },
    {
      q: 'Apa saja topik berita yang diperbolehkan di SI NARA?',
      a: 'Topik berita difokuskan pada kearifan lokal Desa Sumberbrantas, seperti Pertanian Apel & Sayur, Agrowisata, Kegiatan Sekolah, UMKM Desa, Pengelolaan Lingkungan, serta Budaya lokal.',
    },
    {
      q: 'Apakah Guru bisa menulis dan menyunting berita siswa?',
      a: 'Ya, Guru memiliki hak akses sebagai Editor di Studio Editor. Guru dapat mereview, memberikan arahan revisi, atau langsung mempublikasikan karya siswa.',
    },
  ];

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1100, margin: '0 auto' }}>
      <SectionHeader
        emoji="📖"
        title="Panduan Penggunaan SI NARA"
        subtitle="Petunjuk Langkah demi Langkah bagi Siswa & Guru Jurnalis Cilik"
        color="#0EA5E9"
      />

      {/* Tabs navigation */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 24,
          flexWrap: 'wrap',
          borderBottom: '2px solid #E6F5EC',
          paddingBottom: 12,
        }}
      >
        <button
          onClick={() => setActiveTab('alur')}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Nunito',
            fontWeight: 800,
            fontSize: 14,
            background: activeTab === 'alur' ? '#0EA5E9' : '#F0FAF4',
            color: activeTab === 'alur' ? '#FFF' : '#4A7060',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>🚀</span>
          <span>Alur Aplikasi</span>
        </button>

        <button
          onClick={() => setActiveTab('siswa')}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Nunito',
            fontWeight: 800,
            fontSize: 14,
            background: activeTab === 'siswa' ? '#2AA168' : '#F0FAF4',
            color: activeTab === 'siswa' ? '#FFF' : '#4A7060',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>👦</span>
          <span>Panduan Siswa</span>
        </button>

        {/* <button
          onClick={() => setActiveTab('guru')}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Nunito',
            fontWeight: 800,
            fontSize: 14,
            background: activeTab === 'guru' ? '#3B8FD4' : '#F0FAF4',
            color: activeTab === 'guru' ? '#FFF' : '#4A7060',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>👩‍🏫</span>
          <span>Panduan Guru / Editor</span>
        </button> */}

        <button
          onClick={() => setActiveTab('faq')}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Nunito',
            fontWeight: 800,
            fontSize: 14,
            background: activeTab === 'faq' ? '#7C3AED' : '#F0FAF4',
            color: activeTab === 'faq' ? '#FFF' : '#4A7060',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>❓</span>
          <span>FAQ & Tanya Jawab</span>
        </button>
      </div>

      {/* ═══ TAB 1: ALUR APLIKASI ═══════════════════════════════════════ */}
      {activeTab === 'alur' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              background: '#F0F9FF',
              border: '2px solid #BAE6FD',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <h3
              style={{
                fontFamily: 'Nunito',
                fontWeight: 900,
                fontSize: 18,
                color: '#0369A1',
                marginTop: 0,
                marginBottom: 8,
              }}
            >
              💡 Siklus Pembelajaran & Jurnalistik SI NARA
            </h3>
            <p style={{ margin: 0, color: '#334155', fontSize: 14, lineHeight: 1.6 }}>
              SI NARA (Sistem Informasi Naungan Jurnalistik Cilik Sumberbrantas) dirancang untuk membantu murid SD belajar jurnalistik secara bertahap, mulai dari pemahaman teori hingga penerbitan berita karya sendiri.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                background: '#FFF',
                border: '2px solid #E6F5EC',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    background: '#3B8FD4',
                    color: '#FFF',
                    fontWeight: 900,
                    width: 28,
                    height: 28,
                    borderRadius: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                  }}
                >
                  1
                </span>
                <span style={{ fontSize: 24 }}>📚</span>
                <h4 style={{ margin: 0, fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#1A2E22' }}>
                  Pojok Literasi
                </h4>
              </div>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
                Pelajari 6 materi dasar jurnalistik (Struktur Berita, PUEBI, Wawancara, Foto, Mengenal Desa, Fakta/Opini) dan selesaikan kuis evaluasi.
              </p>
              {setZone && (
                <button
                  onClick={() => setZone('literasi')}
                  style={{
                    marginTop: 14,
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#E0F2FE',
                    color: '#0369A1',
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Buka Pojok Literasi →
                </button>
              )}
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: '#FFF',
                border: '2px solid #E6F5EC',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    background: '#F5C03A',
                    color: '#FFF',
                    fontWeight: 900,
                    width: 28,
                    height: 28,
                    borderRadius: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                  }}
                >
                  2
                </span>
                <span style={{ fontSize: 24 }}>🗺️</span>
                <h4 style={{ margin: 0, fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#1A2E22' }}>
                  Ruang Redaksi
                </h4>
              </div>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
                Pilih topik liputan seputar Desa Sumberbrantas dan buat kerangka pertanyaan liputan menggunakan formula ADIKSIMBA (5W + 1H).
              </p>
              {setZone && role === 'siswa' && (
                <button
                  onClick={() => setZone('redaksi')}
                  style={{
                    marginTop: 14,
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#FEF3C7',
                    color: '#92400E',
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Buka Ruang Redaksi →
                </button>
              )}
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: '#FFF',
                border: '2px solid #E6F5EC',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    background: '#F07040',
                    color: '#FFF',
                    fontWeight: 900,
                    width: 28,
                    height: 28,
                    borderRadius: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                  }}
                >
                  3
                </span>
                <span style={{ fontSize: 24 }}>✏️</span>
                <h4 style={{ margin: 0, fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#1A2E22' }}>
                  Studio Editor
                </h4>
              </div>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
                Tulis artikel berita secara utuh, lampirkan foto liputan, dan kirimkan ke Guru/Editor untuk dilakukan pemeriksaan dan review.
              </p>
              {setZone && (
                <button
                  onClick={() => setZone('studio')}
                  style={{
                    marginTop: 14,
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#FFEDD5',
                    color: '#C2410C',
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Buka Studio Editor →
                </button>
              )}
            </div>

            {/* Step 4 */}
            <div
              style={{
                background: '#FFF',
                border: '2px solid #E6F5EC',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    background: '#7C3AED',
                    color: '#FFF',
                    fontWeight: 900,
                    width: 28,
                    height: 28,
                    borderRadius: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                  }}
                >
                  4
                </span>
                <span style={{ fontSize: 24 }}>🗞️</span>
                <h4 style={{ margin: 0, fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#1A2E22' }}>
                  Galeri Jurnalistik
                </h4>
              </div>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
                Berita yang disetujui (Approved) akan langsung tayang di Galeri! Teman-teman dan guru bisa membaca serta saling memberi komentar.
              </p>
              {setZone && (
                <button
                  onClick={() => setZone('galeri')}
                  style={{
                    marginTop: 14,
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#F3E8FF',
                    color: '#6B21A8',
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Buka Galeri →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: PANDUAN SISWA ═══════════════════════════════════════ */}
      {activeTab === 'siswa' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#F0FAF4', border: '2px solid #C6F6D5', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: '#166534', margin: '0 0 8px 0' }}>
              👦 Petunjuk Khusus untuk Siswa (Jurnalis Cilik)
            </h3>
            <p style={{ margin: 0, color: '#276749', fontSize: 14, lineHeight: 1.6 }}>
              Selamat bertugas sebagai Jurnalis Cilik Desa Sumberbrantas! Berikut langkah-langkah yang perlu kamu lakukan dari awal sampai beritamu terbit:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Item 1 */}
            <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '2px solid #E6F5EC' }}>
              <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#2AA168', marginTop: 0, marginBottom: 10 }}>
                1. Membuka Kunci Menu (Pojok Literasi 📚)
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
                <li>Buka menu <b>Pojok Literasi</b> di samping kiri.</li>
                <li>Klik dan baca 6 materi pelajaran jurnalistik secara berurutan.</li>
                <li>Tandai materi yang sudah kamu baca. Setelah semua materi selesai, tombol <b>Kuis Evaluasi</b> akan aktif.</li>
                <li>Kerjakan kuis evaluasi hingga lulus untuk membuka fitur <b>Ruang Redaksi</b> dan <b>Studio Editor</b>.</li>
              </ul>
            </div>

            {/* Item 2 */}
            <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '2px solid #E6F5EC' }}>
              <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#F5C03A', marginTop: 0, marginBottom: 10 }}>
                2. Menyiapkan Liputan (Ruang Redaksi 🗺️)
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
                <li>Pilih salah satu topik berita dari katalog potensi Desa Sumberbrantas (misal: Petani Apel, Sayur Organik, UMKM, Wisata).</li>
                <li>Susun rancangan wawancara dengan mengisi pertanyaan <b>ADIKSIMBA</b> (Apa, Siapa, Di mana, Kapan, Mengapa, Bagaimana).</li>
                <li>Lakukan wawancara langsung ke narasumber di lingkungan desa dengan sopan.</li>
              </ul>
            </div>

            {/* Item 3 */}
            <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '2px solid #E6F5EC' }}>
              <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#F07040', marginTop: 0, marginBottom: 10 }}>
                3. Menulis & Mengirim Berita (Studio Editor ✏️)
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
                <li>Masuk ke menu <b>Studio Editor</b> dan klik buat draft naskah baru.</li>
                <li>Tulis Judul Berita yang menarik dan padat.</li>
                <li>Tulis Teras Berita (Lead) yang merangkum poin inti wawancara.</li>
                <li>Tulis Tubuh Berita secara detail dan santun.</li>
                <li>Unggah foto pendukung liputanmu dan beri keterangan (caption) foto.</li>
                <li>Klik <b>Simpan Draft</b> jika belum selesai, atau klik <b>Kirim ke Editor</b> bila sudah siap diperiksa Guru.</li>
              </ul>
            </div>

            {/* Item 4 */}
            <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '2px solid #E6F5EC' }}>
              <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#7C3AED', marginTop: 0, marginBottom: 10 }}>
                4. Memantau Status Berita
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                <div style={{ background: '#F0FAF4', border: '1px solid #2AA168', padding: '8px 12px', borderRadius: 10, fontSize: 12 }}>
                  📝 <b>Draft</b>: Masih ditulis oleh siswa.
                </div>
                <div style={{ background: '#FEF9E0', border: '1px solid #F5C03A', padding: '8px 12px', borderRadius: 10, fontSize: 12 }}>
                  🟡 <b>Dalam Review</b>: Sedang diperiksa oleh Guru.
                </div>
                <div style={{ background: '#FEE2E2', border: '1px solid #F87171', padding: '8px 12px', borderRadius: 10, fontSize: 12 }}>
                  🔴 <b>Revisi</b>: Perlu perbaikan naskah sesuai catatan Guru.
                </div>
                <div style={{ background: '#D4F0E3', border: '1px solid #166534', padding: '8px 12px', borderRadius: 10, fontSize: 12 }}>
                  🟢 <b>Disetujui</b>: Berita berhasil terbit di Galeri Jurnalistik!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: PANDUAN GURU ═══════════════════════════════════════ */}
      {/* {activeTab === 'guru' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#EFF6FF', border: '2px solid #BFDBFE', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: '#1E40AF', margin: '0 0 8px 0' }}>
              👩‍🏫 Petunjuk Khusus Guru / Editor
            </h3>
            <p style={{ margin: 0, color: '#1E3A8A', fontSize: 14, lineHeight: 1.6 }}>
              Sebagai Guru/Editor, Anda bertindak sebagai pembimbing literasi sekaligus penyunting naskah berita yang dikirimkan oleh siswa.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '2px solid #E6F5EC' }}>
              <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#3B8FD4', marginTop: 0, marginBottom: 10 }}>
                1. Pemantauan Progress Siswa (Beranda Guru 🏡)
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
                <li>Melihat ringkasan total siswa, jumlah berita yang dikirim, dan berita terbit.</li>
                <li>Memantau tingkat penyelesaian materi literasi dan kelulusan kuis siswa secara individu.</li>
              </ul>
            </div>

            <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '2px solid #E6F5EC' }}>
              <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#F07040', marginTop: 0, marginBottom: 10 }}>
                2. Pemeriksaan & Review Berita (Studio Editor ✏️)
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
                <li>Masuk ke <b>Studio Editor</b> untuk melihat daftar seluruh draft siswa yang diajukan ("Dalam Review").</li>
                <li>Buka naskah siswa, periksa struktur berita (Judul, Lead, Body), penggunaan PUEBI, dan kelayakan foto.</li>
                <li>Jika naskah membutuhkan perbaikan, beri catatan konstruktif dan ubah status menjadi <b>Revisi</b>.</li>
                <li>Jika naskah sudah layak terbit, klik tombol <b>Setujui / Approve</b>.</li>
              </ul>
            </div>

            <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '2px solid #E6F5EC' }}>
              <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#7C3AED', marginTop: 0, marginBottom: 10 }}>
                3. Moderasi Galeri & Apresiasi Karya (Galeri 🗞️)
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
                <li>Melihat publikasi karya siswa di Galeri Jurnalistik.</li>
                <li>Memberikan umpan balik positif di kolom komentar untuk meningkatkan motivasi siswa.</li>
              </ul>
            </div>
          </div>
        </div>
      )} */}

      {/* ═══ TAB 4: FAQ ════════════════════════════════════════════════ */}
      {activeTab === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#FAF5FF', border: '2px solid #E9D5FF', borderRadius: 16, padding: 20, marginBottom: 8 }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: '#6B21A8', margin: '0 0 8px 0' }}>
              ❓ Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            <p style={{ margin: 0, color: '#581C87', fontSize: 14 }}>
              Temukan jawaban cepat atas pertanyaan seputar penggunaan aplikasi SI NARA di bawah ini:
            </p>
          </div>

          {faqs.map((faq, idx) => {
            const isOpen = !!openFaq[idx];
            return (
              <div
                key={idx}
                style={{
                  background: '#FFF',
                  border: '2px solid #E6F5EC',
                  borderRadius: 16,
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 15,
                    color: '#1A2E22',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    🔻
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '0 20px 16px 20px',
                      color: '#4B5563',
                      fontSize: 14,
                      lineHeight: 1.6,
                      borderTop: '1px solid #F0FAF4',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}