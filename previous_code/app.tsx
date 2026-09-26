import { useState, useRef } from "react";

type Zone = "beranda" | "literasi" | "redaksi" | "studio" | "galeri";
type Role = "murid" | "guru";

const ZONES: { id: Zone; emoji: string; label: string; short: string; color: string }[] = [
  { id: "beranda",  emoji: "🏡", label: "Beranda",          short: "Beranda",  color: "#2AA168" },
  { id: "literasi", emoji: "📚", label: "Pojok Literasi",   short: "Literasi", color: "#3B8FD4" },
  { id: "redaksi",  emoji: "🗺️", label: "Ruang Redaksi",    short: "Redaksi",  color: "#F5C03A" },
  { id: "studio",   emoji: "✏️", label: "Studio Editor",    short: "Studio",   color: "#F07040" },
  { id: "galeri",   emoji: "🗞️", label: "Galeri Jurnalistik", short: "Galeri", color: "#7C3AED" },
];

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
  const [zone, setZone] = useState<Zone>("beranda");
  const [role, setRole] = useState<Role>("murid");

  const activeZone = ZONES.find(z => z.id === zone)!;

  return (
    <div style={{ display: "flex", height: "100%", background: "#F2FBF5", overflow: "hidden" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, minWidth: 220, background: "#fff",
        borderRight: "2px solid #E6F5EC", display: "flex",
        flexDirection: "column", gap: 0, zIndex: 20,
        boxShadow: "2px 0 12px rgba(42,161,104,0.07)"
      }} className="hidden-mobile">
        {/* Logo */}
        <div style={{ padding: "20px 20px 12px", borderBottom: "2px solid #E6F5EC" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "linear-gradient(135deg,#2AA168,#3B8FD4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0
            }}>📰</div>
            <div>
              <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, color: "#1a2e22", lineHeight: 1.1 }}>SI NARA</div>
              <div style={{ fontSize: 10, color: "#6B9E80", fontWeight: 600, letterSpacing: "0.04em" }}>JURNALIS CILIK</div>
            </div>
          </div>
        </div>

        {/* Role Switch */}
        <div style={{ padding: "12px 16px", borderBottom: "2px solid #E6F5EC" }}>
          <div style={{ fontSize: 10, color: "#6B9E80", fontWeight: 700, marginBottom: 6, letterSpacing: "0.06em" }}>PERAN</div>
          <div style={{ display: "flex", background: "#F0FAF4", borderRadius: 10, padding: 3 }}>
            {(["murid", "guru"] as Role[]).map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: "5px 0", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "Nunito", fontWeight: 700, fontSize: 12,
                background: role === r ? "#2AA168" : "transparent",
                color: role === r ? "white" : "#6B9E80",
                transition: "all 0.2s"
              }}>
                {r === "murid" ? "👦 Murid" : "👩‍🏫 Guru"}
              </button>
            ))}
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {ZONES.map(z => (
            <button key={z.id} onClick={() => setZone(z.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer",
              background: zone === z.id ? z.color + "18" : "transparent",
              color: zone === z.id ? z.color : "#4A7060",
              fontFamily: "Nunito", fontWeight: zone === z.id ? 800 : 600,
              fontSize: 13, textAlign: "left",
              borderLeft: zone === z.id ? `3px solid ${z.color}` : "3px solid transparent",
              transition: "all 0.18s"
            }}>
              <span style={{ fontSize: 18 }}>{z.emoji}</span>
              <span>{z.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom info */}
        <div style={{ padding: "12px 16px", borderTop: "2px solid #E6F5EC" }}>
          <div style={{ background: "#F0FAF4", borderRadius: 12, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "#2AA168", fontWeight: 700, fontFamily: "Nunito" }}>🌿 Sumberbrantas</div>
            <div style={{ fontSize: 10, color: "#6B9E80", marginTop: 2 }}>Kota Batu, Jawa Timur</div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header style={{
          background: "white", borderBottom: "2px solid #E6F5EC",
          padding: "12px 24px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, fontSize: 18,
              background: activeZone.color + "20",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>{activeZone.emoji}</div>
            <div>
              <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 16, color: "#1a2e22" }}>{activeZone.label}</div>
              <div style={{ fontSize: 11, color: "#6B9E80" }}>SI NARA · Jurnalis Cilik Sumberbrantas</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              background: role === "murid" ? "#D4F0E3" : "#DBF0FF",
              color: role === "murid" ? "#166534" : "#1E40AF",
              padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "Nunito"
            }}>{role === "murid" ? "👦 Murid" : "👩‍🏫 Guru/Editor"}</div>
            <div style={{
              width: 36, height: 36, borderRadius: 50,
              background: "linear-gradient(135deg,#2AA168,#3B8FD4)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
            }}>🙂</div>
          </div>
        </header>

        {/* Zone Content */}
        <main style={{ flex: 1, overflow: "auto", padding: "0" }}>
          {zone === "beranda"  && <ZoneBeranda role={role} setZone={setZone} />}
          {zone === "literasi" && <ZoneLiterasi />}
          {zone === "redaksi"  && <ZoneRedaksi />}
          {zone === "studio"   && <ZoneStudio role={role} />}
          {zone === "galeri"   && <ZoneGaleri />}
        </main>

        {/* Mobile bottom nav */}
        <nav style={{
          display: "none", borderTop: "2px solid #E6F5EC",
          background: "white", padding: "8px 4px 12px"
        }} className="show-mobile">
          {ZONES.map(z => (
            <button key={z.id} onClick={() => setZone(z.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: 2, border: "none", background: "transparent", cursor: "pointer",
              padding: "4px 0"
            }}>
              <span style={{ fontSize: 22 }}>{z.emoji}</span>
              <span style={{
                fontSize: 10, fontFamily: "Nunito", fontWeight: 700,
                color: zone === z.id ? z.color : "#9CA3AF"
              }}>{z.short}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ZONE 1: BERANDA
// ════════════════════════════════════════════════════════════════════
function ZoneBeranda({ role, setZone }: { role: Role; setZone: (z: Zone) => void }) {
  const news = [
    { emoji: "🍎", title: "Petani Apel Sumberbrantas Panen Raya Musim Ini", author: "Kelompok Mawar", time: "2 jam lalu", cat: "Pertanian" },
    { emoji: "🌿", title: "Wisata Edukasi Hidroponik Menarik Ratusan Pengunjung", author: "Kelompok Melati", time: "1 hari lalu", cat: "Agrowisata" },
    { emoji: "🎭", title: "Festival Budaya Desa: Tari Topeng Tampil Memukau", author: "Kelompok Anggrek", time: "2 hari lalu", cat: "Budaya" },
    { emoji: "🥦", title: "Inovasi Pertanian Sayur Organik Sambut Musim Hujan", author: "Kelompok Dahlia", time: "3 hari lalu", cat: "Pertanian" },
  ];

  const steps = [
    { n: 1, icon: "📖", label: "Pelajari", desc: "Baca e-modul & infografis jurnalistik", color: "#2AA168", zone: "literasi" as Zone },
    { n: 2, icon: "🎙️", label: "Wawancara", desc: "Observasi & catat di lembar kerja", color: "#3B8FD4", zone: "redaksi" as Zone },
    { n: 3, icon: "✏️", label: "Edit", desc: "Tulis & review bersama kelompok", color: "#F07040", zone: "studio" as Zone },
    { n: 4, icon: "🗞️", label: "Terbit", desc: "Publikasikan ke Galeri SI NARA", color: "#7C3AED", zone: "galeri" as Zone },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{
        borderRadius: 24, overflow: "hidden", marginBottom: 28,
        background: "linear-gradient(135deg,#1E8C58 0%,#2AA168 40%,#3B8FD4 100%)",
        position: "relative", minHeight: 220
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1648518295678-f78670c35924?w=1200&h=400&fit=crop&auto=format)`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18
        }} />
        <div style={{ position: "relative", padding: "36px 40px", color: "white" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{
                background: "rgba(255,255,255,0.2)", borderRadius: 20, display: "inline-block",
                padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 10, fontFamily: "Nunito"
              }}>🌿 Desa Sumberbrantas · Kota Batu</div>
              <h1 style={{
                fontFamily: "Nunito", fontWeight: 900, fontSize: "clamp(24px,4vw,40px)",
                margin: 0, lineHeight: 1.15, textShadow: "0 2px 8px rgba(0,0,0,0.2)"
              }}>SI NARA 📰<br />Jurnalis Cilik Sumberbrantas</h1>
              <p style={{ margin: "12px 0 20px", fontSize: 14, opacity: 0.92, maxWidth: 480, lineHeight: 1.6 }}>
                Platform Pembelajaran Jurnalistik Berbasis Proyek untuk Siswa Kelas VI SD.
                Temukan, tulis, dan bagikan cerita desa kita!
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { label: "🚀 Mulai Belajar", zone: "literasi" as Zone, bg: "white", color: "#2AA168" },
                  { label: "✏️ Tulis Berita", zone: "studio" as Zone, bg: "rgba(255,255,255,0.2)", color: "white" },
                  { label: "🖼️ Galeri", zone: "galeri" as Zone, bg: "rgba(255,255,255,0.2)", color: "white" },
                ].map(btn => (
                  <button key={btn.label} onClick={() => setZone(btn.zone)} style={{
                    padding: "10px 20px", borderRadius: 30, border: "2px solid rgba(255,255,255,0.5)",
                    background: btn.bg, color: btn.color, fontFamily: "Nunito", fontWeight: 800,
                    fontSize: 14, cursor: "pointer", transition: "all 0.18s"
                  }}>{btn.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 140 }}>
              {[["📰", "12", "Berita Terbit"], ["⭐", "48", "Penilaian"], ["👥", "6", "Kelompok"]].map(([e, n, l]) => (
                <div key={l} style={{
                  background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "10px 16px",
                  display: "flex", alignItems: "center", gap: 10
                }}>
                  <span style={{ fontSize: 22 }}>{e}</span>
                  <div>
                    <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 20 }}>{n}</div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Learning Flow */}
      <div style={{ background: "white", borderRadius: 20, padding: "24px", marginBottom: 28, boxShadow: "0 2px 12px rgba(42,161,104,0.08)" }}>
        <h2 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, margin: "0 0 20px", color: "#1a2e22" }}>
          🗺️ Alur Belajar SI NARA
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", rowGap: 16 }}>
          {steps.map((s, i) => (
            <>
              <button key={s.n} onClick={() => setZone(s.zone)} className="card-hover" style={{
                flex: "1 1 160px", background: s.color + "12", borderRadius: 16,
                border: `2px solid ${s.color}30`, padding: "18px 16px",
                cursor: "pointer", textAlign: "center", transition: "all 0.2s"
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 50, background: s.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, margin: "0 auto 10px", color: "white"
                }}>{s.icon}</div>
                <div style={{
                  width: 22, height: 22, borderRadius: 50, background: s.color,
                  color: "white", fontSize: 11, fontWeight: 900, fontFamily: "Nunito",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "-8px auto 6px"
                }}>{s.n}</div>
                <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 15, color: "#1a2e22" }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "#6B9E80", marginTop: 4, lineHeight: 1.4 }}>{s.desc}</div>
              </button>
              {i < steps.length - 1 && (
                <div key={`line-${i}`} className="step-line" style={{ flex: "0 0 20px", height: 3, background: `linear-gradient(90deg,${s.color},${steps[i+1].color})` }} />
              )}
            </>
          ))}
        </div>
      </div>

      {/* News + Instagram */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        {/* News Feed */}
        <div style={{ background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 2px 12px rgba(42,161,104,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, margin: 0 }}>📢 Berita Terkini</h2>
            <button onClick={() => setZone("galeri")} style={{
              background: "#D4F0E3", color: "#166534", border: "none", borderRadius: 20,
              padding: "5px 14px", fontSize: 12, fontWeight: 700, fontFamily: "Nunito", cursor: "pointer"
            }}>Lihat Semua →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {news.map((n, i) => (
              <div key={i} className="card-hover" style={{
                border: "2px solid #E6F5EC", borderRadius: 14, padding: "14px 16px",
                display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer"
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: "#F0FAF4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0
                }}>{n.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    background: "#D4F0E3", color: "#166534", display: "inline-block",
                    padding: "2px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700,
                    fontFamily: "Nunito", marginBottom: 4
                  }}>{n.cat}</div>
                  <div style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: "#1a2e22", lineHeight: 1.3 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: "#6B9E80", marginTop: 4 }}>✍️ {n.author} · 🕐 {n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Widget */}
        <div style={{ background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 2px 12px rgba(42,161,104,0.08)" }}>
          <h2 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, margin: "0 0 16px" }}>📸 Instagram SI NARA</h2>
          <div style={{
            background: "linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)",
            borderRadius: 14, padding: "16px", marginBottom: 14, color: "white", textAlign: "center"
          }}>
            <div style={{ fontSize: 30, marginBottom: 4 }}>📷</div>
            <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 16 }}>@sinara.sumberbrantas</div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>Ikuti kami di Instagram!</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
              {[["128", "Postingan"], ["1.2K", "Pengikut"], ["89", "Mengikuti"]].map(([n, l]) => (
                <div key={l}><div style={{ fontWeight: 800, fontSize: 16 }}>{n}</div><div style={{ fontSize: 11 }}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            {[
              "photo-1617078913444-5bfe537fe74c",
              "photo-1593519544785-fd359b7068f1",
              "photo-1648518295678-f78670c35924",
              "photo-1578402027070-0f5ebd84ec9b",
              "photo-1744627049760-f22f045992fe",
              "flagged/photo-1574097656146-0b43b7660cb6",
            ].map((id, i) => (
              <div key={i} style={{
                aspectRatio: "1", borderRadius: 10, overflow: "hidden",
                background: "#E6F5EC", cursor: "pointer"
              }}>
                <img
                  src={`https://images.unsplash.com/${id}?w=120&h=120&fit=crop&auto=format`}
                  alt="Postingan Instagram"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
          <button style={{
            width: "100%", marginTop: 12, padding: "10px", borderRadius: 12,
            border: "2px solid #E6F5EC", background: "white", cursor: "pointer",
            fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#4A7060"
          }}>📲 Buka di Instagram</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ZONE 2: POJOK LITERASI
// ════════════════════════════════════════════════════════════════════
type HlType = "what" | "who" | "where" | "when" | "why" | "how" | null;

const ADIKSIMBA_LABELS: { key: Exclude<HlType, null>; label: string; q: string; color: string; bg: string }[] = [
  { key: "what",  label: "APA (What)",   q: "Apa",    color: "#991B1B", bg: "#FECACA" },
  { key: "who",   label: "SIAPA (Who)",  q: "Siapa",  color: "#1E40AF", bg: "#BFDBFE" },
  { key: "where", label: "DI MANA (Where)", q: "Di Mana", color: "#166534", bg: "#BBF7D0" },
  { key: "when",  label: "KAPAN (When)", q: "Kapan",  color: "#854D0E", bg: "#FEF08A" },
  { key: "why",   label: "MENGAPA (Why)",q: "Mengapa",color: "#6B21A8", bg: "#E9D5FF" },
  { key: "how",   label: "BAGAIMANA (How)",q: "Bgmn", color: "#9A3412", bg: "#FED7AA" },
];

const SAMPLE_SENTENCES = [
  { id: 0, text: "Ratusan kilogram apel segar berhasil dipanen di Desa Sumberbrantas.", answer: "what" as HlType },
  { id: 1, text: "Pak Budi Santoso, petani apel berusia 52 tahun, memimpin panen raya ini.", answer: "who" as HlType },
  { id: 2, text: "Panen berlangsung di kebun apel seluas dua hektar di Jalan Raya Selecta.", answer: "where" as HlType },
  { id: 3, text: "Kegiatan panen dilaksanakan pada Sabtu, 30 Agustus 2025.", answer: "when" as HlType },
  { id: 4, text: "Musim panen tiba lebih awal karena cuaca yang mendukung sepanjang tahun ini.", answer: "why" as HlType },
  { id: 5, text: "Para petani menggunakan alat panen modern untuk mempercepat proses pengumpulan hasil.", answer: "how" as HlType },
];

const FAKTA_OPINI_CARDS = [
  { id: 0, text: "Desa Sumberbrantas menghasilkan 200 ton apel per tahun.", answer: "fakta" },
  { id: 1, text: "Wisata agro di Sumberbrantas adalah yang paling indah di Jawa Timur.", answer: "opini" },
  { id: 2, text: "Desa Sumberbrantas berdiri pada tahun 1948.", answer: "fakta" },
  { id: 3, text: "Tarian Topeng Malangan lebih menarik dari tarian daerah lain.", answer: "opini" },
  { id: 4, text: "Di desa Sumberbrantas terdapat mata air Sungai Brantas yang merupakan sungai terpanjang kedua di Pulau Jawa setelah Bengawan Solo.", answer: "fakta" },
  { id: 5, text: "Sayuran organik dari desa ini pasti lebih sehat dari produk kota.", answer: "opini" },
];

function ZoneLiterasi() {
  const [tab, setTab] = useState<"modul" | "kuis" | "adiksimba">("modul");
  const [highlights, setHighlights] = useState<Record<number, HlType>>({});
  const [selectedHl, setSelectedHl] = useState<HlType>(null);
  const [cardPlacements, setCardPlacements] = useState<Record<number, "fakta" | "opini" | null>>({});
  const [checked, setChecked] = useState(false);

  const markSentence = (id: number) => {
    if (!selectedHl) return;
    setHighlights(h => ({ ...h, [id]: h[id] === selectedHl ? null : selectedHl }));
  };

  const placeCard = (cardId: number, bucket: "fakta" | "opini") => {
    setCardPlacements(p => ({ ...p, [cardId]: p[cardId] === bucket ? null : bucket }));
  };

  const kuisScore = checked
    ? FAKTA_OPINI_CARDS.filter(c => cardPlacements[c.id] === c.answer).length
    : 0;

  const hlScore = Object.entries(highlights).filter(([id, hl]) => hl === SAMPLE_SENTENCES[+id]?.answer).length;

  const TABS = [
    { id: "modul" as const, label: "📖 E-Modul", color: "#3B8FD4" },
    { id: "kuis" as const, label: "🎮 Kuis Fakta vs Opini", color: "#2AA168" },
    { id: "adiksimba" as const, label: "🔍 Detektif ADIKSIMBA", color: "#F07040" },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <SectionHeader emoji="📚" title="Pojok Literasi Interaktif" subtitle="C2 Memahami · C3 Menerapkan" color="#3B8FD4" />

      {/* Tab Nav */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 20px", borderRadius: 30, border: "none", cursor: "pointer",
            fontFamily: "Nunito", fontWeight: 700, fontSize: 14,
            background: tab === t.id ? t.color : "white",
            color: tab === t.id ? "white" : "#4A7060",
            boxShadow: tab === t.id ? `0 4px 14px ${t.color}44` : "0 1px 4px rgba(0,0,0,0.08)",
            transition: "all 0.2s"
          }}>{t.label}</button>
        ))}
      </div>

      {/* E-Modul */}
      {tab === "modul" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
          {[
            { emoji: "📰", title: "Struktur Teks Berita", desc: "Pelajari bagian-bagian berita: Judul, Teras, Tubuh, dan Ekor berita.", color: "#3B8FD4", badge: "C2" },
            { emoji: "📝", title: "Panduan PUEBI", desc: "Ejaan, tanda baca, dan penulisan kata yang benar dalam bahasa Indonesia.", color: "#2AA168", badge: "C2" },
            { emoji: "🎙️", title: "Teknik Wawancara", desc: "Cara bertanya yang baik, menyiapkan pertanyaan ADIKSIMBA, dan etika meliput.", color: "#F07040", badge: "C3" },
            { emoji: "📷", title: "Foto Jurnalistik", desc: "Prinsip pengambilan foto berita: komposisi, sudut, dan caption.", color: "#7C3AED", badge: "C3" },
            { emoji: "🌿", title: "Mengenal Desa Sumberbrantas", desc: "Sejarah, potensi pertanian, agrowisata, dan budaya lokal desa kita.", color: "#F5C03A", badge: "C2" },
            { emoji: "✅", title: "Fakta vs Opini", desc: "Cara membedakan kalimat fakta dan kalimat opini dalam sebuah teks berita.", color: "#EC4899", badge: "C2" },
          ].map((m, i) => (
            <div key={i} className="card-hover" style={{
              background: "white", borderRadius: 18, padding: "20px", border: `2px solid ${m.color}20`,
              cursor: "pointer", position: "relative"
            }}>
              <div style={{ position: "absolute", top: 14, right: 14, background: m.color, color: "white", borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 800, fontFamily: "Nunito" }}>{m.badge}</div>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{m.emoji}</div>
              <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 15, color: "#1a2e22", marginBottom: 6 }}>{m.title}</div>
              <div style={{ fontSize: 13, color: "#6B9E80", lineHeight: 1.5 }}>{m.desc}</div>
              <button style={{
                marginTop: 14, padding: "7px 16px", borderRadius: 20, border: "none",
                background: m.color + "18", color: m.color, cursor: "pointer",
                fontFamily: "Nunito", fontWeight: 700, fontSize: 13
              }}>📖 Buka Modul →</button>
            </div>
          ))}
        </div>
      )}

      {/* Kuis Fakta vs Opini */}
      {tab === "kuis" && (
        <div style={{ background: "white", borderRadius: 20, padding: "28px", boxShadow: "0 2px 12px rgba(42,161,104,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <h3 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 20, margin: 0 }}>🎮 Pisahkan Fakta & Opini!</h3>
            {checked && (
              <div style={{ background: kuisScore >= 4 ? "#D4F0E3" : "#FEF9E0", color: kuisScore >= 4 ? "#166534" : "#854D0E", padding: "6px 16px", borderRadius: 20, fontFamily: "Nunito", fontWeight: 800, fontSize: 15 }}>
                {kuisScore >= 4 ? "🎉" : "💪"} Skor: {kuisScore}/{FAKTA_OPINI_CARDS.length}
              </div>
            )}
          </div>
          <p style={{ color: "#6B9E80", fontSize: 14, marginBottom: 24 }}>Klik tombol "FAKTA" atau "OPINI" pada setiap kalimat untuk mengelompokkannya!</p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              {FAKTA_OPINI_CARDS.map(c => {
                const placed = cardPlacements[c.id];
                const correct = checked ? placed === c.answer : null;
                return (
                  <div key={c.id} style={{
                    border: `2px solid ${correct === true ? "#2AA168" : correct === false ? "#EF4444" : "#E6F5EC"}`,
                    borderRadius: 14, padding: "14px 16px", marginBottom: 12,
                    background: correct === true ? "#D4F0E3" : correct === false ? "#FEE2E2" : "white",
                    transition: "all 0.2s"
                  }}>
                    <p style={{ margin: "0 0 10px", fontFamily: "Poppins", fontSize: 14, color: "#1a2e22", lineHeight: 1.5 }}>"{c.text}"</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => !checked && placeCard(c.id, "fakta")} style={{
                        flex: 1, padding: "7px", borderRadius: 10, border: "none", cursor: checked ? "default" : "pointer",
                        fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                        background: placed === "fakta" ? "#2AA168" : "#F0FAF4",
                        color: placed === "fakta" ? "white" : "#2AA168",
                        transition: "all 0.18s"
                      }}>✅ FAKTA</button>
                      <button onClick={() => !checked && placeCard(c.id, "opini")} style={{
                        flex: 1, padding: "7px", borderRadius: 10, border: "none", cursor: checked ? "default" : "pointer",
                        fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                        background: placed === "opini" ? "#F07040" : "#FFF5F0",
                        color: placed === "opini" ? "white" : "#F07040",
                        transition: "all 0.18s"
                      }}>💭 OPINI</button>
                    </div>
                    {checked && <div style={{ fontSize: 12, marginTop: 6, color: correct ? "#2AA168" : "#EF4444", fontWeight: 700 }}>
                      {correct ? "✅ Benar!" : `❌ Jawaban: ${c.answer.toUpperCase()}`}
                    </div>}
                  </div>
                );
              })}
            </div>
            <div style={{ width: 180 }}>
              <div style={{ background: "#F0FAF4", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
                <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 14, color: "#2AA168", marginBottom: 8 }}>✅ Kalimat Fakta</div>
                <div style={{ fontSize: 13, color: "#6B9E80" }}>Kalimat yang dapat dibuktikan kebenarannya secara objektif.</div>
              </div>
              <div style={{ background: "#FFF5F0", borderRadius: 16, padding: "16px", marginBottom: 20 }}>
                <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 14, color: "#F07040", marginBottom: 8 }}>💭 Kalimat Opini</div>
                <div style={{ fontSize: 13, color: "#6B9E80" }}>Kalimat yang berisi pendapat atau penilaian seseorang.</div>
              </div>
              <button onClick={() => { setChecked(!checked); if (checked) { setCardPlacements({}); } }} style={{
                width: "100%", padding: "12px", borderRadius: 14, border: "none",
                background: checked ? "#E6F5EC" : "#2AA168", color: checked ? "#2AA168" : "white",
                fontFamily: "Nunito", fontWeight: 800, fontSize: 15, cursor: "pointer"
              }}>{checked ? "🔄 Ulangi" : "🔍 Cek Jawaban!"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ADIKSIMBA Highlighter */}
      {tab === "adiksimba" && (
        <div style={{ background: "white", borderRadius: 20, padding: "28px", boxShadow: "0 2px 12px rgba(42,161,104,0.08)" }}>
          <h3 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 20, margin: "0 0 6px" }}>🔍 Detektif ADIKSIMBA</h3>
          <p style={{ color: "#6B9E80", fontSize: 14, marginBottom: 20 }}>
            Pilih kategori warna di bawah, lalu klik kalimat pada teks berita untuk menyorotnya!
          </p>
          {/* Color Palette */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {ADIKSIMBA_LABELS.map(a => (
              <button key={a.key} onClick={() => setSelectedHl(selectedHl === a.key ? null : a.key)} style={{
                padding: "8px 14px", borderRadius: 30, border: "none", cursor: "pointer",
                fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                background: selectedHl === a.key ? a.color : a.bg,
                color: selectedHl === a.key ? "white" : a.color,
                boxShadow: selectedHl === a.key ? `0 4px 12px ${a.color}55` : "none",
                transition: "all 0.18s", transform: selectedHl === a.key ? "scale(1.05)" : "scale(1)"
              }}>{a.q} →</button>
            ))}
            <button onClick={() => setHighlights({})} style={{
              padding: "8px 14px", borderRadius: 30, border: "2px solid #E6F5EC",
              background: "white", color: "#6B9E80", cursor: "pointer",
              fontFamily: "Nunito", fontWeight: 700, fontSize: 13
            }}>🗑️ Reset</button>
          </div>

          {selectedHl && (
            <div style={{ background: ADIKSIMBA_LABELS.find(a => a.key === selectedHl)!.bg, borderRadius: 12, padding: "10px 16px", marginBottom: 16, fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: ADIKSIMBA_LABELS.find(a => a.key === selectedHl)!.color }}>
              🖊️ Aktif: {ADIKSIMBA_LABELS.find(a => a.key === selectedHl)!.label} — klik kalimat untuk menyorot!
            </div>
          )}

          {/* Sample text */}
          <div style={{ border: "2px solid #E6F5EC", borderRadius: 16, padding: "20px" }}>
            <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 16, color: "#1a2e22", marginBottom: 4 }}>
              Panen Raya Apel di Sumberbrantas
            </div>
            <div style={{ fontSize: 12, color: "#6B9E80", marginBottom: 16 }}>📰 Berita Liputan Murid · Kelas VI SD</div>
            {SAMPLE_SENTENCES.map(s => {
              const hl = highlights[s.id];
              const aInfo = hl ? ADIKSIMBA_LABELS.find(a => a.key === hl) : null;
              const isCorrect = hl === s.answer;
              return (
                <span
                  key={s.id}
                  onClick={() => markSentence(s.id)}
                  style={{
                    display: "inline", cursor: selectedHl ? "pointer" : "default",
                    background: aInfo ? aInfo.bg : "transparent",
                    color: aInfo ? aInfo.color : "#1a2e22",
                    borderRadius: 4, padding: hl ? "0 3px" : "0",
                    fontSize: 15, lineHeight: 2,
                    fontWeight: hl ? 700 : 400,
                    outline: hl ? `2px solid ${aInfo?.color}44` : "none",
                    transition: "all 0.15s"
                  }}
                >
                  {s.text}{" "}
                </span>
              );
            })}
          </div>

          {/* Score */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ background: "#F0FAF4", borderRadius: 12, padding: "10px 18px", fontFamily: "Nunito", fontWeight: 800, fontSize: 15, color: "#2AA168" }}>
              🎯 Terdeteksi: {hlScore}/{SAMPLE_SENTENCES.length} unsur benar
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ADIKSIMBA_LABELS.map(a => (
                <div key={a.key} style={{ background: a.bg, color: a.color, padding: "4px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700, fontFamily: "Nunito" }}>
                  {a.q}: {Object.values(highlights).filter(h => h === a.key).length > 0 ? "✅" : "○"}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ZONE 3: RUANG REDAKSI
// ════════════════════════════════════════════════════════════════════
const TOPICS = [
  { emoji: "🍎", title: "Petani Apel Sumberbrantas", cat: "Pertanian", desc: "Kisah dan inovasi petani apel lokal menghadapi musim tanam." },
  { emoji: "🥦", title: "Pertanian Sayur Organik", cat: "Pertanian", desc: "Cara petani desa budidayakan sayuran tanpa pestisida kimia." },
  { emoji: "🌿", title: "Wisata Edukasi Pertanian", cat: "Agrowisata", desc: "Paket agrowisata yang mengundang wisatawan ke kebun desa." },
  { emoji: "🏪", title: "Wirausaha / UMKM Desa", cat: "UMKM", desc: "Kisah pelaku usaha kecil dan menengah yang berkembang di Desa Sumberbrantas." },
  { emoji: "🌊", title: "Pengelolaan Air Bersih", cat: "Lingkungan", desc: "Sistem irigasi dan pengelolaan sumber air pegunungan desa." },
  { emoji: "🏫", title: "Sekolah & Pendidikan Desa", cat: "Pendidikan", desc: "Perjuangan siswa dan guru di SD Sumberbrantas meraih prestasi." },
  { emoji: "🍓", title: "Agrowisata Strawberry", cat: "Agrowisata", desc: "Petik stroberi langsung dari kebun — daya tarik wisata baru." },
  { emoji: "🐄", title: "Budidaya Hewan", cat: "Budidaya", desc: "Peternak sapi, kambing, dan unggas lokal yang menopang ketahanan pangan desa." },
];

function ZoneRedaksi() {
  const [tab, setTab] = useState<"katalog" | "lembar" | "outline">("katalog");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [outline, setOutline] = useState({ judul: "", lead: "", body: "", ekor: "" });
  const [form, setForm] = useState({ narasumber: "", jabatan: "", lokasi: "", waktu: "", catatan: "", pertanyaan: ["", "", ""] });
  const [customTopic, setCustomTopic] = useState({ emoji: "💡", title: "", cat: "", desc: "" });
  const [customSaved, setCustomSaved] = useState(false);

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <SectionHeader emoji="🗺️" title="Ruang Redaksi & Eksplorasi Desa" subtitle="C3 Menerapkan · C4 Menganalisis" color="#F5C03A" />

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { id: "katalog" as const, label: "🗂️ Katalog Ide Liputan" },
          { id: "lembar" as const, label: "📋 Lembar Kerja Reporter" },
          { id: "outline" as const, label: "🗒️ Outline Builder" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 20px", borderRadius: 30, border: "none", cursor: "pointer",
            fontFamily: "Nunito", fontWeight: 700, fontSize: 14,
            background: tab === t.id ? "#F5C03A" : "white",
            color: tab === t.id ? "#1a2e22" : "#4A7060",
            boxShadow: tab === t.id ? "0 4px 14px #F5C03A55" : "0 1px 4px rgba(0,0,0,0.08)",
            transition: "all 0.2s"
          }}>{t.label}</button>
        ))}
      </div>

      {/* Katalog Topik */}
      {tab === "katalog" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
            {TOPICS.map((t, i) => {
              const catColor = t.cat === "Pertanian" ? "#2AA168" : t.cat === "Agrowisata" ? "#3B8FD4" : t.cat === "UMKM" ? "#F07040" : t.cat === "Budidaya" ? "#EC4899" : t.cat === "Lingkungan" ? "#0EA5E9" : t.cat === "Pendidikan" ? "#7C3AED" : "#6B9E80";
              return (
                <div key={i} className="card-hover" onClick={() => setSelectedTopic(selectedTopic === i ? null : i)} style={{
                  background: selectedTopic === i ? catColor + "18" : "white",
                  borderRadius: 18, padding: "18px", border: `2px solid ${selectedTopic === i ? catColor : "#E6F5EC"}`,
                  cursor: "pointer", transition: "all 0.2s"
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{t.emoji}</div>
                  <div style={{ background: catColor + "20", color: catColor, display: "inline-block", padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700, fontFamily: "Nunito", marginBottom: 6 }}>{t.cat}</div>
                  <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 14, color: "#1a2e22", marginBottom: 6 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: "#6B9E80", lineHeight: 1.4 }}>{t.desc}</div>
                  {selectedTopic === i && (
                    <button onClick={e => { e.stopPropagation(); setTab("lembar"); }} style={{
                      marginTop: 12, width: "100%", padding: "8px", borderRadius: 10,
                      border: "none", background: catColor, color: "white",
                      fontFamily: "Nunito", fontWeight: 700, fontSize: 13, cursor: "pointer"
                    }}>📋 Pilih Topik Ini →</button>
                  )}
                </div>
              );
            })}

            {/* Optional Custom Topic Card */}
            <div style={{
              borderRadius: 18, padding: "18px",
              border: customSaved ? "2px solid #2AA168" : "2px dashed #F5C03A",
              background: customSaved ? "#D4F0E320" : "#FFFBEB",
              transition: "all 0.2s"
            }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>
                {customSaved ? (customTopic.emoji || "💡") : "✨"}
              </div>
              <div style={{ background: "#F5C03A20", color: "#A16207", display: "inline-block", padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700, fontFamily: "Nunito", marginBottom: 8 }}>
                Topik Pilihanmu
              </div>
              {!customSaved ? (
                <>
                  <div style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#854D0E", marginBottom: 10 }}>
                    💡 Buat topik liputanmu sendiri!
                  </div>
                  <input className="field-input" placeholder="Nama topik liputan..." style={{ marginBottom: 8, fontSize: 13 }}
                    value={customTopic.title}
                    onChange={e => setCustomTopic(p => ({ ...p, title: e.target.value }))} />
                  <input className="field-input" placeholder="Kategori (contoh: Budaya, Pertanian...)" style={{ marginBottom: 8, fontSize: 13 }}
                    value={customTopic.cat}
                    onChange={e => setCustomTopic(p => ({ ...p, cat: e.target.value }))} />
                  <textarea className="editor-area" rows={2} placeholder="Deskripsi singkat topikmu..." style={{ fontSize: 12, marginBottom: 10 }}
                    value={customTopic.desc}
                    onChange={e => setCustomTopic(p => ({ ...p, desc: e.target.value }))} />
                  <button onClick={() => customTopic.title && setCustomSaved(true)} style={{
                    width: "100%", padding: "8px", borderRadius: 10, border: "none",
                    background: customTopic.title ? "#F5C03A" : "#E5E7EB",
                    color: customTopic.title ? "#1a2e22" : "#9CA3AF",
                    fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                    cursor: customTopic.title ? "pointer" : "default"
                  }}>💾 Simpan Topikku</button>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 14, color: "#1a2e22", marginBottom: 4 }}>{customTopic.title}</div>
                  <div style={{ fontSize: 12, color: "#6B9E80", lineHeight: 1.4, marginBottom: 10 }}>{customTopic.desc || "Topik liputan pilihanmu!"}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setTab("lembar"); }} style={{
                      flex: 1, padding: "8px", borderRadius: 10, border: "none",
                      background: "#2AA168", color: "white", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, cursor: "pointer"
                    }}>📋 Pilih Ini →</button>
                    <button onClick={() => setCustomSaved(false)} style={{
                      padding: "8px 10px", borderRadius: 10, border: "none",
                      background: "#F0FAF4", color: "#2AA168", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, cursor: "pointer"
                    }}>✏️</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lembar Kerja */}
      {tab === "lembar" && (
        <div style={{ background: "white", borderRadius: 20, padding: "28px", boxShadow: "0 2px 12px rgba(42,161,104,0.08)" }}>
          {(selectedTopic !== null || customSaved) && (
            <div style={{ background: "#FEF9E0", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 24 }}>{selectedTopic !== null ? TOPICS[selectedTopic]?.emoji : customTopic.emoji}</span>
              <div>
                <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 15, color: "#854D0E" }}>
                  Topik Terpilih: {selectedTopic !== null ? TOPICS[selectedTopic]?.title : customTopic.title}
                </div>
                <div style={{ fontSize: 12, color: "#A16207" }}>{selectedTopic !== null ? TOPICS[selectedTopic]?.cat : customTopic.cat}</div>
              </div>
            </div>
          )}
          <h3 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 20, margin: "0 0 20px" }}>📋 Lembar Kerja Reporter</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {[
              { label: "Nama Narasumber", key: "narasumber", placeholder: "Contoh: Pak Budi Santoso", emoji: "👤" },
              { label: "Jabatan/Profesi", key: "jabatan", placeholder: "Contoh: Petani Apel, Kepala Desa", emoji: "💼" },
              { label: "Lokasi Wawancara", key: "lokasi", placeholder: "Contoh: Kebun Apel Jl. Raya Selecta", emoji: "📍" },
              { label: "Waktu Wawancara", key: "waktu", placeholder: "Contoh: Sabtu, 30 Agustus 2025, 09.00", emoji: "🕐" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#4A7060", marginBottom: 6 }}>{f.emoji} {f.label}</label>
                <input className="field-input" placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form] as string}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#4A7060", marginBottom: 6 }}>📝 Catatan Observasi</label>
            <textarea className="editor-area" rows={3} placeholder="Tuliskan apa yang kamu lihat dan amati di lapangan..."
              value={form.catatan} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#4A7060", marginBottom: 8 }}>❓ Daftar Pertanyaan Wawancara</label>
            {form.pertanyaan.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: 50, background: "#F5C03A", color: "#1a2e22", fontFamily: "Nunito", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <input className="field-input" placeholder={`Pertanyaan ke-${i+1}...`}
                  value={p} onChange={e => setForm(f => ({ ...f, pertanyaan: f.pertanyaan.map((q, j) => j === i ? e.target.value : q) }))} />
              </div>
            ))}
            <button onClick={() => setForm(f => ({ ...f, pertanyaan: [...f.pertanyaan, ""] }))} style={{
              padding: "7px 16px", borderRadius: 20, border: "2px dashed #F5C03A",
              background: "transparent", color: "#A16207", cursor: "pointer", fontFamily: "Nunito", fontWeight: 700, fontSize: 13
            }}>+ Tambah Pertanyaan</button>
          </div>
          <button style={{
            padding: "12px 28px", borderRadius: 30, border: "none", cursor: "pointer",
            background: "#2AA168", color: "white", fontFamily: "Nunito", fontWeight: 800, fontSize: 15
          }}>💾 Simpan Lembar Kerja</button>
        </div>
      )}

      {/* Outline Builder */}
      {tab === "outline" && (
        <div style={{ background: "white", borderRadius: 20, padding: "28px", boxShadow: "0 2px 12px rgba(42,161,104,0.08)" }}>
          <h3 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 20, margin: "0 0 6px" }}>🗒️ Outline Builder Berita</h3>
          <p style={{ color: "#6B9E80", fontSize: 14, marginBottom: 24 }}>Susun kerangka beritamu sebelum menulis! Isi setiap bagian struktur berita.</p>
          {[
            { key: "judul", label: "📰 HEAD / Judul Berita", placeholder: "Tulis judul berita yang menarik dan informatif...", color: "#3B8FD4", tip: "Judul harus singkat, jelas, dan menarik perhatian pembaca!", rows: 2 },
            { key: "lead", label: "🎯 LEAD / Teras Berita (ADIKSIMBA)", placeholder: "Tulis paragraf pertama yang menjawab: Apa? Siapa? Di mana? Kapan?...", color: "#2AA168", tip: "Lead adalah kalimat pertama yang paling penting — jawab minimal 4W!", rows: 3 },
            { key: "body", label: "📝 BODY / Tubuh Berita", placeholder: "Kembangkan cerita dengan detail, kutipan narasumber, dan data...", color: "#F07040", tip: "Gunakan kutipan langsung dari narasumber untuk membuat berita lebih hidup!", rows: 5 },
            { key: "ekor", label: "🔚 EKOR / Penutup Berita", placeholder: "Tulis penutup yang berisi harapan, rencana ke depan, atau kesimpulan...", color: "#7C3AED", tip: "Ekor melengkapi informasi dan menutup berita dengan manis!", rows: 2 },
          ].map(s => (
            <div key={s.key} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 14, color: s.color }}>{s.label}</label>
                <div style={{ background: s.color + "15", color: s.color, padding: "4px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600, maxWidth: 260 }}>💡 {s.tip}</div>
              </div>
              <textarea className="editor-area" rows={s.rows} placeholder={s.placeholder}
                style={{ borderColor: outline[s.key as keyof typeof outline] ? s.color + "60" : "#D4F0E3" }}
                value={outline[s.key as keyof typeof outline]}
                onChange={e => setOutline(o => ({ ...o, [s.key]: e.target.value }))} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ padding: "12px 24px", borderRadius: 30, border: "none", cursor: "pointer", background: "#2AA168", color: "white", fontFamily: "Nunito", fontWeight: 800, fontSize: 14 }}>
              💾 Simpan Outline
            </button>
            <button style={{ padding: "12px 24px", borderRadius: 30, border: "none", cursor: "pointer", background: "#F07040", color: "white", fontFamily: "Nunito", fontWeight: 800, fontSize: 14 }}>
              ✏️ Lanjut ke Studio Editor →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ZONE 4: STUDIO EDITOR
// ════════════════════════════════════════════════════════════════════
type DraftStatus = "menunggu" | "revisi" | "acc";

const DRAFTS = [
  { id: 0, group: "Kelompok Mawar", title: "Panen Raya Apel Sumberbrantas Lampaui Target 2025", status: "acc" as DraftStatus, stars: 4.5, reviews: 3 },
  { id: 1, group: "Kelompok Melati", title: "Agrowisata Hidroponik: Daya Tarik Baru Desa Sumberbrantas", status: "revisi" as DraftStatus, stars: 3, reviews: 2 },
  { id: 2, group: "Kelompok Anggrek", title: "Festival Budaya: Topeng Malangan Tampil di Pentas Desa", status: "menunggu" as DraftStatus, stars: 0, reviews: 0 },
];

function ZoneStudio({ role }: { role: Role }) {
  const [tab, setTab] = useState<"draft" | "review" | "status">("draft");
  const [draftText, setDraftText] = useState("Ratusan kilogram apel segar berhasil dipanen di Kebun Apel Pak Budi, Desa Sumberbrantas, pada Sabtu (30/8). Panen yang disebut sebagai yang terbesar dalam tiga tahun terakhir ini disambut gembira oleh para petani setempat.\n\n\"Alhamdulillah, tahun ini kami berhasil melampaui target panen. Cuaca yang bersahabat menjadi faktor utama keberhasilan ini,\" ujar Pak Budi Santoso (52), ketua kelompok tani setempat.\n\nTotal hasil panen mencapai 850 kilogram dari lahan seluas dua hektar.");
  const [stars, setStars] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Record<number, DraftStatus>>({ 0: "acc", 1: "revisi", 2: "menunggu" });

  const statusConfig: Record<DraftStatus, { label: string; color: string; bg: string; emoji: string }> = {
    menunggu: { label: "Menunggu Review", color: "#854D0E", bg: "#FEF9E0", emoji: "⏳" },
    revisi:   { label: "Perlu Revisi",    color: "#9A3412", bg: "#FEE2E2", emoji: "🔄" },
    acc:      { label: "Disetujui ✓",     color: "#166534", bg: "#D4F0E3", emoji: "✅" },
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <SectionHeader emoji="✏️" title="Studio Editor & Peer-Review" subtitle="C5 Mengevaluasi" color="#F07040" />

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { id: "draft" as const, label: "✏️ Drafting Editor" },
          { id: "review" as const, label: "⭐ Peer Review" },
          { id: "status" as const, label: "🏅 Status Draf" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 20px", borderRadius: 30, border: "none", cursor: "pointer",
            fontFamily: "Nunito", fontWeight: 700, fontSize: 14,
            background: tab === t.id ? "#F07040" : "white",
            color: tab === t.id ? "white" : "#4A7060",
            boxShadow: tab === t.id ? "0 4px 14px #F0704055" : "0 1px 4px rgba(0,0,0,0.08)",
            transition: "all 0.2s"
          }}>{t.label}</button>
        ))}
      </div>

      {/* Draft Editor */}
      {tab === "draft" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20 }}>
          <div style={{ background: "white", borderRadius: 20, padding: "28px", boxShadow: "0 2px 12px rgba(42,161,104,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 20, margin: 0 }}>✏️ Editor Naskah Berita</h3>
              <div style={{ background: "#D4F0E3", color: "#166534", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "Nunito" }}>👥 Kelompok Mawar</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#4A7060", marginBottom: 6 }}>📰 Judul Berita</label>
              <input className="field-input" defaultValue="Panen Raya Apel Sumberbrantas Lampaui Target 2025" style={{ fontSize: "1rem", fontFamily: "Nunito", fontWeight: 800 }} />
            </div>
            <label style={{ display: "block", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#4A7060", marginBottom: 6 }}>📝 Naskah Berita</label>
            <textarea className="editor-area" rows={14} value={draftText} onChange={e => setDraftText(e.target.value)} />
            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <label style={{
                padding: "10px 18px", borderRadius: 30, border: "2px dashed #3B8FD4",
                color: "#3B8FD4", cursor: "pointer", fontFamily: "Nunito", fontWeight: 700, fontSize: 13
              }}>📷 Unggah Foto Liputan<input type="file" accept="image/*" style={{ display: "none" }} /></label>
              <button style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "#F5C03A", color: "#1a2e22", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>💾 Simpan Draf</button>
              <button style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "#2AA168", color: "white", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>📤 Kirim untuk Review</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { emoji: "📊", title: "Statistik", items: [`${draftText.split(/\s+/).length} kata`, `${draftText.split(".").length - 1} kalimat`, `${draftText.split("\n\n").length} paragraf`], color: "#3B8FD4" },
              { emoji: "✅", title: "Checklist Berita", items: ["Judul menarik", "Lead menjawab 5W+1H", "Ada kutipan narasumber", "Fakta terverifikasi", "Foto dilampirkan"], color: "#2AA168" },
            ].map(card => (
              <div key={card.title} style={{ background: "white", borderRadius: 18, padding: "18px", boxShadow: "0 2px 12px rgba(42,161,104,0.08)" }}>
                <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 15, color: card.color, marginBottom: 10 }}>{card.emoji} {card.title}</div>
                {card.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13, color: "#4A7060" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 50, border: `2px solid ${card.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: card.color, flexShrink: 0 }}>✓</div>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peer Review */}
      {tab === "review" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {DRAFTS.filter(d => d.status !== "menunggu" || true).map(d => (
            <div key={d.id} style={{ background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 2px 12px rgba(42,161,104,0.08)", border: `2px solid ${statusConfig[statuses[d.id] || d.status].bg}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 17, color: "#1a2e22", marginBottom: 4 }}>{d.title}</div>
                  <div style={{ fontSize: 13, color: "#6B9E80" }}>✍️ {d.group} · {d.reviews} ulasan masuk</div>
                </div>
                <div style={{
                  background: statusConfig[statuses[d.id] || d.status].bg,
                  color: statusConfig[statuses[d.id] || d.status].color,
                  padding: "6px 14px", borderRadius: 20, fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                  ...(statuses[d.id] === "menunggu" ? { animation: "badgePulse 2s infinite" } : {})
                }}>{statusConfig[statuses[d.id] || d.status].emoji} {statusConfig[statuses[d.id] || d.status].label}</div>
              </div>
              {/* Star Rating */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#4A7060", marginBottom: 6 }}>⭐ Beri Penilaian:</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} className="star" onClick={() => setStars(p => ({ ...p, [d.id]: s }))} style={{
                      fontSize: "1.8rem", cursor: "pointer", border: "none", background: "transparent",
                      color: s <= (stars[d.id] || d.stars) ? "#F5C03A" : "#E6F5EC", padding: 0, lineHeight: 1
                    }}>★</button>
                  ))}
                  {(stars[d.id] || d.stars) > 0 && (
                    <span style={{ fontSize: 14, color: "#6B9E80", alignSelf: "center", marginLeft: 6 }}>
                      {(stars[d.id] || d.stars).toFixed(1)} / 5.0
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#4A7060", marginBottom: 6 }}>💬 Masukan Konstruktif:</label>
                <textarea className="editor-area" rows={3}
                  placeholder="Tuliskan saran yang membangun untuk kelompok ini..."
                  value={comments[d.id] || ""}
                  onChange={e => setComments(p => ({ ...p, [d.id]: e.target.value }))} />
              </div>
              <button style={{ marginTop: 12, padding: "9px 22px", borderRadius: 30, border: "none", background: "#F07040", color: "white", fontFamily: "Nunito", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                📤 Kirim Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Status Board */}
      {tab === "status" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
            {(["menunggu", "revisi", "acc"] as DraftStatus[]).map(s => (
              <div key={s} style={{ background: statusConfig[s].bg, borderRadius: 16, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{statusConfig[s].emoji}</div>
                <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 14, color: statusConfig[s].color }}>{statusConfig[s].label}</div>
                <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 28, color: statusConfig[s].color }}>
                  {Object.values(statuses).filter(v => v === s).length}
                </div>
              </div>
            ))}
          </div>
          {DRAFTS.map(d => (
            <div key={d.id} style={{ background: "white", borderRadius: 18, padding: "18px 22px", marginBottom: 12, border: `2px solid ${statusConfig[statuses[d.id]].bg}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 15, color: "#1a2e22" }}>{d.title}</div>
                <div style={{ fontSize: 13, color: "#6B9E80" }}>{d.group}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: statusConfig[statuses[d.id]].bg, color: statusConfig[statuses[d.id]].color, padding: "5px 14px", borderRadius: 20, fontFamily: "Nunito", fontWeight: 700, fontSize: 13 }}>
                  {statusConfig[statuses[d.id]].emoji} {statusConfig[statuses[d.id]].label}
                </div>
                {role === "guru" && (
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["menunggu", "revisi", "acc"] as DraftStatus[]).map(s => (
                      <button key={s} onClick={() => setStatuses(p => ({ ...p, [d.id]: s }))} style={{
                        padding: "5px 10px", borderRadius: 10, border: "none", cursor: "pointer",
                        background: statuses[d.id] === s ? statusConfig[s].color : statusConfig[s].bg,
                        color: statuses[d.id] === s ? "white" : statusConfig[s].color,
                        fontSize: 11, fontFamily: "Nunito", fontWeight: 700
                      }}>{statusConfig[s].emoji}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {role === "guru" && (
            <div style={{ background: "#DBF0FF", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <span style={{ fontSize: 20 }}>👩‍🏫</span>
              <div style={{ fontSize: 13, color: "#1E40AF", fontFamily: "Nunito", fontWeight: 600 }}>Klik tombol status (⏳/🔄/✅) untuk mengubah status draf sebagai Guru/Editor.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ZONE 5: GALERI JURNALISTIK
// ════════════════════════════════════════════════════════════════════
const ARTICLES = [
  { id: 0, emoji: "🍎", group: "Kelompok Mawar", title: "Panen Raya Apel Sumberbrantas Lampaui Target 2025", excerpt: "Ratusan kilogram apel segar dipanen di Kebun Apel Pak Budi, Desa Sumberbrantas, pada Sabtu (30/8) — panen terbesar dalam tiga tahun terakhir...", date: "30 Agustus 2025", cat: "Pertanian", img: "photo-1593519544785-fd359b7068f1", likes: 48, comments: 12 },
  { id: 1, emoji: "🌿", group: "Kelompok Melati", title: "Wisata Edukasi Hidroponik Menarik Ratusan Pengunjung", excerpt: "Kebun hidroponik organik milik Ibu Sri Wahyuni kini menjadi destinasi wisata edukasi yang diminati pelajar dan keluarga dari berbagai daerah...", date: "28 Agustus 2025", cat: "Agrowisata", img: "photo-1648518295678-f78670c35924", likes: 34, comments: 8 },
  { id: 2, emoji: "🎭", group: "Kelompok Anggrek", title: "Festival Budaya Topeng Malangan Pukau Ribuan Penonton", excerpt: "Pertunjukan Tari Topeng Malangan yang menampilkan 50 penari dari berbagai kelompok seni desa berlangsung meriah di Balai Desa Sumberbrantas...", date: "25 Agustus 2025", cat: "Budaya", img: "flagged/photo-1574097656146-0b43b7660cb6", likes: 61, comments: 19 },
];

function ZoneGaleri() {
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [showComment, setShowComment] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const catColor = (cat: string) => cat === "Pertanian" ? "#2AA168" : cat === "Agrowisata" ? "#3B8FD4" : "#7C3AED";

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      <SectionHeader emoji="🗞️" title="Galeri Jurnalistik Cilik" subtitle="C6 Mencipta · Karya Murid Kelas VI" color="#7C3AED" />

      {/* Header actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {["Semua", "Pertanian", "Agrowisata", "Budaya"].map(f => (
            <button key={f} style={{
              padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer",
              fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
              background: f === "Semua" ? "#7C3AED" : "white",
              color: f === "Semua" ? "white" : "#4A7060",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}>{f}</button>
          ))}
        </div>
        <button style={{ padding: "9px 20px", borderRadius: 30, border: "none", cursor: "pointer", background: "#7C3AED", color: "white", fontFamily: "Nunito", fontWeight: 700, fontSize: 13 }}>
          📥 Unduh E-Book PDF
        </button>
      </div>

      {/* Article Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 22 }}>
        {ARTICLES.map(a => (
          <div key={a.id} className="card-hover" style={{ background: "white", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "2px solid #E6F5EC" }}>
            {/* Article Image */}
            <div style={{ height: 180, background: "#E6F5EC", position: "relative", overflow: "hidden" }}>
              <img
                src={`https://images.unsplash.com/${a.img}?w=600&h=300&fit=crop&auto=format`}
                alt={a.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", top: 12, left: 12 }}>
                <div style={{ background: catColor(a.cat), color: "white", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "Nunito" }}>{a.cat}</div>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <div style={{ background: "#D4F0E3", color: "#166534", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: "Nunito" }}>✅ ACC</div>
              </div>
            </div>

            <div style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 11, color: "#6B9E80", marginBottom: 6 }}>✍️ {a.group} · 📅 {a.date}</div>
              <h3 style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 16, color: "#1a2e22", margin: "0 0 8px", lineHeight: 1.3 }}>{a.title}</h3>
              <p style={{ fontSize: 13, color: "#6B9E80", lineHeight: 1.6, margin: "0 0 16px" }}>{a.excerpt}</p>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => setLikes(l => ({ ...l, [a.id]: !l[a.id] }))} style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                  fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                  background: likes[a.id] ? "#FEE2E2" : "#F0FAF4",
                  color: likes[a.id] ? "#EF4444" : "#4A7060",
                  transition: "all 0.18s"
                }}>
                  {likes[a.id] ? "❤️" : "🤍"} {a.likes + (likes[a.id] ? 1 : 0)}
                </button>
                <button onClick={() => setShowComment(showComment === a.id ? null : a.id)} style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                  fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                  background: "#F0F8FF", color: "#3B8FD4"
                }}>💬 {a.comments}</button>
                <button style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                  fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                  background: "linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)",
                  color: "white"
                }}>📲 Share</button>
                <button style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                  fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                  background: "#E9D5FF", color: "#6B21A8"
                }}>📄 PDF</button>
              </div>

              {/* Comment Box */}
              {showComment === a.id && (
                <div style={{ marginTop: 12, padding: "12px", background: "#F7FEFA", borderRadius: 12, border: "2px solid #E6F5EC" }}>
                  <textarea className="editor-area" rows={2} placeholder="Tulis komentar positif..." value={commentText} onChange={e => setCommentText(e.target.value)} style={{ fontSize: 13, marginBottom: 8 }} />
                  <button style={{ padding: "7px 16px", borderRadius: 20, border: "none", background: "#3B8FD4", color: "white", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>💬 Kirim</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* E-Newspaper CTA */}
      <div style={{
        marginTop: 32, borderRadius: 22, padding: "32px 36px",
        background: "linear-gradient(135deg,#5B21B6,#7C3AED,#8B5CF6)",
        color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20
      }}>
        <div>
          <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 22, marginBottom: 6 }}>📰 E-Surat Kabar Digital SI NARA</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Kumpulan seluruh karya jurnalistik murid Kelas VI SD — edisi Agustus 2025</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ padding: "12px 24px", borderRadius: 30, border: "2px solid rgba(255,255,255,0.5)", background: "white", color: "#7C3AED", fontFamily: "Nunito", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            📥 Unduh E-Book PDF
          </button>
          <button style={{ padding: "12px 24px", borderRadius: 30, border: "2px solid rgba(255,255,255,0.5)", background: "transparent", color: "white", fontFamily: "Nunito", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            📲 Share ke Instagram
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared Components ──────────────────────────────────────────────
function SectionHeader({ emoji, title, subtitle, color }: { emoji: string; title: string; subtitle: string; color: string }) {
  return (
    <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 18, background: color + "20",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0
      }}>{emoji}</div>
      <div>
        <h2 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: "clamp(18px,3vw,26px)", margin: 0, color: "#1a2e22" }}>{title}</h2>
        <div style={{ background: color + "20", color, display: "inline-block", padding: "2px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700, fontFamily: "Nunito", marginTop: 4 }}>
          🎯 Bloom's Taxonomy: {subtitle}
        </div>
      </div>
    </div>
  );
}
