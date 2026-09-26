import { useState, useEffect, useMemo } from 'react';
import SectionHeader from '../components/SectionHeader';
import ModalNotification from '../components/ModalNotification';
import { useAuth } from '../contexts/AuthContext';
import { DRAFT_STATUS } from '../data/constants';
import {
  getAllDrafts,
  getDraftById,
  updateDraft,
  updateDraftStatus,
  getReviewsForDraft,
  submitPeerReview,
  uploadReportImage,
} from '../lib/db';
import { getActiveDraft } from '../lib/draftStore';

// ═══════════════════════════════════════════════════════════════
// ROUTER: pilih GuruStudio atau MuridStudio
// ═══════════════════════════════════════════════════════════════
export default function ZoneStudio({ role }) {
  if (role === 'guru') return <GuruStudio />;
  return <MuridStudio />;
}

// ═══════════════════════════════════════════════════════════════
// SHARED: status helpers
// ═══════════════════════════════════════════════════════════════
const statusConfig = {
  draft:    { ...DRAFT_STATUS.draft,    label: 'Draft' },
  review:   { ...DRAFT_STATUS.review },
  revisi:   { ...DRAFT_STATUS.revisi },
  approved: { ...DRAFT_STATUS.approved },
};

const statusKeyFromDb = (dbStatus) => {
  if (dbStatus === 'Approved') return 'approved';
  if (dbStatus === 'Revisi') return 'revisi';
  if (dbStatus === 'Dalam Review') return 'review';
  return 'draft';
};

// ═══════════════════════════════════════════════════════════════
// STUDIO MURID (existing, 4 sub-fitur)
// ═══════════════════════════════════════════════════════════════
function MuridStudio() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState('editor');

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

  const [activeDraft, setActiveDraft] = useState({
    id: null,
    title: '',
    category: 'Lainnya',
    group_name: profile?.full_name || 'Siswa',
    lead: '',
    body: '',
    imageUrl: '',
  });
  const [loadingActive, setLoadingActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);

  const [reviewStars, setReviewStars] = useState({});
  const [reviewComments, setReviewComments] = useState({});
  const [reviewsByDraft, setReviewsByDraft] = useState({});
  const [submittingReview, setSubmittingReview] = useState({});

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    (async () => {
      setLoadingActive(true);
      const draft = await getActiveDraft(user.id);
      if (!mounted) return;

      if (draft) {
        const ol = draft.outline_data || {};
        setActiveDraft({
          id: draft.id,
          title: draft.title || '',
          category: draft.category || 'Lainnya',
          group_name: draft.group_name || profile?.full_name || 'Siswa',
          lead: ol.lead || '',
          body: [ol.body, ol.ekor].filter(Boolean).join('\n\n') || draft.content || '',
          imageUrl: draft.image_url || '',
        });
      }
      setLoadingActive(false);
    })();

    return () => { mounted = false; };
  }, [user, profile]);

  const refreshDrafts = async () => {
    setLoadingDrafts(true);
    const all = await getAllDrafts();
    setDrafts(all);
    setLoadingDrafts(false);
    return all;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingDrafts(true);
      const all = await getAllDrafts();
      if (mounted) {
        setDrafts(all);
        setLoadingDrafts(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (tab !== 'review' || drafts.length === 0) return;
    let mounted = true;

    (async () => {
      const map = {};
      for (const d of drafts) {
        const reviews = await getReviewsForDraft(d.id);
        map[d.id] = reviews;
      }
      if (mounted) setReviewsByDraft(map);
    })();

    return () => { mounted = false; };
  }, [tab, drafts]);

  const checklist = useMemo(() => {
    const leadFilled = (activeDraft.lead || '').trim().length >= 20;
    const hasQuote = /"[^"]+"/.test(activeDraft.body || '');
    const hasPhoto = !!(activeDraft.imageUrl || '').trim();
    return [
      { key: 'lead',  label: 'Lead menjawab 5W+1H',   done: leadFilled },
      { key: 'quote', label: 'Ada kutipan narasumber', done: hasQuote  },
      { key: 'photo', label: 'Foto dilampirkan',       done: hasPhoto  },
    ];
  }, [activeDraft]);

  const completedCount = checklist.filter((c) => c.done).length;
  const checklistPercent = Math.round((completedCount / checklist.length) * 100);

  const stats = useMemo(() => {
    const fullText = `${activeDraft.title} ${activeDraft.lead} ${activeDraft.body}`;
    const words = fullText.trim().split(/\s+/).filter(Boolean).length;
    const sentences = fullText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = [activeDraft.lead, activeDraft.body]
      .filter(Boolean)
      .join('\n\n')
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0).length;
    return { words, sentences, paragraphs };
  }, [activeDraft]);

  const handleChange = (field, value) => setActiveDraft((d) => ({ ...d, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      showModal({
        title: 'Foto Terlalu Besar',
        message: 'Ukuran foto liputan maksimal 5 MB.',
        type: 'warning',
      });
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadReportImage(file, user.id);
      handleChange('imageUrl', publicUrl);
      showModal({
        title: 'Foto Berhasil Diunggah! ✅',
        message: 'Foto liputan berhasil terpasang di naskahmu.',
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      showModal({
        title: 'Gagal Upload Foto',
        message: err.message || 'Coba lagi beberapa saat lagi.',
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!activeDraft.id) {
      showModal({
        title: 'Belum Ada Draf Aktif',
        message: 'Silakan pilih topik & isi lembar kerja di Ruang Redaksi terlebih dahulu!',
        type: 'warning',
      });
      return;
    }
    setSaving(true);
    try {
      const existing = await getDraftById(activeDraft.id);
      const payload = {
        title: activeDraft.title,
        category: activeDraft.category,
        outline_data: { ...(existing?.outline_data || {}), lead: activeDraft.lead, body: activeDraft.body },
        image_url: activeDraft.imageUrl || null,
        content: `${activeDraft.lead}\n\n${activeDraft.body}`.trim(),
      };
      await updateDraft(activeDraft.id, payload);
      showModal({
        title: 'Draf Tersimpan! ✅',
        message: 'Naskah beritamu berhasil diperbarui dan tersimpan.',
        type: 'success',
      });
      await refreshDrafts();
    } catch (err) {
      console.error(err);
      showModal({
        title: 'Gagal Menyimpan Draf',
        message: err.message || 'Coba lagi beberapa saat lagi.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async (draftId) => {
    if (!user) return;
    const stars = reviewStars[draftId] || 0;
    const comment = (reviewComments[draftId] || '').trim();
    if (!stars && !comment) {
      showModal({
        title: 'Isi Penilaian',
        message: 'Mohon berikan rating bintang atau komentar masukan untuk karya temanmu.',
        type: 'warning',
      });
      return;
    }

    setSubmittingReview((p) => ({ ...p, [draftId]: true }));
    try {
      await submitPeerReview({ draftId, reviewerId: user.id, stars: stars || null, comment: comment || null });
      const updated = await getReviewsForDraft(draftId);
      setReviewsByDraft((p) => ({ ...p, [draftId]: updated }));
      setReviewStars((p) => ({ ...p, [draftId]: 0 }));
      setReviewComments((p) => ({ ...p, [draftId]: '' }));
      showModal({
        title: 'Ulasan Terkirim! ⭐',
        message: 'Terima kasih telah memberikan apresiasi dan masukan membangun!',
        type: 'success',
      });
      await refreshDrafts();
    } catch (err) {
      console.error(err);
      showModal({
        title: 'Gagal Mengirim Ulasan',
        message: err.message || 'Coba lagi.',
        type: 'error',
      });
    } finally {
      setSubmittingReview((p) => ({ ...p, [draftId]: false }));
    }
  };

  const TABS = [
    { id: 'editor', label: '✏️ Editor Naskah' },
    { id: 'wip',    label: '👥 Draf Karya Bersama' },
    { id: 'review', label: '⭐ Peer Review' },
    { id: 'status', label: '🏅 Status Draf' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <SectionHeader emoji="✏️" title="Studio Editor & Peer-Review" subtitle="C5 Mengevaluasi · C6 Mencipta" color="#F07040" />

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 20px', borderRadius: 30, border: 'none', cursor: 'pointer',
            fontFamily: 'Nunito', fontWeight: 700, fontSize: 14,
            background: tab === t.id ? '#F07040' : 'white',
            color: tab === t.id ? 'white' : '#4A7060',
            boxShadow: tab === t.id ? '0 4px 14px #F0704055' : '0 1px 4px rgba(0,0,0,0.08)',
            transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ═══ EDITOR TAB (content from previous code, no change) ═══ */}
      {tab === 'editor' && (
        <>
          {loadingActive ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✏️</div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#F07040' }}>Memuat draft...</div>
            </div>
          ) : !activeDraft.id ? (
            <div style={{ background: '#FEF9E0', border: '2px solid #F5C03A', borderRadius: 20, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: '#854D0E', marginBottom: 6 }}>
                Belum ada draft aktif
              </div>
              <div style={{ fontSize: 13, color: '#A16207', marginBottom: 16 }}>
                Buat topik & lembar kerja dulu di Ruang Redaksi!
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 20 }}>
              <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(42,161,104,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 20, margin: 0 }}>✏️ Editor Naskah Berita</h3>
                  <div style={{ background: '#D4F0E3', color: '#166534', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Nunito' }}>
                    👥 {activeDraft.group_name}
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: '#4A7060', marginBottom: 6 }}>📰 Judul Berita</label>
                  <input className="field-input" value={activeDraft.title} onChange={(e) => handleChange('title', e.target.value)} style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1rem' }} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: '#4A7060', marginBottom: 6 }}>🎯 Lead / Teras Berita</label>
                  <textarea className="editor-area" rows={3} value={activeDraft.lead} onChange={(e) => handleChange('lead', e.target.value)} placeholder="Paragraf pembuka yang menjawab 5W+1H..." />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: '#4A7060', marginBottom: 6 }}>📝 Naskah Berita (Body + Ekor)</label>
                  <textarea className="editor-area" rows={12} value={activeDraft.body} onChange={(e) => handleChange('body', e.target.value)} placeholder='Kembangkan cerita... Jangan lupa kutipan langsung "..." dari narasumber!' />
                </div>

                {activeDraft.imageUrl && (
                  <div style={{ marginBottom: 14, borderRadius: 14, overflow: 'hidden', border: '2px solid #E6F5EC' }}>
                    <img src={activeDraft.imageUrl} alt="Foto liputan" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '8px 12px', background: '#F0FAF4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#4A7060' }}>
                      <span>📷 Foto terpasang</span>
                      <button onClick={() => handleChange('imageUrl', '')} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito' }}>🗑️ Hapus</button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <label style={{ padding: '10px 18px', borderRadius: 30, border: `2px dashed ${uploading ? '#9CA3AF' : '#3B8FD4'}`, color: uploading ? '#9CA3AF' : '#3B8FD4', cursor: uploading ? 'wait' : 'pointer', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, background: 'white' }}>
                    {uploading ? '⏳ Mengunggah...' : '📷 Unggah Foto Liputan'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  <button onClick={handleSaveDraft} disabled={saving} style={{ padding: '10px 20px', borderRadius: 30, border: 'none', background: saving ? '#B0C4B8' : '#F5C03A', color: '#1a2e22', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, cursor: saving ? 'wait' : 'pointer' }}>
                    {saving ? '⏳ Menyimpan...' : '💾 Simpan Draf'}
                  </button>
                </div>

                <div style={{ marginTop: 14, background: '#FEF9E0', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#854D0E', lineHeight: 1.5 }}>
                  💡 <strong>Info:</strong> Draf yang disimpan otomatis muncul di tab <strong>👥 Draf Karya Bersama</strong>.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: 'white', borderRadius: 18, padding: 18, boxShadow: '0 2px 12px rgba(42,161,104,0.08)' }}>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: '#3B8FD4', marginBottom: 10 }}>📊 Statistik</div>
                  {[
                    { label: 'Kata', value: stats.words },
                    { label: 'Kalimat', value: stats.sentences },
                    { label: 'Paragraf', value: stats.paragraphs },
                  ].map((s) => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0FAF4' }}>
                      <span style={{ fontSize: 13, color: '#4A7060' }}>{s.label}</span>
                      <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: '#3B8FD4' }}>{s.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'white', borderRadius: 18, padding: 18, boxShadow: '0 2px 12px rgba(42,161,104,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: '#2AA168' }}>✅ Checklist Berita</div>
                    <div style={{ background: checklistPercent === 100 ? '#D4F0E3' : '#FEF9E0', color: checklistPercent === 100 ? '#166534' : '#854D0E', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: 'Nunito' }}>
                      {completedCount}/{checklist.length}
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: '#6B9E80', margin: '0 0 12px' }}>Terdeteksi otomatis dari isi naskahmu ✨</p>
                  {checklist.map((c) => (
                    <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: c.done ? '#2AA168' : '#9CA3AF', fontWeight: c.done ? 700 : 500 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 50, background: c.done ? '#2AA168' : 'transparent', border: `2px solid ${c.done ? '#2AA168' : '#D4F0E3'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', flexShrink: 0 }}>
                        {c.done ? '✓' : ''}
                      </div>
                      {c.label}
                    </div>
                  ))}
                  <div style={{ marginTop: 12, height: 6, background: '#E6F5EC', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${checklistPercent}%`, height: '100%', background: checklistPercent === 100 ? 'linear-gradient(90deg,#2AA168,#3B8FD4)' : 'linear-gradient(90deg,#F5C03A,#F07040)', transition: 'width 0.4s ease' }} />
                  </div>
                  {checklistPercent === 100 && (
                    <div style={{ marginTop: 12, background: 'linear-gradient(135deg,#2AA168,#3B8FD4)', color: 'white', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontFamily: 'Nunito', fontWeight: 700, textAlign: 'center' }}>
                      🎉 Naskahmu sudah lengkap!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══ WIP TAB ═══ */}
      {tab === 'wip' && (
        <div>
          <div style={{ background: 'white', borderRadius: 16, padding: '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12, border: '2px solid #E6F5EC' }}>
            <span style={{ fontSize: 24 }}>📚</span>
            <div style={{ fontSize: 13, color: '#4A7060', lineHeight: 1.5 }}>
              <strong>Draf Karya Bersama:</strong> Semua karya WIP dari seluruh siswa. Baca dulu sebelum memberi review.
            </div>
          </div>

          {loadingDrafts ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6B9E80' }}>Memuat draf...</div>
          ) : drafts.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 18, padding: 40, textAlign: 'center', border: '2px dashed #E6F5EC' }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>📭</div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#6B9E80' }}>Belum ada draf dari siapa pun</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
              {drafts.map((d) => {
                const st = statusConfig[statusKeyFromDb(d.status)];
                const preview = d.outline_data?.lead || d.content?.slice(0, 180) || 'Belum ada konten...';
                return (
                  <div key={d.id} className="card-hover" style={{ background: 'white', borderRadius: 18, padding: 20, border: `2px solid ${st.bg}`, boxShadow: '0 2px 12px rgba(42,161,104,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                      <div style={{ background: '#F0FAF4', color: '#2AA168', padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700, fontFamily: 'Nunito' }}>
                        👥 {d.group_name || d.profiles?.full_name || 'Anonim'}
                      </div>
                      <div style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700, fontFamily: 'Nunito' }}>
                        {st.emoji} {d.status}
                      </div>
                    </div>
                    {d.image_url && (
                      <div style={{ marginBottom: 12, borderRadius: 12, overflow: 'hidden', height: 160, border: '1px solid #E6F5EC' }}>
                        <img
                          src={d.image_url}
                          alt={d.title || 'Foto liputan'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    )}
                    <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: '#1a2e22', margin: '0 0 8px', lineHeight: 1.3 }}>{d.title}</h4>
                    <p style={{ fontSize: 12, color: '#6B9E80', lineHeight: 1.5, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{preview}</p>
                    <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'right' }}>
                      📅 {new Date(d.updated_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ REVIEW TAB ═══ */}
      {tab === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, border: '2px solid #E6F5EC' }}>
            <span style={{ fontSize: 24 }}>⭐</span>
            <div style={{ fontSize: 13, color: '#4A7060', lineHeight: 1.5 }}>
              <strong>Peer Review:</strong> Beri ulasan & komentar konstruktif pada karya teman.
            </div>
          </div>

          {loadingDrafts ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6B9E80' }}>Memuat...</div>
          ) : drafts.filter((d) => d.student_id !== user?.id).length === 0 ? (
            <div style={{ background: 'white', borderRadius: 18, padding: 40, textAlign: 'center', border: '2px dashed #E6F5EC' }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>👀</div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#6B9E80' }}>Belum ada karya teman untuk direview</div>
            </div>
          ) : (
            drafts
              .filter((d) => d.student_id !== user?.id)
              .map((d) => {
                const st = statusConfig[statusKeyFromDb(d.status)];
                const reviews = reviewsByDraft[d.id] || [];
                const preview = d.outline_data?.lead || d.content?.slice(0, 200) || '—';
                return (
                  <div key={d.id} style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(42,161,104,0.08)', border: `2px solid ${st.bg}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ minWidth: 200, flex: 1 }}>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 17, color: '#1a2e22', marginBottom: 4 }}>{d.title}</div>
                        <div style={{ fontSize: 13, color: '#6B9E80' }}>✍️ {d.group_name || d.profiles?.full_name || 'Anonim'} · 💬 {reviews.length} ulasan</div>
                      </div>
                      <div style={{ background: st.bg, color: st.color, padding: '6px 14px', borderRadius: 20, fontFamily: 'Nunito', fontWeight: 700, fontSize: 13 }}>
                        {st.emoji} {d.status}
                      </div>
                    </div>

                    <div style={{ background: '#F7FEFA', borderRadius: 12, padding: '12px 16px', marginBottom: 14, fontSize: 13, color: '#4A7060', lineHeight: 1.6, borderLeft: '4px solid #2AA168' }}>
                      {preview}
                    </div>

                    {reviews.length > 0 && (
                      <div style={{ marginBottom: 14, background: '#F0FAF4', borderRadius: 12, padding: 12 }}>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: '#2AA168', marginBottom: 8 }}>
                          💬 Ulasan sebelumnya ({reviews.length}):
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {reviews.map((r) => (
                            <div key={r.id} style={{ background: 'white', borderRadius: 10, padding: '8px 12px', border: '1px solid #E6F5EC' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 11, color: '#2AA168' }}>{r.profiles?.full_name || 'Anonim'}</span>
                                {r.stars && <span style={{ fontSize: 12, color: '#F5C03A' }}>{'★'.repeat(r.stars)}</span>}
                              </div>
                              {r.comment && <div style={{ fontSize: 12, color: '#4A7060', lineHeight: 1.5 }}>{r.comment}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: '#4A7060', marginBottom: 6 }}>⭐ Beri Penilaian:</div>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} className="star" onClick={() => setReviewStars((p) => ({ ...p, [d.id]: s }))} style={{ fontSize: '1.8rem', cursor: 'pointer', border: 'none', background: 'transparent', color: s <= (reviewStars[d.id] || 0) ? '#F5C03A' : '#E6F5EC', padding: 0, lineHeight: 1 }}>★</button>
                        ))}
                        {(reviewStars[d.id] || 0) > 0 && <span style={{ fontSize: 14, color: '#6B9E80', alignSelf: 'center', marginLeft: 6 }}>{reviewStars[d.id]}.0 / 5.0</span>}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: '#4A7060', marginBottom: 6 }}>💬 Masukan Konstruktif:</label>
                      <textarea className="editor-area" rows={3} placeholder="Tuliskan saran yang membangun untuk kelompok ini..." value={reviewComments[d.id] || ''} onChange={(e) => setReviewComments((p) => ({ ...p, [d.id]: e.target.value }))} />
                    </div>

                    <button onClick={() => handleSubmitReview(d.id)} disabled={submittingReview[d.id]} style={{ marginTop: 12, padding: '9px 22px', borderRadius: 30, border: 'none', background: submittingReview[d.id] ? '#B0C4B8' : '#F07040', color: 'white', fontFamily: 'Nunito', fontWeight: 700, fontSize: 14, cursor: submittingReview[d.id] ? 'wait' : 'pointer' }}>
                      {submittingReview[d.id] ? '⏳ Mengirim...' : '📤 Kirim Review'}
                    </button>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* ═══ STATUS TAB ═══ */}
      {tab === 'status' && (
        <MuridStatusTab drafts={drafts} />
      )}

      {/* Modal Notifikasi */}
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

// ═══════════════════════════════════════════════════════════════
// MURID STATUS TAB (read-only untuk murid)
// ═══════════════════════════════════════════════════════════════
function MuridStatusTab({ drafts }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        {['revisi', 'review', 'approved'].map((key) => {
          const st = statusConfig[key];
          const dbStatus = key === 'approved' ? 'Approved' : key === 'revisi' ? 'Revisi' : 'Dalam Review';
          const count = drafts.filter((d) => d.status === dbStatus).length;
          return (
            <div key={key} style={{ background: st.bg, borderRadius: 16, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{st.emoji}</div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, color: st.color }}>{st.label}</div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: st.color }}>{count}</div>
            </div>
          );
        })}
      </div>

      {drafts.map((d) => {
        const st = statusConfig[statusKeyFromDb(d.status)];
        return (
          <div key={d.id} style={{ background: 'white', borderRadius: 18, padding: '18px 22px', marginBottom: 12, border: `2px solid ${st.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: '#1a2e22', marginBottom: 2 }}>{d.title}</div>
              <div style={{ fontSize: 13, color: '#6B9E80' }}>{d.group_name || d.profiles?.full_name || 'Anonim'}</div>
            </div>
            <div style={{ background: st.bg, color: st.color, padding: '5px 14px', borderRadius: 20, fontFamily: 'Nunito', fontWeight: 700, fontSize: 13 }}>
              {st.emoji} {d.status}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// STUDIO GURU — Review Center
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
function GuruStudio() {
  const [tab, setTab] = useState('review'); // default: review naskah

  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsByDraft, setReviewsByDraft] = useState({});
  const [expanded, setExpanded] = useState({});
  const [busyStatus, setBusyStatus] = useState({});

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
  });

  const showModal = ({ title, message, type = 'info', confirmText = 'OK' }) => {
    setModal({ isOpen: true, title, message, type, confirmText });
  };

  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  const refresh = async () => {
    setLoading(true);
    const all = await getAllDrafts();
    setDrafts(all);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const all = await getAllDrafts();
      if (mounted) {
        setDrafts(all);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load reviews untuk semua draft (untuk preview)
  useEffect(() => {
    if (drafts.length === 0) return;
    let mounted = true;
    (async () => {
      const map = {};
      for (const d of drafts) {
        const r = await getReviewsForDraft(d.id);
        map[d.id] = r;
      }
      if (mounted) setReviewsByDraft(map);
    })();
    return () => { mounted = false; };
  }, [drafts]);

  const handleChangeStatus = async (draftId, status) => {
    setBusyStatus((p) => ({ ...p, [draftId]: true }));
    try {
      await updateDraftStatus(draftId, status);
      await refresh();
    } catch (err) {
      console.error(err);
      showModal({
        title: 'Gagal Ubah Status',
        message: err.message || 'Coba lagi beberapa saat lagi.',
        type: 'error',
      });
    } finally {
      setBusyStatus((p) => ({ ...p, [draftId]: false }));
    }
  };

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  // Group draft: pending (Dalam Review + Draft) dulu, lalu revisi, lalu approved
  const sortedDrafts = useMemo(() => {
    const priority = { 'Dalam Review': 1, Draft: 2, Revisi: 3, Approved: 4 };
    return [...drafts].sort((a, b) => (priority[a.status] || 5) - (priority[b.status] || 5));
  }, [drafts]);

  const pendingCount = drafts.filter((d) => d.status === 'Dalam Review' || d.status === 'Draft').length;
  const approvedCount = drafts.filter((d) => d.status === 'Approved').length;

  // Checklist auto dari draft (untuk guru lihat apa yang sudah/belum)
  const computeChecklist = (d) => {
    const lead = d.outline_data?.lead || '';
    const body = d.outline_data?.body || d.content || '';
    const imageUrl = d.image_url || '';
    return [
      { key: 'lead',  label: 'Lead menjawab 5W+1H',   done: lead.trim().length >= 20 },
      { key: 'quote', label: 'Ada kutipan narasumber', done: /"[^"]+"/.test(body) },
      { key: 'photo', label: 'Foto dilampirkan',       done: !!imageUrl },
    ];
  };

  const getStats = (d) => {
    const lead = d.outline_data?.lead || '';
    const body = d.outline_data?.body || d.content || '';
    const full = `${lead} ${body}`.trim();
    return {
      words: full.split(/\s+/).filter(Boolean).length,
      chars: full.length,
    };
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <SectionHeader
        emoji="👩‍🏫"
        title="Review Center"
        subtitle="Baca, nilai, dan setujui karya siswa"
        color="#3B8FD4"
      />

      {/* Info panel */}
      <div
        style={{
          background: 'linear-gradient(135deg,#1E8C58,#3B8FD4)',
          borderRadius: 16,
          padding: '16px 20px',
          marginBottom: 20,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 32 }}>📝</span>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 15, marginBottom: 2 }}>
            {pendingCount > 0
              ? `${pendingCount} draf menunggu review kamu`
              : 'Semua draf sudah direview'}
          </div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>
            Beri status <strong>Disetujui</strong> agar karya tampil di Galeri Jurnalistik.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Nunito' }}>
            ⏳ Pending: {pendingCount}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Nunito' }}>
            ✅ Approved: {approvedCount}
          </div>
        </div>
      </div>

      {/* Tab Nav: hanya 2 tab untuk guru */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { id: 'review', label: '📝 Review Naskah' },
          { id: 'status', label: '🏅 Status Draf' },
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
              background: tab === t.id ? '#3B8FD4' : 'white',
              color: tab === t.id ? 'white' : '#4A7060',
              boxShadow: tab === t.id ? '0 4px 14px #3B8FD455' : '0 1px 4px rgba(0,0,0,0.08)',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#6B9E80' }}>Memuat draf siswa...</div>
      ) : drafts.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 18, padding: 60, textAlign: 'center', border: '2px dashed #E6F5EC' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>📭</div>
          <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: '#1a2e22', marginBottom: 6 }}>
            Belum ada draf dari siswa
          </div>
          <div style={{ fontSize: 13, color: '#6B9E80' }}>
            Draf akan muncul di sini saat siswa menyimpan karya mereka.
          </div>
        </div>
      ) : tab === 'review' ? (
        // ═══ TAB REVIEW NASKAH ═══
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {sortedDrafts.map((d) => {
            const st = statusConfig[statusKeyFromDb(d.status)];
            const reviews = reviewsByDraft[d.id] || [];
            const isExpanded = expanded[d.id];
            const checklist = computeChecklist(d);
            const stats = getStats(d);
            const lead = d.outline_data?.lead || '';
            const body = d.outline_data?.body || d.content || '';
            const ekor = d.outline_data?.ekor || '';
            const busy = busyStatus[d.id];

            return (
              <div
                key={d.id}
                style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: `2px solid ${st.bg}`,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ minWidth: 200, flex: 1 }}>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 17, color: '#1a2e22', marginBottom: 4 }}>
                      {d.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#6B9E80' }}>
                      ✍️ {d.group_name || d.profiles?.full_name || 'Anonim'} · 📅 {new Date(d.updated_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <div style={{ background: st.bg, color: st.color, padding: '6px 14px', borderRadius: 20, fontFamily: 'Nunito', fontWeight: 700, fontSize: 13 }}>
                    {st.emoji} {d.status}
                  </div>
                </div>

                {/* Meta strip: stats + checklist */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                  <div style={{ background: '#F0FAF4', borderRadius: 10, padding: '6px 12px', fontSize: 11, fontFamily: 'Nunito', fontWeight: 700, color: '#2AA168' }}>
                    📝 {stats.words} kata
                  </div>
                  <div style={{ background: '#DBF0FF', borderRadius: 10, padding: '6px 12px', fontSize: 11, fontFamily: 'Nunito', fontWeight: 700, color: '#1E40AF' }}>
                    💬 {reviews.length} review
                  </div>
                  {checklist.map((c) => (
                    <div
                      key={c.key}
                      style={{
                        background: c.done ? '#D4F0E3' : '#F3F4F6',
                        color: c.done ? '#166534' : '#9CA3AF',
                        borderRadius: 10,
                        padding: '6px 12px',
                        fontSize: 11,
                        fontFamily: 'Nunito',
                        fontWeight: 700,
                      }}
                    >
                      {c.done ? '✅' : '○'} {c.label}
                    </div>
                  ))}
                </div>

                {/* Preview naskah */}
                <div style={{ background: '#F7FEFA', borderRadius: 12, padding: '14px 16px', marginBottom: 14, borderLeft: '4px solid #2AA168' }}>
                  {lead && (
                    <p style={{ margin: '0 0 10px', fontSize: 14, color: '#1a2e22', fontWeight: 600, lineHeight: 1.6 }}>
                      {lead}
                    </p>
                  )}
                  {!isExpanded && body && (
                    <p style={{ margin: 0, fontSize: 13, color: '#4A7060', lineHeight: 1.6 }}>
                      {body.slice(0, 200)}{body.length > 200 ? '...' : ''}
                    </p>
                  )}
                  {isExpanded && (
                    <>
                      {body && (
                        <p style={{ margin: '0 0 10px', fontSize: 13, color: '#4A7060', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                          {body}
                        </p>
                      )}
                      {ekor && (
                        <p style={{ margin: 0, fontSize: 13, color: '#4A7060', lineHeight: 1.7, fontStyle: 'italic' }}>
                          {ekor}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Foto */}
                {d.image_url && (
                  <div style={{ marginBottom: 14, borderRadius: 12, overflow: 'hidden', border: '2px solid #E6F5EC' }}>
                    <img src={d.image_url} alt="Foto liputan" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }} />
                  </div>
                )}

                {/* Toggle expand */}
                {(body.length > 200 || ekor) && (
                  <button
                    onClick={() => toggleExpand(d.id)}
                    style={{ background: 'transparent', border: 'none', color: '#3B8FD4', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 14 }}
                  >
                    {isExpanded ? '▲ Tutup' : '▼ Baca Selengkapnya'}
                  </button>
                )}

                {/* Ulasan sebelumnya */}
                {reviews.length > 0 && (
                  <div style={{ background: '#F0FAF4', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: '#2AA168', marginBottom: 8 }}>
                      💬 Ulasan ({reviews.length}):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {reviews.slice(0, 3).map((r) => (
                        <div key={r.id} style={{ background: 'white', borderRadius: 8, padding: '6px 10px', border: '1px solid #E6F5EC', fontSize: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 11, color: '#2AA168' }}>
                              {r.profiles?.full_name || 'Anonim'}
                            </span>
                            {r.stars && <span style={{ fontSize: 11, color: '#F5C03A' }}>{'★'.repeat(r.stars)}</span>}
                          </div>
                          {r.comment && <div style={{ color: '#4A7060', lineHeight: 1.5 }}>{r.comment}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aksi Guru: ubah status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderTop: '2px solid #F0FAF4', paddingTop: 14 }}>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: '#4A7060', marginRight: 4 }}>
                    Ubah Status:
                  </div>
                  {[
                    { db: 'Dalam Review', key: 'review' },
                    { db: 'Revisi',       key: 'revisi' },
                    { db: 'Approved',     key: 'approved' },
                  ].map((s) => {
                    const sConf = statusConfig[s.key];
                    const isActive = d.status === s.db;
                    return (
                      <button
                        key={s.key}
                        onClick={() => !isActive && !busy && handleChangeStatus(d.id, s.db)}
                        disabled={isActive || busy}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 20,
                          border: 'none',
                          cursor: isActive || busy ? 'default' : 'pointer',
                          background: isActive ? sConf.color : sConf.bg,
                          color: isActive ? 'white' : sConf.color,
                          fontFamily: 'Nunito',
                          fontWeight: 700,
                          fontSize: 12,
                          opacity: busy && !isActive ? 0.5 : 1,
                          transition: 'all 0.18s',
                        }}
                      >
                        {sConf.emoji} {sConf.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // ═══ TAB STATUS DRAF (ringkas untuk guru) ═══
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
            {['revisi', 'review', 'approved'].map((key) => {
              const st = statusConfig[key];
              const dbStatus = key === 'approved' ? 'Approved' : key === 'revisi' ? 'Revisi' : 'Dalam Review';
              const count = drafts.filter((d) => d.status === dbStatus).length;
              return (
                <div key={key} style={{ background: st.bg, borderRadius: 16, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{st.emoji}</div>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, color: st.color }}>{st.label}</div>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: st.color }}>{count}</div>
                </div>
              );
            })}
          </div>

          {drafts.map((d) => {
            const st = statusConfig[statusKeyFromDb(d.status)];
            const busy = busyStatus[d.id];
            return (
              <div key={d.id} style={{ background: 'white', borderRadius: 18, padding: '18px 22px', marginBottom: 12, border: `2px solid ${st.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: '#1a2e22', marginBottom: 2 }}>{d.title}</div>
                  <div style={{ fontSize: 13, color: '#6B9E80' }}>{d.group_name || d.profiles?.full_name || 'Anonim'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {[
                    { db: 'Dalam Review', key: 'review' },
                    { db: 'Revisi',       key: 'revisi' },
                    { db: 'Approved',     key: 'approved' },
                  ].map((s) => {
                    const sConf = statusConfig[s.key];
                    const isActive = d.status === s.db;
                    return (
                      <button
                        key={s.key}
                        onClick={() => !isActive && !busy && handleChangeStatus(d.id, s.db)}
                        disabled={isActive || busy}
                        title={sConf.label}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 10,
                          border: 'none',
                          cursor: isActive || busy ? 'default' : 'pointer',
                          background: isActive ? sConf.color : sConf.bg,
                          color: isActive ? 'white' : sConf.color,
                          fontFamily: 'Nunito',
                          fontWeight: 700,
                          fontSize: 12,
                          opacity: busy && !isActive ? 0.5 : 1,
                        }}
                      >
                        {sConf.emoji} {sConf.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Notifikasi */}
      <ModalNotification
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
      />
    </div>
  );
}