// ─── ZONE NAVIGATION ──────────────────────────────────────────────
export const ZONES = [
  { id: 'beranda',  emoji: '🏡', label: 'Beranda',           short: 'Beranda',  color: '#2AA168' },
  { id: 'literasi', emoji: '📚', label: 'Pojok Literasi',    short: 'Literasi', color: '#3B8FD4' },
  { id: 'redaksi',  emoji: '🗺️', label: 'Ruang Redaksi',     short: 'Redaksi',  color: '#F5C03A' },
  { id: 'studio',   emoji: '✏️', label: 'Studio Editor',     short: 'Studio',   color: '#F07040' },
  { id: 'galeri',   emoji: '🗞️', label: 'Galeri Jurnalistik', short: 'Galeri',  color: '#7C3AED' },
  { id: 'panduan',  emoji: '📖', label: 'Panduan Penggunaan', short: 'Panduan', color: '#0EA5E9' },
];

// ─── 6 BAHAN AJAR (Pojok Literasi) ────────────────────────────────
export const MATERIALS = [
  { id: 'struktur-teks', emoji: '📰', title: 'Struktur Teks Berita', desc: 'Pelajari bagian-bagian berita: Judul, Teras, Tubuh, dan Ekor berita.', color: '#3B8FD4' },
  { id: 'puebi',         emoji: '📝', title: 'Panduan PUEBI',         desc: 'Ejaan, tanda baca, dan penulisan kata yang benar dalam bahasa Indonesia.', color: '#2AA168' },
  { id: 'wawancara',     emoji: '🎙️', title: 'Teknik Wawancara',      desc: 'Cara bertanya yang baik, menyiapkan pertanyaan ADIKSIMBA, dan etika meliput.', color: '#F07040' },
  { id: 'foto',          emoji: '📷', title: 'Foto Jurnalistik',      desc: 'Prinsip pengambilan foto berita: komposisi, sudut, dan caption.', color: '#7C3AED' },
  { id: 'desa',          emoji: '🌿', title: 'Mengenal Desa Sumberbrantas', desc: 'Sejarah, potensi pertanian, agrowisata, dan budaya lokal desa kita.', color: '#F5C03A' },
  { id: 'fakta-opini',   emoji: '✅', title: 'Fakta vs Opini',        desc: 'Cara membedakan kalimat fakta dan kalimat opini dalam sebuah teks berita.', color: '#EC4899' },
];

// ─── ADIKSIMBA ────────────────────────────────────────────────────
export const ADIKSIMBA_LABELS = [
  { key: 'what',  label: 'APA (What)',       q: 'Apa',      color: '#991B1B', bg: '#FECACA' },
  { key: 'who',   label: 'SIAPA (Who)',      q: 'Siapa',    color: '#1E40AF', bg: '#BFDBFE' },
  { key: 'where', label: 'DI MANA (Where)',  q: 'Di Mana',  color: '#166534', bg: '#BBF7D0' },
  { key: 'when',  label: 'KAPAN (When)',     q: 'Kapan',    color: '#854D0E', bg: '#FEF08A' },
  { key: 'why',   label: 'MENGAPA (Why)',    q: 'Mengapa',  color: '#6B21A8', bg: '#E9D5FF' },
  { key: 'how',   label: 'BAGAIMANA (How)',  q: 'Bagaimana',     color: '#9A3412', bg: '#FED7AA' },
];

// ─── KATALOG TOPIK LIPUTAN ────────────────────────────────────────
export const TOPICS = [
  { emoji: '🍎', title: 'Petani Apel Sumberbrantas', cat: 'Pertanian',  desc: 'Kisah dan inovasi petani apel lokal menghadapi musim tanam.' },
  { emoji: '🥦', title: 'Pertanian Sayur Organik',   cat: 'Pertanian',  desc: 'Cara petani desa budidayakan sayuran tanpa pestisida kimia.' },
  { emoji: '🌿', title: 'Wisata Edukasi Pertanian',  cat: 'Agrowisata', desc: 'Paket agrowisata yang mengundang wisatawan ke kebun desa.' },
  { emoji: '🏪', title: 'Wirausaha / UMKM Desa',     cat: 'UMKM',       desc: 'Kisah pelaku usaha kecil dan menengah yang berkembang di desa.' },
  { emoji: '🌊', title: 'Pengelolaan Air Bersih',    cat: 'Lingkungan', desc: 'Sistem irigasi dan pengelolaan sumber air pegunungan desa.' },
  { emoji: '🏫', title: 'Sekolah & Pendidikan Desa', cat: 'Pendidikan', desc: 'Perjuangan siswa dan guru meraih prestasi.' },
  { emoji: '🍓', title: 'Agrowisata Strawberry',     cat: 'Agrowisata', desc: 'Petik stroberi langsung dari kebun — daya tarik wisata baru.' },
  { emoji: '🐄', title: 'Budidaya Hewan',            cat: 'Budidaya',   desc: 'Peternak sapi, kambing, dan unggas lokal penopang pangan desa.' },
];

// Warna kategori untuk konsistensi
export const CATEGORY_COLORS = {
  Pertanian:  '#2AA168',
  Agrowisata: '#3B8FD4',
  UMKM:       '#F07040',
  Pendidikan: '#7C3AED',
  Lingkungan: '#0EA5E9',
  Budidaya:   '#EC4899',
  Budaya:     '#7C3AED',
  Lainnya:    '#6B9E80',
};

// ─── STATUS DRAFT ─────────────────────────────────────────────────
export const DRAFT_STATUS = {
  draft:    { label: 'Draft',          emoji: '📝', color: '#6B9E80', bg: '#F0FAF4' },
  review:   { label: 'Dalam Review',   emoji: '🟡', color: '#854D0E', bg: '#FEF9E0' },
  revisi:   { label: 'Revisi',         emoji: '🔴', color: '#9A3412', bg: '#FEE2E2' },
  approved: { label: 'Disetujui',      emoji: '🟢', color: '#166534', bg: '#D4F0E3' },
};