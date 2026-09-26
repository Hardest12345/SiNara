import { useState, useEffect, useMemo } from 'react';
import SectionHeader from '../components/SectionHeader';
import ModalNotification from '../components/ModalNotification';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORY_COLORS } from '../data/constants';
import { getApprovedDrafts, getCommentsForArticle, submitGalleryComment } from '../lib/db';

export default function ZoneGaleri() {
  const { user } = useAuth();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const [category, setCategory] = useState('Semua');
  const [openComments, setOpenComments] = useState({});
  const [expanded, setExpanded] = useState({});

  // commentsByArticle: { [articleId]: [ {id, user_id, comment, created_at, profiles}, ... ] }
  const [commentsByArticle, setCommentsByArticle] = useState({});
  const [newComments, setNewComments] = useState({});
  const [submitting, setSubmitting] = useState({});

  // ═══ Load artikel Approved dari Supabase ═════════════════════════
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const data = await getApprovedDrafts();
      if (mounted) {
        setArticles(data);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ═══ Load komentar saat artikel dibuka ═══════════════════════════
  const loadComments = async (articleId) => {
    const comments = await getCommentsForArticle(articleId);
    setCommentsByArticle((p) => ({ ...p, [articleId]: comments }));
  };

  const toggleComments = async (id) => {
    const willOpen = !openComments[id];
    setOpenComments((p) => ({ ...p, [id]: willOpen }));

    if (willOpen && !commentsByArticle[id]) {
      await loadComments(id);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
  };

  // ═══ Submit komentar ══════════════════════════════════════════════
  const submitComment = async (articleId) => {
    if (!user) return;
    const text = (newComments[articleId] || '').trim();
    if (!text) return;

    setSubmitting((p) => ({ ...p, [articleId]: true }));
    try {
      await submitGalleryComment({
        articleId,
        userId: user.id,
        comment: text,
      });

      await loadComments(articleId);
      setNewComments((p) => ({ ...p, [articleId]: '' }));
    } catch (err) {
      console.error(err);
      showModal({
        title: 'Gagal Kirim Komentar',
        message: err.message || 'Coba lagi beberapa saat lagi.',
        type: 'error',
      });
    } finally {
      setSubmitting((p) => ({ ...p, [articleId]: false }));
    }
  };

  // ═══ Kategori dari data Approved ══════════════════════════════════
  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category || 'Lainnya'));
    return ['Semua', ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (category === 'Semua') return articles;
    return articles.filter((a) => (a.category || 'Lainnya') === category);
  }, [articles, category]);

  const catColor = (cat) => CATEGORY_COLORS[cat] || '#7C3AED';

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getAuthor = (a) => {
    // Prioritas: group_name → profiles.full_name → email → 'Anonim'
    return a.group_name || a.profiles?.full_name || 'Anonim';
  };

  const getPreview = (a) => {
    const lead = a.outline_data?.lead;
    const content = a.content;
    const text = lead || content || '';
    return text.slice(0, 220);
  };

  const getFullContent = (a) => {
    const lead = a.outline_data?.lead || '';
    const body = a.outline_data?.body || '';
    const ekor = a.outline_data?.ekor || '';
    const combined = [lead, body, ekor].filter(Boolean).join('\n\n');
    return combined || a.content || getPreview(a);
  };

  // ═══ Render ═══════════════════════════════════════════════════════
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <SectionHeader
        emoji="🗞️"
        title="Galeri Jurnalistik Cilik"
        subtitle="C6 Mencipta · Karya Murid Kelas VI"
        color="#7C3AED"
      />

      {/* Info Approved only */}
      <div
        style={{
          background: '#D4F0E3',
          borderRadius: 14,
          padding: '12px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 22 }}>✅</span>
        <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.5 }}>
          <strong>Hanya berita berstatus Disetujui (Approved) oleh Guru</strong> yang
          muncul di Galeri ini. Berita masih dalam proses review tidak akan tampil.
        </div>
      </div>

      {/* Filter Kategori */}
      {!loading && articles.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((f) => {
              const isActive = f === category;
              const color = f === 'Semua' ? '#7C3AED' : catColor(f);
              return (
                <button
                  key={f}
                  onClick={() => setCategory(f)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 20,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Nunito',
                    fontWeight: 700,
                    fontSize: 13,
                    background: isActive ? color : 'white',
                    color: isActive ? 'white' : '#4A7060',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    transition: 'all 0.18s',
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
          <div
            style={{
              background: '#F0FAF4',
              color: '#2AA168',
              padding: '6px 14px',
              borderRadius: 20,
              fontFamily: 'Nunito',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            📰 {filteredArticles.length} berita
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗞️</div>
          <div style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#7C3AED' }}>
            Memuat Galeri...
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 60,
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 12 }}>📭</div>
          <div
            style={{
              fontFamily: 'Nunito',
              fontWeight: 900,
              fontSize: 18,
              color: '#1a2e22',
              marginBottom: 6,
            }}
          >
            Belum ada berita disetujui
          </div>
          <div style={{ fontSize: 13, color: '#6B9E80', lineHeight: 1.6 }}>
            Berita akan muncul di sini setelah Guru memberikan status <strong>Approved</strong>.
          </div>
        </div>
      )}

      {/* Empty Filtered */}
      {!loading && articles.length > 0 && filteredArticles.length === 0 && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 60,
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div
            style={{
              fontFamily: 'Nunito',
              fontWeight: 800,
              fontSize: 16,
              color: '#6B9E80',
              marginBottom: 6,
            }}
          >
            Belum ada berita di kategori ini
          </div>
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>
            Coba pilih kategori lain!
          </div>
        </div>
      )}

      {/* Grid Artikel */}
      {!loading && filteredArticles.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 22,
          }}
        >
          {filteredArticles.map((a) => {
            const isExpanded = expanded[a.id];
            const isCommentsOpen = openComments[a.id];
            const comments = commentsByArticle[a.id] || [];
            const author = getAuthor(a);
            const cat = a.category || 'Lainnya';

            return (
              <div
                key={a.id}
                style={{
                  background: 'white',
                  borderRadius: 22,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                  border: '2px solid #E6F5EC',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Foto */}
                <div
                  style={{
                    height: 180,
                    background: a.image_url
                      ? '#E6F5EC'
                      : `linear-gradient(135deg,${catColor(cat)},${catColor(cat)}99)`,
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {a.image_url ? (
                    <img
                      src={a.image_url}
                      alt={a.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: 64, opacity: 0.7 }}>📰</span>
                  )}
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <div
                      style={{
                        background: catColor(cat),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: 'Nunito',
                      }}
                    >
                      {cat}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <div
                      style={{
                        background: '#D4F0E3',
                        color: '#166534',
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'Nunito',
                      }}
                    >
                      ✅ ACC
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div
                  style={{
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: 11, color: '#6B9E80', marginBottom: 6 }}>
                    ✍️ {author} · 📅 {formatDate(a.updated_at)}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Nunito',
                      fontWeight: 800,
                      fontSize: 16,
                      color: '#1a2e22',
                      margin: '0 0 8px',
                      lineHeight: 1.3,
                    }}
                  >
                    {a.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: '#6B9E80',
                      lineHeight: 1.6,
                      margin: '0 0 12px',
                      flex: 1,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {isExpanded ? getFullContent(a) : getPreview(a)}
                    {!isExpanded && getPreview(a).length >= 220 && '...'}
                  </p>

                  <button
                    onClick={() => toggleExpand(a.id)}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'transparent',
                      border: 'none',
                      color: catColor(cat),
                      fontFamily: 'Nunito',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      padding: 0,
                      marginBottom: 12,
                    }}
                  >
                    {isExpanded ? '▲ Tutup' : '▼ Baca Selengkapnya'}
                  </button>

                  {/* Action Row: HANYA Komentar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '2px solid #F0FAF4',
                      paddingTop: 12,
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() => toggleComments(a.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 14px',
                        borderRadius: 20,
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Nunito',
                        fontWeight: 700,
                        fontSize: 13,
                        background: isCommentsOpen ? '#DBF0FF' : '#F0F8FF',
                        color: '#3B8FD4',
                        transition: 'all 0.18s',
                      }}
                    >
                      💬 {commentsByArticle[a.id]?.length || 0} Komentar
                    </button>
                    <span
                      style={{
                        fontSize: 11,
                        color: '#9CA3AF',
                        fontStyle: 'italic',
                      }}
                    >
                      Karya terverifikasi ✓
                    </span>
                  </div>

                  {/* Comment Section */}
                  {isCommentsOpen && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 12,
                        background: '#F7FEFA',
                        borderRadius: 12,
                        border: '2px solid #E6F5EC',
                      }}
                    >
                      {!commentsByArticle[a.id] ? (
                        <div
                          style={{
                            textAlign: 'center',
                            fontSize: 12,
                            color: '#9CA3AF',
                            padding: 10,
                          }}
                        >
                          ⏳ Memuat komentar...
                        </div>
                      ) : comments.length === 0 ? (
                        <div
                          style={{
                            textAlign: 'center',
                            fontSize: 12,
                            color: '#9CA3AF',
                            padding: 10,
                            marginBottom: 8,
                          }}
                        >
                          Belum ada komentar. Jadilah yang pertama!
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            marginBottom: 12,
                          }}
                        >
                          {comments.map((c) => {
                            const isGuru = c.profiles?.role === 'guru';
                            return (
                              <div
                                key={c.id}
                                style={{
                                  background: 'white',
                                  borderRadius: 10,
                                  padding: '8px 12px',
                                  border: `1px solid ${isGuru ? '#DBF0FF' : '#E6F5EC'}`,
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    marginBottom: 2,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: 'Nunito',
                                      fontWeight: 800,
                                      fontSize: 11,
                                      color: isGuru ? '#1E40AF' : '#2AA168',
                                    }}
                                  >
                                    {c.profiles?.full_name || 'Anonim'}
                                  </span>
                                  {isGuru && (
                                    <span
                                      style={{
                                        background: '#DBF0FF',
                                        color: '#1E40AF',
                                        fontSize: 9,
                                        padding: '1px 6px',
                                        borderRadius: 6,
                                        fontWeight: 700,
                                      }}
                                    >
                                      GURU
                                    </span>
                                  )}
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: '#9CA3AF',
                                      marginLeft: 'auto',
                                    }}
                                  >
                                    {new Date(c.created_at).toLocaleDateString('id-ID')}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: '#4A7060',
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {c.comment}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add Comment */}
                      <textarea
                        className="editor-area"
                        rows={2}
                        placeholder="Tulis komentar positif..."
                        value={newComments[a.id] || ''}
                        onChange={(e) =>
                          setNewComments((p) => ({ ...p, [a.id]: e.target.value }))
                        }
                        style={{ fontSize: 13, marginBottom: 8 }}
                        disabled={submitting[a.id]}
                      />
                      <button
                        onClick={() => submitComment(a.id)}
                        disabled={!(newComments[a.id] || '').trim() || submitting[a.id]}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 20,
                          border: 'none',
                          background:
                            !(newComments[a.id] || '').trim() || submitting[a.id]
                              ? '#E5E7EB'
                              : '#3B8FD4',
                          color:
                            !(newComments[a.id] || '').trim() || submitting[a.id]
                              ? '#9CA3AF'
                              : 'white',
                          fontFamily: 'Nunito',
                          fontWeight: 700,
                          fontSize: 13,
                          cursor:
                            !(newComments[a.id] || '').trim() || submitting[a.id]
                              ? 'not-allowed'
                              : 'pointer',
                        }}
                      >
                        {submitting[a.id] ? '⏳ Mengirim...' : '💬 Kirim Komentar'}
                      </button>
                    </div>
                  )}
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