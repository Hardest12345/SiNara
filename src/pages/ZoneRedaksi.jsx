import { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import ModalNotification from '../components/ModalNotification';
import { useAuth } from '../contexts/AuthContext';
import { TOPICS, CATEGORY_COLORS, ADIKSIMBA_LABELS } from '../data/constants';
import { getActiveDraft, saveActiveDraft } from '../lib/draftStore';

const INITIAL_QUESTIONS = {
  what: [''],
  who: [''],
  where: [''],
  when: [''],
  why: [''],
  how: [''],
};

export default function ZoneRedaksi({ setZone }) {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState('katalog');

  // ── Modal Notifikasi ──────────────────────────────────────────────
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: null,
    onConfirm: null,
  });

  const showModal = ({ title, message, type = 'info', confirmText = 'OK', cancelText = null, onConfirm = null }) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
    });
  };

  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  // ── Katalog ───────────────────────────────────────────────────────
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState({
    emoji: '💡',
    title: '',
    cat: '',
    desc: '',
  });
  const [customSaved, setCustomSaved] = useState(false);

  // ── Lembar Kerja ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    narasumber: '',
    jabatan: '',
    lokasi: '',
    waktu: '',
    catatan: '',
  });
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);

  // ── Outline ───────────────────────────────────────────────────────
  const [outline, setOutline] = useState({
    head: '',
    lead: '',
    body: '',
    ekor: '',
  });

  // ── Meta ──────────────────────────────────────────────────────────
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(true);

  // ═══ Load draft aktif dari Supabase saat mount ═════════════════
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    (async () => {
      setLoadingDraft(true);
      const draft = await getActiveDraft(user.id);
      if (!mounted) return;

      if (draft) {
        setActiveDraftId(draft.id);

        // Restore topik
        if (draft.category && draft.category !== 'Lainnya') {
          const idx = TOPICS.findIndex((t) => t.title === draft.title);
          if (idx >= 0) setSelectedTopic(idx);
        } else if (draft.title) {
          setCustomTopic({
            emoji: '💡',
            title: draft.title,
            cat: draft.category || '',
            desc: '',
          });
          setCustomSaved(true);
        }

        // Restore lembar kerja
        const iv = draft.interviews_data || {};
        if (iv.form) setForm(iv.form);
        if (iv.questions) setQuestions({ ...INITIAL_QUESTIONS, ...iv.questions });

        // Restore outline
        const ol = draft.outline_data || {};
        setOutline({
          head: ol.head || '',
          lead: ol.lead || '',
          body: ol.body || '',
          ekor: ol.ekor || '',
        });

        setLastSaved(draft.updated_at);
      }
      setLoadingDraft(false);
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  // ── Handlers: Katalog ─────────────────────────────────────────────
  const handleSelectTopic = (idx) => {
    setSelectedTopic(selectedTopic === idx ? null : idx);
    setCustomSaved(false);
  };

  const handleSaveCustom = () => {
    if (customTopic.title) {
      setCustomSaved(true);
      setSelectedTopic(null);
    }
  };

  const activeTopic =
    selectedTopic !== null
      ? TOPICS[selectedTopic]
      : customSaved
      ? customTopic
      : null;

  // ── Handlers: ADIKSIMBA ───────────────────────────────────────────
  const addQuestion = (key) => {
    setQuestions((q) => ({ ...q, [key]: [...q[key], ''] }));
  };

  const updateQuestion = (key, idx, value) => {
    setQuestions((q) => ({
      ...q,
      [key]: q[key].map((item, i) => (i === idx ? value : item)),
    }));
  };

  const removeQuestion = (key, idx) => {
    setQuestions((q) => ({
      ...q,
      [key]: q[key].length === 1 ? [''] : q[key].filter((_, i) => i !== idx),
    }));
  };

  // ═══ Save Lembar Kerja ke Supabase ════════════════════════════════
  const handleSaveLembar = async () => {
    if (!user) return;
    if (!activeTopic) {
      showModal({
        title: 'Pilih Topik Dulu',
        message: 'Silakan pilih topik liputan terlebih dahulu di tab Katalog Ide!',
        type: 'warning',
        confirmText: 'Ke Katalog Ide',
        onConfirm: () => setTab('katalog'),
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: activeTopic.title,
        category: activeTopic.cat || 'Lainnya',
        group_name: profile?.full_name || 'Siswa',
        interviews_data: { form, questions },
      };

      const draft = await saveActiveDraft(user.id, payload);
      setActiveDraftId(draft.id);
      setLastSaved(draft.updated_at);

      showModal({
        title: 'Lembar Kerja Tersimpan! ✅',
        message: 'Data wawancara & pertanyaan ADIKSIMBA berhasil disimpan. Kamu bisa melanjutkan ke Outline Builder!',
        type: 'success',
        confirmText: 'Lanjut ke Outline →',
        cancelText: 'Tetap di Sini',
        onConfirm: () => setTab('outline'),
      });
    } catch (err) {
      console.error(err);
      showModal({
        title: 'Gagal Menyimpan',
        message: err.message || 'Terjadi kesalahan saat menyimpan lembar kerja.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // ═══ Save Outline ke Supabase ═════════════════════════════════════
  const handleSaveOutline = async (goToStudio = false) => {
    if (!user) return;
    if (!activeTopic) {
      showModal({
        title: 'Pilih Topik Dulu',
        message: 'Silakan pilih topik liputan terlebih dahulu di tab Katalog Ide!',
        type: 'warning',
        confirmText: 'Ke Katalog Ide',
        onConfirm: () => setTab('katalog'),
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: outline.head || activeTopic.title,
        category: activeTopic.cat || 'Lainnya',
        group_name: profile?.full_name || 'Siswa',
        interviews_data: { form, questions },
        outline_data: outline,
        // Auto-isi content gabungan untuk preview di Studio
        content: [outline.lead, outline.body, outline.ekor]
          .filter(Boolean)
          .join('\n\n'),
      };

      const draft = await saveActiveDraft(user.id, payload);
      setActiveDraftId(draft.id);
      setLastSaved(draft.updated_at);

      if (goToStudio) {
        showModal({
          title: 'Berhasil Disimpan! 🎉',
          message: 'Outline tersimpan. Kamu akan langsung berpindah ke Studio Editor untuk menyusun naskah utuh.',
          type: 'success',
          confirmText: 'Buka Studio Editor ✏️',
          onConfirm: () => {
            if (setZone) setZone('studio');
          },
        });
      } else {
        showModal({
          title: 'Outline Tersimpan! ✅',
          message: 'Outline kerangka beritamu berhasil disimpan.',
          type: 'success',
          confirmText: 'Ke Studio Editor ✏️',
          cancelText: 'Tetap di Sini',
          onConfirm: () => {
            if (setZone) setZone('studio');
          },
        });
      }
    } catch (err) {
      console.error(err);
      showModal({
        title: 'Gagal Menyimpan',
        message: err.message || 'Terjadi kesalahan saat menyimpan outline.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loadingDraft) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
        <div style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#F5C03A' }}>
          Memuat Ruang Redaksi...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <SectionHeader
        emoji="🗺️"
        title="Ruang Redaksi & Eksplorasi Desa"
        subtitle="C3 Menerapkan · C4 Menganalisis"
        color="#F5C03A"
      />

      {/* Info draft aktif */}
      {activeDraftId && (
        <div
          style={{
            background: '#D4F0E3',
            borderRadius: 12,
            padding: '10px 16px',
            marginBottom: 16,
            fontSize: 12,
            color: '#166534',
            fontFamily: 'Nunito',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>📝</span>
          Draf aktif: <strong>{activeTopic?.title || 'Tanpa judul'}</strong>
          {lastSaved && (
            <span style={{ marginLeft: 'auto', fontWeight: 600, opacity: 0.8 }}>
              Terakhir disimpan: {new Date(lastSaved).toLocaleString('id-ID')}
            </span>
          )}
        </div>
      )}

      {/* Tab Nav */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { id: 'katalog', label: '🗂️ Katalog Ide Liputan' },
          { id: 'lembar',  label: '📋 Lembar Kerja Reporter' },
          { id: 'outline', label: '🗒️ Outline Builder' },
        ].map((t) => (
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
              background: tab === t.id ? '#F5C03A' : 'white',
              color: tab === t.id ? '#1a2e22' : '#4A7060',
              boxShadow: tab === t.id ? '0 4px 14px #F5C03A55' : '0 1px 4px rgba(0,0,0,0.08)',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: KATALOG ═══ */}
      {tab === 'katalog' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {TOPICS.map((t, i) => {
            const catColor = CATEGORY_COLORS[t.cat] || '#6B9E80';
            const isSelected = selectedTopic === i;
            return (
              <div
                key={i}
                className="card-hover"
                onClick={() => handleSelectTopic(i)}
                style={{
                  background: isSelected ? catColor + '18' : 'white',
                  borderRadius: 18,
                  padding: 18,
                  border: `2px solid ${isSelected ? catColor : '#E6F5EC'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>{t.emoji}</div>
                <div
                  style={{
                    background: catColor + '20',
                    color: catColor,
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'Nunito',
                    marginBottom: 6,
                  }}
                >
                  {t.cat}
                </div>
                <div
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 14,
                    color: '#1a2e22',
                    marginBottom: 6,
                  }}
                >
                  {t.title}
                </div>
                <div style={{ fontSize: 12, color: '#6B9E80', lineHeight: 1.4 }}>
                  {t.desc}
                </div>
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTab('lembar');
                    }}
                    style={{
                      marginTop: 12,
                      width: '100%',
                      padding: 8,
                      borderRadius: 10,
                      border: 'none',
                      background: catColor,
                      color: 'white',
                      fontFamily: 'Nunito',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    📋 Pilih Topik Ini →
                  </button>
                )}
              </div>
            );
          })}

          {/* Custom Topic */}
          <div
            style={{
              borderRadius: 18,
              padding: 18,
              border: customSaved ? '2px solid #2AA168' : '2px dashed #F5C03A',
              background: customSaved ? '#D4F0E320' : '#FFFBEB',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>
              {customSaved ? customTopic.emoji || '💡' : '✨'}
            </div>
            <div
              style={{
                background: '#F5C03A20',
                color: '#A16207',
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'Nunito',
                marginBottom: 8,
              }}
            >
              Topik Pilihanmu
            </div>

            {!customSaved ? (
              <>
                <div
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#854D0E',
                    marginBottom: 10,
                  }}
                >
                  💡 Buat topik liputanmu sendiri!
                </div>
                <input
                  className="field-input"
                  placeholder="Nama topik liputan..."
                  style={{ marginBottom: 8, fontSize: 13 }}
                  value={customTopic.title}
                  onChange={(e) =>
                    setCustomTopic((p) => ({ ...p, title: e.target.value }))
                  }
                />
                <input
                  className="field-input"
                  placeholder="Kategori (contoh: Budaya, Pertanian...)"
                  style={{ marginBottom: 8, fontSize: 13 }}
                  value={customTopic.cat}
                  onChange={(e) =>
                    setCustomTopic((p) => ({ ...p, cat: e.target.value }))
                  }
                />
                <textarea
                  className="editor-area"
                  rows={2}
                  placeholder="Deskripsi singkat topikmu..."
                  style={{ fontSize: 12, marginBottom: 10 }}
                  value={customTopic.desc}
                  onChange={(e) =>
                    setCustomTopic((p) => ({ ...p, desc: e.target.value }))
                  }
                />
                <button
                  onClick={handleSaveCustom}
                  disabled={!customTopic.title}
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 10,
                    border: 'none',
                    background: customTopic.title ? '#F5C03A' : '#E5E7EB',
                    color: customTopic.title ? '#1a2e22' : '#9CA3AF',
                    fontFamily: 'Nunito',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: customTopic.title ? 'pointer' : 'default',
                  }}
                >
                  💾 Simpan Topikku
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 14,
                    color: '#1a2e22',
                    marginBottom: 4,
                  }}
                >
                  {customTopic.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#6B9E80',
                    lineHeight: 1.4,
                    marginBottom: 10,
                  }}
                >
                  {customTopic.desc || 'Topik liputan pilihanmu!'}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setTab('lembar')}
                    style={{
                      flex: 1,
                      padding: 8,
                      borderRadius: 10,
                      border: 'none',
                      background: '#2AA168',
                      color: 'white',
                      fontFamily: 'Nunito',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    📋 Pilih Ini →
                  </button>
                  <button
                    onClick={() => setCustomSaved(false)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: 'none',
                      background: '#F0FAF4',
                      color: '#2AA168',
                      fontFamily: 'Nunito',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    ✏️
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ TAB 2: LEMBAR KERJA ═══ */}
      {tab === 'lembar' && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
          }}
        >
          {activeTopic && (
            <div
              style={{
                background: '#FEF9E0',
                borderRadius: 14,
                padding: '12px 16px',
                marginBottom: 20,
                display: 'flex',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 24 }}>{activeTopic.emoji}</span>
              <div>
                <div
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 15,
                    color: '#854D0E',
                  }}
                >
                  Topik Terpilih: {activeTopic.title}
                </div>
                <div style={{ fontSize: 12, color: '#A16207' }}>
                  {activeTopic.cat || 'Tanpa kategori'}
                </div>
              </div>
            </div>
          )}

          <h3
            style={{
              fontFamily: 'Nunito',
              fontWeight: 900,
              fontSize: 20,
              margin: '0 0 20px',
            }}
          >
            📋 Lembar Kerja Reporter
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
              marginBottom: 20,
            }}
          >
            {[
              { label: 'Nama Narasumber', key: 'narasumber', placeholder: 'Contoh: Pak Budi Santoso', emoji: '👤' },
              { label: 'Jabatan/Profesi', key: 'jabatan',    placeholder: 'Contoh: Petani Apel',      emoji: '💼' },
              { label: 'Lokasi Wawancara', key: 'lokasi',    placeholder: 'Contoh: Kebun Apel Jl. Raya Selecta', emoji: '📍' },
              { label: 'Waktu Wawancara',  key: 'waktu',     placeholder: 'Contoh: Sabtu, 30 Agustus 2025', emoji: '🕐' },
            ].map((f) => (
              <div key={f.key}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Nunito',
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#4A7060',
                    marginBottom: 6,
                  }}
                >
                  {f.emoji} {f.label}
                </label>
                <input
                  className="field-input"
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Nunito',
                fontWeight: 700,
                fontSize: 13,
                color: '#4A7060',
                marginBottom: 6,
              }}
            >
              📝 Catatan Observasi
            </label>
            <textarea
              className="editor-area"
              rows={3}
              placeholder="Tuliskan apa yang kamu lihat dan amati di lapangan..."
              value={form.catatan}
              onChange={(e) => setForm((p) => ({ ...p, catatan: e.target.value }))}
            />
          </div>

          {/* ADIKSIMBA */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <label
                style={{
                  fontFamily: 'Nunito',
                  fontWeight: 800,
                  fontSize: 15,
                  color: '#1a2e22',
                }}
              >
                ❓ Daftar Pertanyaan ADIKSIMBA (5W+1H)
              </label>
              <div
                style={{
                  background: '#FEF9E0',
                  color: '#854D0E',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'Nunito',
                }}
              >
                💡 Bisa tambah lebih dari 1 pertanyaan per poin!
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ADIKSIMBA_LABELS.map((a) => (
                <div
                  key={a.key}
                  style={{
                    border: `2px solid ${a.color}25`,
                    borderRadius: 14,
                    padding: 14,
                    background: a.bg + '40',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      flexWrap: 'wrap',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        background: a.color,
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 800,
                        fontFamily: 'Nunito',
                      }}
                    >
                      {a.label}
                    </div>
                    <button
                      onClick={() => addQuestion(a.key)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 20,
                        border: `2px dashed ${a.color}`,
                        background: 'white',
                        color: a.color,
                        cursor: 'pointer',
                        fontFamily: 'Nunito',
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      + Tambah Pertanyaan
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {questions[a.key].map((q, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 50,
                            background: a.color,
                            color: 'white',
                            fontFamily: 'Nunito',
                            fontWeight: 800,
                            fontSize: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <input
                          className="field-input"
                          placeholder={`Pertanyaan ${a.q.toLowerCase()} ke-${idx + 1}...`}
                          value={q}
                          onChange={(e) => updateQuestion(a.key, idx, e.target.value)}
                        />
                        {questions[a.key].length > 1 && (
                          <button
                            onClick={() => removeQuestion(a.key, idx)}
                            title="Hapus pertanyaan ini"
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              border: 'none',
                              background: '#FEE2E2',
                              color: '#EF4444',
                              cursor: 'pointer',
                              fontSize: 14,
                              flexShrink: 0,
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={handleSaveLembar}
              disabled={saving}
              style={{
                padding: '12px 28px',
                borderRadius: 30,
                border: 'none',
                cursor: saving ? 'wait' : 'pointer',
                background: saving ? '#B0C4B8' : '#2AA168',
                color: 'white',
                fontFamily: 'Nunito',
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Lembar Kerja'}
            </button>
            <button
              onClick={() => setTab('outline')}
              style={{
                padding: '12px 28px',
                borderRadius: 30,
                border: '2px solid #F07040',
                cursor: 'pointer',
                background: 'white',
                color: '#F07040',
                fontFamily: 'Nunito',
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              ✏️ Lanjut ke Outline →
            </button>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: OUTLINE ═══ */}
      {tab === 'outline' && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
          }}
        >
          <h3
            style={{
              fontFamily: 'Nunito',
              fontWeight: 900,
              fontSize: 20,
              margin: '0 0 6px',
            }}
          >
            🗒️ Outline Builder Berita
          </h3>
          <p style={{ color: '#6B9E80', fontSize: 14, marginBottom: 24 }}>
            Susun kerangka beritamu sebelum menulis! Isi setiap bagian struktur berita.
          </p>

          {[
            {
              key: 'head',
              label: '📰 HEAD / Judul Berita',
              placeholder: 'Tulis judul berita yang menarik dan informatif...',
              color: '#3B8FD4',
              tip: 'Judul harus singkat, jelas, dan menarik perhatian pembaca!',
              rows: 2,
            },
            {
              key: 'lead',
              label: '🎯 LEAD / Teras Berita (ADIKSIMBA)',
              placeholder: 'Tulis paragraf pertama yang menjawab: Apa? Siapa? Di Mana? Kapan?...',
              color: '#2AA168',
              tip: 'Lead adalah kalimat pertama yang paling penting — jawab minimal 4W!',
              rows: 3,
            },
            {
              key: 'body',
              label: '📝 BODY / Tubuh Berita',
              placeholder: 'Kembangkan cerita dengan detail, kutipan narasumber, dan data...',
              color: '#F07040',
              tip: 'Gunakan kutipan langsung "..." dari narasumber agar berita lebih hidup!',
              rows: 5,
            },
            {
              key: 'ekor',
              label: '🔚 EKOR / Penutup Berita',
              placeholder: 'Tulis penutup yang berisi harapan, rencana ke depan, atau kesimpulan...',
              color: '#7C3AED',
              tip: 'Ekor melengkapi informasi dan menutup berita dengan manis!',
              rows: 2,
            },
          ].map((s) => (
            <div key={s.key} style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <label
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: 14,
                    color: s.color,
                  }}
                >
                  {s.label}
                </label>
                <div
                  style={{
                    background: s.color + '15',
                    color: s.color,
                    padding: '4px 10px',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    maxWidth: 280,
                  }}
                >
                  💡 {s.tip}
                </div>
              </div>
              <textarea
                className="editor-area"
                rows={s.rows}
                placeholder={s.placeholder}
                style={{
                  borderColor: outline[s.key] ? s.color + '60' : '#D4F0E3',
                }}
                value={outline[s.key]}
                onChange={(e) => setOutline((o) => ({ ...o, [s.key]: e.target.value }))}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSaveOutline(false)}
              disabled={saving}
              style={{
                padding: '12px 24px',
                borderRadius: 30,
                border: 'none',
                cursor: saving ? 'wait' : 'pointer',
                background: saving ? '#B0C4B8' : '#2AA168',
                color: 'white',
                fontFamily: 'Nunito',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Outline'}
            </button>
            <button
              onClick={() => handleSaveOutline(true)}
              disabled={saving}
              style={{
                padding: '12px 24px',
                borderRadius: 30,
                border: 'none',
                cursor: saving ? 'wait' : 'pointer',
                background: saving ? '#B0C4B8' : '#F07040',
                color: 'white',
                fontFamily: 'Nunito',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              ✏️ Simpan & Lanjut ke Studio Editor →
            </button>
          </div>
        </div>
      )}

      {/* Modal Popup Notifikasi */}
      <ModalNotification
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}