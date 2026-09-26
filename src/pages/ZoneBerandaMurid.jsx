import { ZONES } from '../data/constants';

export default function ZoneBerandaMurid({ role, setZone, progress }) {
  const checkedCount = Object.values(progress?.checkedMaterials || {}).filter(Boolean).length;
  const news = [
    { emoji: '🍎', title: 'Petani Apel Sumberbrantas Panen Raya Musim Ini', author: 'Kelompok Mawar', time: '2 jam lalu', cat: 'Pertanian' },
    { emoji: '🌿', title: 'Wisata Edukasi Hidroponik Menarik Ratusan Pengunjung', author: 'Kelompok Melati', time: '1 hari lalu', cat: 'Agrowisata' },
    { emoji: '🎭', title: 'Festival Budaya Desa: Tari Topeng Tampil Memukau', author: 'Kelompok Anggrek', time: '2 hari lalu', cat: 'Budaya' },
    { emoji: '🥦', title: 'Inovasi Pertanian Sayur Organik Sambut Musim Hujan', author: 'Kelompok Dahlia', time: '3 hari lalu', cat: 'Pertanian' },
  ];

  const steps = [
    { n: 1, icon: '📖', label: 'Pelajari',   desc: 'Baca e-modul & infografis jurnalistik', color: '#2AA168', zone: 'literasi' },
    { n: 2, icon: '🎙️', label: 'Wawancara', desc: 'Observasi & catat di lembar kerja',     color: '#3B8FD4', zone: 'redaksi'  },
    { n: 3, icon: '✏️', label: 'Edit',       desc: 'Tulis & review bersama kelompok',       color: '#F07040', zone: 'studio'   },
    { n: 4, icon: '🗞️', label: 'Terbit',     desc: 'Publikasikan ke Galeri SI NARA',        color: '#7C3AED', zone: 'galeri'   },
  ];

  const statItems = [
    // { emoji: '📚', value: '6',  label: 'Bahan Ajar' },
    // { emoji: '📰', value: '12', label: 'Berita Terbit' },
    // { emoji: '🏆', value: '48', label: 'Bintang Diraih' },
  ];

  // ── Panel Progress Belajar ──────────────────────────────────────
  const progressItems = [
    { emoji: '📖', label: '6 Bahan Ajar', status: checkedCount === 6 ? 'done' : 'progress', detail: checkedCount === 6 ? 'Selesai ✓' : `${checkedCount} dari 6 dibaca` },    { emoji: '🔍', label: 'Detektif ADIKSIMBA', status: progress?.literasiDone ? 'done' : 'locked',  detail: progress?.literasiDone ? 'Selesai ✓' : 'Belum dimulai' },
    { emoji: '🗺️', label: 'Ruang Redaksi',   status: progress?.literasiDone ? 'progress' : 'locked', detail: progress?.literasiDone ? 'Siap dijelajahi' : 'Terkunci 🔒' },
    { emoji: '✏️', label: 'Studio Editor',   status: 'locked', detail: 'Selesaikan Redaksi dulu' },
  ];

  const statusStyle = {
    done:     { bg: '#D4F0E3', color: '#166534', icon: '✅' },
    progress: { bg: '#FEF9E0', color: '#854D0E', icon: '🟡' },
    locked:   { bg: '#F3F4F6', color: '#9CA3AF', icon: '🔒' },
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      {/* ───────── HERO ───────── */}
      <div
        style={{
          borderRadius: 24, overflow: 'hidden', marginBottom: 28,
          background: 'linear-gradient(135deg,#1E8C58 0%,#2AA168 40%,#3B8FD4 100%)',
          position: 'relative', minHeight: 220,
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1648518295678-f78670c35924?w=1200&h=400&fit=crop&auto=format)',
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18,
          }}
        />
        <div style={{ position: 'relative', padding: '36px 40px', color: 'white' }}>
          <div
            style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.2)', borderRadius: 20,
                  display: 'inline-block', padding: '4px 14px',
                  fontSize: 12, fontWeight: 700, marginBottom: 10,
                  fontFamily: 'Nunito',
                }}
              >
                🌿 Desa Sumberbrantas · Kota Batu
              </div>
              <h1
                style={{
                  fontFamily: 'Nunito', fontWeight: 900,
                  fontSize: 'clamp(24px,4vw,40px)',
                  margin: 0, lineHeight: 1.15,
                  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                SI NARA 📰<br />Jurnalis Cilik Sumberbrantas
              </h1>
              <p
                style={{
                  margin: '12px 0 20px', fontSize: 14,
                  opacity: 0.92, maxWidth: 480, lineHeight: 1.6,
                }}
              >
                Platform Pembelajaran Jurnalistik Berbasis Proyek untuk Siswa Kelas VI SD.
                Temukan, tulis, dan bagikan cerita desa kita!
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: '🚀 Mulai Belajar', zone: 'literasi', bg: 'white',                  color: '#2AA168' },
                  { label: '✏️ Tulis Berita',  zone: 'studio',   bg: 'rgba(255,255,255,0.2)', color: 'white'   },
                  { label: '🖼️ Galeri',        zone: 'galeri',   bg: 'rgba(255,255,255,0.2)', color: 'white'   },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => setZone(btn.zone)}
                    style={{
                      padding: '10px 20px', borderRadius: 30,
                      border: '2px solid rgba(255,255,255,0.5)',
                      background: btn.bg, color: btn.color,
                      fontFamily: 'Nunito', fontWeight: 800,
                      fontSize: 14, cursor: 'pointer', transition: 'all 0.18s',
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats baru (pengganti stats sosmed) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
              {statItems.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 14, padding: '10px 16px',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{s.emoji}</span>
                  <div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 20 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ───────── ALUR BELAJAR 4 LANGKAH ───────── */}
      <div
        style={{
          background: 'white', borderRadius: 20, padding: 24,
          marginBottom: 28,
          boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
        }}
      >
        <h2
          style={{
            fontFamily: 'Nunito', fontWeight: 900,
            fontSize: 18, margin: '0 0 20px', color: '#1a2e22',
          }}
        >
          🗺️ Alur Belajar SI NARA
        </h2>
        <div
          style={{
            display: 'flex', alignItems: 'center',
            gap: 0, flexWrap: 'wrap', rowGap: 16,
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              style={{ display: 'contents' }}
            >
              <button
                onClick={() => setZone(s.zone)}
                className="card-hover"
                style={{
                  flex: '1 1 160px',
                  background: s.color + '12', borderRadius: 16,
                  border: `2px solid ${s.color}30`,
                  padding: '18px 16px',
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 50,
                    background: s.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, margin: '0 auto 10px', color: 'white',
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    width: 22, height: 22, borderRadius: 50,
                    background: s.color, color: 'white',
                    fontSize: 11, fontWeight: 900, fontFamily: 'Nunito',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '-8px auto 6px',
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: 'Nunito', fontWeight: 800,
                    fontSize: 15, color: '#1a2e22',
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 12, color: '#6B9E80',
                    marginTop: 4, lineHeight: 1.4,
                  }}
                >
                  {s.desc}
                </div>
              </button>
              {i < steps.length - 1 && (
                <div
                  className="step-line"
                  style={{ flex: '0 0 20px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── 2 KOLOM: BERITA + PANEL PROGRESS ───────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Berita Terkini */}
        <div
          style={{
            background: 'white', borderRadius: 20, padding: 24,
            boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
          }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 18,
            }}
          >
            <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, margin: 0 }}>
              📢 Berita Terkini
            </h2>
            <button
              onClick={() => setZone('galeri')}
              style={{
                background: '#D4F0E3', color: '#166534',
                border: 'none', borderRadius: 20,
                padding: '5px 14px', fontSize: 12,
                fontWeight: 700, fontFamily: 'Nunito', cursor: 'pointer',
              }}
            >
              Lihat Semua →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {news.map((n, i) => (
              <div
                key={i}
                className="card-hover"
                onClick={() => setZone('galeri')}
                style={{
                  border: '2px solid #E6F5EC', borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: '#F0FAF4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, flexShrink: 0,
                  }}
                >
                  {n.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      background: '#D4F0E3', color: '#166534',
                      display: 'inline-block',
                      padding: '2px 10px', borderRadius: 10,
                      fontSize: 10, fontWeight: 700,
                      fontFamily: 'Nunito', marginBottom: 4,
                    }}
                  >
                    {n.cat}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Nunito', fontWeight: 700,
                      fontSize: 14, color: '#1a2e22', lineHeight: 1.3,
                    }}
                  >
                    {n.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B9E80', marginTop: 4 }}>
                    ✍️ {n.author} · 🕐 {n.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Progress Belajar (Pengganti Widget Instagram) */}
        <div
          style={{
            background: 'white', borderRadius: 20, padding: 24,
            boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
          }}
        >
          <h2
            style={{
              fontFamily: 'Nunito', fontWeight: 900,
              fontSize: 18, margin: '0 0 6px',
            }}
          >
            🎯 Progress Belajarmu
          </h2>
          <p style={{ fontSize: 12, color: '#6B9E80', margin: '0 0 16px' }}>
            Pantau langkahmu jadi jurnalis cilik!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {progressItems.map((p, i) => {
              const st = statusStyle[p.status];
              return (
                <div
                  key={i}
                  style={{
                    background: st.bg, borderRadius: 12,
                    padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{p.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'Nunito', fontWeight: 800,
                        fontSize: 13, color: st.color,
                      }}
                    >
                      {p.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B9E80', marginTop: 1 }}>
                      {p.detail}
                    </div>
                  </div>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{st.icon}</span>
                </div>
              );
            })}
          </div>

          {/* Quick CTA */}
          <button
            onClick={() => setZone('literasi')}
            style={{
              width: '100%', marginTop: 16,
              padding: '12px', borderRadius: 12, border: 'none',
              background: '#2AA168', color: 'white',
              fontFamily: 'Nunito', fontWeight: 800,
              fontSize: 14, cursor: 'pointer',
            }}
          >
            {progress?.literasiDone ? '🚀 Lanjut ke Ruang Redaksi' : '📚 Mulai Belajar Sekarang'}
          </button>

          <div
            style={{
              marginTop: 14, padding: '10px 12px',
              background: '#F0FAF4', borderRadius: 12,
              fontSize: 11, color: '#4A7060', lineHeight: 1.5,
            }}
          >
            💡 <strong>Tips:</strong> Selesaikan 6 Bahan Ajar + Kuis 100% untuk membuka Ruang Redaksi!
          </div>
        </div>
      </div>

      {/* ───────── TIPS JURNALIS CILIK ───────── */}
      <div
        style={{
          background: 'white', borderRadius: 20, padding: 24,
          marginTop: 28,
          boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
        }}
      >
        <h2
          style={{
            fontFamily: 'Nunito', fontWeight: 900,
            fontSize: 18, margin: '0 0 6px',
          }}
        >
          ✨ Tips Jurnalis Cilik
        </h2>
        <p style={{ fontSize: 13, color: '#6B9E80', margin: '0 0 18px' }}>
          Rangkuman singkat supaya beritamu makin keren!
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          {[
            { emoji: '🎯', title: 'Teras yang Kuat',   desc: 'Paragraf pertama wajib jawab minimal 4W: Apa, Siapa, Di Mana, Kapan.', color: '#2AA168' },
            { emoji: '💬', title: 'Kutipan Langsung',  desc: 'Pakai tanda petik "..." untuk mengutip persis kata narasumber.',        color: '#3B8FD4' },
            { emoji: '📷', title: 'Foto Bercerita',    desc: 'Ambil foto dari sudut menarik dan sertakan caption singkat.',           color: '#F07040' },
            { emoji: '✂️', title: 'Kalimat Efektif',   desc: 'Satu ide satu kalimat. Hindari kalimat yang terlalu panjang.',          color: '#7C3AED' },
          ].map((tip, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                background: tip.color + '10',
                borderRadius: 16, padding: 16,
                border: `2px solid ${tip.color}25`,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{tip.emoji}</div>
              <div
                style={{
                  fontFamily: 'Nunito', fontWeight: 800,
                  fontSize: 14, color: tip.color, marginBottom: 4,
                }}
              >
                {tip.title}
              </div>
              <div style={{ fontSize: 12, color: '#4A7060', lineHeight: 1.5 }}>
                {tip.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}