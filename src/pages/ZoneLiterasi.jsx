import { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../contexts/AuthContext';
import { MATERIALS, ADIKSIMBA_LABELS } from '../data/constants';
import { getMaterials } from '../lib/db'; // tambahkan di import

import {
  getMaterialsProgress,
  toggleMaterialProgress,
  saveQuizAttempt,
  getLatestQuizAttempt,
} from '../lib/db';

const FAKTA_OPINI_CARDS = [
  { id: 0, text: 'Desa Sumberbrantas menghasilkan 200 ton apel per tahun.', answer: 'fakta' },
  { id: 1, text: 'Wisata agro di Sumberbrantas adalah yang paling indah di Jawa Timur.', answer: 'opini' },
  { id: 2, text: 'Desa Sumberbrantas berdiri pada tahun 1948.', answer: 'fakta' },
  { id: 3, text: 'Tarian Topeng Malangan lebih menarik dari tarian daerah lain.', answer: 'opini' },
  { id: 4, text: 'Di desa Sumberbrantas terdapat mata air Sungai Brantas yang merupakan sungai terpanjang kedua di Pulau Jawa setelah Bengawan Solo.', answer: 'fakta' },
  { id: 5, text: 'Sayuran organik dari desa ini pasti lebih sehat dari produk kota.', answer: 'opini' },
];

const SAMPLE_SENTENCES = [
  { id: 0, text: 'Ratusan kilogram apel segar berhasil dipanen di Desa Sumberbrantas.', answer: 'what' },
  { id: 1, text: 'Pak Budi Santoso, petani apel berusia 52 tahun, memimpin panen raya ini.', answer: 'who' },
  { id: 2, text: 'Panen berlangsung di kebun apel seluas dua hektar di Jalan Raya Selecta.', answer: 'where' },
  { id: 3, text: 'Kegiatan panen dilaksanakan pada Sabtu, 30 Agustus 2025.', answer: 'when' },
  { id: 4, text: 'Musim panen tiba lebih awal karena cuaca yang mendukung sepanjang tahun ini.', answer: 'why' },
  { id: 5, text: 'Para petani menggunakan alat panen modern untuk mempercepat proses pengumpulan hasil.', answer: 'how' },
];

export default function ZoneLiterasi({ progress, onUpdateProgress, onOpenPdf }) {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState('modul');

  // ── State: Bahan Ajar (dari Supabase) ────────────────────────────
  const [checkedMaterials, setCheckedMaterials] = useState({});
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // ── State: Kuis ───────────────────────────────────────────────────
  const [cardPlacements, setCardPlacements] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizPassedState, setQuizPassedState] = useState(false);

  // ── State: ADIKSIMBA ──────────────────────────────────────────────
  const [highlights, setHighlights] = useState({});
  const [selectedHl, setSelectedHl] = useState(null);

  // ★ State baru: materials info (untuk cek ketersediaan PDF)
  const [materialsMap, setMaterialsMap] = useState({});

  // ═══ Load data dari Supabase saat mount ═════════════════════════
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    (async () => {
      setLoadingMaterials(true);
      const [mats, quiz, matInfoList] = await Promise.all([
        getMaterialsProgress(user.id),
        getLatestQuizAttempt(user.id, 'fakta_opini'),
        getMaterials(),
      ]);

      if (!mounted) return;
      setCheckedMaterials(mats);

      // Convert list materials → map
      const map = {};
      matInfoList.forEach((m) => { map[m.material_key] = m; });
      setMaterialsMap(map);

      if (quiz?.passed) {
        setQuizPassedState(true);
        setQuizChecked(true);
      }
      setLoadingMaterials(false);
    })();

    return () => { mounted = false; };
  }, [user]);

  // ── Computed ──────────────────────────────────────────────────────
  const materialsDoneCount = Object.values(checkedMaterials).filter(Boolean).length;
  const materialsComplete = materialsDoneCount === 6;

  const quizCorrectCount = quizChecked
    ? FAKTA_OPINI_CARDS.filter((c) => cardPlacements[c.id] === c.answer).length
    : 0;

  const adiksimbaScore = Object.entries(highlights).filter(
    ([id, hl]) => hl === SAMPLE_SENTENCES[+id]?.answer
  ).length;
  const adiksimbaDone = adiksimbaScore === SAMPLE_SENTENCES.length;

  const literasiComplete = materialsComplete && quizPassedState;

  // ── Sync ke AuthContext profile ───────────────────────────────────
  const syncProgress = (newMaterialsDone, newQuizPassed, newAdiksimbaDone) => {
    onUpdateProgress?.({
      literasiDone: newMaterialsDone && newQuizPassed,
      checkedMaterials: checkedMaterials,
      quizPassed: newQuizPassed,
      adiksimbaDone: newAdiksimbaDone,
    });
  };

  // ── Handler: Checkbox Bahan Ajar (SAVE TO DB) ─────────────────────
  const toggleMaterial = async (id) => {
    const newValue = !checkedMaterials[id];

    // Optimistic update
    const updated = { ...checkedMaterials, [id]: newValue };
    setCheckedMaterials(updated);

    const allDone = Object.values(updated).filter(Boolean).length === 6;
    syncProgress(allDone, quizPassedState, adiksimbaDone);

    // Save ke DB
    await toggleMaterialProgress(user.id, id, newValue);
  };

  // ── Handler: Kuis ─────────────────────────────────────────────────
  const placeCard = (cardId, bucket) => {
    if (quizChecked && quizPassedState) return; // sudah lulus → tidak bisa edit
    setCardPlacements((p) => ({ ...p, [cardId]: p[cardId] === bucket ? null : bucket }));
  };

  const handleCheckQuiz = async () => {
    const correct = FAKTA_OPINI_CARDS.filter(
      (c) => cardPlacements[c.id] === c.answer
    ).length;
    const passed = correct === FAKTA_OPINI_CARDS.length;

    setQuizChecked(true);
    setQuizPassedState(passed);

    // Save ke DB
    await saveQuizAttempt(
      user.id,
      'fakta_opini',
      correct,
      FAKTA_OPINI_CARDS.length,
      passed,
      cardPlacements
    );

    syncProgress(materialsComplete, passed, adiksimbaDone);
  };

  const handleRetryQuiz = () => {
    setCardPlacements({});
    setQuizChecked(false);
    setQuizPassedState(false);
    syncProgress(materialsComplete, false, adiksimbaDone);
  };

  // ── Handler: ADIKSIMBA ────────────────────────────────────────────
  const markSentence = (id) => {
    if (!selectedHl) return;
    const updated = { ...highlights, [id]: highlights[id] === selectedHl ? null : selectedHl };
    setHighlights(updated);

    const score = Object.entries(updated).filter(
      ([sid, hl]) => hl === SAMPLE_SENTENCES[+sid]?.answer
    ).length;

    if (score === SAMPLE_SENTENCES.length) {
      syncProgress(materialsComplete, quizPassedState, true);
    }
  };

  const TABS = [
    { id: 'modul',     label: `📖 E-Modul (${materialsDoneCount}/6)`, color: '#3B8FD4' },
    { id: 'kuis',      label: '🎮 Kuis Fakta vs Opini',                color: '#2AA168' },
    { id: 'adiksimba', label: '🔍 Detektif ADIKSIMBA',                 color: '#F07040' },
  ];

  if (loadingMaterials) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
        <div style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#2AA168' }}>
          Memuat Pojok Literasi...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <SectionHeader
        emoji="📚"
        title="Pojok Literasi Interaktif"
        subtitle="C2 Memahami · C3 Menerapkan"
        color="#3B8FD4"
      />

      {/* Progress + Locking Banner */}
      <div
        style={{
          background: literasiComplete
            ? 'linear-gradient(135deg,#2AA168,#3B8FD4)'
            : '#FFFBEB',
          borderRadius: 16,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
          color: literasiComplete ? 'white' : '#854D0E',
          border: literasiComplete ? 'none' : '2px solid #F5C03A',
        }}
      >
        <div style={{ fontSize: 32 }}>{literasiComplete ? '🎉' : '🔒'}</div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 15, marginBottom: 2 }}>
            {literasiComplete
              ? 'Selamat! Pojok Literasi TUNTAS!'
              : 'Ruang Redaksi Terkunci'}
          </div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>
            {literasiComplete
              ? 'Kamu sudah bisa masuk ke Ruang Redaksi untuk mulai meliput!'
              : 'Selesaikan 6 Bahan Ajar + Kuis 100% untuk membuka Ruang Redaksi.'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div
            style={{
              background: literasiComplete ? 'rgba(255,255,255,0.25)' : '#FEF9E0',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'Nunito',
            }}
          >
            📖 Bahan Ajar: {materialsDoneCount}/6
          </div>
          <div
            style={{
              background: literasiComplete ? 'rgba(255,255,255,0.25)' : '#FEF9E0',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'Nunito',
            }}
          >
            🎮 Kuis: {quizPassedState ? 'LULUS ✓' : quizChecked ? `${quizCorrectCount}/6` : 'Belum'}
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 20px',
              borderRadius: 30,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Nunito',
              fontWeight: 700,
              fontSize: 14,
              background: tab === t.id ? t.color : 'white',
              color: tab === t.id ? 'white' : '#4A7060',
              boxShadow: tab === t.id ? `0 4px 14px ${t.color}44` : '0 1px 4px rgba(0,0,0,0.08)',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: E-MODUL ═══ */}
      {tab === 'modul' && (
        <div>
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: '14px 18px',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '2px solid #E6F5EC',
            }}
          >
            <span style={{ fontSize: 24 }}>💡</span>
            <div style={{ fontSize: 13, color: '#4A7060', lineHeight: 1.5 }}>
              <strong>Petunjuk:</strong> Baca setiap materi, lalu <strong>centang kotak</strong> jika kamu sudah paham. Progress otomatis tersimpan!
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {MATERIALS.map((m) => {
              const isChecked = !!checkedMaterials[m.id];
              return (
                <div
                  key={m.id}
                  className="card-hover"
                  style={{
                    background: isChecked ? m.color + '10' : 'white',
                    borderRadius: 18,
                    padding: 20,
                    border: `2px solid ${isChecked ? m.color : m.color + '20'}`,
                    position: 'relative',
                    transition: 'all 0.2s',
                  }}
                >
                  <button
                    onClick={() => toggleMaterial(m.id)}
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      border: `2px solid ${isChecked ? m.color : '#D4F0E3'}`,
                      background: isChecked ? m.color : 'white',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.18s',
                      padding: 0,
                    }}
                  >
                    {isChecked ? '✓' : ''}
                  </button>

                  <div style={{ fontSize: 36, marginBottom: 12 }}>{m.emoji}</div>
                  <div
                    style={{
                      fontFamily: 'Nunito',
                      fontWeight: 800,
                      fontSize: 15,
                      color: '#1a2e22',
                      marginBottom: 6,
                      paddingRight: 40,
                    }}
                  >
                    {m.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B9E80', lineHeight: 1.5, marginBottom: 14 }}>
                    {m.desc}
                  </div>
                  {(() => {
                    const pdfAvailable = !!materialsMap[m.id]?.pdf_url;
                    return (
                      <button
                        onClick={() => pdfAvailable && onOpenPdf?.(m.id)}
                        disabled={!pdfAvailable}
                        title={pdfAvailable ? 'Buka modul PDF' : 'Guru belum mengunggah modul ini'}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 20,
                          border: 'none',
                          background: pdfAvailable ? m.color + '18' : '#F3F4F6',
                          color: pdfAvailable ? m.color : '#9CA3AF',
                          cursor: pdfAvailable ? 'pointer' : 'not-allowed',
                          fontFamily: 'Nunito',
                          fontWeight: 700,
                          fontSize: 13,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        {pdfAvailable ? '📖 Buka Modul →' : '🔒 Belum tersedia'}
                      </button>
                    );
                  })()}
                </div>
              );
            })}
          </div>

          {materialsComplete && !quizPassedState && (
            <div
              style={{
                marginTop: 20,
                background: 'linear-gradient(135deg,#2AA168,#3B8FD4)',
                borderRadius: 16,
                padding: '20px 24px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 16, marginBottom: 4 }}>
                  🎉 Hebat! 6 Bahan Ajar sudah selesai!
                </div>
                <div style={{ fontSize: 13, opacity: 0.9 }}>
                  Lanjut ke Kuis Fakta vs Opini — kamu harus dapat 100% untuk lulus!
                </div>
              </div>
              <button
                onClick={() => setTab('kuis')}
                style={{
                  padding: '12px 24px',
                  borderRadius: 30,
                  border: '2px solid white',
                  background: 'white',
                  color: '#2AA168',
                  fontFamily: 'Nunito',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                🎮 Mulai Kuis →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB 2: KUIS ═══ */}
      {tab === 'kuis' && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 20, margin: 0 }}>
              🎮 Pisahkan Fakta & Opini!
            </h3>
            {quizChecked && (
              <div
                style={{
                  background: quizPassedState ? '#D4F0E3' : '#FEE2E2',
                  color: quizPassedState ? '#166534' : '#9A3412',
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontFamily: 'Nunito',
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                {quizPassedState ? '🎉 LULUS!' : `💪 Skor: ${quizCorrectCount}/${FAKTA_OPINI_CARDS.length}`}
              </div>
            )}
          </div>
          <p style={{ color: '#6B9E80', fontSize: 14, marginBottom: 20 }}>
            Klik tombol <strong>FAKTA</strong> atau <strong>OPINI</strong> pada setiap kalimat. Kamu harus benar <strong>semua (6/6)</strong> untuk lulus!
          </p>

          {!materialsComplete && (
            <div
              style={{
                background: '#FEF9E0',
                border: '2px solid #F5C03A',
                borderRadius: 14,
                padding: '12px 16px',
                marginBottom: 20,
                fontSize: 13,
                color: '#854D0E',
                fontFamily: 'Nunito',
                fontWeight: 700,
              }}
            >
              ⚠️ Selesaikan dulu 6 Bahan Ajar sebelum kuis ini bisa dianggap lulus. (Bahan Ajar: {materialsDoneCount}/6)
            </div>
          )}

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 260px', minWidth: 260 }}>
              {FAKTA_OPINI_CARDS.map((c) => {
                const placed = cardPlacements[c.id];
                const correct = quizChecked ? placed === c.answer : null;
                const disabled = quizChecked && quizPassedState;
                return (
                  <div
                    key={c.id}
                    style={{
                      border: `2px solid ${
                        correct === true ? '#2AA168' : correct === false ? '#EF4444' : '#E6F5EC'
                      }`,
                      borderRadius: 14,
                      padding: '14px 16px',
                      marginBottom: 12,
                      background:
                        correct === true ? '#D4F0E3' : correct === false ? '#FEE2E2' : 'white',
                      transition: 'all 0.2s',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 10px',
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        color: '#1a2e22',
                        lineHeight: 1.5,
                      }}
                    >
                      "{c.text}"
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => placeCard(c.id, 'fakta')}
                        disabled={disabled}
                        style={{
                          flex: 1,
                          padding: 7,
                          borderRadius: 10,
                          border: 'none',
                          cursor: disabled ? 'default' : 'pointer',
                          fontFamily: 'Nunito',
                          fontWeight: 700,
                          fontSize: 13,
                          background: placed === 'fakta' ? '#2AA168' : '#F0FAF4',
                          color: placed === 'fakta' ? 'white' : '#2AA168',
                          transition: 'all 0.18s',
                        }}
                      >
                        ✅ FAKTA
                      </button>
                      <button
                        onClick={() => placeCard(c.id, 'opini')}
                        disabled={disabled}
                        style={{
                          flex: 1,
                          padding: 7,
                          borderRadius: 10,
                          border: 'none',
                          cursor: disabled ? 'default' : 'pointer',
                          fontFamily: 'Nunito',
                          fontWeight: 700,
                          fontSize: 13,
                          background: placed === 'opini' ? '#F07040' : '#FFF5F0',
                          color: placed === 'opini' ? 'white' : '#F07040',
                          transition: 'all 0.18s',
                        }}
                      >
                        💭 OPINI
                      </button>
                    </div>
                    {quizChecked && (
                      <div
                        style={{
                          fontSize: 12,
                          marginTop: 6,
                          color: correct ? '#2AA168' : '#EF4444',
                          fontWeight: 700,
                        }}
                      >
                        {correct ? '✅ Benar!' : `❌ Jawaban: ${c.answer.toUpperCase()}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ flex: '0 0 200px' }}>
              <div
                style={{
                  background: '#F0FAF4',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 14,
                    color: '#2AA168',
                    marginBottom: 8,
                  }}
                >
                  ✅ Kalimat Fakta
                </div>
                <div style={{ fontSize: 13, color: '#6B9E80', lineHeight: 1.5 }}>
                  Dapat dibuktikan kebenarannya secara objektif.
                </div>
              </div>
              <div
                style={{
                  background: '#FFF5F0',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 14,
                    color: '#F07040',
                    marginBottom: 8,
                  }}
                >
                  💭 Kalimat Opini
                </div>
                <div style={{ fontSize: 13, color: '#6B9E80', lineHeight: 1.5 }}>
                  Berisi pendapat atau penilaian seseorang.
                </div>
              </div>

              {!quizPassedState ? (
                <>
                  {!quizChecked ? (
                    <button
                      onClick={handleCheckQuiz}
                      disabled={Object.keys(cardPlacements).length < 6}
                      style={{
                        width: '100%',
                        padding: 12,
                        borderRadius: 14,
                        border: 'none',
                        background:
                          Object.keys(cardPlacements).length < 6 ? '#E5E7EB' : '#2AA168',
                        color:
                          Object.keys(cardPlacements).length < 6 ? '#9CA3AF' : 'white',
                        fontFamily: 'Nunito',
                        fontWeight: 800,
                        fontSize: 15,
                        cursor:
                          Object.keys(cardPlacements).length < 6
                            ? 'not-allowed'
                            : 'pointer',
                      }}
                    >
                      🔍 Cek Jawaban!
                    </button>
                  ) : (
                    <button
                      onClick={handleRetryQuiz}
                      style={{
                        width: '100%',
                        padding: 12,
                        borderRadius: 14,
                        border: 'none',
                        background: '#E6F5EC',
                        color: '#2AA168',
                        fontFamily: 'Nunito',
                        fontWeight: 800,
                        fontSize: 15,
                        cursor: 'pointer',
                      }}
                    >
                      🔄 Ulangi Kuis
                    </button>
                  )}
                </>
              ) : (
                <div
                  style={{
                    padding: '12px',
                    background: 'linear-gradient(135deg,#2AA168,#3B8FD4)',
                    borderRadius: 12,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  🎉 Kuis LULUS!
                  <div style={{ fontSize: 11, opacity: 0.9, marginTop: 4, fontWeight: 600 }}>
                    Lanjut ke Detektif ADIKSIMBA
                  </div>
                  <button
                    onClick={() => setTab('adiksimba')}
                    style={{
                      marginTop: 8,
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: 'none',
                      background: 'white',
                      color: '#2AA168',
                      fontFamily: 'Nunito',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    🔍 Lanjut →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: ADIKSIMBA ═══ */}
      {tab === 'adiksimba' && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
          }}
        >
          <h3 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 20, margin: '0 0 6px' }}>
            🔍 Detektif ADIKSIMBA
          </h3>
          <p style={{ color: '#6B9E80', fontSize: 14, marginBottom: 20 }}>
            Pilih kategori warna di bawah, lalu <strong>klik kalimat</strong> pada teks berita untuk menyorotnya!
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {ADIKSIMBA_LABELS.map((a) => (
              <button
                key={a.key}
                onClick={() => setSelectedHl(selectedHl === a.key ? null : a.key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 30,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                  fontWeight: 700,
                  fontSize: 13,
                  background: selectedHl === a.key ? a.color : a.bg,
                  color: selectedHl === a.key ? 'white' : a.color,
                  boxShadow: selectedHl === a.key ? `0 4px 12px ${a.color}55` : 'none',
                  transition: 'all 0.18s',
                  transform: selectedHl === a.key ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {a.q} →
              </button>
            ))}
            <button
              onClick={() => {
                setHighlights({});
                setSelectedHl(null);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: 30,
                border: '2px solid #E6F5EC',
                background: 'white',
                color: '#6B9E80',
                cursor: 'pointer',
                fontFamily: 'Nunito',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              🗑️ Reset
            </button>
          </div>

          {selectedHl && (
            <div
              style={{
                background: ADIKSIMBA_LABELS.find((a) => a.key === selectedHl).bg,
                borderRadius: 12,
                padding: '10px 16px',
                marginBottom: 16,
                fontFamily: 'Nunito',
                fontWeight: 700,
                fontSize: 14,
                color: ADIKSIMBA_LABELS.find((a) => a.key === selectedHl).color,
              }}
            >
              🖊️ Aktif: {ADIKSIMBA_LABELS.find((a) => a.key === selectedHl).label} — klik kalimat untuk menyorot!
            </div>
          )}

          <div style={{ border: '2px solid #E6F5EC', borderRadius: 16, padding: 20 }}>
            <div
              style={{
                fontFamily: 'Nunito',
                fontWeight: 800,
                fontSize: 16,
                color: '#1a2e22',
                marginBottom: 4,
              }}
            >
              Panen Raya Apel di Sumberbrantas
            </div>
            <div style={{ fontSize: 12, color: '#6B9E80', marginBottom: 16 }}>
              📰 Berita Liputan Murid · Kelas VI SD
            </div>
            {SAMPLE_SENTENCES.map((s) => {
              const hl = highlights[s.id];
              const aInfo = hl ? ADIKSIMBA_LABELS.find((a) => a.key === hl) : null;
              return (
                <span
                  key={s.id}
                  onClick={() => markSentence(s.id)}
                  style={{
                    display: 'inline',
                    cursor: selectedHl ? 'pointer' : 'default',
                    background: aInfo ? aInfo.bg : 'transparent',
                    color: aInfo ? aInfo.color : '#1a2e22',
                    borderRadius: 4,
                    padding: hl ? '0 3px' : '0',
                    fontSize: 15,
                    lineHeight: 2,
                    fontWeight: hl ? 700 : 400,
                    outline: hl ? `2px solid ${aInfo?.color}44` : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {s.text}{' '}
                </span>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                background: adiksimbaDone ? '#D4F0E3' : '#F0FAF4',
                borderRadius: 12,
                padding: '10px 18px',
                fontFamily: 'Nunito',
                fontWeight: 800,
                fontSize: 15,
                color: adiksimbaDone ? '#166534' : '#2AA168',
              }}
            >
              🎯 Terdeteksi: {adiksimbaScore}/{SAMPLE_SENTENCES.length} unsur benar
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ADIKSIMBA_LABELS.map((a) => {
                const count = Object.values(highlights).filter((h) => h === a.key).length;
                const found = count > 0;
                return (
                  <div
                    key={a.key}
                    style={{
                      background: a.bg,
                      color: a.color,
                      padding: '4px 10px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'Nunito',
                      opacity: found ? 1 : 0.5,
                    }}
                  >
                    {a.q}: {found ? '✅' : '○'}
                  </div>
                );
              })}
            </div>
          </div>

          {adiksimbaDone && literasiComplete && (
            <div
              style={{
                marginTop: 20,
                background: 'linear-gradient(135deg,#2AA168,#3B8FD4)',
                borderRadius: 16,
                padding: '20px 24px',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>🎉</div>
              <div
                style={{
                  fontFamily: 'Nunito',
                  fontWeight: 900,
                  fontSize: 18,
                  marginBottom: 4,
                }}
              >
                Pojok Literasi TUNTAS!
              </div>
              <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 12 }}>
                Semua syarat terpenuhi. Ruang Redaksi sekarang TERBUKA 🔓
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}