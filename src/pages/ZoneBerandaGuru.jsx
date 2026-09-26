import { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '../lib/supabase';
import { getAllDrafts } from '../lib/db';

export default function ZoneBerandaGuru({ setZone }) {
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalDraf: 0,
    drafPending: 0,
    drafApproved: 0,
    drafRevisi: 0,
    quizPassed: 0,
    quizTotal: 0,
  });
  const [recentDrafts, setRecentDrafts] = useState([]);
  const [recentQuiz, setRecentQuiz] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      // Total siswa (role = siswa)
      const { count: totalSiswa } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'siswa');

      // Semua draf
      const drafts = await getAllDrafts();

      // Kuis semua siswa
      const { data: quizzes } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          profiles:student_id ( full_name, email )
        `)
        .eq('quiz_type', 'fakta_opini')
        .order('created_at', { ascending: false })
        .limit(10);

      // Hitung status draf
      const pending = drafts.filter((d) => d.status === 'Dalam Review').length;
      const approved = drafts.filter((d) => d.status === 'Approved').length;
      const revisi = drafts.filter((d) => d.status === 'Revisi').length;

      // Hitung siswa yang lulus kuis (dari quiz_attempts, unique per student)
      const passedSet = new Set();
      drafts.forEach((d) => {
        if (d.status === 'Approved') passedSet.add(d.student_id);
      });

      if (!mounted) return;

      setStats({
        totalSiswa: totalSiswa || 0,
        totalDraf: drafts.length,
        drafPending: pending,
        drafApproved: approved,
        drafRevisi: revisi,
        quizPassed: passedSet.size,
        quizTotal: totalSiswa || 0,
      });

      // 3 draf terbaru untuk preview
      setRecentDrafts(drafts.slice(0, 4));

      // 5 kuis terbaru
      setRecentQuiz((quizzes || []).slice(0, 5));

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = [
    { emoji: '👥', label: 'Total Siswa', value: stats.totalSiswa, color: '#3B8FD4' },
    { emoji: '📰', label: 'Total Draf', value: stats.totalDraf, color: '#2AA168' },
    { emoji: '⏳', label: 'Menunggu Review', value: stats.drafPending, color: '#F5C03A' },
    { emoji: '✅', label: 'Disetujui', value: stats.drafApproved, color: '#166534' },
    { emoji: '🔄', label: 'Perlu Revisi', value: stats.drafRevisi, color: '#F07040' },
    { emoji: '🎯', label: 'Kuis Lulus', value: `${stats.quizPassed}/${stats.quizTotal}`, color: '#7C3AED' },
  ];

  const statusBadge = (status) => {
    if (status === 'Approved') return { bg: '#D4F0E3', color: '#166534', emoji: '🟢' };
    if (status === 'Revisi') return { bg: '#FEE2E2', color: '#9A3412', emoji: '🔴' };
    if (status === 'Dalam Review') return { bg: '#FEF9E0', color: '#854D0E', emoji: '🟡' };
    return { bg: '#F0FAF4', color: '#6B9E80', emoji: '📝' };
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <SectionHeader
        emoji="👩‍🏫"
        title="Dashboard Pemantauan Kelas"
        subtitle="Pantau progress & karya siswa"
        color="#3B8FD4"
      />

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <div style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#3B8FD4' }}>
            Memuat statistik...
          </div>
        </div>
      ) : (
        <>
          {/* ─── Hero Panel ─── */}
          <div
            style={{
              background: 'linear-gradient(135deg,#1E8C58 0%,#2AA168 40%,#3B8FD4 100%)',
              borderRadius: 20,
              padding: '24px 28px',
              marginBottom: 24,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontSize: 56 }}>👩‍🏫</div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div
                style={{
                  fontFamily: 'Nunito',
                  fontWeight: 900,
                  fontSize: 'clamp(18px,3vw,24px)',
                  marginBottom: 4,
                }}
              >
                Selamat datang, Guru!
              </div>
              <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6 }}>
                Pantau progress belajar siswa, kelola draf berita, dan berikan persetujuan
                untuk publikasi di Galeri Jurnalistik.
              </div>
            </div>
          </div>

          {/* ─── Statistik Cards ─── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 14,
              marginBottom: 24,
            }}
          >
            {statCards.map((s) => (
              <div
                key={s.label}
                className="card-hover"
                style={{
                  background: 'white',
                  borderRadius: 16,
                  padding: 18,
                  boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
                  border: `2px solid ${s.color}20`,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: s.color + '18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    marginBottom: 10,
                  }}
                >
                  {s.emoji}
                </div>
                <div
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 900,
                    fontSize: 26,
                    color: s.color,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#6B9E80',
                    fontWeight: 600,
                    fontFamily: 'Nunito',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* ─── 2 Kolom: Draf Terbaru + Kuis Terbaru ─── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
              gap: 20,
              marginBottom: 24,
            }}
          >
            {/* Draf Terbaru */}
            <div
              style={{
                background: 'white',
                borderRadius: 20,
                padding: 22,
                boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 900,
                    fontSize: 16,
                    margin: 0,
                    color: '#1a2e22',
                  }}
                >
                  📝 Draf Terbaru
                </h3>
                <button
                  onClick={() => setZone('studio')}
                  style={{
                    background: '#F0FAF4',
                    color: '#2AA168',
                    border: 'none',
                    borderRadius: 20,
                    padding: '4px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'Nunito',
                    cursor: 'pointer',
                  }}
                >
                  Kelola →
                </button>
              </div>

              {recentDrafts.length === 0 ? (
                <div
                  style={{
                    fontSize: 13,
                    color: '#9CA3AF',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  Belum ada draf dari siswa
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recentDrafts.map((d) => {
                    const st = statusBadge(d.status);
                    return (
                      <div
                        key={d.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          background: '#F9FEFB',
                          borderRadius: 12,
                          border: '1px solid #E6F5EC',
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: st.bg,
                            color: st.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 15,
                            flexShrink: 0,
                          }}
                        >
                          {st.emoji}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: 'Nunito',
                              fontWeight: 700,
                              fontSize: 13,
                              color: '#1a2e22',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {d.title}
                          </div>
                          <div style={{ fontSize: 11, color: '#6B9E80' }}>
                            {d.group_name || d.profiles?.full_name || 'Anonim'} · {d.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Kuis Terbaru */}
            <div
              style={{
                background: 'white',
                borderRadius: 20,
                padding: 22,
                boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 900,
                    fontSize: 16,
                    margin: 0,
                    color: '#1a2e22',
                  }}
                >
                  🎯 Hasil Kuis Fakta vs Opini
                </h3>
              </div>

              {recentQuiz.length === 0 ? (
                <div
                  style={{
                    fontSize: 13,
                    color: '#9CA3AF',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  Belum ada siswa yang mengerjakan kuis
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recentQuiz.map((q) => {
                    const passed = q.passed;
                    const color = passed ? '#166534' : '#9A3412';
                    const bg = passed ? '#D4F0E3' : '#FEE2E2';
                    return (
                      <div
                        key={q.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          background: bg + '40',
                          borderRadius: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 50,
                            background: bg,
                            color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 800,
                            fontFamily: 'Nunito',
                            flexShrink: 0,
                          }}
                        >
                          {q.score}/{q.total}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: 'Nunito',
                              fontWeight: 700,
                              fontSize: 13,
                              color: '#1a2e22',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {q.profiles?.full_name || 'Anonim'}
                          </div>
                          <div style={{ fontSize: 11, color: '#6B9E80' }}>
                            {new Date(q.created_at).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <div
                          style={{
                            fontFamily: 'Nunito',
                            fontWeight: 800,
                            fontSize: 11,
                            color,
                          }}
                        >
                          {passed ? '✅ LULUS' : '❌ GAGAL'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ─── Quick Actions ─── */}
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              padding: 22,
              boxShadow: '0 2px 12px rgba(42,161,104,0.08)',
            }}
          >
            <h3
              style={{
                fontFamily: 'Nunito',
                fontWeight: 900,
                fontSize: 16,
                margin: '0 0 14px',
                color: '#1a2e22',
              }}
            >
              ⚡ Aksi Cepat
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 12,
              }}
            >
              {[
                { emoji: '🏅', label: 'Kelola Status Draf', desc: 'Setujui / revisi', zone: 'studio', color: '#F07040' },
                { emoji: '🗞️', label: 'Lihat Galeri', desc: 'Berita terpublikasi', zone: 'galeri', color: '#7C3AED' },
                { emoji: '📚', label: 'Preview Literasi', desc: 'Materi & kuis', zone: 'literasi', color: '#3B8FD4' },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => setZone(a.zone)}
                  className="card-hover"
                  style={{
                    background: a.color + '10',
                    border: `2px solid ${a.color}25`,
                    borderRadius: 14,
                    padding: 14,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{a.emoji}</div>
                  <div
                    style={{
                      fontFamily: 'Nunito',
                      fontWeight: 800,
                      fontSize: 13,
                      color: a.color,
                      marginBottom: 2,
                    }}
                  >
                    {a.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B9E80' }}>{a.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}