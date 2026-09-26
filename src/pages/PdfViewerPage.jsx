import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMaterialByKey } from '../lib/db';
import { MATERIALS } from '../data/constants';

export default function PdfViewerPage({ materialKey, onBack }) {
  const { profile } = useAuth();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  const info = MATERIALS.find((m) => m.id === materialKey);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getMaterialByKey(materialKey);
      if (mounted) {
        setMaterial(data);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [materialKey]);

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
        <div style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#3B8FD4' }}>
          Memuat modul...
        </div>
      </div>
    );
  }

  // Kalau belum ada PDF
  if (!material?.pdf_url) {
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            borderRadius: 20,
            border: 'none',
            background: '#F0FAF4',
            color: '#2AA168',
            fontFamily: 'Nunito',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            marginBottom: 20,
          }}
        >
          ← Kembali
        </button>
        <div
          style={{
            background: '#FEF9E0',
            border: '2px solid #F5C03A',
            borderRadius: 20,
            padding: 40,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 12 }}>📭</div>
          <div
            style={{
              fontFamily: 'Nunito',
              fontWeight: 900,
              fontSize: 18,
              color: '#854D0E',
              marginBottom: 6,
            }}
          >
            Modul belum tersedia
          </div>
          <div style={{ fontSize: 13, color: '#A16207' }}>
            Guru belum mengunggah PDF untuk topik <strong>{info?.title}</strong>.
          </div>
        </div>
      </div>
    );
  }

  // Preview PDF (iframe native browser)
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: '10px 18px',
            borderRadius: 20,
            border: 'none',
            background: '#F0FAF4',
            color: '#2AA168',
            fontFamily: 'Nunito',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          ← Kembali
        </button>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              fontFamily: 'Nunito',
              fontWeight: 900,
              fontSize: 16,
              color: '#1a2e22',
            }}
          >
            {info?.emoji} {material.title}
          </div>
          <div style={{ fontSize: 12, color: '#6B9E80' }}>
            Mode Preview · Read-only
          </div>
        </div>
        <div
          style={{
            background: '#DBF0FF',
            color: '#1E40AF',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'Nunito',
          }}
        >
          👁️ Preview Only
        </div>
      </div>

      {/* Info baca */}
      <div
        style={{
          background: '#FEF9E0',
          borderRadius: 12,
          padding: '10px 14px',
          marginBottom: 14,
          fontSize: 12,
          color: '#854D0E',
          fontFamily: 'Nunito',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        💡 Baca modul dengan teliti, lalu kembali dan centang kotak materi di Pojok Literasi.
      </div>

      {/* PDF iframe */}
      <div
        style={{
          background: 'white',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '2px solid #E6F5EC',
          height: 'calc(100vh - 320px)',
          minHeight: 500,
          position: 'relative',
        }}
      >
        <iframe
          src={`${material.pdf_url}#toolbar=0&navpanes=0&scrollbar=0`}
          title={material.title}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      </div>

      {/* Hint kecil */}
      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          color: '#9CA3AF',
          textAlign: 'center',
          fontFamily: 'Nunito',
        }}
      >
        📖 Gunakan scroll untuk membaca seluruh halaman
      </div>
    </div>
  );
}